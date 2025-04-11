import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6hUYhTxRyE-L0X_WFiqJhFsj_DJiYQOY",
  authDomain: "blog-website-45945.firebaseapp.com",
  projectId: "blog-website-45945",
  storageBucket: "blog-website-45945.firebasestorage.app",
  messagingSenderId: "61076602702",
  appId: "1:61076602702:web:0e0fb7b8bf7176ec58281f"
};

const app = initializeApp(firebaseConfig);
// Replace with your actual email
export const ADMIN_EMAIL = "akm.official.02@gmail.com";

export const auth = getAuth(app);
export const db = getFirestore(app);