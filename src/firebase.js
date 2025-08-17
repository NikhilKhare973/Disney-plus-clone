// Import the functions you need from the SDKs you need
// import firebase from "./firebase";

import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAP8jAHG3s0P-8NiuD6ElB1i_VHYOx7Q7A",
  authDomain: "disneyplus-clone-4d501.firebaseapp.com",
  projectId: "disneyplus-clone-4d501",
  storageBucket: "disneyplus-clone-4d501.firebasestorage.app",
  messagingSenderId: "942994927664",
  appId: "1:942994927664:web:9a530c89460ca146053df5",
  measurementId: "G-PTJ1L1HQRB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
// const auth = firebase.auth(app);
const provider = new GoogleAuthProvider();
const storage = firebase.storage();

signInWithPopup(auth, provider);

export { auth, provider, storage };
export default db;