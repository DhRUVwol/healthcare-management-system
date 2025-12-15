// app/api/socket.js
import { Server } from "socket.io";
import Message from "@/models/message";
import connectDB from "@/lib/mongodb";

let io;

export default async function handler(req, res) {
    if (!res.socket.server.io) {
        console.log("🔌 Initializing Socket.IO server...");
        await connectDB();

        io = new Server(res.socket.server, {
            path: "/api/socket_io",
            addTrailingSlash: false,
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
            },
        });

        res.socket.server.io = io;

        io.on("connection", (socket) => {
            console.log(`✅ User connected: ${socket.id}`);

            socket.on("joinRoom", ({ user_id, roomId }) => {
                if (!roomId || !user_id) return;
                socket.join(roomId);
                socket.emit("roomJoined", { roomId, status: "success" });
                console.log(`User ${user_id} joined room ${roomId}`);
            });

            socket.on("sendMessage", async (data) => {
                const { content, to, from, roomId, fileUrl, fileName, fileType } = data;
                if (!roomId) return;

                const message = new Message({
                    sender: from,
                    receiver: to,
                    content,
                    room: roomId,
                    fileUrl,
                    fileName,
                    fileType
                });

                await message.save();

                io.to(roomId).emit("receiveMessage", {
                    content,
                    from,
                    to,
                    timestamp: new Date(),
                    fileUrl,
                    fileName,
                    fileType
                });

                console.log(`💬 Message sent to room ${roomId}: ${content}`);
            });

            socket.on("disconnect", () => {
                console.log(`❌ User disconnected: ${socket.id}`);
            });
        });
    }
    res.end();
}
