import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

export const attendanceService = {
  // Record attendance when QR code is scanned
  async recordAttendance(data: {
    student_id: string,
    course_id: string,
    section_id: string,
    scanned_by: string
  }) {
    try {
      const attendanceRef = collection(db, 'attendance');
      await addDoc(attendanceRef, {
        ...data,
        timestamp: new Date(),
        status: 'present'
      });
    } catch (error) {
      throw error;
    }
  },

  // Get attendance history
  async getAttendanceHistory(studentId: string) {
    try {
      const attendanceRef = collection(db, 'attendance');
      const q = query(attendanceRef, where('student_id', '==', studentId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }
};
