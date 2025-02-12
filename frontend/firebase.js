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
  apiKey: "AIzaSyCkCwbDW7LP5FoRi_d_NWzGorbXqZnRI2A",
  authDomain: "valsstore-c21e6.firebaseapp.com",
  projectId: "valsstore-c21e6",
  storageBucket: "valsstore-c21e6.firebasestorage.app",
  messagingSenderId: "59297556098",
  appId: "1:59297556098:web:eb01574dd82dfa57ca769b",
  measurementId: "G-F9NKFESEPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const auth=getAuth(app);
export const db = getFirestore();
// Inicializar Analytics solo si el entorno lo soporta
