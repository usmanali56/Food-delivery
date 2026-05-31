import mongoose from "mongoose";

/**
 * Connects to MongoDB once at startup.
 * Connection string comes from MONGO_URI in .env
 */
export async function connectDatabase() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  return mongoose.connection;
}
