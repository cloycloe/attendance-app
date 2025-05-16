const mongoose = require("mongoose");

const TeacherAssignmentSchema = new mongoose.Schema({
  instructor_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  course_id: {
    type: String,
    required: true,
    ref: 'Course'
  },
  subject_id: {
    type: String,
    required: true,
    ref: 'Subject'
  },
  subject_name: {
    type: String,
    required: true
  },
  section_id: {
    type: String,
    required: true,
    ref: 'Section'
  }
}, {
  collection: 'teacherassignments' // Explicitly set collection name
});

module.exports = mongoose.model("TeacherAssignment", TeacherAssignmentSchema);
