const jwt = require("jsonwebtoken");
const User = require("../models/user");

// 🔐 PROTECT ROUTES
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🚫 Blocked users (except admin)
    if (user.role !== "admin" && user.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked by admin",
      });
    }

    // ⏳ Vendor approval check
    if (user.role === "vendor" && !user.isApproved) {
      return res.status(403).json({
        message: "Your vendor account is not approved by admin",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 🔐 ROLE BASED ACCESS
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied for this role",
      });
    }
    next();
  };
};

// ✅ IMPORTANT EXPORT
module.exports = {
  protect,
  authorize,
};
