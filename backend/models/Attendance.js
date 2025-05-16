const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  subject_id: {
    type: String,
    required: true,
    ref: 'Subject'
  },
  section_id: {
    type: String,
    required: true,
    ref: 'Section'
  },
  instructor_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  students: [{
    student_id: {
      type: String,
      required: true,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['present', 'absent'],
      required: true
    },
    marked_at: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Compound index to prevent multiple attendance records for same class on same day
attendanceSchema.index({ subject_id: 1, section_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
