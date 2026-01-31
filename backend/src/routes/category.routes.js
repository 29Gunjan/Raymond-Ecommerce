const express = require('express');
const prisma = require('../utils/prisma');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { name: 'asc' }
        });

        res.json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Get single category with products
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                products: {
                    include: {
                        variants: true,
                        reviews: { select: { rating: true } }
                    }
                }
            }
        });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
});

module.exports = router;
