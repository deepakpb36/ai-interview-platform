import { askAI } from "./services/aiService";

async function testAI() {
  try {
    const answer = await askAI(
      "Say hello and give me one short motivational sentence for an interview."
    );

    console.log("🤖 AI RESPONSE:");
    console.log(answer);
  } catch (error) {
    console.error("❌ AI ERROR:");
    console.error(error);
  }
  console.log(
  "API key loaded:",
  !!import.meta.env.VITE_OPENROUTER_API_KEY
);
}

testAI();