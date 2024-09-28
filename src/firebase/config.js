// firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAAybP6Blbe9SnFbwd5AzJ8tP_htLoUvF0",
  authDomain: "safe-hands-72ce1.firebaseapp.com",
  projectId: "safe-hands-72ce1",
  storageBucket: "safe-hands-72ce1.appspot.com",
  messagingSenderId: "696587012143",
  appId: "1:696587012143:web:4112ce344824189c4b9eda",
  measurementId: "G-BCQWFLYRG9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
