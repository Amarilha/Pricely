// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCwVKAi3b6Z4JIbR_G7ensn9EFDv141KX4",
    authDomain: "sw-valuo.firebaseapp.com",
    databaseURL: "https://sw-valuo-default-rtdb.firebaseio.com",
    projectId: "sw-valuo",
    storageBucket: "sw-valuo.firebasestorage.app",
    messagingSenderId: "450626458483",
    appId: "1:450626458483:web:d1bf0e934a524ef8436b06",
    measurementId: "G-C03JEM0HRQ"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
