import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, updateDoc, arrayUnion }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let currentUser = null;
let solvedProblems = [];

onAuthStateChanged(auth, async user => {
  if (!user) { window.location.href = 'index.html'; return; }
  currentUser = user;
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) solvedProblems = snap.data().solvedProblems || [];
  } catch(e) {}
  
  if (window.initChallengePage) {
    window.initChallengePage(solvedProblems);
  }

  const params = new URLSearchParams(window.location.search);
  const pid = parseInt(params.get('p'));
  if (pid && pid >= 1 && pid <= 14 && window.loadProblem) {
    window.loadProblem(pid);
  }
});

window.handleLogout = async () => {
  await signOut(auth);
  window.location.href = 'index.html';
};

window.markSolved = async function(problemId) {
  if (!currentUser || solvedProblems.includes(problemId)) return;
  solvedProblems.push(problemId);
  try {
    await updateDoc(doc(db, 'users', currentUser.uid), {
      solvedProblems: arrayUnion(problemId)
    });
    const el = document.getElementById(`prob-check-${problemId}`);
    if (el) el.textContent = 'Solved';
  } catch(e) {}
};
