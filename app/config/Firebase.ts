import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHrdkL4TmkaY-5UWmyXTjJ6GmLV0RbgZI",
  authDomain: "mytaskmanager-6ffa9.firebaseapp.com",
  projectId: "mytaskmanager-6ffa9",
  storageBucket: "mytaskmanager-6ffa9.firebasestorage.app",
  messagingSenderId: "484876914727",
  appId: "1:484876914727:web:b5dc4e65e0afe236edfe02",
  measurementId: "G-B8YLQK0Q6Y",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
