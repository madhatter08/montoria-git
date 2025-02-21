import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/roles/userModel.js";
import transporter from "../config/nodemailer.js";
import {
  WELCOME_EMAIL_TEMPLATE,
  WELCOME_EMAIL_ATTACHMENTS,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  //VERIFICATION_EMAIL_TEMPLATE,
  //ACCOUNT_VERIFICATION_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";

export const addUser = async (req, res) => {
  const { schoolId, email, password, roleId, ...roleData } = req.body;

  if (!schoolId || !email || !password || !roleId) {
    return res.json({ success: false, message: "Missing details" });
  }

  const roleIdMap = { 1: "admin", 2: "guide", 3: "student" };
  const role = roleIdMap[roleId];

  if (!role) {
    return res.json({ success: false, message: "Invalid roleId" });
  }

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { schoolId }],
    });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUserData = { schoolId, email, password: hashedPassword, roleId, role };

    // Handle Role-Specific Data
    switch (role) {
      case "admin":
        if (!roleData.name) {
          return res.json({ success: false, message: "Admin name is required" });
        }
        newUserData.adminData = { name: roleData.name };
        break;

      case "guide":
        const requiredGuideFields = [
          "firstName",
          "lastName",
          "address",
          "birthday",
          "contactNumber",
        ];
        for (const field of requiredGuideFields) {
          if (!roleData[field]) {
            return res.json({ success: false, message: `${field} is required` });
          }
        }
        newUserData.guideData = {
          firstName: roleData.firstName,
          middleName: roleData.middleName || "",
          lastName: roleData.lastName,
          address: roleData.address,
          birthday: roleData.birthday,
          contactNumber: roleData.contactNumber,
          photo: roleData.photo || "",
          class: roleData.class || [],
        };
        break;

      case "student":
        const requiredStudentFields = [
          "firstName",
          "lastName",
          "age",
          "gender",
          "birthday",
          "address",
          "levelId",
        ];
        for (const field of requiredStudentFields) {
          if (!roleData[field]) {
            return res.json({ success: false, message: `${field} is required` });
          }
        }
        newUserData.studentData = {
          firstName: roleData.firstName,
          middleName: roleData.middleName || "",
          lastName: roleData.lastName,
          age: roleData.age,
          gender: roleData.gender,
          birthday: roleData.birthday,
          address: roleData.address,
          parent: roleData.parent || [],
          photo: roleData.photo || "",
          allergy: roleData.allergy || "N/A",
          levelId: roleData.levelId,
          classId: roleData.classId || null,
          remarks: roleData.remarks || "",
        };
        break;

      default:
        return res.json({ success: false, message: "Invalid role specified" });
    }

    const newUser = new userModel(newUserData);
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const emailContent = WELCOME_EMAIL_TEMPLATE.replace("{schoolId}", schoolId);
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: newUser.email,
      subject: "Welcome to the team!",
      html: emailContent,
      attachments: WELCOME_EMAIL_ATTACHMENTS,
    };

    //await transporter.sendMail(mailOption);

    return res.json({ success: true, message: "User successfully registered", user: newUser });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


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

