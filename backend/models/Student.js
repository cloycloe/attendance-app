const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  studentId: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Student', studentSchema);
