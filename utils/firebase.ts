import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyD5Z5sNvVc5FW3vaXGVS5MvxO6nUf59BBM",
    authDomain: "kavi-bilisim.firebaseapp.com",
    projectId: "kavi-bilisim",
    storageBucket: "kavi-bilisim.firebasestorage.app",
    messagingSenderId: "336983508128",
    appId: "1:336983508128:web:8096dd265cd64c9686f5c5",
    measurementId: "G-THLW8L4FBM"
  };

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);
