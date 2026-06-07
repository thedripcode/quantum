import { GoogleGenAI } from "@google/genai";
import { GEMINI_SYSTEM_INSTRUCTION } from '../constants';

// Initialize the client
// API Key is assumed to be in process.env.API_KEY
const client = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageToGemini = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string
): Promise<string> => {
  try {
    // Transform history to the format expected by the SDK if necessary, 
    // but for simple single-turn or managed history, we can just use generateContent for now 
    // or use chat. For simplicity and robustness in this demo context, we'll use a chat session.

    const chat = client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I didn't catch that. Could you rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the school's information database right now. Please try again later.";
  }
};