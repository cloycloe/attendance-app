const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  course_name: {
    type: String,
    required: true,
    unique: true
  },
  course_code: {
    type: String,
    required: true,
    unique: true
  },
  subject: {
    type: String,
    required: true
  },
  lecturerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Course", CourseSchema);
