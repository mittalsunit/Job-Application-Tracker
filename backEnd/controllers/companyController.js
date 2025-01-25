const Company = require("../models/companyModel");

// Create a new company
exports.createCompany = async (req, res) => {
  try {
    const { name, size, industry, contactDetails, notes } = req.body;
    const userId = req.user.id;

    const company = await Company.create({
      name,
      size,
      industry,
      contactDetails,
      notes,
      userId,
    });
    res.status(201).json({ message: "Company created successfully", company });
  } catch (error) {
    res.status(500).json({ message: "Failed to create company", error });
  }
};

// Get all companies for the logged-in user
exports.getCompanies = async (req, res) => {
  try {
    const userId = req.user.id;

    const companies = await Company.findAll({ where: { userId } });
    res.status(200).json({ companies });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch companies", error });
  }
};

// Update a company
exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, size, industry, contactDetails, notes } = req.body;

    const company = await Company.findOne({
      where: { id, userId: req.user.id },
    });
    if (!company) return res.status(404).json({ message: "Company not found" });

    await company.update({ name, size, industry, contactDetails, notes });
    res.status(200).json({ message: "Company updated successfully", company });
  } catch (error) {
    res.status(500).json({ message: "Failed to update company", error });
  }
};

// Delete a company
exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findOne({
      where: { id, userId: req.user.id },
    });
    if (!company) return res.status(404).json({ message: "Company not found" });

    await company.destroy();
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete company", error });
  }
};
