const express = require("express");
const { getAnalytics } = require("../controllers/analyticsController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware); // Protect the route
router.get("/", getAnalytics);

module.exports = router;
