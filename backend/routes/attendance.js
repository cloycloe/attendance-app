const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Course = require('../models/Course');

// Get attendance report
router.get('/report', async (req, res) => {
  try {
    const { classId, startDate, endDate } = req.query;

    const attendanceRecords = await Attendance.find({
      class_id: classId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
    .populate('student_id', 'name user_id')
    .populate('class_id', 'course_name')
    .sort({ date: 1, 'student_id.name': 1 });

    const reportData = attendanceRecords.map(record => ({
      date: record.date.toLocaleDateString(),
      student_id: record.student_id.user_id,
      student_name: record.student_id.name,
      class_name: record.class_id.course_name,
      status: record.status
    }));

    res.json(reportData);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});

// Mark attendance
router.post('/mark', async (req, res) => {
  try {
    const { student_id, class_id, date, status, marked_by } = req.body;

    const attendance = new Attendance({
      student_id,
      class_id,
      date: new Date(date),
      status,
      marked_by
    });

    await attendance.save();
    res.status(201).json({ message: 'Attendance marked successfully', attendance });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
});

// Get attendance by class and date
router.get('/class/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;

    const attendance = await Attendance.find({
      class_id: classId,
      date: new Date(date)
    })
    .populate('student_id', 'name user_id')
    .sort({ 'student_id.name': 1 });

    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
});

module.exports = router;
