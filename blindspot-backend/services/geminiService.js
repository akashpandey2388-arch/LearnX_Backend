const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize the API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeBlindspots = async (userData) => {
  try {
    // UPDATED MODEL NAME FOR 2026
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      As a 'Blindspot' Analyst, review this user insight: "${userData}".
      Identify 2-3 psychological or professional blindspots and suggest a 
      specific action step for each. Keep it concise and insightful.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    // This will now show the SPECIFIC error if it fails again
    console.error("--- Gemini API Error Details ---");
    console.error("Status:", error.status);
    console.error("Message:", error.message);
    throw new Error("AI Analysis failed. Check server console for details.");
  }
};

module.exports = { analyzeBlindspots };