const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  username: {
    type: String,
    required: true
  },
  subjectId: {
    type: String,
    required: true,
    ref: 'Subject'
  },
  sectionId: {
    type: String,
    required: true,
    ref: 'Section'
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  }
});

// Compound index to prevent duplicate enrollments
enrollmentSchema.index({ user_id: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
