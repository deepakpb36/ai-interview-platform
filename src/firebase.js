import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFArRDtnoG1j5bfL7z2kTKiPwnuyiXFCM",
  authDomain: "ai-interview-platform-6cef5.firebaseapp.com",
  projectId: "ai-interview-platform-6cef5",
  storageBucket: "ai-interview-platform-6cef5.firebasestorage.app",
  messagingSenderId: "79302504251",
  appId: "1:79302504251:web:58f183ceb42a6254afd11e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export const db = getFirestore(app);
