const { Op } = require("sequelize");
const Busboy = require("busboy");
const uploadToS3 = require("../utils/awsS3");
const Job = require("../models/jobModel");

// Create a new job application
exports.createJob = (req, res) => {
  const busboy = Busboy({ headers: req.headers });  //// Updated instantiation

  const jobData = {}; // store job fields
  let resumeUrl = null; // store the S3 URL of the uploaded resume

  // Handle form fields
  busboy.on("field", (fieldname, value) => {
    jobData[fieldname] = value;
  });

  // Handle file upload
  busboy.on("file", (fieldname, file, filename) => {
    if (fieldname === "resume") {
      const uniqueFileName = `${Date.now()}-${filename}`;
      uploadToS3(file, uniqueFileName)
        .then((data) => {
          resumeUrl = data.Location; // S3 file URL
        })
        .catch((err) => {
          console.error("S3 Upload Error:", err);
          res.status(500).json({ message: "Failed to upload file to S3" });
        });
    }
  });

  // When the form is fully parsed
  busboy.on("finish", async () => {
    try {
      const userId = req.user.id;
      const job = await Job.create({
        ...jobData,
        resume: resumeUrl,
        userId,
      });

      res
        .status(201)
        .json({ message: "Job application created successfully", job });
    } catch (error) {
      console.error("Error creating job:", error);
      res
        .status(500)
        .json({ message: "Failed to create job application", error });
    }
  });

  // Pipe the request into Busboy
  req.pipe(busboy);
};

// Get all job applications for the logged-in user
exports.getJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const { search, status, startDate, endDate } = req.query; // Extract query parameters

    const whereClause = { userId }; // Build the where clause for filtering

    // Add search condition (searching in companyName and jobTitle)
    if (search) {
      whereClause[Op.or] = [
        { companyName: { [Op.like]: `%${search}%` } },
        { jobTitle: { [Op.like]: `%${search}%` } },
      ];
    }

    // Add status filter
    if (status) whereClause.status = status;

    // Add date range filter
    if (startDate && endDate) {
      whereClause.applicationDate = {
        [Op.between]: [startDate, endDate],
      };
    }

    const jobs = await Job.findAll({ where: { userId } });
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs", error });
  }
};

// Update a job application
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, jobTitle, applicationDate, status, notes } = req.body;

    const job = await Job.findOne({ where: { id, userId: req.user.id } });
    if (!job)
      return res.status(404).json({ message: "Job application not found" });

    await job.update({
      companyName,
      jobTitle,
      applicationDate,
      status,
      notes,

      resume,
    });
    res
      .status(200)
      .json({ message: "Job application updated successfully", job });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update job application", error });
  }
};

// Delete a job application
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findOne({ where: { id, userId: req.user.id } });
    if (!job)
      return res.status(404).json({ message: "Job application not found" });

    await job.destroy();
    res.status(200).json({ message: "Job application deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete job application", error });
  }
};
