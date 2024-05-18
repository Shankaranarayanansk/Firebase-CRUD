// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAH1Gf4QvVp3Gpp-JMkD6FHNwsNDCA1kSQ",
  authDomain: "crud-app-fb-74b4f.firebaseapp.com",
  projectId: "crud-app-fb-74b4f",
  storageBucket: "crud-app-fb-74b4f.appspot.com",
  messagingSenderId: "868278386401",
  appId: "1:868278386401:web:cd46f68fc00635507c41a0"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const  db = getFirestore();
export{
  db
}