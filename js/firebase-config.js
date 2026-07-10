import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// The Firebase API key is used to identify your project to Google's servers.
// By design, it is public and safe to be exposed in frontend code.
// Actual security is enforced via Firestore Security Rules in the Firebase Console.
const firebaseConfig = {
  apiKey: "AIzaSyBf4m6LnrR2XI6j6ex1D9nHkDSNT57ErG4",
  authDomain: "send-node.firebaseapp.com",
  projectId: "send-node",
  storageBucket: "send-node.firebasestorage.app",
  messagingSenderId: "239978336493",
  appId: "1:239978336493:web:49580094311c7562d5fce4",
  measurementId: "G-TS3CCSHWJT"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
