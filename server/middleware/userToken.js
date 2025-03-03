import jwt from "jsonwebtoken";

const userToken = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'Unauthorized - no token provided' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
          //req.user = { userId: tokenDecode.id }; // Attach user ID to req.user
          req.body.userId = tokenDecode.id;
        } else {
            return res.json({ success: false, message: "Unauthorized - invalid token" });
        }

        next();
        
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export default userToken;