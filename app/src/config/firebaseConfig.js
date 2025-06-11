import { initializeApp, FirebaseError } from "firebase/app";

import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword, 
  updateProfile,
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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
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