const express = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware); // Protect routes

router.get("/profile", getProfile); // Get user profile
router.put("/profile", updateProfile); // Update user profile

module.exports = router;
