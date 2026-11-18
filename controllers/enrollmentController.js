const { Op } = require('sequelize');
const { Student, Course } = require('../models');

const courseFields = ['id', 'title', 'code', 'credits'];
const studentFields = ['id', 'name', 'email', 'age'];

// POST /students/:id/courses — enrol a student in one or more courses
// Body: { "courseIds": [1, 2] } or { "courseId": 1 }
exports.enrollStudent = async (req, res) => {
  const ids = req.body.courseIds ?? (req.body.courseId !== undefined ? [req.body.courseId] : null);
  if (!Array.isArray(ids) || ids.length === 0 || !ids.every(Number.isInteger)) {
    return res.status(400).json({ error: 'Provide courseId or a non-empty courseIds array of integers' });
  }
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const courses = await Course.findAll({ where: { id: { [Op.in]: ids } } });
    if (courses.length !== new Set(ids).size) {
      const found = courses.map(c => c.id);
      const missing = ids.filter(id => !found.includes(id));
      return res.status(404).json({ error: `Course(s) not found: ${missing.join(', ')}` });
    }

    await student.addCourses(courses);
    console.log(`ENROLL: student ${student.id} -> courses ${ids.join(', ')}`);
    const enrolled = await student.getCourses({ attributes: courseFields, joinTableAttributes: [] });
    res.status(201).json({ ...student.toJSON(), courses: enrolled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /students/:id/courses — a student with the courses they are enrolled in
exports.getStudentCourses = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [{ model: Course, as: 'courses', attributes: courseFields, through: { attributes: [] } }],
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /courses/:id/students — a course with the students enrolled in it
exports.getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      attributes: courseFields,
      include: [{ model: Student, as: 'students', attributes: studentFields, through: { attributes: [] } }],
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /students/:id/courses/:courseId — remove one enrolment
exports.unenrollStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    const removed = await student.removeCourse(Number(req.params.courseId));
    if (!removed) return res.status(404).json({ error: 'Student is not enrolled in that course' });
    console.log(`UNENROLL: student ${student.id} -> course ${req.params.courseId}`);
    res.json({ message: `Student ${student.id} removed from course ${req.params.courseId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
