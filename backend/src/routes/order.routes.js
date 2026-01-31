const express = require('express');
const prisma = require('../utils/prisma');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Generate order number
const generateOrderNumber = () => {
    const prefix = 'RMD';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
};

// Track order by order number (public - no auth required)
router.post('/track', async (req, res) => {
    try {
        const { orderNumber, email } = req.body;

        if (!orderNumber || !email) {
            return res.status(400).json({ error: 'Order number and email are required' });
        }

        const order = await prisma.order.findFirst({
            where: {
                orderNumber: orderNumber.toUpperCase(),
                user: {
                    email: email.toLowerCase()
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
                address: true,
                user: {
                    select: {
                        email: true,
                        name: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found. Please check your order number and email.' });
        }

        // Build timeline based on order status
        const statusTimeline = {
            'PENDING': [
                { status: 'Order Placed', date: order.createdAt, completed: true },
                { status: 'Processing', date: null, completed: false },
                { status: 'Shipped', date: null, completed: false },
                { status: 'Delivered', date: null, completed: false }
            ],
            'CONFIRMED': [
                { status: 'Order Placed', date: order.createdAt, completed: true },
                { status: 'Processing', date: order.updatedAt, completed: true },
                { status: 'Shipped', date: null, completed: false },
                { status: 'Delivered', date: null, completed: false }
            ],
            'PROCESSING': [
                { status: 'Order Placed', date: order.createdAt, completed: true },
                { status: 'Processing', date: order.updatedAt, completed: true },
                { status: 'Shipped', date: null, completed: false },
                { status: 'Delivered', date: null, completed: false }
            ],
            'SHIPPED': [
                { status: 'Order Placed', date: order.createdAt, completed: true },
                { status: 'Processing', date: order.createdAt, completed: true },
                { status: 'Shipped', date: order.updatedAt, completed: true },
                { status: 'Out for Delivery', date: null, completed: false },
                { status: 'Delivered', date: null, completed: false }
            ],
            'DELIVERED': [
                { status: 'Order Placed', date: order.createdAt, completed: true },
                { status: 'Processing', date: order.createdAt, completed: true },
                { status: 'Shipped', date: order.createdAt, completed: true },
                { status: 'Delivered', date: order.updatedAt, completed: true }
            ],
            'CANCELLED': [
                { status: 'Order Placed', date: order.createdAt, completed: true },
                { status: 'Order Cancelled', date: order.updatedAt, completed: true, isCancelled: true }
            ]
        };

        const timeline = statusTimeline[order.status] || statusTimeline['PENDING'];

        res.json({
            orderNumber: order.orderNumber,
            status: order.status,
            total: order.total,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            timeline,
            items: order.items,
            address: order.address,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus
        });
    } catch (error) {
        console.error('Track order error:', error);
        res.status(500).json({ error: 'Failed to track order' });
    }
});

// Get user orders
router.get('/', authenticate, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
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
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get single order
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findFirst({
            where: {
                id,
                userId: req.user.id
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

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Create order
router.post('/', authenticate, async (req, res) => {
    try {
        const { addressId, notes } = req.body;

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

        const shipping = subtotal >= 2000 ? 0 : 99;
        const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
        const total = subtotal + shipping + tax;

        // Create order
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

            const { sendEmail, emailTemplates } = require('../utils/email');
            const emailContent = emailTemplates.orderConfirmation(order, user);
            await sendEmail({
                to: user.email,
                subject: emailContent.subject,
                html: emailContent.html
            });
        } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
        }

        res.status(201).json(order);
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Cancel order
router.put('/:id/cancel', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findFirst({
            where: {
                id,
                userId: req.user.id
            },
            include: { items: true }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
            return res.status(400).json({ error: 'Order cannot be cancelled' });
        }

        // Restore stock
        for (const item of order.items) {
            await prisma.productVariant.update({
                where: { id: item.variantId },
                data: {
                    stock: {
                        increment: item.quantity
                    }
                }
            });
        }

        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status: 'CANCELLED' },
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

        res.json(updatedOrder);
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({ error: 'Failed to cancel order' });
    }
});

module.exports = router;
