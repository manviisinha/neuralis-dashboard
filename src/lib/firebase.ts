import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCXWaOLBdWVEs9jO4dcHIb708KM3rI2LAY",
    authDomain: "neurora-2ccf2.firebaseapp.com",
    projectId: "neurora-2ccf2",
    storageBucket: "neurora-2ccf2.firebasestorage.app",
    messagingSenderId: "296630386564",
    appId: "1:296630386564:web:4a7b6fbd3aa5165893e7d1",
    measurementId: "G-BDWB45SKN5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
