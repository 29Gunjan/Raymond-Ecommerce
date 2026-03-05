const express = require('express');
const router = express.Router();
const { runCustomerSupport } = require('../services/aiChat.service');
const { authenticate } = require('../middleware/auth.middleware');

// POST /api/chat — AI Customer Support (requires login)
router.post('/', authenticate, async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        // Check if GROQ_API_KEY is configured
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({
                success: false,
                error: 'AI service is not configured. Please add GROQ_API_KEY to .env'
            });
        }

        const result = await runCustomerSupport(message.trim(), history || []);

        res.json({
            success: true,
            data: {
                category: result.category,
                sentiment: result.sentiment,
                response: result.response,
                escalated: result.escalated,
                products: result.products || []
            }
        });
    } catch (error) {
        console.error('Chat API Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to process your message. Please try again.'
        });
    }
});

module.exports = router;
