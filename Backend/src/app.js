import express from "express";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import jobRoutes from "./routes/job.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
import applicationRoute from "./routes/application.route.js";
import cors from "cors";

const app = express();

// ─── Security: Restrict allowed origins to env-configured value only ───────────
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server requests (no origin) and the configured client origin
        if (!origin || origin === allowedOrigin) {
            callback(null, true);
        } else {
            callback(new Error("CORS policy violation: Origin not allowed"));
        }
    },
    credentials: true,
}));

// ─── Security: Limit JSON payload size to prevent DoS via large bodies ─────────
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(cookieParser());

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoute);

// ─── Global error handler (must be last) ───────────────────────────────────────
app.use(errorMiddleware);

export default app;