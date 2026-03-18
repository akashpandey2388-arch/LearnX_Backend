const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('./models/Question'); // Ensure this path is correct

const starterQuestions = [
  { text: "Do you often research a topic endlessly instead of starting the actual task?", category: "Perfectionism", weight: 5 },
  { text: "How often do you say 'yes' to new tasks when your plate is already full?", category: "Boundaries", weight: 3 },
  { text: "When a project is 90% done, do you struggle to push through the final 10%?", category: "Execution", weight: 4 },
  { text: "Do you feel you need to know everything before you feel 'qualified' to start?", category: "Imposter Syndrome", weight: 5 }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("🌱 Connecting to MongoDB for seeding...");
    
    // 1. Clear existing questions
    await Question.deleteMany();
    console.log("🗑️  Old questions cleared.");

    // 2. Insert new questions
    await Question.insertMany(starterQuestions);
    console.log("✅ Questions Seeded Successfully!");

    // 3. Close connection and exit
    process.exit();
  })
  .catch(err => {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  });