
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    signInWithPopup,
    sendEmailVerification,
    RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
    getDatabase,
    ref,
    get,
    set,
    update,
    remove,
    push,
    onValue,
    runTransaction
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBYPvmvzzNxtTFOVpPXKRvUhoHBjBTCVBE",
    authDomain: "camisetazo-puntos.firebaseapp.com",
    databaseURL: "https://camisetazo-puntos-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "camisetazo-puntos",
    storageBucket: "camisetazo-puntos.firebasestorage.app",
    messagingSenderId: "652477026185",
    appId: "1:652477026185:web:4a05e015da74d4541d1b58",
    measurementId: "G-GS53GWE2Z0"
};

let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Auth persistence error:", error);
});


export {
    
    auth,
    db,
    googleProvider,

    
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    signInWithPopup,
    sendEmailVerification,
    RecaptchaVerifier,

    
    ref,
    get,
    set,
    update,
    remove,
    push,
    onValue,
    runTransaction
};
