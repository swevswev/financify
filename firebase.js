import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA-ZFPmxspdOqlE_gYUsZA5w_yXWG1lt4Y",
    authDomain: "ripple-529a7,firebaseapp.com",
    projectId: "ripple-529a7",
    storageBucket: "ripple-529a7.appspot.com",
    messagingSenderId: "1058583868177",
    appId: "1:1058583868177:web:a69dce05097133cfba12b0",
    databaseURL: "https://ripple-529a7-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
// Initialize FireDatabase
const realTimeDb = getDatabase(app);

export {db, realTimeDb};