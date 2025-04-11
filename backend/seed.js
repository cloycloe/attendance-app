const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Course = require("./models/Course");
const Section = require("./models/Section");
const Enrollment = require("./models/Enrollment");
const Attendance = require("./models/Attendance");
const dotenv = require("dotenv");

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/attendance-app");
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Section.deleteMany({});
    await Enrollment.deleteMany({});
    await Attendance.deleteMany({});

    // Create courses first
    const course1 = new Course({
      course_code: 'BSIT',
      course_name: 'Bachelor of Science in Information Technology',
      subject: 'Secure Mobile Application'
    });

    const course2 = new Course({
      course_code: 'BSN',
      course_name: 'Bachelor of Science in Nursing',
      subject: 'Nursing Fundamentals'
    });

    await course1.save();
    await course2.save();
    console.log('Courses seeded successfully');

    // Create sections
    const sectionA = new Section({
      name: 'BSIT-1A',
      courseIds: [course1._id]
    });

    const sectionB = new Section({
      name: 'BSN-1A',
      courseIds: [course2._id]
    });

    await sectionA.save();
    await sectionB.save();
    console.log('Sections seeded successfully');

    // Create users with proper ID scheme
    const users = [
      // Admins (1xxx)
      {
        user_id: 1001,
        username: 'ADMIN-1001',
        password: 'password1',
        name: 'Cloe Mabanding',
        role: 'Administrator'
      },
      // Add your new admin here
      {
        user_id: 1002,
        username: 'ADMIN-1002',
        password: 'youradmin2',
        name: 'Cloy Cloe',
        role: 'Administrator'
      },

      // Lecturers (2xxx)
      {
        user_id: 2001,
        username: 'LECT-2001',
        password: 'password2',
        name: 'Sophie Bohol',
        role: 'Instructor'
      },
      // Add new lecturer here if needed
      {
        user_id: 2002,
        username: 'LECT-2002',
        password: 'lecturer2',
        name: 'John Doe',
        role: 'Instructor'
      },

      // Students (3xxx)
      {
        user_id: 3001,
        username: 'STUD-3001',
        password: 'password3',
        name: 'Ella Ventura',
        role: 'Student',
        section: sectionA._id
      },
      {
        user_id: 3002,
        username: 'STUD-3002',
        password: 'password3',
        name: 'Maureen Portillo',
        role: 'Student',
        section: sectionA._id
      }
      // Add new students here if needed
    ];

    // Save all users
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
    }

    console.log('Users seeded successfully');

    // Update courses with lecturer ID (use the first lecturer)
    const lecturer = await User.findOne({ role: 'Instructor' });
    if (lecturer) {
      course1.lecturerId = lecturer._id;
      course2.lecturerId = lecturer._id;
      await course1.save();
      await course2.save();
    }

    // Create enrollments for students
    const students = await User.find({ role: 'Student' });
    const enrollments = students.map(student => ({
      studentId: student._id,
      courseId: course1._id
    }));

    await Enrollment.insertMany(enrollments);
    console.log('Enrollments seeded successfully');

    console.log('\nDatabase seeded with:');
    console.log('Users created:');
    for (const user of users) {
      console.log(`- ${user.role}: ${user.username} (ID: ${user.user_id})`);
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase();