// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider, } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
//For The Storage of Firebase
import {getStorage} from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyD9KyBoz7ubzt0bGJYHOauAe0zGeImwNI4",
  authDomain: "fitness-app-c5282.firebaseapp.com",
  projectId: "fitness-app-c5282",
  storageBucket: "fitness-app-c5282.appspot.com",
  messagingSenderId: "86468570648",
  appId: "1:86468570648:web:c9a2296f1b5fe725665d6d",
  measurementId: "G-LS2K51YH6T"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export const db = getFirestore(app)
//For Cloud Storage
export const storage = getStorage(app)

