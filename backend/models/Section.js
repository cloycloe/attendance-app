const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  courseIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Section", SectionSchema);