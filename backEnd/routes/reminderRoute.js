const express = require("express");
const { sendReminder } = require("../controllers/reminderController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware); // Protect all reminder routes with authentication

router.post("/", sendReminder); // Route to send a reminder

module.exports = router;
