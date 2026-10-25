import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

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

function showMessage(text, type = "error") {
  message.textContent = text;
  message.className = `message show ${type}`;
}

function getFriendlyError(error) {
  const errors = {
    "auth/email-already-in-use":
      "This email is already registered. Please login.",
    "auth/invalid-email":
      "Please enter a valid email address.",
    "auth/weak-password":
      "Password must be at least 6 characters.",
    "auth/invalid-credential":
      "Incorrect email or password.",
    "auth/user-not-found":
      "Account not found. Please sign up first.",
    "auth/too-many-requests":
      "Too many attempts. Please try again later.",
    "auth/network-request-failed":
      "Network error. Check your internet connection.",
    "auth/api-key-not-valid":
      "Invalid API Key. Check your Firebase configuration.",
    "auth/operation-not-allowed":
      "Email/Password authentication is not enabled."
  };

  return errors[error.code] ||
    error.message ||
    "Something went wrong. Please try again.";
}

switchBtn.addEventListener("click", () => {
  isSignup = !isSignup;

  heading.textContent = isSignup ? "Create Account" : "Welcome Back";
  subtitle.textContent = isSignup
    ? "Sign up with your email"
    : "Login to your account";

  submitBtn.textContent = isSignup ? "Sign Up" : "Login";
  switchText.firstChild.textContent = isSignup
    ? "Already have an account? "
    : "Don't have an account? ";

  switchBtn.textContent = isSignup ? "Login" : "Sign Up";
  passwordInput.autocomplete = isSignup
    ? "new-password"
    : "current-password";

  message.className = "message";
  message.textContent = "";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  submitBtn.disabled = true;
  submitBtn.textContent = "Please wait...";
  message.className = "message";

  try {
    if (isSignup) {
      await createUserWithEmailAndPassword(
        auth, email, password
      );
      showMessage("Account created successfully!", "success");
    } else {
      await signInWithEmailAndPassword(
        auth, email, password
      );
      showMessage("Login successful!", "success");
    }
  } catch (error) {
    showMessage(getFriendlyError(error));
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = isSignup ? "Sign Up" : "Login";
  }
});

forgotBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();

  if (!email) {
    showMessage("Enter your email address first.");
    emailInput.focus();
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    showMessage(
      "If the account is eligible, a password reset email will be sent.",
      "success"
    );
  } catch (error) {
    showMessage(getFriendlyError(error));
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    showMessage("Logged out successfully.", "success");
  } catch (error) {
    showMessage(getFriendlyError(error));
  }
});

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
