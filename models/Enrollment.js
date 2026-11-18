const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

// Junction table for the many-to-many link between students and courses.
const Enrollment = sequelize.define('Enrollment', {
  studentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  courseId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
}, {
  tableName: 'enrollments',
});

module.exports = Enrollment;
