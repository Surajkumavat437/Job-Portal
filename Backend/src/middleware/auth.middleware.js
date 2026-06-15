import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";

const  authMiddleware = async (req, res, next) => {
    // Read the token from the securely transmitted httpOnly cookie
    const token = req.cookies.accessToken;

    // 🌟 FIX: Use return next() instead of throw to hand control to your errorMiddleware cleanly
    if (!token) {
        return next(new ApiError(401, "Unauthorized: No session token found. Please log in."));
    }

    try { 
        // Verify signature integrity against your server environment configuration keys
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        
        // Attach the unpacked payload data (id, role) onto the request state bundle
        req.user = decodedToken;
        
        // Yield execution access cleanly downstream to the next middleware or controller route
        return next();
    } catch (err) {
        // Hand token validation details (expired or manipulated signatures) to your error catcher
        return next(new ApiError(401, "Invalid or expired session token. Please log in again."));
    }
};

export default authMiddleware