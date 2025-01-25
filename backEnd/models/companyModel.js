const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel");

const Company = sequelize.define("Company", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.STRING,
  },
  industry: {
    type: DataTypes.STRING,
  },
  contactDetails: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.TEXT,
  },
});

// Associate Company with User (1-to-many relationship)
User.hasMany(Company, { foreignKey: "userId" });
Company.belongsTo(User, { foreignKey: "userId" });

module.exports = Company;
