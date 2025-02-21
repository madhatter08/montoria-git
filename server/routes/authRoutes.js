import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  addUser,
  resetPassword,
  sendResetOTP,
  //sendVerifyOtp,
  //verifyEmail,
} from "../controllers/authController.js";
import userToken from "../middleware/userToken.js";

const authRouter = express.Router();

// API Endpoints
authRouter.post("/add-user", addUser);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-reset-otp", sendResetOTP);
authRouter.post("/reset-password", resetPassword);

// authRouter.post("/send-verify-otp", userToken, sendVerifyOtp);
// authRouter.post("/verify-account", userToken, verifyEmail);
authRouter.get("/is-auth", userToken, isAuthenticated);

export default authRouter;
