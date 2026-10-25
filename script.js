
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import { auth } from "./firebase.js";

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");
const message = document.getElementById("message");
const userArea = document.getElementById("userArea");
const userEmail = document.getElementById("userEmail");
const heading = document.getElementById("heading");
const subtitle = document.getElementById("subtitle");
const switchText = document.getElementById("switchText");

let busy = false;

function showMessage(text, success = false) {
  message.textContent = text;
  message.style.color = success ? "#4ade80" : "#fca5a5";
}

function setBusy(value) {
  busy = value;
  loginBtn.disabled = value;
  registerBtn.disabled = value;
  logoutBtn.disabled = value;

  loginBtn.textContent = value
    ? "Please wait..."
    : "Login";
}

function getErrorMessage(error) {
  const errors = {
    "auth/invalid-email":
      "Please enter a valid email address.",
    "auth/invalid-credential":
      "Incorrect email or password.",
    "auth/email-already-in-use":
      "This email is already registered. Please login.",
    "auth/weak-password":
      "Password must contain at least 6 characters.",
    "auth/operation-not-allowed":
      "Enable Email/Password in Firebase Console.",
    "auth/too-many-requests":
      "Too many attempts. Try again later.",
    "auth/network-request-failed":
      "Network error. Check your internet connection.",
    "auth/unauthorized-domain":
      "Add your GitHub Pages domain to Authorized domains."
  };

  return errors[error.code] || "Error: " + error.message;
}

async function runAuth(mode) {
  if (busy) return;

  if (!form.reportValidity()) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  setBusy(true);
  showMessage("");

  try {
    if (mode === "register") {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      showMessage("Account created successfully!", true);
    } else {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      showMessage("Login successful!", true);
    }
  } catch (error) {
    console.error("Firebase error:", error.code, error.message);
    showMessage(getErrorMessage(error));
  } finally {
    setBusy(false);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runAuth("login");
});

registerBtn.addEventListener("click", () => {
  runAuth("register");
});

logoutBtn.addEventListener("click", async () => {
  if (busy) return;

  logoutBtn.disabled = true;

  try {
    await signOut(auth);
    showMessage("Logged out successfully.", true);
  } catch (error) {
    showMessage(getErrorMessage(error));
  } finally {
    logoutBtn.disabled = false;
  }
});

onAuthStateChanged(auth, (user) => {
  const loggedIn = Boolean(user);

  form.hidden = loggedIn;
  userArea.hidden = !loggedIn;

  if (loggedIn) {
    heading.textContent = "Welcome!";
    subtitle.textContent = "You are signed in.";
    userEmail.textContent = user.email || "Signed-in user";
    showMessage("Login successful!", true);
  } else {
    heading.textContent = "Welcome Back";
    subtitle.textContent = "Login to your account";
    showMessage("");
  }

  switchText.hidden = loggedIn;
});
