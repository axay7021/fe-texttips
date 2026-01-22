import mongoose from "mongoose";

declare global {
  // keep a typed global cache for mongoose across module reloads

  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define mongo_uri in env variables");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;

    console.log("DB Connected");
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
