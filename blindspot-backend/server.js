const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. Import Routes & Services
const analyzeRoutes = require('./routes/analyzeRoutes');
const { analyzeBlindspots } = require('./services/geminiService');

const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 4. Use Routes
// This maps all routes in analyzeRoutes.js to start with /api
app.use('/api', analyzeRoutes);

// 5. Temporary Health Check / Test Route
app.get('/', (req, res) => {
  res.send("Blindspot Analyzer API is running...");
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});