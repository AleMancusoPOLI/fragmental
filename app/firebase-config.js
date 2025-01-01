import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCAYj6pw7y8u2i8-UE8s1eN1CvmKA5hYio",
  authDomain: "actam-2024-fragmental.firebaseapp.com",
  projectId: "actam-2024-fragmental",
  storageBucket: "actam-2024-fragmental.firebasestorage.app",
  messagingSenderId: "1088037275778",
  appId: "1:1088037275778:web:ba2b5e42ac969d0fb0cc9b",
  measurementId: "G-8HEZJ93P6G",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
