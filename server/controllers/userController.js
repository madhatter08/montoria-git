import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/roles/userModel.js";
import transporter from "../config/nodemailer.js";
import {
  WELCOME_EMAIL_TEMPLATE,
  WELCOME_EMAIL_ATTACHMENTS,
} from "./emailTemplates.js";

export const getUserData = async (req, res) => {
  try {
    // Use req.user set by userToken middleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Extract role-specific data
    let roleData;
    switch (user.role) {
      case "admin":
        roleData = user.adminData;
        break;
      case "guide":
        roleData = user.guideData;
        break;
      case "student":
        roleData = user.studentData;
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid user role" });
    }

    console.log("User data being sent:", user); // Debug log

    res.json({
      success: true,
      userData: {
        _id: user._id,
        email: user.email,
        schoolid: user.schoolId, // Renamed to schoolid (lowercase) for consistency
        role: user.role,
        isActive: user.isActive,
        roleData,
      },
    });
  } catch (error) {
    console.error("Error in getUserData:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllUserData = async (req, res) => {
  try {
    const users = await userModel
      .find()
      .select("-password -resetOtp -resetOtpExpiresAt -__v -createdAt -updatedAt");

    if (!users.length) {
      return res.json({ success: false, message: "No users found" });
    }

    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addUser = async (req, res) => {
  const { schoolId, email, password, roleId, ...roleData } = req.body;

  if (!schoolId || !email || !password || !roleId) {
    return res.json({ success: false, message: "Missing schoolId, email, password, or roleId" });
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
    let newUserData = {
      schoolId,
      email,
      password: hashedPassword,
      roleId,
      role,
    };

    // Handle Role-Specific Data
    switch (role) {
      case "admin":
        if (!roleData.name) {
          return res.json({
            success: false,
            message: "Admin name is required",
          });
        }
        newUserData.adminData = {
          name: roleData.name,
          photo: roleData.photo || "",
          contactNumber: roleData.contactNumber,
        };
        break;

      case "guide":
        const requiredGuideFields = [
          "guideType",
          "firstName",
          "lastName",
          "address",
          "birthday",
          "contactNumber",
        ];
        for (const field of requiredGuideFields) {
          if (!roleData[field]) {
            return res.json({
              success: false,
              message: `${field} is required`,
            });
          }
        }
        newUserData.guideData = {
          guideType: roleData.guideType,
          firstName: roleData.firstName,
          middleName: roleData.middleName || "",
          lastName: roleData.lastName, // Fixed typo from routeData to roleData
          address: roleData.address,
          birthday: roleData.birthday,
          contactNumber: roleData.contactNumber,
          photo: roleData.photo || "",
          class: roleData.class || "",
        };
        break;

      case "student":
        const requiredStudentFields = [
          "firstName",
          "lastName",
          "gender",
          "birthday",
          "address",
          "program",
          "level",
          "parentName",
          "parentRel",
          "parentPhone",
        ];
        for (const field of requiredStudentFields) {
          if (!roleData[field]) {
            return res.json({
              success: false,
              message: `${field} is required`,
            });
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
          parentName: roleData.parentName,
          parentRel: roleData.parentRel,
          parentPhone: roleData.parentPhone,
          photo: roleData.photo || "",
          program: roleData.program,
          level: roleData.level,
          class: roleData.class || null,
          remarks: roleData.remarks || "",
          lrn: roleData.lrn || "",
        };
        break;

      default:
        return res.json({ success: false, message: "Invalid role specified" });
    }

    const newUser = new userModel(newUserData);
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

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

    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      message: "User successfully registered",
      user: newUser,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const editUser = async (req, res) => {
  const { id } = req.params; // Get the user ID from the URL
  const { schoolId, email, password, roleId, ...roleData } = req.body; // Extract the updated data

  try {
    // Find the user by ID
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update top-level fields if provided
    if (schoolId) user.schoolId = schoolId;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (roleId) {
      const roleIdMap = { 1: "admin", 2: "guide", 3: "student" };
      const role = roleIdMap[roleId];
      if (!role) {
        return res.status(400).json({ success: false, message: "Invalid roleId" });
      }
      user.roleId = roleId;
      user.role = role;
    }

    // Update role-specific data
    switch (user.role) {
      case "admin":
        if (roleData.name) user.adminData.name = roleData.name;
        if (roleData.photo) user.adminData.photo = roleData.photo;
        if (roleData.contactNumber) user.adminData.contactNumber = roleData.contactNumber;
        break;

      case "guide":
        if (roleData.guideType) user.guideData.guideType = roleData.guideType;
        if (roleData.firstName) user.guideData.firstName = roleData.firstName;
        if (roleData.middleName) user.guideData.middleName = roleData.middleName;
        if (roleData.lastName) user.guideData.lastName = roleData.lastName;
        if (roleData.address) user.guideData.address = roleData.address;
        if (roleData.birthday) user.guideData.birthday = roleData.birthday;
        if (roleData.contactNumber) user.guideData.contactNumber = roleData.contactNumber;
        if (roleData.photo) user.guideData.photo = roleData.photo;
        if (roleData.class) user.guideData.class = roleData.class;
        break;

      case "student":
        if (roleData.firstName) user.studentData.firstName = roleData.firstName;
        if (roleData.middleName) user.studentData.middleName = roleData.middleName;
        if (roleData.lastName) user.studentData.lastName = roleData.lastName;
        if (roleData.age) user.studentData.age = roleData.age;
        if (roleData.gender) user.studentData.gender = roleData.gender;
        if (roleData.birthday) user.studentData.birthday = roleData.birthday;
        if (roleData.address) user.studentData.address = roleData.address;
        if (roleData.parentName) user.studentData.parentName = roleData.parentName;
        if (roleData.parentRel) user.studentData.parentRel = roleData.parentRel;
        if (roleData.parentPhone) user.studentData.parentPhone = roleData.parentPhone;
        if (roleData.photo) user.studentData.photo = roleData.photo;
        if (roleData.program) user.studentData.program = roleData.program;
        if (roleData.level) user.studentData.level = roleData.level;
        if (roleData.class) user.studentData.class = roleData.class;
        if (roleData.lrn) user.studentData.lrn = roleData.lrn;
        if (roleData.remarks) user.studentData.remarks = roleData.remarks;
        break;

      default:
        return res.status(400).json({ success: false, message: "Invalid role specified" });
    }

    // Save the updated user
    const updatedUser = await user.save();

    res.json({ success: true, message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Server error while updating user" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params; // Get the user ID from the URL

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await userModel.findByIdAndDelete(id);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error while deleting user" });
  }
};