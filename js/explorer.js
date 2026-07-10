/**
 * explorer.js — Explorer page interactions
 * Requires bst.js and visualizer.js to be loaded first
 */

// ── Init ──────────────────────────────────────────────────
const bst = new BST();
let viz;
let codePanelOpen = true;
let stepIndex = -1;
let stepLines  = [];
const declaredArrays = {};
const SEARCH_DELAY_MS = 4000;
const EXEC_DELAY_MS   = 600;

// Regex patterns (same as Java version)
const R_METHOD = /^\s*(?:\w+\.)(insert|delete|search|clear)\s*\(\s*(\d*)\s*\)\s*;?\s*$/i;
const R_CTOR   = /^\s*(?:BinarySearchTree|BST)\s+\w+\s*=\s*new\s+(?:BinarySearchTree|BST)\s*\(\s*\)\s*;?\s*$/i;
const R_SYSOUT = /^\s*System\.out\.println\s*\((.*)\)\s*;?\s*$/;
const R_ARRAY  = /^\s*int\[\]\s+(\w+)\s*=\s*(?:new\s+int\[\]\s*)?\{([^}]+)\}\s*;?\s*$/;
const R_FOREACH = /^\s*for\s*\(\s*int\s+\w+\s*:\s*(\w+)\s*\)\s*\{?\s*(?:\w+\.)(insert|delete|search)\s*\(\s*\w+\s*\)\s*;?\s*\}?\s*$/i;

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('exp-canvas');
  resizeCanvas(canvas);
  window.addEventListener('resize', () => resizeCanvas(canvas));

  viz = new BSTVisualizer(canvas, bst);
  viz.transX = canvas.width  / 2;
  viz.transY = 60;
  viz._dirty = true;

  setStatus('Ready — insert nodes or run Java code');
});

function resizeCanvas(c) {
  const wrap = c.parentElement;
  c.width  = wrap.clientWidth;
  c.height = wrap.clientHeight;
  if (viz) { viz._dirty = true; }
}

// ── Status ────────────────────────────────────────────────
function setStatus(msg) {
  document.getElementById('status-text').textContent = msg;
}
function log(msg) {
  const c = document.getElementById('exp-console');
  c.value += msg + '\n';
  c.scrollTop = c.scrollHeight;
}

// ── Toolbar buttons ───────────────────────────────────────
window.handleInsert = function() {
  const v = parseInput(); if (v === null) return;
  const inserted = bst.insert(v);
  if (!inserted) { setStatus(`Duplicate: ${v} already in tree`); return; }
  viz.relayout();
  setTimeout(() => viz.highlightNode(v, '#27ae60', 1200), 400);
  setStatus(`Inserted: ${v}`);
};

window.handleDelete = function() {
  const v = parseInput(); if (v === null) return;
  viz.highlightNode(v, '#c0392b', 400);
  setTimeout(() => {
    const ok = bst.delete(v);
    if (ok) { viz.relayout(); setStatus(`Deleted: ${v}`); }
    else     { setStatus(`${v} not found in tree`); }
  }, 300);
};

window.handleSearch = function() {
  const v = parseInput(); if (v === null) return;
  const path  = bst.searchPath(v);
  const found = path.length > 0 && path[path.length - 1].value === v;
  viz.animateSearch(path, found, SEARCH_DELAY_MS);
  setStatus(found ? `Found: ${v}` : `${v} not found`);
};

window.handleRandom = function() {
  bst.clear(); viz.relayout();
  const vals = Array.from({length: 9 + Math.floor(Math.random()*4)}, () => Math.floor(Math.random()*90)+5);
  const unique = [...new Set(vals)].slice(0, 10);
  unique.forEach(v => bst.insert(v));
  viz.relayout();
  setStatus(`Random tree with ${bst.countNodes()} nodes`);
};

window.handleClear = function() {
  bst.clear(); viz.relayout();
  setStatus('Tree cleared');
};

window.toggleCode = function() {
  codePanelOpen = !codePanelOpen;
  document.getElementById('code-panel').classList.toggle('collapsed', !codePanelOpen);
  document.getElementById('toggle-code-btn').textContent = codePanelOpen ? '◀ Code' : '▶ Code';
  setTimeout(() => {
    resizeCanvas(document.getElementById('exp-canvas'));
    viz._dirty = true;
  }, 350);
};

function parseInput() {
  const el  = document.getElementById('value-input');
  const v   = parseInt(el.value);
  el.value  = '';
  if (isNaN(v)) { setStatus('Please enter a number'); return null; }
  return v;
}

// ── Code Execution ────────────────────────────────────────
window.runCode = function() {
  const code = document.getElementById('exp-code').value;
  document.getElementById('exp-console').value = '';
  Object.keys(declaredArrays).forEach(k => delete declaredArrays[k]);
  const lines = code.split('\n');
  log('╔══════════════════════════════╗');
  log('║     ▶  Program Execution    ║');
  log('╚══════════════════════════════╝\n');
  executeSequence(lines, 0);
};

function executeSequence(lines, i) {
  if (i >= lines.length) {
    log('\n─────────────────────────────\n✅ BUILD SUCCESSFUL');
    setStatus('Execution complete');
    return;
  }
  const line = lines[i].trim();
  if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*') || line === '{' || line === '}') {
    if (line) log(`   ${String(i+1).padStart(3)} │ ${line}`);
    setTimeout(() => executeSequence(lines, i+1), 80);
    return;
  }
  log(`  ►  ${String(i+1).padStart(3)} │ ${line}`);
  const result = execLine(line);
  if (result) log(`       └─➤ ${result}`);
  setTimeout(() => executeSequence(lines, i+1), EXEC_DELAY_MS);
}

window.stepCode = function() {
  const code = document.getElementById('exp-code').value;
  if (stepIndex < 0) {
    stepLines = code.split('\n');
    Object.keys(declaredArrays).forEach(k => delete declaredArrays[k]);
    document.getElementById('exp-console').value = '';
    log('╔══════════════════════════════╗\n║   ⏭  Step Debugging         ║\n╚══════════════════════════════╝\n');
    stepIndex = 0;
  }
  while (stepIndex < stepLines.length) {
    const l = stepLines[stepIndex].trim();
    if (l && !l.startsWith('//') && !l.startsWith('/*') && l !== '{' && l !== '}') break;
    if (l) log(`   ${String(stepIndex+1).padStart(3)} │ ${l}`);
    stepIndex++;
  }
  if (stepIndex >= stepLines.length) {
    log('\n✅ All lines executed.');
    stepIndex = -1;
    return;
  }
  const line = stepLines[stepIndex].trim();
  log(`  ►  ${String(stepIndex+1).padStart(3)} │ ${line}`);
  const result = execLine(line);
  if (result) log(`       └─➤ ${result}`);
  stepIndex++;
  if (stepIndex >= stepLines.length) {
    log('\n✅ All lines executed.');
    stepIndex = -1;
  }
};

window.resetCode = function() {
  stepIndex = -1;
  Object.keys(declaredArrays).forEach(k => delete declaredArrays[k]);
  document.getElementById('exp-console').value = '↺ Reset.\n';
  viz.resetColors();
  setStatus('Reset');
};

window.loadExample = function() {
  document.getElementById('exp-code').value =
`BinarySearchTree tree = new BinarySearchTree();

int[] nums = {50, 30, 70, 20, 40, 60, 80};
for (int x : nums) { tree.insert(x); }

tree.search(40);
tree.search(99);

tree.delete(30);

tree.search(20);
tree.search(40);

System.out.println("Done!");`;
  document.getElementById('exp-console').value = '';
  stepIndex = -1;
  setStatus('Example loaded — click ▶ Run All or ⏭ Step');
};

function execLine(line) {
  let m;

  m = R_METHOD.exec(line);
  if (m) return execCmd(m[1].toLowerCase(), m[2]);

  m = R_CTOR.exec(line);
  if (m) { bst.clear(); viz.relayout(); return 'BinarySearchTree initialized'; }

  m = R_SYSOUT.exec(line);
  if (m) {
    let c = m[1].trim().replace(/^"|"$/g, '');
    return `>> ${c}`;
  }

  m = R_ARRAY.exec(line);
  if (m) {
    const name = m[1];
    const vals = m[2].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    declaredArrays[name] = vals;
    return `Declared array ${name} with ${vals.length} elements`;
  }

  m = R_FOREACH.exec(line);
  if (m) {
    const arrName = m[1], cmd = m[2].toLowerCase();
    const vals = declaredArrays[arrName];
    if (!vals) return `❌ Array '${arrName}' not found`;
    return vals.map(v => execCmd(cmd, String(v))).join('; ');
  }

  if (/^(import|package|public|private|class|@)/.test(line)) return '(declaration)';
  if (/^(int|String|var)\s/.test(line)) return '(variable declared)';

  return `⚠ Unrecognized: ${line}`;
}

function execCmd(cmd, arg) {
  switch(cmd) {
    case 'insert': {
      const v = parseInt(arg);
      if (isNaN(v)) return '❌ insert requires a number';
      const n = bst.insert(v);
      viz.relayout();
      if (n) setTimeout(() => viz.highlightNode(v, '#27ae60', 1000), 400);
      setStatus(`Inserted: ${v}`);
      return n ? `Inserted node ${v}` : `Duplicate ${v}`;
    }
    case 'delete': {
      const v = parseInt(arg);
      if (isNaN(v)) return '❌ delete requires a number';
      const exists = !!bst.find(v);
      if (!exists) return `❌ Node ${v} not found`;
      viz.highlightNode(v, '#c0392b', 400);
      setTimeout(() => { bst.delete(v); viz.relayout(); }, 350);
      setStatus(`Deleted: ${v}`);
      return `Deleted node ${v}`;
    }
    case 'search': {
      const v = parseInt(arg);
      if (isNaN(v)) return '❌ search requires a number';
      const path  = bst.searchPath(v);
      const found = path.length > 0 && path[path.length-1].value === v;
      viz.animateSearch(path, found, SEARCH_DELAY_MS);
      setStatus(found ? `Found: ${v}` : `${v} not found`);
      return found ? `✔ Found node ${v}` : `✘ Node ${v} not found`;
    }
    case 'clear': {
      bst.clear(); viz.relayout();
      setStatus('Tree cleared');
      return 'Tree cleared';
    }
    default:
      return `❌ Unknown method: ${cmd}`;
  }
}
