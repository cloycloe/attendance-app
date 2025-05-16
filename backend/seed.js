const mongoose = require('mongoose');
const Course = require('./models/Course');
const Subject = require('./models/Subject');
const Section = require('./models/Section');
const Enrollment = require('./models/Enrollment');
const User = require('./models/User');
const TeacherAssignment = require('./models/TeacherAssignment');

async function seedDatabase() {
  try {
    // Drop existing database to start fresh
    console.log('Dropping existing database...');
    await mongoose.connection.dropDatabase();
    
    // Create courses
    console.log('Creating courses...');
    const courses = [
      {
        course_id: "BSIT",
        course_name: "Bachelor of Science in Information Technology"
      },
      {
        course_id: "BSN",
        course_name: "Bachelor of Science in Nursing"
      }
    ];
    const createdCourses = await Course.create(courses);
    console.log('✓ Courses created');

    // Create subjects
    console.log('Creating subjects...');
    const subjects = [
      {
        subject_id: "ITMSD2",
        subject_name: "Advance Mobile Application Development",
        course_id: "BSIT"
      },
      {
        subject_id: "ITMSD5",
        subject_name: "Secure Mobile Application Development",
        course_id: "BSIT"
      },
      {
        subject_id: "ITP135",
        subject_name: "Capstone Project and Research 1",
        course_id: "BSIT"
      },
      {
        subject_id: "NCM115",
        subject_name: "Nursing Research 2",
        course_id: "BSN"
      }
    ];
    const createdSubjects = await Subject.create(subjects);
    console.log('✓ Subjects created');

    // Create sections
    console.log('Creating sections...');
    const sections = [
      { section_id: "BSIT3A" },
      { section_id: "BSIT3B" },
      { section_id: "BSIT3C" },
      { section_id: "BSN3B" },
      { section_id: "BSIT4C" }
    ];
    const createdSections = await Section.create(sections);
    console.log('✓ Sections created');

    // Create users with proper ID patterns
    console.log('Creating users...');
    const users = [
      {
        user_id: "3001",  // Student ID pattern
        username: "2021-3644",
        password: "student001",
        role: "Student",
        name: "Cloe Den S. Mabanding"
      },
      {
        user_id: "2001",  // Instructor ID pattern
        username: "INSTRUCTOR-2001",
        password: "instructor1",
        role: "Instructor",
        name: "Instructor X"
      },
      {
        user_id: "1001",  // Admin ID pattern
        username: "ADMINISTRATOR-1001",
        password: "administrator1",
        role: "Administrator",
        name: "Administrator X"
      }
    ];
    const createdUsers = await User.create(users);
    console.log('✓ Users created');

    // Create enrollments
    console.log('Creating enrollments...');
    const enrollments = [
      {
        user_id: "3001",
        username: "2021-3644",
        subjectId: "ITMSD2",
        sectionId: "BSIT3C",
        academicYear: "2024-2025",
        semester: "1st"
      }
    ];
    const createdEnrollments = await Enrollment.create(enrollments);
    console.log('✓ Enrollments created');

    // Create Teacher Assignment
    console.log('Creating teacher assignments...');
    const teacherAssignments = [
      {
        instructor_id: "2001",
        course_id: "BSIT",
        subject_id: "ITMSD2",
        subject_name: "Advance Mobile Application Development",
        section_id: "BSIT3C"
      }
    ];

    const createdAssignments = await TeacherAssignment.create(teacherAssignments);
    console.log('✓ Teacher assignments created:', createdAssignments.length);

    console.log('\nDatabase seeding completed successfully! Summary:');
    console.log(`- Courses created: ${createdCourses.length}`);
    console.log(`- Subjects created: ${createdSubjects.length}`);
    console.log(`- Sections created: ${createdSections.length}`);
    console.log(`- Users created: ${createdUsers.length}`);
    console.log(`- Teacher assignments created: ${createdAssignments.length}`);
    console.log(`- Enrollments created: ${createdEnrollments.length}`);

  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    throw error;
  }
}

// Connect and seed
console.log('Connecting to MongoDB...');
mongoose.connect('mongodb://localhost:27017/attendance-app')
  .then(() => {
    console.log('✓ Connected to MongoDB');
    return seedDatabase();
  })
  .then(() => {
    console.log('\n✓ All done! Closing connection...');
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('\n❌ Error:', error);
    mongoose.connection.close();
  });