const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        // Check if user_id follows the pattern
        if (this.role === 'Student') {
          return v.startsWith('3');
        } else if (this.role === 'Instructor') {
          return v.startsWith('2');
        } else if (this.role === 'Administrator') {
          return v.startsWith('1');
        }
        return false;
      },
      message: 'user_id must start with 3 for Students, 2 for Instructors, or 1 for Administrators'
    }
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["Administrator", "Instructor", "Student"],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Static method to get next available user_id
UserSchema.statics.getNextUserId = async function(role) {
  let prefix;
  if (role === 'Student') prefix = '3';
  else if (role === 'Instructor') prefix = '2';
  else if (role === 'Administrator') prefix = '1';
  
  const lastUser = await this.findOne({ role })
    .sort({ user_id: -1 })  // Sort by user_id in descending order
    .select('user_id');
    
  if (!lastUser) {
    return `${prefix}001`; // First user of this role
  }
  
  const lastNumber = parseInt(lastUser.user_id.slice(1));
  const nextNumber = lastNumber + 1;
  return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
};

// Hash password before saving
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("User", UserSchema);