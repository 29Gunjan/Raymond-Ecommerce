const express = require('express');
const prisma = require('../utils/prisma');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Get wishlist
router.get('/', authenticate, async (req, res) => {
    try {
        let wishlist = await prisma.wishlist.findUnique({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                variants: true,
                                reviews: { select: { rating: true } }
                            }
                        }
                    }
                }
            }
        });

        if (!wishlist) {
            wishlist = await prisma.wishlist.create({
                data: { userId: req.user.id },
                include: { items: [] }
            });
        }

        // Format response
        const products = wishlist.items.map(item => ({
            ...item.product,
            wishlistItemId: item.id,
            avgRating: item.product.reviews.length > 0
                ? Math.round((item.product.reviews.reduce((sum, r) => sum + r.rating, 0) / item.product.reviews.length) * 10) / 10
                : 0
        }));

        res.json({ products });
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
});

// Add to wishlist
router.post('/add', authenticate, async (req, res) => {
    try {
        const { productId } = req.body;

        // Get or create wishlist
        let wishlist = await prisma.wishlist.findUnique({
            where: { userId: req.user.id }
        });

        if (!wishlist) {
            wishlist = await prisma.wishlist.create({
                data: { userId: req.user.id }
            });
        }

        // Check if already in wishlist
        const existing = await prisma.wishlistItem.findUnique({
            where: {
                wishlistId_productId: {
                    wishlistId: wishlist.id,
                    productId
                }
            }
        });

        if (existing) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }

        // Add to wishlist
        await prisma.wishlistItem.create({
            data: {
                wishlistId: wishlist.id,
                productId
            }
        });

        res.json({ message: 'Added to wishlist' });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
});

// Remove from wishlist
router.delete('/remove/:productId', authenticate, async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await prisma.wishlist.findUnique({
            where: { userId: req.user.id }
        });

        if (!wishlist) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        await prisma.wishlistItem.delete({
            where: {
                wishlistId_productId: {
                    wishlistId: wishlist.id,
                    productId
                }
            }
        });

        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
});

// Check if product is in wishlist
router.get('/check/:productId', authenticate, async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await prisma.wishlist.findUnique({
            where: { userId: req.user.id }
        });

        if (!wishlist) {
            return res.json({ inWishlist: false });
        }

        const item = await prisma.wishlistItem.findUnique({
            where: {
                wishlistId_productId: {
                    wishlistId: wishlist.id,
                    productId
                }
            }
        });

        res.json({ inWishlist: !!item });
    } catch (error) {
        console.error('Check wishlist error:', error);
        res.status(500).json({ error: 'Failed to check wishlist' });
    }
});

module.exports = router;
