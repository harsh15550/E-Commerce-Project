import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // OTP valid for 5 minutes
  },
});

const otpModel = mongoose.model("OTP", otpSchema);
export default otpModel;
