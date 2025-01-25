const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel"); // For associating jobs with users

const Job = sequelize.define("Job", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  applicationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("applied", "interviewed", "offered", "rejected"),
    defaultValue: "applied",
  },
  notes: {
    type: DataTypes.TEXT,
  },
  // resume: {
  //   type: DataTypes.STRING,
  //   allowNull: true, // Optional
  // },
});

// Associate Job with User (1-to-many relationship)
User.hasMany(Job, { foreignKey: "userId" });
Job.belongsTo(User, { foreignKey: "userId" });

module.exports = Job;
