import ApiError from "../utils/apiError.js";

const roleMiddleware = (...allowedRoles)=>{
    return (req,res,next)=>{
        const userRole = req.user?.role;

        if(!userRole){
            return next(new ApiError(401, "Unauthorized"));
        }

        if(!allowedRoles.includes(userRole)){
            return next(new ApiError(403, "Forbidden: Access denied"));
        }

        next();
    }
}

export default roleMiddleware;