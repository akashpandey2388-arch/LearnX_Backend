const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Leadership', 'Tech Skills'
  weight: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);