// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
//import { getAnalytics } from "firebase/analytics"; [dont need yet ig]

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiW3YMP38gCnsSDLqoMcYS8fxLQyHaWt4",
  authDomain: "couple-cue-app.firebaseapp.com",
  projectId: "couple-cue-app",
  storageBucket: "couple-cue-app.appspot.com",
  messagingSenderId: "334840540570",
  appId: "1:334840540570:web:48e32821c57c854a1e9e23",
  measurementId: "G-43X0ZYXSSJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
//const analytics = getAnalytics(app); [same thing]

export { db, auth };
