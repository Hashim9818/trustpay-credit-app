import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, async user => {
  if (!user) return;
  const userDoc = await getDoc(doc(db,"users",user.uid));
  if (userDoc.data().role !== 'admin') {
    window.location = 'dashboard.html';
    return;
  }
  const snapshot = await getDocs(collection(db, "users"));
  document.getElementById('userTable').innerHTML =
    snapshot.docs.map(d => {
      const u = d.data();
      return `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td></tr>`;
    }).join('');
});
