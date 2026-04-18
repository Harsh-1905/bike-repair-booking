import express from "express";
import {
    forgotPassword,
    resetPassword,
    verifyOtp
} from "../controller/passwordController.js";

const router = express.Router();

router.post("/forgotpassword", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/resetpassword", resetPassword);

export default router;
