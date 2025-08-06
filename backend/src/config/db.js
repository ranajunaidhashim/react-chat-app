import mongoose from "mongoose";

export const connectDb = async () => {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.DB_NAME;

    try {
        await mongoose.connect(uri, { dbName });
        console.log("✅ MongoDB connected");

    } catch (err) {
        console.log("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
}
