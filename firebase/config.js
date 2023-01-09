import * as firebase from "firebase";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-ht4PMECZ25KV8o4iKSCtSFhtA1a1UzI",
  authDomain: "athosimg.firebaseapp.com",
  projectId: "athosimg",
  storageBucket: "athosimg.appspot.com",
  messagingSenderId: "387132310392",
  appId: "1:387132310392:web:d7896ce56631d9a323be8d",
  measurementId: "G-14DD8R7J3J"
};

// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);



