// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI, Content } from "@google/generative-ai";

// Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ generated_text: "No messages provided." });
    }

    // 1. Extract the user's latest message
    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.content;

    // 2. Format previous history for Gemini
    // Gemini uses 'user' and 'model' roles, while your app likely sends 'user' and 'assistant'
    const history: Content[] = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // 3. Select the model (Gemini 1.5 Flash is fast and free)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Start the chat with history
    const chat = model.startChat({
      history: history,
    });

    // 5. Send the new message
    const result = await chat.sendMessage(userPrompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini Response:", text);

    res.status(200).json({ generated_text: text });
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    res.status(500).json({ generated_text: "Failed to get response." });
  }
}
