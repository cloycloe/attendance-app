import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  Timestamp,
  doc,
  getDoc 
} from 'firebase/firestore';
import { 
  initializeAuth,
  getReactNativePersistence,
  signInAnonymously
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB0pQ3sO2gHH1Bzic3v99y6_F6WICUtA4o",
  projectId: "attendanceapp-e2759",
  appId: "1:855179084732:web:172b069d05a2ec905121b9",
  storageBucket: "attendanceapp-e2759.appspot.com",
  messagingSenderId: "855179084732"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

// Your backend URL (using your local IP address)
const BACKEND_URL = 'http://192.168.5.178:5000/api';

export const firebaseService = {
  // Authentication
  async login(username: string, password: string) {
    try {
      // First, authenticate against your MongoDB backend
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const userData = await response.json();
      
      // Sign in anonymously to Firebase (for real-time features)
      await signInAnonymously(auth);

      return {
        user_id: userData.user_id,
        username: userData.username,
        name: userData.name,
        role: userData.role,
        section: userData.section
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed: ' + error.message);
    }
  },

  // Get Student's Subjects
  async getStudentSubjects(studentId: string) {
    try {
      const enrollmentsRef = collection(db, 'enrollments');
      const q = query(enrollmentsRef, where('studentId', '==', studentId));
      const querySnapshot = await getDocs(q);
      
      const subjects = [];
      for (const doc of querySnapshot.docs) {
        const subjectDoc = await getDoc(doc.data().subjectRef);
        if (subjectDoc.exists()) {
          subjects.push({
            id: subjectDoc.id,
            ...subjectDoc.data()
          });
        }
      }
      return subjects;
    } catch (error) {
      throw error;
    }
  },

  // Generate QR Code Data
  generateQRData(studentId: string, courseId: string) {
    return {
      studentId,
      courseId,
      timestamp: new Date().toISOString(),
      nonce: Math.random().toString(36).substring(7)
    };
  },

  // Record Attendance
  async recordAttendance(data: {
    student_id: string,
    class_id: string,
    qrData: string,
    marked_by: string
  }) {
    try {
      // First save to your MongoDB backend
      const response = await fetch(`${BACKEND_URL}/attendance/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          date: new Date(),
          status: 'present'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record attendance');
      }

      // Then store in Firebase for real-time updates
      const attendanceRef = collection(db, 'attendance');
      await addDoc(attendanceRef, {
        ...data,
        timestamp: new Date(),
        status: 'present'
      });

      return true;
    } catch (error) {
      console.error('Record attendance error:', error);
      throw error;
    }
  },

  // Get Attendance History
  async getAttendanceHistory(studentId: string, courseId: string) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/attendance/history?studentId=${studentId}&courseId=${courseId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch attendance history');
      }

      return await response.json();
    } catch (error) {
      console.error('Get history error:', error);
      throw error;
    }
  }
};

export { auth, db };
