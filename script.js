import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// HTML elements
const form = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const switchBtn = document.getElementById("switchBtn");
const switchText = document.getElementById("switchText");
const heading = document.getElementById("heading");
const subtitle = document.getElementById("subtitle");
const forgotBtn = document.getElementById("forgotBtn");
const message = document.getElementById("message");
const dashboard = document.getElementById("dashboard");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

let isSignup = false;
let isBusy = false;

// Display status messages
function showMessage(text, type = "error") {
  message.textContent = text;
  message.className = `message show ${type}`;
}

// Friendly Firebase errors
function getFriendlyError(error) {
  const errors = {
    "auth/email-already-in-use":
      "This email is already registered. Please login.",

    "auth/invalid-email":
      "Please enter a valid email address.",

    "auth/weak-password":
      "Password must contain at least 6 characters.",

    "auth/invalid-credential":
      "Invalid email or password.",

    "auth/user-not-found":
      "Account not found. Please sign up first.",

    "auth/wrong-password":
      "Incorrect password.",

    "auth/too-many-requests":
      "Too many attempts. Please try again later.",

    "auth/network-request-failed":
      "Network error. Check your internet connection.",

    "auth/operation-not-allowed":
      "Email/Password sign-in is not enabled.",

    "auth/api-key-not-valid":
      "Invalid API key. Check firebase.js configuration.",

    "auth/invalid-api-key":
      "Invalid API key. Check your Firebase configuration.",

    "auth/weak-password":
      "Please choose a stronger password.",

    "auth/unauthorized-domain":
      "This website domain is not authorized in Firebase."
  };

  return errors[error.code] ||
    "Error: " + (error.message || "Please try again.");
}

// Switch between Login and Sign Up
switchBtn.addEventListener("click", () => {
  if (isBusy) return;

  isSignup = !isSignup;

  heading.textContent = isSignup
    ? "Create Account"
    : "Welcome Back";

  subtitle.textContent = isSignup
    ? "Sign up with your email"
    : "Login to your account";

  submitBtn.textContent = isSignup
    ? "Sign Up"
    : "Login";

  switchText.firstChild.textContent = isSignup
    ? "Already have an account? "
    : "Don't have an account? ";

  switchBtn.textContent = isSignup
    ? "Login"
    : "Sign Up";

  passwordInput.autocomplete = isSignup
    ? "new-password"
    : "current-password";

  message.textContent = "";
  message.className = "message";
});

// Login and Sign Up
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (isBusy) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("Please enter your email and password.");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must contain at least 6 characters.");
    return;
  }

  isBusy = true;
  submitBtn.disabled = true;
  submitBtn.textContent = "Please wait...";
  message.className = "message";

  try {
    if (isSignup) {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      showMessage(
        "Account created successfully!",
        "success"
      );
    } else {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      showMessage(
        "Login successful!",
        "success"
      );
    }
  } catch (error) {
    showMessage(getFriendlyError(error));
  } finally {
    isBusy = false;
    submitBtn.disabled = false;
    submitBtn.textContent = isSignup
      ? "Sign Up"
      : "Login";
  }
});

// Forgot password
forgotBtn.addEventListener("click", async () => {
  if (isBusy) return;

  const email = emailInput.value.trim();

  if (!email) {
    showMessage("Enter your email address first.");
    emailInput.focus();
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);

    showMessage(
      "If the account exists, a password reset email will be sent.",
      "success"
    );
  } catch (error) {
    showMessage(getFriendlyError(error));
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  if (isBusy) return;

  isBusy = true;
  logoutBtn.disabled = true;

  try {
    await signOut(auth);
    showMessage("Logged out successfully.", "success");
  } catch (error) {
    showMessage(getFriendlyError(error));
  } finally {
    isBusy = false;
    logoutBtn.disabled = false;
  }
});

// Track Login status
onAuthStateChanged(auth, (user) => {
  if (user) {
    form.hidden = true;
    forgotBtn.hidden = true;
    switchText.hidden = true;
    dashboard.hidden = false;

    userEmail.textContent = user.email || "";

    heading.textContent = "Welcome!";
    subtitle.textContent = "You are signed in.";
  } else {
    form.hidden = false;
    forgotBtn.hidden = false;
    switchText.hidden = false;
    dashboard.hidden = true;

    heading.textContent = isSignup
      ? "Create Account"
      : "Welcome Back";

    subtitle.textContent = isSignup
      ? "Sign up with your email"
      : "Login to your account";
  }
});
