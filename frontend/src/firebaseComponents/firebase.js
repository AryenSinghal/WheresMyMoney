// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCm3Un8qa7Hxll_11B7_oae0kWG3ZOap2c",
  authDomain: "wheresmymoney-a39c9.firebaseapp.com",
  projectId: "wheresmymoney-a39c9",
  storageBucket: "wheresmymoney-a39c9.firebasestorage.app",
  messagingSenderId: "542739432911",
  appId: "1:542739432911:web:6da6a92eedcd37972d7eba"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
