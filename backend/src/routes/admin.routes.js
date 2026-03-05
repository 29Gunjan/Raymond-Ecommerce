const express = require('express');
const prisma = require('../utils/prisma');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// Dashboard stats
router.get('/dashboard', async (req, res) => {
    try {
        const [
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue,
            recentOrders,
            topProducts
        ] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.user.count({ where: { role: 'USER' } }),
            prisma.order.aggregate({
                _sum: { total: true },
                where: { paymentStatus: 'PAID' }
            }),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true, email: true } }
                }
            }),
            prisma.orderItem.groupBy({
                by: ['productId'],
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5
            })
        ]);

        res.json({
            stats: {
                totalProducts,
                totalOrders,
                totalUsers,
                totalRevenue: totalRevenue._sum.total || 0
            },
            recentOrders,
            topProducts
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// Products CRUD
router.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { slug: { contains: search, mode: 'insensitive' } }
                ]
            }
            : {};

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: { select: { id: true, name: true } },
                    variants: true,
                    _count: { select: { reviews: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma.product.count({ where })
        ]);

        res.json({
            products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

router.post('/products', async (req, res) => {
    try {
        const { name, slug, description, price, comparePrice, images, categoryId, featured, isNew, variants } = req.body;

        // Auto-generate slug from name if not provided
        const productSlug = slug || name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
            + '-' + Date.now().toString(36);

        const product = await prisma.product.create({
            data: {
                name,
                slug: productSlug,
                description,
                price,
                comparePrice,
                images,
                categoryId,
                featured: featured || false,
                isNew: isNew || false,
                variants: {
                    create: variants || []
                }
            },
            include: {
                category: true,
                variants: true
            }
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

router.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description, price, comparePrice, images, categoryId, featured, isNew, variants } = req.body;

        // Delete existing variants and create new ones
        if (variants) {
            await prisma.productVariant.deleteMany({
                where: { productId: id }
            });
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                price,
                comparePrice,
                images,
                categoryId,
                featured,
                isNew,
                ...(variants && {
                    variants: {
                        create: variants
                    }
                })
            },
            include: {
                category: true,
                variants: true
            }
        });

        res.json(product);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.product.delete({
            where: { id }
        });

        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Categories CRUD
router.get('/categories', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: { select: { products: true } }
            },
            orderBy: { name: 'asc' }
        });

        res.json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

router.post('/categories', async (req, res) => {
    try {
        const { name, slug, description, image } = req.body;

        // Auto-generate slug from name if not provided, with unique suffix
        const categorySlug = slug || name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
            + '-' + Date.now().toString(36);

        const category = await prisma.category.create({
            data: {
                name,
                slug: categorySlug,
                description: description || null,
                image: image || null
            }
        });

        res.status(201).json(category);
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ error: 'Failed to create category: ' + error.message });
    }
});

router.put('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description, image } = req.body;

        const category = await prisma.category.update({
            where: { id },
            data: { name, slug, description, image }
        });

        res.json(category);
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

router.delete('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.category.delete({
            where: { id }
        });

        res.json({ message: 'Category deleted' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

// Orders management
router.get('/orders', async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = status ? { status } : {};

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    items: {
                        include: {
                            product: { select: { name: true, images: true } },
                            variant: true
                        }
                    },
                    address: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma.order.count({ where })
        ]);

        res.json({
            orders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

router.put('/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentStatus } = req.body;

        const order = await prisma.order.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(paymentStatus && { paymentStatus })
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                items: true,
                address: true
            }
        });

        res.json(order);
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// Users management
router.get('/users', async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            }
            : {};

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    role: true,
                    createdAt: true,
                    _count: { select: { orders: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma.user.count({ where })
        ]);

        res.json({
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['USER', 'ADMIN'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });

        res.json(user);
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// Get orders for a specific user
router.get('/users/:id/orders', async (req, res) => {
    try {
        const { id } = req.params;

        const orders = await prisma.order.findMany({
            where: { userId: id },
            include: {
                items: {
                    include: {
                        product: { select: { name: true, images: true, slug: true } },
                        variant: true
                    }
                },
                address: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ orders });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ error: 'Failed to fetch user orders' });
    }
});

// Returns management
router.get('/returns', async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = status ? { status } : {};

        const [returns, total] = await Promise.all([
            prisma.returnRequest.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    order: {
                        select: {
                            id: true,
                            orderNumber: true,
                            total: true,
                            paymentMethod: true,
                            paymentStatus: true
                        }
                    },
                    items: {
                        include: {
                            orderItem: {
                                include: {
                                    product: { select: { name: true, images: true } },
                                    variant: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma.returnRequest.count({ where })
        ]);

        res.json({
            returns,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get returns error:', error);
        res.status(500).json({ error: 'Failed to fetch returns' });
    }
});

router.get('/returns/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const returnRequest = await prisma.returnRequest.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true, phone: true } },
                order: {
                    include: {
                        address: true,
                        items: {
                            include: {
                                product: { select: { id: true, name: true, images: true } },
                                variant: true
                            }
                        }
                    }
                },
                items: {
                    include: {
                        orderItem: {
                            include: {
                                product: { select: { id: true, name: true, slug: true, images: true } },
                                variant: true
                            }
                        }
                    }
                }
            }
        });

        if (!returnRequest) {
            return res.status(404).json({ error: 'Return request not found' });
        }

        res.json(returnRequest);
    } catch (error) {
        console.error('Get return detail error:', error);
        res.status(500).json({ error: 'Failed to fetch return details' });
    }
});

router.put('/returns/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        const validStatuses = ['APPROVED', 'REJECTED', 'PICKED_UP', 'RECEIVED', 'REFUNDED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const returnRequest = await prisma.returnRequest.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        orderItem: true
                    }
                },
                order: true,
                user: { select: { id: true, email: true, name: true } }
            }
        });

        if (!returnRequest) {
            return res.status(404).json({ error: 'Return request not found' });
        }

        // If marking as REFUNDED, restore stock for returned items
        if (status === 'REFUNDED') {
            for (const item of returnRequest.items) {
                await prisma.productVariant.update({
                    where: { id: item.orderItem.variantId },
                    data: {
                        stock: {
                            increment: item.quantity
                        }
                    }
                });
            }

            // Check if full refund (refund amount equals order total)
            if (returnRequest.refundAmount >= returnRequest.order.total) {
                await prisma.order.update({
                    where: { id: returnRequest.orderId },
                    data: { paymentStatus: 'REFUNDED' }
                });
            }
        }

        // Update return request status
        const updatedReturn = await prisma.returnRequest.update({
            where: { id },
            data: {
                status,
                ...(adminNotes && { adminNotes })
            },
            include: {
                items: {
                    include: {
                        orderItem: {
                            include: {
                                product: { select: { id: true, name: true, images: true } },
                                variant: true
                            }
                        }
                    }
                },
                order: {
                    select: {
                        orderNumber: true,
                        total: true,
                        paymentMethod: true,
                        paymentStatus: true
                    }
                },
                user: { select: { id: true, name: true, email: true } }
            }
        });

        // Send status update email
        try {
            const { sendEmail, emailTemplates } = require('../utils/email');
            const emailContent = emailTemplates.returnStatusUpdate(updatedReturn, updatedReturn.user, status);
            await sendEmail({
                to: updatedReturn.user.email,
                subject: emailContent.subject,
                html: emailContent.html
            });
        } catch (emailError) {
            console.error('Failed to send return status email:', emailError);
        }

        res.json(updatedReturn);
    } catch (error) {
        console.error('Update return status error:', error);
        res.status(500).json({ error: 'Failed to update return status' });
    }
});

module.exports = router;
