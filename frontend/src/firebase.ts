// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blogging-b7be5.firebaseapp.com",
  projectId: "mern-blogging-b7be5",
  storageBucket: "mern-blogging-b7be5.appspot.com",
  messagingSenderId: "170487674821",
  appId: "1:170487674821:web:4b1381c6d0af13b4367dac",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
