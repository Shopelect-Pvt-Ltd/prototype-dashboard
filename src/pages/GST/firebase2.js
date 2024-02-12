import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = { // Have the firebase config here
    apiKey: "AIzaSyD33JyUFjugVISjRu_yElDamtvR0-6tBlU",
    authDomain: "prototype-finkraft.firebaseapp.com",
    projectId: "prototype-finkraft",
    storageBucket: "prototype-finkraft.appspot.com",
    messagingSenderId: "283994867558",
    appId: "1:283994867558:web:d5038e6f45625e3c86eaa7",
    measurementId: "G-6J2FHW78VS"
};

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };
