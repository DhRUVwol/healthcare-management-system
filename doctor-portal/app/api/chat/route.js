// app/api/chat/route.js
import connectDB from "@/lib/mongodb";
import Message from "@/models/message";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const sender = searchParams.get("sender");
        const receiver = searchParams.get("receiver");

        await connectDB();
        const messages = await Message.find({
            $or: [
                { sender: sender, receiver: receiver },
                { sender: receiver, receiver: sender }
            ]
        }).sort({ createdAt: 1 }); // oldest to newest
        return NextResponse.json(messages, { status: 200 });

    } catch (e) {
        return NextResponse.json({ err: e.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const { content, sender, receiver, roomId } = await req.json();
        const newMessage = new Message({
            content,
            sender,
            receiver,
            room: roomId
        });
        await newMessage.save();
        return NextResponse.json(newMessage, { status: 201 });

    } catch (e) {
        return NextResponse.json({ err: e.message }, { status: 500 });
    }
}
