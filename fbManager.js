import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZc9aLzqrhWMAdmNklKsSvkMhMyfkPBD0",
  authDomain: "gtec-game.firebaseapp.com",
  projectId: "gtec-game",
  storageBucket: "gtec-game.appspot.com",
  messagingSenderId: "620499159749",
  appId: "1:620499159749:web:8029e43d5ae347b9463eac",
  measurementId: "G-YYFQFNBWN9",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
