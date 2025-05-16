const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  course_id: {
    type: String,
    required: true,
    unique: true
  },
  course_name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Course", CourseSchema);
