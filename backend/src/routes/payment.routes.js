const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const prisma = require('../utils/prisma');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Get Razorpay Key ID (public)
router.get('/key', (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// Create Razorpay Order
router.post('/create-order', authenticate, async (req, res) => {
    try {
        const { addressId, notes } = req.body;

        if (!addressId) {
            return res.status(400).json({ error: 'Address is required' });
        }

        // Get cart
        const cart = await prisma.cart.findUnique({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true
                    }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Verify address belongs to user
        const address = await prisma.address.findFirst({
            where: {
                id: addressId,
                userId: req.user.id
            }
        });

        if (!address) {
            return res.status(400).json({ error: 'Invalid address' });
        }

        // Calculate totals
        const subtotal = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        const shipping = subtotal >= 2999 ? 0 : 199;
        const total = subtotal + shipping;

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(total * 100), // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: req.user.id,
                addressId: addressId,
                orderNotes: notes || ''
            }
        });

        res.json({
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            subtotal,
            shipping,
            total
        });
    } catch (error) {
        console.error('Create Razorpay order error:', error);
        res.status(500).json({ error: 'Failed to create payment order' });
    }
});

// Generate order number
const generateOrderNumber = () => {
    const prefix = 'RMD';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
};

// Verify Payment and Create Order
router.post('/verify', authenticate, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            addressId,
            notes
        } = req.body;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ error: 'Invalid payment signature' });
        }

        // Get cart
        const cart = await prisma.cart.findUnique({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true
                    }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Calculate totals
        const subtotal = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        const shipping = subtotal >= 2999 ? 0 : 199;
        const tax = Math.round(subtotal * 0.18 * 100) / 100;
        const total = subtotal + shipping + tax;

        // Create order with payment info
        const order = await prisma.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                userId: req.user.id,
                addressId,
                subtotal,
                shipping,
                tax,
                total,
                notes,
                paymentMethod: 'RAZORPAY',
                paymentStatus: 'PAID',
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                status: 'CONFIRMED',
                items: {
                    create: cart.items.map(item => ({
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                        price: item.product.price
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                images: true
                            }
                        },
                        variant: true
                    }
                },
                address: true
            }
        });

        // Update stock
        for (const item of cart.items) {
            await prisma.productVariant.update({
                where: { id: item.variantId },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            });
        }

        // Clear cart
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });

        // Send order confirmation email
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: { email: true, name: true }
            });

            const { sendOrderConfirmationEmail } = require('../utils/email');
            await sendOrderConfirmationEmail(user.email, user.name, order);
        } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
        }

        res.json({
            success: true,
            order,
            message: 'Payment verified and order placed successfully'
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});

// Handle Payment Failure
router.post('/failed', authenticate, async (req, res) => {
    try {
        const { razorpay_order_id, error_code, error_description } = req.body;

        console.log('Payment failed:', {
            orderId: razorpay_order_id,
            errorCode: error_code,
            errorDescription: error_description
        });

        res.json({
            success: false,
            message: 'Payment failed. Please try again.'
        });
    } catch (error) {
        console.error('Handle payment failure error:', error);
        res.status(500).json({ error: 'Failed to process payment failure' });
    }
});

// Razorpay Webhook (for server-to-server notifications)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (webhookSecret) {
            const expectedSignature = crypto
                .createHmac('sha256', webhookSecret)
                .update(JSON.stringify(req.body))
                .digest('hex');

            if (signature !== expectedSignature) {
                return res.status(400).json({ error: 'Invalid webhook signature' });
            }
        }

        const event = req.body;

        switch (event.event) {
            case 'payment.captured':
                console.log('Payment captured:', event.payload.payment.entity.id);
                break;
            case 'payment.failed':
                console.log('Payment failed:', event.payload.payment.entity.id);
                break;
            case 'order.paid':
                console.log('Order paid:', event.payload.order.entity.id);
                break;
            default:
                console.log('Unhandled webhook event:', event.event);
        }

        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

module.exports = router;
