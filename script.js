
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import { auth } from "./firebase.js";

const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userArea = document.getElementById("userArea");
const userEmail = document.getElementById("userEmail");
const loginBtn = document.getElementById("loginBtn");

let isRegistering = false;

registerBtn.addEventListener("click", async () => {
  isRegistering = true;
  message.textContent = "Enter your email and password, then create your account.";
  form.querySelector("button").textContent = "Register";
  registerBtn.hidden = true;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  loginBtn.disabled = true;

  try {
    if (isRegistering) {
      await createUserWithEmailAndPassword(
        auth,
        email.value.trim(),
        password.value
      );
      message.textContent = "Account created successfully!";
      isRegistering = false;
    } else {
      await signInWithEmailAndPassword(
        auth,
        email.value.trim(),
        password.value
      );
      message.textContent = "Login successful!";
    }
  } catch (error) {
    const errors = {
      "auth/invalid-email": "Enter a valid email address.",
      "auth/invalid-credential": "Incorrect email or password.",
      "auth/email-already-in-use": "This email is already registered.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/too-many-requests": "Too many attempts. Try again later.",
      "auth/operation-not-allowed": "Enable Email/Password in Firebase Authentication."
    };

    message.textContent =
      errors[error.code] || error.message;
  } finally {
    loginBtn.disabled = false;
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    message.textContent = "Logged out successfully.";
  } catch (error) {
    message.textContent = error.message;
  }
});

onAuthStateChanged(auth, (user) => {
  const loggedIn = Boolean(user);

  userArea.hidden = !loggedIn;
  logoutBtn.hidden = !loggedIn;
  form.hidden = loggedIn;
  registerBtn.hidden = loggedIn;

  if (loggedIn) {
    userEmail.textContent = user.email || "";
    message.textContent = "You are logged in.";
  }
});
