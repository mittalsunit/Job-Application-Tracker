const express = require("express");
const {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware); // Protect all job routes

// Routes
router.post("/", createJob);
router.get("/", getJobs);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;
