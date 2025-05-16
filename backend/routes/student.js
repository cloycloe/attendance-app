const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const QRCode = require('qrcode');

// Get student subjects
router.get('/subjects/:studentId', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId)
      .populate('subjects');
    res.json(student.subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate QR code for attendance
router.post('/generate-qr', async (req, res) => {
  try {
    const { studentId, subjectId, timestamp } = req.body;
    
    // Create attendance data
    const attendanceData = {
      studentId,
      subjectId,
      timestamp,
      code: Math.random().toString(36).substring(7)
    };

    // Generate QR code
    const qrCode = await QRCode.toDataURL(JSON.stringify(attendanceData));
    res.json({ qrCode });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
