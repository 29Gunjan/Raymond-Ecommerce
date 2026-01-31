const express = require('express');
const prisma = require('../utils/prisma');
const { optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all products with filters
router.get('/', optionalAuth, async (req, res) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            size,
            color,
            sort,
            search,
            featured,
            isNew,
            page = 1,
            limit = 12
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build where clause
        const where = {};

        if (category) {
            where.category = { slug: category };
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice);
            if (maxPrice) where.price.lte = parseFloat(maxPrice);
        }

        if (size || color) {
            where.variants = {
                some: {
                    ...(size && { size }),
                    ...(color && { color }),
                    stock: { gt: 0 }
                }
            };
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (featured === 'true') {
            where.featured = true;
        }

        if (isNew === 'true') {
            where.isNew = true;
        }

        // Build order by
        let orderBy = { createdAt: 'desc' };
        if (sort === 'price-asc') orderBy = { price: 'asc' };
        if (sort === 'price-desc') orderBy = { price: 'desc' };
        if (sort === 'name') orderBy = { name: 'asc' };
        if (sort === 'newest') orderBy = { createdAt: 'desc' };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: {
                        select: { id: true, name: true, slug: true }
                    },
                    variants: true,
                    reviews: {
                        select: { rating: true }
                    }
                },
                orderBy,
                skip,
                take: parseInt(limit)
            }),
            prisma.product.count({ where })
        ]);

        // Calculate average rating
        const productsWithRating = products.map(product => {
            const avgRating = product.reviews.length > 0
                ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                : 0;
            return {
                ...product,
                avgRating: Math.round(avgRating * 10) / 10,
                reviewCount: product.reviews.length
            };
        });

        res.json({
            products: productsWithRating,
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

// Get single product by slug
router.get('/:slug', optionalAuth, async (req, res) => {
    try {
        const { slug } = req.params;

        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                category: {
                    select: { id: true, name: true, slug: true }
                },
                variants: {
                    orderBy: [{ color: 'asc' }, { size: 'asc' }]
                },
                reviews: {
                    include: {
                        user: {
                            select: { id: true, name: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Calculate average rating
        const avgRating = product.reviews.length > 0
            ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
            : 0;

        // Get related products
        const relatedProducts = await prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: product.id }
            },
            include: {
                variants: true,
                reviews: { select: { rating: true } }
            },
            take: 4
        });

        res.json({
            ...product,
            avgRating: Math.round(avgRating * 10) / 10,
            reviewCount: product.reviews.length,
            relatedProducts: relatedProducts.map(p => ({
                ...p,
                avgRating: p.reviews.length > 0
                    ? Math.round((p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length) * 10) / 10
                    : 0
            }))
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

module.exports = router;
