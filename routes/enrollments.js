const express = require('express');
const enrollments = require('../controllers/enrollmentController');

const router = express.Router();

router.post('/students/:id/courses', enrollments.enrollStudent);
router.get('/students/:id/courses', enrollments.getStudentCourses);
router.delete('/students/:id/courses/:courseId', enrollments.unenrollStudent);
router.get('/courses/:id/students', enrollments.getCourseStudents);

module.exports = router;
