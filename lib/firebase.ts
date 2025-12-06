// Firebase initialization (you said you'll install firebase yourself).
// npm install firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAt294OeuOdgVAVovLJH-ScfZajt4YFnBk",
  authDomain: "sociallogs-973c5.firebaseapp.com",
  projectId: "sociallogs-973c5",
  storageBucket: "sociallogs-973c5.firebasestorage.app",
  messagingSenderId: "670577962315",
  appId: "1:670577962315:web:a9488e6b30dd1a864a8cce",
  measurementId: "G-4RZL29JNQ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;