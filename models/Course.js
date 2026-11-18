const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3,
  },
}, {
  tableName: 'courses',
});

module.exports = Course;
