const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeBlindspots = async (userData) => {
  try {
    // Try using 'gemini-1.5-flash' or 'gemini-pro' 
    // If one fails, the other usually works based on your SDK version
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Review this user statement: "${userData}". 
    Identify 2 specific professional blindspots and 1 growth tip. 
    Keep the tone helpful and professional.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("--- REAL ERROR FROM GOOGLE ---");
    console.error(error); // This prints the full error object
    throw new Error("AI Analysis failed");
  }
};

module.exports = { analyzeBlindspots };