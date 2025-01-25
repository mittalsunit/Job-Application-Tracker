const express = require("express");
const {
  createCompany,
  getCompanies,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware); // Protect all company routes with authentication

// Routes
router.post("/", createCompany);
router.get("/", getCompanies);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

module.exports = router;
