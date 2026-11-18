const sequelize = require('../sequelize');
const Student = require('./Student');
const Course = require('./Course');
const Enrollment = require('./Enrollment');

// Many-to-Many: a student can enrol in many courses, and a course can have
// many students. Each row in the enrollments table links one student to one course.
Student.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: 'studentId',
  otherKey: 'courseId',
  as: 'courses',
});
Course.belongsToMany(Student, {
  through: Enrollment,
  foreignKey: 'courseId',
  otherKey: 'studentId',
  as: 'students',
});

module.exports = { sequelize, Student, Course, Enrollment };
