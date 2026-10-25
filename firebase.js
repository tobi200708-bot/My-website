<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDXownoNcO7vSrN5rnoDiii62uWqeb90S4",
    authDomain: "my-website-a67e5.firebaseapp.com",
    projectId: "my-website-a67e5",
    storageBucket: "my-website-a67e5.firebasestorage.app",
    messagingSenderId: "551788580994",
    appId: "1:551788580994:web:79c5242dfc2374a302649b",
    measurementId: "G-5N0CGM6GNH"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
