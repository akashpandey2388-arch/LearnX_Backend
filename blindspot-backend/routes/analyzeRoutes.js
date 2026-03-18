const express = require('express');
const router = express.Router();
const { analyzeBlindspots } = require('../services/geminiService');
const Cluster = require('../models/Cluster'); 
const Question = require('../models/Question'); // <--- 1. ADD THIS IMPORT

// POST: /api/analyze
router.post('/analyze', async (req, res) => {
    try {
        const { userData } = req.body;
        if (!userData) return res.status(400).json({ error: "No user data provided" });

        const analysis = await analyzeBlindspots(userData);

        const newEntry = new Cluster({
            originalInput: userData,
            aiAnalysis: analysis
        });
        await newEntry.save();

        res.json({
            success: true,
            analysis: analysis,
            savedId: newEntry._id 
        });
    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ error: "Analysis failed" });
    }
});

// GET: /api/history
router.get('/history', async (req, res) => {
    try {
        const history = await Cluster.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch history" });
    }
});

// GET: /api/questions <--- 2. ADD THIS NEW ROUTE
router.get('/questions', async (req, res) => {
    try {
        // This fetches the questions we seeded with seed.js
        const questions = await Question.find().sort({ weight: -1 });
        res.json(questions);
    } catch (error) {
        console.error("Fetch Questions Error:", error);
        res.status(500).json({ error: "Could not fetch questions" });
    }
});

module.exports = router;