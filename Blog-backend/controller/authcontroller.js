const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Fallback secret for development - set JWT_SECRET in .env for production
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

exports.Signup = async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });

  res.json({ message: "Signup successful ✅" });
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found ❌" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Wrong password ❌" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({ message: "Login successful ✅", token });
}