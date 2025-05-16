const express = require('express');
const router = express.Router();
const TeacherAssignment = require('../models/TeacherAssignment');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

// Get sections for a specific subject and instructor
router.get('/sections/:subject_code', async (req, res) => {
  try {
    const { subject_code } = req.params;
    const instructor_id = req.user.user_id; // Assuming you have auth middleware

    const assignment = await TeacherAssignment.findOne({
      instructor_id,
      subject_code
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ sections: assignment.sections });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get students for a specific section
router.get('/enrollments/students/:section_id', async (req, res) => {
  try {
    const { section_id } = req.params;

    // Find all enrollments for this section
    const enrollments = await Enrollment.find({ section_id });

    // Get all student IDs from enrollments
    const studentIds = enrollments.map(e => e.student_id);

    // Find all students
    const students = await User.find({
      user_id: { $in: studentIds },
      role: 'Student'
    }).select('user_id username name');

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get instructor's classes
router.get('/instructor/classes', async (req, res) => {
  try {
    const instructor_id = req.user.user_id; // From auth middleware

    const assignments = await TeacherAssignment.find({ instructor_id })
      .populate('sections.section_id');

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
