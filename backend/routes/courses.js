const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ course_name: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

// Add new course
router.post('/add', async (req, res) => {
  try {
    const { course_name, course_code } = req.body;
    
    // Check if course already exists
    const existingCourse = await Course.findOne({ 
      $or: [{ course_name }, { course_code }] 
    });
    
    if (existingCourse) {
      return res.status(400).json({ message: 'Course already exists' });
    }

    const course = new Course({
      course_name,
      course_code
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
});

// Update course
router.put('/:id', async (req, res) => {
  try {
    const { course_name, course_code } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { course_name, course_code },
      { new: true }
    );
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
});

module.exports = router;
