import mongoose from "mongoose";

/**
 * User Schema with automatic timestamps
 * - createdAt: Automatically set when user is created
 * - updatedAt: Automatically updated when user data is modified
 * 
 * Note: Existing users in database may not have timestamps,
 * only new registrations after this update will include them.
 */
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    resetOtp: {
        type: String,
        default: null,
        select: false
    },
    resetOtpExpiry: {
        type: Date,
        default: null
    }
}, { timestamps: true });
export default mongoose.model("registration", userSchema)