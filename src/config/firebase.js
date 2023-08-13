// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBv5VUYsGBrwCLI-xr2saGJ6o6I7cXzpkM",
  authDomain: "alime-tinder.firebaseapp.com",
  projectId: "alime-tinder",
  storageBucket: "alime-tinder.appspot.com",
  messagingSenderId: "820921879679",
  appId: "1:820921879679:web:d774ceec04afb59e9ec34a"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const database = getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp)
export const provider = new GoogleAuthProvider();