const express = require('express');
const router = express.Router();
const { analyzeBlindspots } = require('../services/geminiService');
const Cluster = require('../models/Cluster'); // Import the model

router.post('/analyze', async (req, res) => {
    try {
        const { userData } = req.body;

        if (!userData) {
            return res.status(400).json({ error: "No user data provided" });
        }

        // 1. Get the AI Analysis
        const analysis = await analyzeBlindspots(userData);

        // 2. SAVE to MongoDB
        const newEntry = new Cluster({
            originalInput: userData,
            aiAnalysis: analysis
        });
        await newEntry.save();

        // 3. Return response to user
        res.json({
            success: true,
            analysis: analysis,
            savedId: newEntry._id // Let them know it's saved!
        });
    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ error: "Analysis failed" });
    }
});

// GET: /api/history
// Retrieves all previous AI analyses
router.get('/history', async (req, res) => {
    try {
        const history = await Cluster.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch history" });
    }
});


module.exports = router;