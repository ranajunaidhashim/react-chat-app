import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2K3tEAFKkm7HgqHfqlAP7j9CRwMV1ek8",
  authDomain: "react-chat-app-d0469.firebaseapp.com",
  databaseURL: "https://react-chat-app-d0469-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "react-chat-app-d0469",
  storageBucket: "react-chat-app-d0469.appspot.com",
  messagingSenderId: "475838901388",
  appId: "1:475838901388:web:b974360044a5b04f651fa9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
