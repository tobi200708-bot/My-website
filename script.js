
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import { auth } from "./firebase.js";

// HTML elements
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");
const message = document.getElementById("message");
const userArea = document.getElementById("userArea");
const userEmail = document.getElementById("userEmail");

let mode = "login";
let busy = false;

// Display messages
function showMessage(text, success = false) {
  message.textContent = text;
  message.style.color = success ? "#4ade80" : "#fca5a5";
}

// Login or Register
async function authenticate(event) {
  event.preventDefault();

  if (busy) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("Please enter email and password.");
    return;
  }

  busy = true;
  loginBtn.disabled = true;
  registerBtn.disabled = true;
  showMessage("Please wait...");

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
    const errors = {
      "auth/invalid-email": "Enter a valid email address.",
      "auth/invalid-credential": "Incorrect email or password.",
      "auth/email-already-in-use": "This email is already registered.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/operation-not-allowed":
        "Enable Email/Password in Firebase Console.",
      "auth/too-many-requests":
        "Too many attempts. Try again later.",
      "auth/network-request-failed":
        "Network error. Check your internet connection.",
      "auth/unauthorized-domain":
        "Add your website domain in Firebase Authentication settings."
    };

    showMessage(errors[error.code] || error.message);
    console.error("Firebase authentication error:", error.code, error.message);
  } finally {
    busy = false;
    loginBtn.disabled = false;
    registerBtn.disabled = false;
  }
}

// Login form
form.addEventListener("submit", (event) => {
  mode = "login";
  authenticate(event);
});

// Create account
registerBtn.addEventListener("click", () => {
  mode = "register";

  if (!form.reportValidity()) return;

  authenticate(new Event("submit", { cancelable: true }));
});

// Logout
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    showMessage("Logged out successfully.", true);
  } catch (error) {
    showMessage("Logout failed. Please try again.");
    console.error(error);
  }
});

// Watch login status
onAuthStateChanged(auth, (user) => {
  const loggedIn = Boolean(user);

  form.hidden = loggedIn;
  registerBtn.hidden = loggedIn;
  userArea.hidden = !loggedIn;
  logoutBtn.hidden = !loggedIn;

  if (user) {
    userEmail.textContent = user.email || "";
    showMessage("You are logged in.", true);
  }
});
