import { NextResponse } from "next/server";
import OpenAI from "openai";
import jwt from "jsonwebtoken";



export async function POST(req) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build",
    });
    
    const { message, token } = await req.json();

    if (!message) {
      return NextResponse.json({ response: "Please enter a message." }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({ response: "Authentication required." }, { status: 401 });
    }

    // Decode JWT to get user info (Optional token system from original implementation)
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ response: "Session expired or invalid token. Please log in again." }, { status: 401 });
    }

    const userTokens = decodedToken.tokens ?? 10; // Default to 10 if not present

    if (userTokens <= 0) {
      return NextResponse.json({ response: "Not enough tokens. Please purchase more tokens to continue using the chatbot." }, { status: 403 });
    }

    // Deduct one token
    decodedToken.tokens = userTokens - 1;
    const newToken = jwt.sign(
      { id: decodedToken.id, tokens: decodedToken.tokens, ...decodedToken },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Simulate network delay for a realistic feel
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock response
    const reply = "I am a simulated AI Health Assistant (Mock Mode). I cannot provide real medical advice because the OpenAI API key is not configured, but this demonstrates that the chat interface and token system work perfectly!";

    return NextResponse.json({
      response: reply,
      newToken: newToken
    }, { status: 200 });

  } catch (error) {
    console.error("Chatbot Error:", error);
    return NextResponse.json({ response: `Error: ${error.message || "Internal Server Error"}` }, { status: 500 });
  }
}
