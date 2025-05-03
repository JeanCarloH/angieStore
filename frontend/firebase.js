// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {getAuth} from "firebase/auth";
import { getFirestore , collection, doc,addDoc,setDoc} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgWmvtpf0VrYiNmlWVoWe9TB61c59SmA8",
  authDomain: "angiestore-e2358.firebaseapp.com",
  projectId: "angiestore-e2358",
  storageBucket: "angiestore-e2358.firebasestorage.app",
  messagingSenderId: "808121405978",
  appId: "1:808121405978:web:a11ef6764482fc959a37a3",
  measurementId: "G-NYP260W2JB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const auth=getAuth(app);
export const db = getFirestore();
// Inicializar Analytics solo si el entorno lo soporta
