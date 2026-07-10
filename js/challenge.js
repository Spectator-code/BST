/**
 * challenge.js — Challenge IDE logic
 * Requires bst.js, visualizer.js, problems.js
 */

// ── State ─────────────────────────────────────────────────
let chalBst = new BST();
let chalViz = null;
let currentProblem = null;
const declaredArrays = {};
const SEARCH_DELAY_MS = 4000;

// Regex (same as explorer)
const R_METHOD  = /^\s*(?:\w+\.)(insert|delete|search|clear)\s*\(\s*(\d*)\s*\)\s*;?\s*$/i;
const R_CTOR    = /^\s*(?:BinarySearchTree|BST)\s+\w+\s*=\s*new\s+(?:BinarySearchTree|BST)\s*\(\s*\)\s*;?\s*$/i;
const R_SYSOUT  = /^\s*System\.out\.println\s*\((.*)\)\s*;?\s*$/;
const R_ARRAY   = /^\s*int\[\]\s+(\w+)\s*=\s*(?:new\s+int\[\]\s*)?\{([^}]+)\}\s*;?\s*$/;
const R_FOREACH = /^\s*for\s*\(\s*int\s+\w+\s*:\s*(\w+)\s*\)\s*\{?\s*(?:\w+\.)(insert|delete|search)\s*\(\s*\w+\s*\)\s*;?\s*\}?\s*$/i;

// ── Init ──────────────────────────────────────────────────
window.initChallengePage = function(solvedProblems = []) {
  // Build sidebar
  const sidebar = document.getElementById('chal-sidebar');
  PROBLEMS.forEach(p => {
    const solved = solvedProblems.includes(p.id);
    const div = document.createElement('div');
    div.className = 'prob-item';
    div.id = `prob-item-${p.id}`;
    div.onclick = () => window.loadProblem(p.id);
    div.innerHTML = `
      <span class="prob-item-num">${p.id}</span>
      <span class="prob-item-dot dot-${p.difficulty}"></span>
      <span class="prob-item-name">${p.title}</span>
      <span class="prob-item-check" id="prob-check-${p.id}">${solved ? '✅' : ''}</span>`;
    sidebar.appendChild(div);
  });

  // Setup canvas
  const canvas = document.getElementById('chal-canvas');
  resizeChalCanvas(canvas);
  window.addEventListener('resize', () => { resizeChalCanvas(canvas); if(chalViz) chalViz._dirty=true; });
  chalViz = new BSTVisualizer(canvas, chalBst);
  chalViz.transX = canvas.width / 2;
  chalViz.transY = 50;
  chalViz._dirty = true;
};

function resizeChalCanvas(c) {
  const wrap = c.parentElement;
  c.width  = wrap.clientWidth  || 280;
  c.height = wrap.clientHeight || 400;
}

// ── Load Problem ──────────────────────────────────────────
window.loadProblem = function(id) {
  const p = PROBLEMS.find(x => x.id === id);
  if (!p) return;
  currentProblem = p;

  // Update sidebar active state
  document.querySelectorAll('.prob-item').forEach(el => el.classList.remove('active'));
  const item = document.getElementById(`prob-item-${id}`);
  if (item) item.classList.add('active');

  // Update nav title
  document.getElementById('nav-prob-title').textContent = `#${p.id} ${p.title}`;

  // Update description
  document.getElementById('desc-title').textContent = p.title;
  const badge = document.getElementById('desc-badge');
  badge.textContent  = p.difficulty;
  badge.className    = `badge badge-${p.difficulty}`;
  document.getElementById('desc-body').innerHTML = p.description;

  // Hints
  const hintsSection = document.getElementById('hints-section');
  hintsSection.style.display = p.hints?.length ? 'block' : 'none';
  if (p.hints?.length) {
    document.getElementById('hints-list').innerHTML =
      p.hints.map(h => `<div class="hint-item">${h}</div>`).join('');
    document.getElementById('hints-list').classList.remove('open');
  }

  // Load starter code into editor
  document.getElementById('chal-code').value = p.starterCode || '';

  // Reset IDE
  resetIdeState();
  URL.searchParams?.set?.('p', id);
};

window.toggleHints = function() {
  document.getElementById('hints-list').classList.toggle('open');
};

// ── Run / Submit ──────────────────────────────────────────
window.runCode = function(isSubmit = false) {
  const code = document.getElementById('chal-code').value;
  const consoleEl = document.getElementById('chal-console');
  const banner    = document.getElementById('result-banner');
  banner.className  = 'result-banner';
  banner.style.display = 'none';

  // Reset BST and visualizer
  chalBst.clear();
  chalViz.relayout();
  Object.keys(declaredArrays).forEach(k => delete declaredArrays[k]);

  consoleEl.value = '';
  log('╔══════════════════════════════╗');
  log(isSubmit ? '║     ✔  Submitting...        ║' : '║     ▶  Running Code...      ║');
  log('╚══════════════════════════════╝\n');

  const lines = code.split('\n');
  executeSequence(lines, 0, () => {
    if (isSubmit) runTests();
  });
};

function executeSequence(lines, i, onDone) {
  if (i >= lines.length) { onDone && onDone(); return; }
  const line = lines[i].trim();
  if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*') || line === '{' || line === '}') {
    if (line) log(`   ${pad(i+1)} │ ${line}`);
    setTimeout(() => executeSequence(lines, i+1, onDone), 60);
    return;
  }
  log(`  ►  ${pad(i+1)} │ ${line}`);
  const result = execLine(line);
  if (result) log(`       └─➤ ${result}`);
  setTimeout(() => executeSequence(lines, i+1, onDone), 500);
}

// ── Test Runner ───────────────────────────────────────────
function runTests() {
  if (!currentProblem) return;
  const tests = currentProblem.testCases;
  let passed = 0, total = tests.length;

  log('\n─────────────────────────────');
  log(`Running ${total} test case(s)...`);

  tests.forEach((tc, i) => {
    const testBst = new BST();
    (tc.setup || []).forEach(v => testBst.insert(v));

    let actual, expected = tc.expected;
    try {
      switch (tc.action) {
        case 'search':  actual = !!testBst.find(tc.value); break;
        case 'height':  actual = testBst.height(); break;
        case 'count':   actual = testBst.countNodes(); break;
        case 'inorder': actual = JSON.stringify(testBst.inorder()); expected = JSON.stringify(tc.expected); break;
        case 'levelOrder': actual = JSON.stringify(testBst.levelOrder()); expected = JSON.stringify(tc.expected); break;
        case 'isValidBST': actual = testBst.isValidBST(); break;
        case 'isBalanced': actual = testBst.isBalanced(); break;
        case 'lca':     actual = testBst.lca(tc.v1, tc.v2)?.value; break;
        case 'kthSmallest': actual = testBst.kthSmallest(tc.k); break;
        case 'successor':   actual = testBst.successor(tc.value); break;
        case 'predecessor': actual = testBst.predecessor(tc.value); break;
        case 'searchAfterDelete':
          testBst.delete(tc.deleteFirst);
          actual = !!testBst.find(tc.value);
          break;
        default: actual = null;
      }
    } catch(e) { actual = `ERROR: ${e.message}`; }

    const ok = String(actual) === String(expected);
    if (ok) passed++;
    log(`  Test ${i+1}: ${ok ? '✅ PASS' : '❌ FAIL'}  expected=${expected}  got=${actual}`);
  });

  log(`\n${passed}/${total} tests passed.`);

  const banner = document.getElementById('result-banner');
  if (passed === total) {
    banner.className  = 'result-banner pass show';
    banner.innerHTML  = `✅ All ${total} tests passed! Problem solved!`;
    banner.style.display = 'flex';
    if (typeof window.markSolved === 'function') window.markSolved(currentProblem.id);
  } else {
    banner.className  = 'result-banner fail show';
    banner.innerHTML  = `❌ ${passed}/${total} tests passed. Check the console and try again.`;
    banner.style.display = 'flex';
  }
}

// ── Reset ─────────────────────────────────────────────────
window.resetIde = function() {
  if (currentProblem) {
    document.getElementById('chal-code').value = currentProblem.starterCode || '';
  }
  resetIdeState();
};

function resetIdeState() {
  chalBst.clear();
  chalViz.relayout();
  Object.keys(declaredArrays).forEach(k => delete declaredArrays[k]);
  document.getElementById('chal-console').value = '// Run your code to see output...\n';
  const banner = document.getElementById('result-banner');
  banner.className = 'result-banner';
  banner.style.display = 'none';
}

// ── Code Execution ────────────────────────────────────────
function execLine(line) {
  let m;
  m = R_METHOD.exec(line);
  if (m) return execCmd(m[1].toLowerCase(), m[2]);

  m = R_CTOR.exec(line);
  if (m) { chalBst.clear(); chalViz.relayout(); return 'BinarySearchTree initialized'; }

  m = R_SYSOUT.exec(line);
  if (m) { return `>> ${m[1].trim().replace(/^"|"$/g,'')}`; }

  m = R_ARRAY.exec(line);
  if (m) {
    const vals = m[2].split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));
    declaredArrays[m[1]] = vals;
    return `Declared array ${m[1]} with ${vals.length} elements`;
  }

  m = R_FOREACH.exec(line);
  if (m) {
    const vals = declaredArrays[m[1]];
    if (!vals) return `❌ Array '${m[1]}' not found`;
    return vals.map(v => execCmd(m[2].toLowerCase(), String(v))).join('; ');
  }

  if (/^(import|package|public|private|class|@)/.test(line)) return '(declaration)';
  if (/^(int|String|var)\s/.test(line)) return '(variable declared)';
  return `⚠ Unrecognized: ${line}`;
}

function execCmd(cmd, arg) {
  switch(cmd) {
    case 'insert': {
      const v = parseInt(arg); if (isNaN(v)) return '❌ insert requires a number';
      const n = chalBst.insert(v); chalViz.relayout();
      if (n) setTimeout(() => chalViz.highlightNode(v, '#27ae60', 1000), 400);
      return n ? `Inserted node ${v}` : `Duplicate ${v}`;
    }
    case 'delete': {
      const v = parseInt(arg); if (isNaN(v)) return '❌ delete requires a number';
      const ok = chalBst.find(v);
      if (!ok) return `❌ Node ${v} not found`;
      chalViz.highlightNode(v, '#c0392b', 400);
      setTimeout(() => { chalBst.delete(v); chalViz.relayout(); }, 350);
      return `Deleted node ${v}`;
    }
    case 'search': {
      const v = parseInt(arg); if (isNaN(v)) return '❌ search requires a number';
      const path  = chalBst.searchPath(v);
      const found = path.length > 0 && path[path.length-1].value === v;
      chalViz.animateSearch(path, found, SEARCH_DELAY_MS);
      return found ? `✔ Found node ${v}` : `✘ Node ${v} not found`;
    }
    case 'clear': {
      chalBst.clear(); chalViz.relayout();
      return 'Tree cleared';
    }
    default: return `❌ Unknown: ${cmd}`;
  }
}

// ── Helpers ───────────────────────────────────────────────
function log(msg) {
  const c = document.getElementById('chal-console');
  c.value += msg + '\n';
  c.scrollTop = c.scrollHeight;
}

function pad(n) { return String(n).padStart(3, ' '); }
