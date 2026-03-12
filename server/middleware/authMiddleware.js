import User from "../model/userModel.js";

export const requireAuth = async (req, res, next) => {
    try {
        // Get user_id from headers (set by axios interceptor)
        const user_id = req.headers['x-user-id'];
        
        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login."
            });
        }

        // Find the user and attach to request
        const user = await User.findById(user_id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found. Please login again."
            });
        }

        req.user = { id: user_id, ...user.toObject() };
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({
            success: false,
            message: "Authentication error",
            error: error.message
        });
    }
};