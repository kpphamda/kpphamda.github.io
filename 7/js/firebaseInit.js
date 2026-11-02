import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { FIREBASE_CONFIG } from "./firebaseConfig.js";

// true once the real keys from the firebase console have been pasted into firebaseConfig.js
export const firebaseIsConfigured = !FIREBASE_CONFIG.apiKey.startsWith("YOUR_");

let authInstance = null;
let dbInstance = null;

if (firebaseIsConfigured) {
  const app = initializeApp(FIREBASE_CONFIG);
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
}

export const auth = authInstance;
export const db = dbInstance;
