const mongoose = require('mongoose');

const ClusterSchema = new mongoose.Schema({
  originalInput: { type: String, required: true },
  aiAnalysis: { type: String, required: true },
  category: { type: String, default: "General" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cluster', ClusterSchema);