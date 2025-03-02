import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/roles/userModel.js";
import transporter from "../config/nodemailer.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  //VERIFICATION_EMAIL_TEMPLATE,
  //ACCOUNT_VERIFICATION_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";


export const login = async (req, res) => {
  const { schoolId, password } = req.body;

  if (!schoolId || !password) {
    return res.json({ success: false, message: "School ID and password are required" });
  }
  try {
    const user = await userModel.findOne({ schoolId });
    if (!user) {
      return res.json({ success: false, message: "Invalid school ID or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid school ID or password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({ success: true, message: "Logged in", role: user.role });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendResetOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    // generate 6-digit random number Otp
    const otp = String(Math.floor(100000 + Math.random() * 90000));
    user.resetOtp = otp;
    //Otp expires in 15 mins
    user.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000;

    await user.save();
    const emailContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{verificationCode}", otp);
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      html: emailContent,
    };

    await transporter.sendMail(mailOption);
    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Email, OTP, and new password are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpiresAt = 0;

    await user.save();
    const emailContent = PASSWORD_RESET_SUCCESS_TEMPLATE;
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Reset Successful",
      html: emailContent,
    };

    await transporter.sendMail(mailOption);
    return res.json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

