import express from "express";
import {
    forgotPassword,
    resetPassword
} from "../controller/passwordController.js";

const router = express.Router();

router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

export default router;
