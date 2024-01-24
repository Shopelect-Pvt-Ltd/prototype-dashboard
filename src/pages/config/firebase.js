// firebase.js
// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD33JyUFjugVISjRu_yElDamtvR0-6tBlU",
    authDomain: "prototype-finkraft.firebaseapp.com",
    projectId: "prototype-finkraft",
    storageBucket: "prototype-finkraft.appspot.com",
    messagingSenderId: "283994867558",
    appId: "1:283994867558:web:d5038e6f45625e3c86eaa7",
    measurementId: "G-6J2FHW78VS"
}

export default firebaseConfig;

// export const auth = firebase.auth();
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get individual Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);

// Get a list of cities from your database
const credList = async function getCreds(firestore) {
    const credsCol = collection(firestore, 'AirlinesCredentials');
    const credsSnapshot = await getDocs(credsCol);
    const credsList = credsSnapshot.docs.map(doc => doc.data());
    console.log(credList);
    return credsList;
  }

  

export { app, auth, firestore, credList, collection, getDocs };

