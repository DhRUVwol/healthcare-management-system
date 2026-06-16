import { NextResponse } from "next/server";
import OpenAI from "openai";
import jwt from "jsonwebtoken";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful medical assistant." },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({
      response: reply,
      newToken: newToken
    }, { status: 200 });

  } catch (error) {
    console.error("Chatbot Error:", error);
    return NextResponse.json({ response: `Error: ${error.message || "Internal Server Error"}` }, { status: 500 });
  }
}
