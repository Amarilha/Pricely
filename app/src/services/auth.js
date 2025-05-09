// app/src/services/auth.js
import { auth, provider, db } from "../config/firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export async function authGoogle() {
  try {
    // Check if popups are blocked
    if (window.innerWidth === 0 && window.innerHeight === 0) {
      throw new Error("Popup blocked or browser is in headless mode");
    }

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;

    // Add user to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      token: credential.accessToken,
      createdAt: new Date()
    });

    return user;
  } catch (error) {
    console.error("Google auth error:", error);

    throw error;
  }
}