import app from "./src/app.js";
import connectDb from "./src/config/db.js";
import dotenv from "dotenv";

dotenv.config();


const startServer = async () => {
  try {
    await connectDb();
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
