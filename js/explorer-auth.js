import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, user => {
  if (!user) window.location.href = 'index.html';
});

window.handleLogout = async () => {
  await signOut(auth);
  window.location.href = 'index.html';
};
