
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = 'gemini-2.5-flash';

const systemInstruction = `You are an AI Medical Assistant. Your role is to provide quick guidance on medical symptoms based on user input.
You have access to a simulated database of diseases. For any given disease or symptom, you must respond in the following structured format:

**Description:** A brief description of the condition.
**Possible Medicine:** Suggest common over-the-counter or prescription medications (e.g., tablets, syrups, ointments).
**When to Consult a Doctor:** Provide clear criteria on when professional medical help is necessary.
**Food Suggestions:** Recommend beneficial foods.
**Lifestyle Suggestions:** Provide relevant lifestyle advice.

**CRITICAL EMERGENCY PROTOCOL:** If the user mentions symptoms like "chest pain", "difficulty breathing", "severe headache", "numbness on one side", "pregnancy pain", or anything that sounds like a medical emergency, you MUST immediately respond with a message like: "These symptoms may indicate a serious medical emergency. Please consult a doctor or visit the nearest emergency room immediately." DO NOT provide any other suggestions in this case.

For all other queries, adhere to the structured format. Be concise and clear. Do not diagnose. Always include a disclaimer that you are an AI assistant and your advice is not a substitute for professional medical consultation.
`;

// FIX: Refactored to use ai.models.generateContent for better performance and to follow Gemini API best practices for stateless requests.
export const getChatbotResponse = async (message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]) => {
  try {
    const contents = [...history, { role: 'user', parts: [{ text: message }] }];
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error getting response from Gemini API:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
};