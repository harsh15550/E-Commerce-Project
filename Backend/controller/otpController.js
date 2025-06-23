import nodemailer from 'nodemailer';
import otpModel from '../models/otp.js';
import userModel from '../models/user.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in DB with expiry (optional)
        await otpModel.create({ email, otp, createdAt: new Date() });

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASSWORD,
            },
        });

        await transporter.sendMail({
            to: email,
            subject: "Your OTP for password reset",
            text: `Your OTP is ${otp}`,
        });

        return res.json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        console.log(error);

    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await otpModel.findOne({ email, otp });
        if (!otpRecord) return res.status(400).json({ success: false, message: "Invalid OTP" });

        return res.json({ success: true, message: "OTP verified" });
    } catch (error) {
        console.log(error);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const {newPassword, email} = req.body;
        const user = await userModel.findOne({email});
        if(!user) return res.json({sucess: false, message: "User Not Found "})

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        return res.json({ success: true, message: 'User Register Successful' })

    } catch (error) {
        console.log(error);
    }
}