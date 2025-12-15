
// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error("❌ Please define the MONGODB_URI environment variable");
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectDB() {
//   if (cached.conn) {
//     console.log("✅ Using existing MongoDB connection");
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     console.log("🔄 Connecting to MongoDB Atlas...");
    
//     cached.promise = mongoose
//       .connect(MONGODB_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       })
//       .then((mongoose) => {
//         console.log("🚀 MongoDB Atlas connected!");
//         return mongoose;
//       })
//       .catch((err) => {
//         console.error("❌ MongoDB connection error:", err);
//         throw new Error("❌ MongoDB connection failed"); // Ensure the app stops on failure
//       });
//   }

//   try {
//     cached.conn = await cached.promise;
//     return cached.conn;
//   } catch (err) {
//     cached.promise = null; // Reset promise on failure
//     throw err;
//   }
// }

// export default connectDB;


import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      // These options are no longer needed in newer MongoDB drivers
      // but keeping them won't hurt
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Increase timeout to 10 seconds
      socketTimeoutMS: 45000, // Socket timeout
    };

    console.log("🔄 Connecting to MongoDB Atlas...");
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        cached.promise = null; // Reset the promise on error
        throw err; // Re-throw to be handled by the caller
      });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Handle error but don't throw again to prevent double error logs
    console.error("Failed to establish MongoDB connection");
    return null;
  }
}

export default connectDB;