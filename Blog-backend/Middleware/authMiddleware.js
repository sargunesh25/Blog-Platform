const jwt = require("jsonwebtoken");

// Fallback secret for development - set JWT_SECRET in .env for production
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token, not allowed ❌" });
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token ❌" });

    req.user = decoded; // save user info from token
    next();
  });
};
