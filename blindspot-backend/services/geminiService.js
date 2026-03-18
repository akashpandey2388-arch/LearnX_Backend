const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize the Gemini API with your key from the .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeBlindspots = async (surveyData) => {
  try {
    // We use 'gemini-1.5-flash' for speed and cost-efficiency
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert data analyst. I am providing you with survey responses: ${JSON.stringify(surveyData)}.
      Identify the top 3 "blindspots" (areas where the user's perception differs from reality or common patterns).
      Return the results in a clear, bulleted format.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze data with AI.");
  }
};

module.exports = { analyzeBlindspots };