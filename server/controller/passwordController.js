import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetOtp = await bcrypt.hash(otp, 10);
        user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;

        await user.save();

        await sendEmail(email, `Your OTP is ${otp}`);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email }).select("+resetOtp");
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.resetOtpExpiry < Date.now()) {
        return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const isOtpValid = await bcrypt.compare(otp, user.resetOtp);
    if (!isOtpValid) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successful" });
};
