import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Redirect if already logged in
onAuthStateChanged(auth, user => {
  if (user) window.location.href = 'dashboard.html';
});

function showError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.classList.add('show');
}

function hideError() {
  document.getElementById('auth-error').classList.remove('show');
}

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (loading) btn.classList.add('btn-loading');
  else btn.classList.remove('btn-loading');
  btn.disabled = loading;
}

window.handleLogin = async function(e) {
  e.preventDefault();
  hideError();
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  setLoading('login-btn', true);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'dashboard.html';
  } catch (err) {
    showError(firebaseErrorMessage(err));
    setLoading('login-btn', false);
  }
};

window.handleRegister = async function(e) {
  e.preventDefault();
  hideError();
  const username = document.getElementById('reg-username').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  setLoading('register-btn', true);
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: username });
    await setDoc(doc(db, 'users', cred.user.uid), {
      username,
      email,
      solvedProblems: [],
      totalInserts: 0,
      createdAt: serverTimestamp()
    });
    window.location.href = 'dashboard.html';
  } catch (err) {
    console.error(err);
    showError(firebaseErrorMessage(err));
    setLoading('register-btn', false);
  }
};

function firebaseErrorMessage(err) {
  const code = err.code || 'unknown';
  const msg = err.message || '';
  const map = {
    'auth/email-already-in-use':  'That email is already registered.',
    'auth/invalid-email':         'Invalid email address.',
    'auth/weak-password':         'Password must be at least 6 characters.',
    'auth/user-not-found':        'No account found with that email.',
    'auth/wrong-password':        'Incorrect password.',
    'auth/too-many-requests':     'Too many attempts. Please try again later.',
    'auth/invalid-credential':    'Email or password is incorrect.',
    'auth/operation-not-allowed': 'Email/Password login is not enabled in Firebase.',
  };
  return map[code] || `Error: ${code} - ${msg}`;
}

window.switchTab = function(tab) {
  document.getElementById('login-form').style.display    = tab === 'login'    ? 'flex' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'flex' : 'none';
  document.getElementById('tab-login').classList.toggle('active',    tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  document.getElementById('auth-error').classList.remove('show');
};
