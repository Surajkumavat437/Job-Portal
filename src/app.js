import express from "express";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import jobRoutes from "./routes/job.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
import applicationRoute from "./routes/application.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoute);
app.use(errorMiddleware);

export default app;