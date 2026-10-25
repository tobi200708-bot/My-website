
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from
  "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

// Firebase Console -> Project settings -> Your apps
const firebaseConfig = {
  apiKey: 7d14a46fe48c7a519a3d38c990cbe2b9e7cb3579
  authDomain: login-website-a67e5.firebaseapp.com
  projectId: login-website-a67e5
  appId: loginwebsite.login
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = document.getElementById("email");
const password = document.getElementById("password");
const status = document.getElementById("status");

console.log("Firebase initialized");

document.getElementById("register").onclick = async () => {
  try {
    const result = await createUserWithEmailAndPassword(
      auth, email.value.trim(), password.value
    );
    status.textContent = "Account created: " + result.user.email;
  } catch (error) {
    status.textContent = error.code + ": " + error.message;
    console.error(error);
  }
};

document.getElementById("login").onclick = async () => {
  try {
    const result = await signInWithEmailAndPassword(
      auth, email.value.trim(), password.value
    );
    status.textContent = "Login successful: " + result.user.email;
  } catch (error) {
    status.textContent = error.code + ": " + error.message;
    console.error(error);
  }
};

document.getElementById("logout").onclick = async () => {
  try {
    await signOut(auth);
    status.textContent = "Logout successful";
  } catch (error) {
    status.textContent = error.message;
  }
};
