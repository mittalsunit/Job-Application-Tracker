const Job = require("../models/jobModel");
const { Sequelize } = require("sequelize");

// Get job analytics data
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Count jobs by status
    const statusCounts = await Job.findAll({
      where: { userId },
      attributes: ["status", [Sequelize.fn("COUNT", Sequelize.col("status")), "count"]],
      group: ["status"],
    });

    // 2. Count jobs over time (by month)
    const timelineCounts = await Job.findAll({
      where: { userId },
      attributes: [
        [Sequelize.fn("DATE_FORMAT", Sequelize.col("applicationDate"), "%Y-%m"), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: ["month"],
      order: [["month", "ASC"]],
    });

    res.status(200).json({
      statusCounts,
      timelineCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch analytics data", error });
  }
};
