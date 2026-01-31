const express = require('express');
const prisma = require('../utils/prisma');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate stats
        const stats = {
            total: reviews.length,
            average: reviews.length > 0
                ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
                : 0,
            distribution: {
                5: reviews.filter(r => r.rating === 5).length,
                4: reviews.filter(r => r.rating === 4).length,
                3: reviews.filter(r => r.rating === 3).length,
                2: reviews.filter(r => r.rating === 2).length,
                1: reviews.filter(r => r.rating === 1).length
            }
        };

        res.json({ reviews, stats });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Add review
router.post('/', authenticate, async (req, res) => {
    try {
        const { productId, rating, title, comment } = req.body;

        // Check if user already reviewed this product
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId: req.user.id,
                    productId
                }
            }
        });

        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this product' });
        }

        // Check if user has purchased this product
        const hasPurchased = await prisma.orderItem.findFirst({
            where: {
                productId,
                order: {
                    userId: req.user.id,
                    status: 'DELIVERED'
                }
            }
        });

        // Create review (even without purchase for demo purposes)
        const review = await prisma.review.create({
            data: {
                userId: req.user.id,
                productId,
                rating,
                title,
                comment
            },
            include: {
                user: {
                    select: { id: true, name: true }
                }
            }
        });

        res.status(201).json(review);
    } catch (error) {
        console.error('Add review error:', error);
        res.status(500).json({ error: 'Failed to add review' });
    }
});

// Update review
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, title, comment } = req.body;

        const review = await prisma.review.findFirst({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const updatedReview = await prisma.review.update({
            where: { id },
            data: { rating, title, comment },
            include: {
                user: {
                    select: { id: true, name: true }
                }
            }
        });

        res.json(updatedReview);
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
});

// Delete review
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const review = await prisma.review.findFirst({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        await prisma.review.delete({
            where: { id }
        });

        res.json({ message: 'Review deleted' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

module.exports = router;
