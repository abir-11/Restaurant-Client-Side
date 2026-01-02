// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9mTX_sr5vj2rEqU2gZiQJe5kU6PV3w3E",
  authDomain: "restaurant-web-4f322.firebaseapp.com",
  projectId: "restaurant-web-4f322",
  storageBucket: "restaurant-web-4f322.firebasestorage.app",
  messagingSenderId: "316320157758",
  appId: "1:316320157758:web:eb4c199ded2aea9415016f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

