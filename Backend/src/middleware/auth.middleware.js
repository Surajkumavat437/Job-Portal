import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedToken;
    return next();
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};
