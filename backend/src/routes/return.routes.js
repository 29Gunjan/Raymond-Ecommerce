const express = require('express');
const prisma = require('../utils/prisma');
const { authenticate } = require('../middleware/auth.middleware');
const { sendEmail, emailTemplates } = require('../utils/email');

const router = express.Router();

// All return routes require authentication
router.use(authenticate);

// Generate return number
const generateReturnNumber = () => {
    const prefix = 'RET';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
};

// Create a return request
router.post('/', async (req, res) => {
    try {
        const { orderId, reason, description, items } = req.body;

        // Validate required fields
        if (!orderId || !reason || !items || items.length === 0) {
            return res.status(400).json({
                error: 'Order ID, reason, and at least one item are required'
            });
        }

        // Get the order with items
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: req.user.id
            },
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true
                    }
                },
                returns: {
                    where: {
                        status: {
                            notIn: ['REJECTED']
                        }
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if order is delivered
        if (order.status !== 'DELIVERED') {
            return res.status(400).json({
                error: 'Only delivered orders can be returned'
            });
        }

        // Check if there's already an active return request
        if (order.returns.length > 0) {
            return res.status(400).json({
                error: 'A return request already exists for this order'
            });
        }

        // Check 15-day return window (from delivery date = updatedAt when status became DELIVERED)
        const deliveryDate = new Date(order.updatedAt);
        const returnDeadline = new Date(deliveryDate);
        returnDeadline.setDate(returnDeadline.getDate() + 15);

        if (new Date() > returnDeadline) {
            return res.status(400).json({
                error: 'Return window has expired. Returns are accepted within 15 days of delivery.'
            });
        }

        // Validate return items against order items
        let refundAmount = 0;
        const returnItems = [];

        for (const returnItem of items) {
            const orderItem = order.items.find(oi => oi.id === returnItem.orderItemId);

            if (!orderItem) {
                return res.status(400).json({
                    error: `Order item ${returnItem.orderItemId} not found in this order`
                });
            }

            if (returnItem.quantity <= 0 || returnItem.quantity > orderItem.quantity) {
                return res.status(400).json({
                    error: `Invalid return quantity for ${orderItem.product.name}. Maximum: ${orderItem.quantity}`
                });
            }

            refundAmount += orderItem.price * returnItem.quantity;
            returnItems.push({
                orderItemId: returnItem.orderItemId,
                quantity: returnItem.quantity,
                productId: orderItem.productId
            });
        }

        // Create the return request
        const returnRequest = await prisma.returnRequest.create({
            data: {
                returnNumber: generateReturnNumber(),
                reason,
                description: description || null,
                refundAmount: Math.round(refundAmount * 100) / 100,
                orderId,
                userId: req.user.id,
                items: {
                    create: returnItems
                }
            },
            include: {
                items: {
                    include: {
                        orderItem: {
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
                        }
                    }
                },
                order: {
                    select: {
                        orderNumber: true,
                        total: true,
                        paymentMethod: true
                    }
                }
            }
        });

        // Send return confirmation email
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: { email: true, name: true }
            });

            const emailContent = emailTemplates.returnRequested(returnRequest, user);
            await sendEmail({
                to: user.email,
                subject: emailContent.subject,
                html: emailContent.html
            });
        } catch (emailError) {
            console.error('Failed to send return confirmation email:', emailError);
        }

        res.status(201).json(returnRequest);
    } catch (error) {
        console.error('Create return request error:', error);
        res.status(500).json({ error: 'Failed to create return request' });
    }
});

// Get user's return requests
router.get('/', async (req, res) => {
    try {
        const returns = await prisma.returnRequest.findMany({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        orderItem: {
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
                        }
                    }
                },
                order: {
                    select: {
                        id: true,
                        orderNumber: true,
                        total: true,
                        paymentMethod: true,
                        createdAt: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(returns);
    } catch (error) {
        console.error('Get returns error:', error);
        res.status(500).json({ error: 'Failed to fetch return requests' });
    }
});

// Get single return request
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const returnRequest = await prisma.returnRequest.findFirst({
            where: {
                id,
                userId: req.user.id
            },
            include: {
                items: {
                    include: {
                        orderItem: {
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
                        }
                    }
                },
                order: {
                    select: {
                        id: true,
                        orderNumber: true,
                        total: true,
                        paymentMethod: true,
                        paymentStatus: true,
                        createdAt: true
                    }
                }
            }
        });

        if (!returnRequest) {
            return res.status(404).json({ error: 'Return request not found' });
        }

        res.json(returnRequest);
    } catch (error) {
        console.error('Get return request error:', error);
        res.status(500).json({ error: 'Failed to fetch return request' });
    }
});

module.exports = router;
