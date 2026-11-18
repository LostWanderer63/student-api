const express = require('express');
const { UniqueConstraintError, ValidationError } = require('sequelize');
const Course = require('../models/Course');

const router = express.Router();

function handleError(res, err) {
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({ error: 'Course code already exists' });
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
  }
  res.status(500).json({ error: err.message });
}

// INSERT: add a new course with Model.create()
router.post('/', async (req, res) => {
  const { title, code, credits } = req.body;
  try {
    const course = await Course.create({ title, code, credits });
    console.log(`INSERT: course ${course.id} added (${course.code})`);
    res.status(201).json(course);
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
