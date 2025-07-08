import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Register
document.getElementById('registerForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const name = e.target.name.value;
  const email = e.target.email.value;
  const password = e.target.password.value;
  const role = e.target.role.value; // "user" or "admin"

  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", cred.user.uid), { name, email, role });
  window.location = role === "admin" ? 'admin.html' : 'dashboard.html';
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const { email, password } = e.target.elements;
  await signInWithEmailAndPassword(auth, email.value, password.value);
});

// Auth persistence & routing
onAuthStateChanged(auth, async user => {
  const path = window.location.pathname;
  if (!user) {
    if (['/dashboard.html','/admin.html'].includes(path)) {
      window.location = 'login.html';
    }
    return;
  }
  const docSnap = await getDoc(doc(db, "users", user.uid));
  const role = docSnap.data().role;
  if (path === '/login.html' || path === '/register.html') {
    window.location = role === 'admin' ? 'admin.html' : 'dashboard.html';
  }
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  signOut(auth).then(() => window.location = 'login.html');
});
