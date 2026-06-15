const errorMiddleware = (err, req, res, next) => {
    // Security: log the full error server-side for observability, but NEVER send
    // stack traces or internal error details to the client.
    console.error(`[ERROR] ${req.method} ${req.originalUrl} →`, err);

    // Handle Mongoose duplicate-key errors (e.g. duplicate email on register)
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "A record with this value already exists.",
        });
    }

    // Handle Mongoose CastErrors (e.g. invalid ObjectId format)
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format.",
        });
    }

    // Handle Mongoose ValidationErrors (schema-level validation failures)
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: messages.join("; "),
        });
    }

    // Handle JWT errors
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired session. Please log in again.",
        });
    }

    const statusCode = err.statusCode || 500;

    // Security: in production, never reveal internal error messages for 5xx errors.
    // Only propagate the message for client-facing 4xx errors (ApiError instances).
    const isClientError = statusCode >= 400 && statusCode < 500;
    const message =
        isClientError
            ? err.message || "Bad request"
            : process.env.NODE_ENV === "production"
            ? "Internal Server Error"
            : err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorMiddleware;