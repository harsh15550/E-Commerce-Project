import express from "express";
import { forgotPassword, resetPassword, verifyOtp } from "../controller/otpController.js";
const otpRouter = express.Router();

otpRouter.post('/forgot-password', forgotPassword);
otpRouter.post('/verify', verifyOtp);
otpRouter.post('/reset-password', resetPassword);

export default otpRouter;