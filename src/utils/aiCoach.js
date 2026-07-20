import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

console.log("API Key:", apiKey);

const ai = new GoogleGenAI({
  apiKey,
});

export async function askInterviewCoach(message, category = "General") {
  try {
    const prompt = `
You are an expert ${category} interview coach.

User:
${message}
`;

    const response = await ai.models.generateContent({
   model: "gemini-2.0-flash",
      contents: prompt,
    });

    console.log("Full Gemini Response:", response);

    return response.text || "No response received.";
  } catch (err) {
    console.error("FULL ERROR:", err);

    alert(JSON.stringify(err, null, 2));

    return err.message || "Unknown error";
  }
}