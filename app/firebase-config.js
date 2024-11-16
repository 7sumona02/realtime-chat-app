// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwqiR4OfianY1x6R0b5hxUnLsE82NNMWs",
  authDomain: "realtime-chat-app-cd5b0.firebaseapp.com",
  projectId: "realtime-chat-app-cd5b0",
  storageBucket: "realtime-chat-app-cd5b0.firebasestorage.app",
  messagingSenderId: "266585080542",
  appId: "1:266585080542:web:d1d934f542a59a1d6ef84f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);