import jwt from "jsonwebtoken";
import User from "../models/roles/userModel.js"; // Import User model to fetch full user data

const userToken = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenDecode.id) {
      return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
    }

    // Fetch full user data from the database
    const user = await User.findById(tokenDecode.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Attach full user object to req.user
    req.user = user;
    req.body.userId = tokenDecode.id; // Keep this for compatibility if needed elsewhere

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ success: false, message: "Unauthorized - token verification failed" });
  }
};

export default userToken;