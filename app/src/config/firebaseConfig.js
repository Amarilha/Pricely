import { initializeApp } from "firebase/app";
import { AuthErrorCodes } from 'firebase/auth';
// E use AuthErrorCodes em vez de FirebaseError onde necessário
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword, 
  updateProfile,
  FirebaseError,
  onAuthStateChanged // Correto: vem do auth
} from "firebase/auth";

import { 
  getFirestore,
  setDoc,
  doc, 
  getDoc
} from "firebase/firestore";

// Hooks do React devem vir separados
import { useEffect, useState } from 'react';

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Exporte separadamente os métodos do Firebase e hooks do React
export { 
  auth, 
  provider, 
  db, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword, 
  updateProfile,
  FirebaseError,
  setDoc,
  doc,
  getDoc, 
  onAuthStateChanged
};

// Exporte hooks do React separadamente se necessário
export { useEffect, useState };