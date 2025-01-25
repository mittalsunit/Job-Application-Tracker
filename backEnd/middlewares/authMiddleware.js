const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user; // Attach user to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error });
  }
};

module.exports = authMiddleware;
