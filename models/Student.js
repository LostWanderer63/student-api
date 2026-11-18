const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

// Maps onto the existing students table from schema.sql (no timestamp columns).
const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'students',
  timestamps: false,
});

module.exports = Student;
