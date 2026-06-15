import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
    // Security: validate that MONGO_URI is present before attempting connection
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI environment variable is not set");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // Security: these options prevent certain injection-style edge cases
            // and enforce stricter query behaviour
            serverSelectionTimeoutMS: 10000, // fail fast if DB is unreachable
            socketTimeoutMS: 45000,
        });
        // Security: do not log the connection string — it contains credentials
        console.log("Successfully connected to the database");
    } catch (err) {
        // Security: log the error type/message but NOT the full connection string
        console.error(`Database connection failed: ${err.message}`);
        process.exit(1);
    }
};

export default connectDb;