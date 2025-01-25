const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const path = require("path");
// Middleware to handle JSON and URL-encoded data with increased limits
app.use(express.json({ limit: "5mb" })); // JSON payload limit to 5 MB
app.use(express.urlencoded({ extended: true, limit: "5mb" })); // URL-encoded payload limit to 5 MB

app.use(express.json());

const sequelize = require("./config/db");
const authRoute = require("./routes/authRoute");
const jobRoutes = require("./routes/jobRoute");
const reminderRoutes = require("./routes/reminderRoute");
const companyRoutes = require("./routes/companyRoute");
const userRoutes = require("./routes/userRoute");
const analyticsRoutes = require("./routes/analyticsRoute");

app.use("/api/auth", authRoute);
app.use("/api/jobs", jobRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/analytics", analyticsRoutes);

require("dotenv").config();
const PORT = process.env.PORT || 6000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

sequelize
  .sync()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Failed to connect to the database:", err));
