import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server Error: Missing API Key" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const formattedContents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
    });

    const generatedText = result.text;

    if (!generatedText) {
      return NextResponse.json({ generated_text: "No response generated." });
    }

    return NextResponse.json({ generated_text: generatedText });
  } catch (error) {
    console.error("❌ Gemini API Error:", (error as Error).message);
    return NextResponse.json(
      {
        error: "AI Service Failed",
        details: (error as Error).message,
      },
    { status: 500 }
    );
  }
}
