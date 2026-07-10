import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const PROBLEMS = [
  { id:1,  title:'Insert a Node',               difficulty:'easy'   },
  { id:2,  title:'Search in a BST',             difficulty:'easy'   },
  { id:3,  title:'Delete a Node',               difficulty:'medium' },
  { id:4,  title:'Find Minimum / Maximum',       difficulty:'easy'   },
  { id:5,  title:'Inorder Traversal',            difficulty:'easy'   },
  { id:6,  title:'Level Order Traversal',        difficulty:'medium' },
  { id:7,  title:'Height of BST',               difficulty:'easy'   },
  { id:8,  title:'Count Nodes',                 difficulty:'easy'   },
  { id:9,  title:'Check if Valid BST',           difficulty:'medium' },
  { id:10, title:'Lowest Common Ancestor',       difficulty:'medium' },
  { id:11, title:'Kth Smallest Element',         difficulty:'medium' },
  { id:12, title:'Convert Sorted Array to BST',  difficulty:'hard'   },
  { id:13, title:'Balanced BST Check',           difficulty:'hard'   },
  { id:14, title:'Find Successor / Predecessor', difficulty:'hard'   },
];

onAuthStateChanged(auth, async user => {
  if (!user) { window.location.href = 'index.html'; return; }

  const displayName = user.displayName || user.email.split('@')[0];
  document.getElementById('hero-name').textContent = `Hello, ${displayName}`;
  document.getElementById('nav-username').textContent = displayName;
  document.getElementById('nav-avatar').textContent = displayName[0].toUpperCase();

  let solvedProblems = [];
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) solvedProblems = snap.data().solvedProblems || [];
  } catch(e) {}

  const solved = solvedProblems.length;
  document.getElementById('stat-solved').textContent = solved;
  document.getElementById('stat-pct').textContent = Math.round((solved/14)*100) + '%';

  const list = document.getElementById('problem-list');
  PROBLEMS.forEach(p => {
    const isSolved = solvedProblems.includes(p.id);
    list.innerHTML += `
      <a class="problem-row" href="challenge.html?p=${p.id}">
        <span class="problem-num">${p.id}</span>
        <span class="problem-name">${p.title}</span>
        <span class="badge badge-${p.difficulty}">${p.difficulty}</span>
        <span class="problem-status">${isSolved ? 'Solved' : ''}</span>
      </a>`;
  });
});

window.handleLogout = async function() {
  await signOut(auth);
  window.location.href = 'index.html';
};
