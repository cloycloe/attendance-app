import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // You'll get these values from Firebase Console
  apiKey: "AIzaSyB0pQ3sO2gHH1Bzic3v99y6_F6WICUtA4o",
  authDomain: "your-app.firebaseapp.com",
  projectId: "attendanceapp-e2759",
  storageBucket: "attendanceapp-e2759.appspot.com",
  messagingSenderId: "855179084732",
  appId: "1:855179084732:web:172b069d05a2ec905121b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper function for anonymous sign in
export const signInAnonymouslyToFirebase = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error('Anonymous auth error:', error);
    throw error;
  }
};
