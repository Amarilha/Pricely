import { initializeApp, FirebaseError } from "firebase/app";

import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged // Correto: vem do auth
} from "firebase/auth";

import { 
  getFirestore,
  setDoc,
  doc, 
  getDoc
} from "firebase/firestore";



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

let app, auth, provider, db;

if (process.env.npm_lifecycle_event !== 'build') {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  provider = new GoogleAuthProvider();
  db = getFirestore(app);
} else {
  console.log('ℹ️  Build em andamento, a inicialização do Firebase será ignorada.');
  // Mocking Firebase services for build time
  app = {};
  auth = {};
  provider = {};
  db = {};
}

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
  onAuthStateChanged,
  sendPasswordResetEmail
};

