// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWobUiyuQFmRKlje2w650nJW3u1AC5jKk",
  authDomain: "memoria-86371.firebaseapp.com",
  projectId: "memoria-86371",
  storageBucket: "memoria-86371.firebasestorage.app",
  messagingSenderId: "287690329052",
  appId: "1:287690329052:web:4d9c3e501549493b4b1d19",
  measurementId: "G-L4S1DXC71F",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
