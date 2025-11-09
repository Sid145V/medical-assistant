import { GoogleGenAI } from "@google/genai";

// FIX: Initialize the GoogleGenAI client according to guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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


// FIX: Replaced mock implementation with a call to the Gemini API.
export const getChatbotResponse = async (message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]) => {
  try {
    // FIX: According to the guidelines, use 'gemini-2.5-flash' for basic text tasks.
    const model = 'gemini-2.5-flash';
    
    // The contents should be the entire conversation history plus the new message.
    // The caller in ChatbotPage.tsx passes the history *before* the new message is added to its state.
    const contents = [...history, { role: 'user', parts: [{ text: message }] }];

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    
    // FIX: Extract text directly from response object as per guidelines.
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // FIX: Provide a user-friendly error message.
    return "I'm sorry, I encountered an error while processing your request. Please try again later.";
  }
};
