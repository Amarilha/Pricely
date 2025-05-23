// app/src/services/auth.js
import { auth, provider, db } from "../config/firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export async function authGoogle() {
  try {
    const result = await signInWithPopup(auth, provider)
    
    // Cria o cookie de sessão
    const idToken = await result.user.getIdToken()
    document.cookie = `session=${idToken}; path=/; max-age=3600; secure; samesite=strict`
    
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