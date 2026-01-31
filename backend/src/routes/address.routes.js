const express = require('express');
const prisma = require('../utils/prisma');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Get user addresses
router.get('/', authenticate, async (req, res) => {
    try {
        const addresses = await prisma.address.findMany({
            where: { userId: req.user.id },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        res.json(addresses);
    } catch (error) {
        console.error('Get addresses error:', error);
        res.status(500).json({ error: 'Failed to fetch addresses' });
    }
});

// Add address
router.post('/', authenticate, async (req, res) => {
    try {
        const { name, phone, street, city, state, pincode, country, isDefault } = req.body;

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: req.user.id },
                data: { isDefault: false }
            });
        }

        const address = await prisma.address.create({
            data: {
                userId: req.user.id,
                name,
                phone,
                street,
                city,
                state,
                pincode,
                country: country || 'India',
                isDefault: isDefault || false
            }
        });

        res.status(201).json(address);
    } catch (error) {
        console.error('Add address error:', error);
        res.status(500).json({ error: 'Failed to add address' });
    }
});

// Update address
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, street, city, state, pincode, country, isDefault } = req.body;

        const existingAddress = await prisma.address.findFirst({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!existingAddress) {
            return res.status(404).json({ error: 'Address not found' });
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: req.user.id, id: { not: id } },
                data: { isDefault: false }
            });
        }

        const address = await prisma.address.update({
            where: { id },
            data: {
                name,
                phone,
                street,
                city,
                state,
                pincode,
                country,
                isDefault
            }
        });

        res.json(address);
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({ error: 'Failed to update address' });
    }
});

// Delete address
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const existingAddress = await prisma.address.findFirst({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!existingAddress) {
            return res.status(404).json({ error: 'Address not found' });
        }

        await prisma.address.delete({
            where: { id }
        });

        res.json({ message: 'Address deleted' });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({ error: 'Failed to delete address' });
    }
});

// Set default address
router.put('/:id/default', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        // Unset all defaults
        await prisma.address.updateMany({
            where: { userId: req.user.id },
            data: { isDefault: false }
        });

        // Set new default
        const address = await prisma.address.update({
            where: { id },
            data: { isDefault: true }
        });

        res.json(address);
    } catch (error) {
        console.error('Set default address error:', error);
        res.status(500).json({ error: 'Failed to set default address' });
    }
});

module.exports = router;
