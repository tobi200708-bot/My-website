
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDXownoNc7OvSrN5rnoDiii62uWqeb90S4",
  authDomain: "my-website-a67e5.firebaseapp.com",
  projectId: "my-website-a67e5",
  storageBucket: "my-website-a67e5.firebasestorage.app",
  messagingSenderId: "551788580994",
  appId: "1:551788580994:web:1111c15a7661152f02649b",
  measurementId: "G-3MZSJX7QJP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
