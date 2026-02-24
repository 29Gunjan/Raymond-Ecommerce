const express = require('express');
const prisma = require('../utils/prisma');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Get cart
router.get('/', authenticate, async (req, res) => {
    try {
        let cart = await prisma.cart.findUnique({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                price: true,
                                images: true
                            }
                        },
                        variant: true
                    }
                }
            }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: req.user.id },
                include: { items: [] }
            });
        }

        // Calculate totals
        const subtotal = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.json({
            ...cart,
            subtotal,
            itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// Add to cart
router.post('/add', authenticate, async (req, res) => {
    try {
        const { productId, variantId, quantity = 1 } = req.body;

        if (!productId || !variantId) {
            return res.status(400).json({ error: 'productId and variantId are required' });
        }

        // Get or create cart
        let cart = await prisma.cart.findUnique({
            where: { userId: req.user.id }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: req.user.id }
            });
        }

        // Check if item already in cart
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId_variantId: {
                    cartId: cart.id,
                    productId,
                    variantId
                }
            }
        });

        if (existingItem) {
            // Update quantity
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
        } else {
            // Add new item
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    variantId,
                    quantity
                }
            });
        }

        // Return updated cart
        const updatedCart = await prisma.cart.findUnique({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                price: true,
                                images: true
                            }
                        },
                        variant: true
                    }
                }
            }
        });

        const subtotal = updatedCart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.json({
            ...updatedCart,
            subtotal,
            itemCount: updatedCart.items.reduce((sum, item) => sum + item.quantity, 0)
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Failed to add to cart: ' + error.message });
    }
});

// Update cart item quantity
router.put('/item/:itemId', authenticate, async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (quantity <= 0) {
            await prisma.cartItem.delete({
                where: { id: itemId }
            });
        } else {
            await prisma.cartItem.update({
                where: { id: itemId },
                data: { quantity }
            });
        }

        // Return updated cart
        const cart = await prisma.cart.findUnique({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                price: true,
                                images: true
                            }
                        },
                        variant: true
                    }
                }
            }
        });

        const subtotal = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.json({
            ...cart,
            subtotal,
            itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
        });
    } catch (error) {
        console.error('Update cart item error:', error);
        res.status(500).json({ error: 'Failed to update cart item' });
    }
});

// Remove from cart
router.delete('/item/:itemId', authenticate, async (req, res) => {
    try {
        const { itemId } = req.params;

        await prisma.cartItem.delete({
            where: { id: itemId }
        });

        // Return updated cart
        const cart = await prisma.cart.findUnique({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                price: true,
                                images: true
                            }
                        },
                        variant: true
                    }
                }
            }
        });

        const subtotal = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.json({
            ...cart,
            subtotal,
            itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ error: 'Failed to remove from cart' });
    }
});

// Clear cart
router.delete('/clear', authenticate, async (req, res) => {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: req.user.id }
        });

        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
        }

        res.json({ message: 'Cart cleared', items: [], subtotal: 0, itemCount: 0 });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
});

module.exports = router;
