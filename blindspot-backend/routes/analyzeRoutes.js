const express = require('express');
const router = express.Router();
const { analyzeBlindspots } = require('../services/geminiService');

// POST: /api/analyze
router.post('/analyze', async (req, res) => {
    try {
        const { userData } = req.body;

        if (!userData) {
            return res.status(400).json({ error: "No user data provided" });
        }

        // Send the data to our Gemini Service
        const analysis = await analyzeBlindspots(userData);
        
        res.json({
            success: true,
            analysis: analysis
        });
    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ error: "AI Analysis failed" });
    }
});

module.exports = router;