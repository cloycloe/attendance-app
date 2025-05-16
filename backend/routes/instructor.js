const express = require('express');
const router = express.Router();
const TeacherAssignment = require('../models/TeacherAssignment');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Section = require('../models/Section');

router.get('/subjects/:instructorId', async (req, res) => {
  try {
    const assignments = await TeacherAssignment.find({ 
      instructor_id: req.params.instructorId 
    })
    .populate('subject_id')
    .populate('section_id')
    .populate('course_id');
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/courses/:instructorId', async (req, res) => {
  try {
    // Get all assignments for this instructor
    const assignments = await TeacherAssignment.find({
      instructor_id: req.params.instructorId
    });

    // Group assignments by course
    const courseMap = {};
    for (const assignment of assignments) {
      if (!courseMap[assignment.course_id]) {
        const course = await Course.findOne({ course_id: assignment.course_id });
        courseMap[assignment.course_id] = {
          course_id: assignment.course_id,
          course_name: course.course_name,
          subjects: []
        };
      }
      courseMap[assignment.course_id].subjects.push({
        subject_id: assignment.subject_id,
        subject_name: assignment.subject_name,
        section_id: assignment.section_id
      });
    }

    res.json(Object.values(courseMap));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get instructor's courses, subjects, and students
router.get('/:instructorId', async (req, res) => {
  try {
    const instructor = await Instructor.findOne({ instructor_id: req.params.instructorId })
      .populate('courses.course_id', 'course_name')
      .populate('courses.subjects.subject_id', 'subject_name')
      .populate('courses.subjects.section_id', 'section_id')
      .populate('courses.subjects.students.student_id', 'name');

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.json(instructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new subject to instructor's course
router.post('/:instructorId/courses/:courseId/subjects', async (req, res) => {
  try {
    const { subject_id, section_id } = req.body;
    
    const instructor = await Instructor.findOne({ instructor_id: req.params.instructorId });
    
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    const course = instructor.courses.find(c => c.course_id === req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.subjects.push({ subject_id, section_id, students: [] });
    await instructor.save();

    res.status(201).json(instructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add student to a subject
router.post('/:instructorId/subjects/:subjectId/students', async (req, res) => {
  try {
    const { student_id } = req.body;
    
    const instructor = await Instructor.findOne({ instructor_id: req.params.instructorId });
    
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Find the subject in any course
    let subjectFound = false;
    instructor.courses.forEach(course => {
      const subject = course.subjects.find(s => s.subject_id === req.params.subjectId);
      if (subject) {
        subject.students.push({ student_id });
        subjectFound = true;
      }
    });

    if (!subjectFound) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    await instructor.save();
    res.status(201).json(instructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
