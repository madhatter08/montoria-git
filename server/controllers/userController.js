import userModel from "../models/roles/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user by _id
    const user = await userModel.findById(userId).select("-password -resetOtp -resetOtpExpiresAt -__v -createdAt -updatedAt");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
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
        return res.json({ success: false, message: "Invalid user role" });
    }

    res.json({
      success: true,
      userData: {
        email: user.email,
        schoolId: user.schoolId,
        role: user.role,
        isActive: user.isActive,
        roleData,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
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
