/**
 * visualizer.js — Canvas-based BST renderer with pan, zoom, animations
 * Depends on bst.js (BST class must be loaded first)
 */

class BSTVisualizer {
  constructor(canvas, bst) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.bst    = bst;

    // Pan / zoom state
    this.scale  = 1;
    this.transX = 0;
    this.transY = 0;
    this._panStartX = 0;
    this._panStartY = 0;
    this._panTransX = 0;
    this._panTransY = 0;
    this._isPanning = false;

    // Node visual state map  value -> { x, y, targetX, targetY, color, scale, glowing }
    this.nodeStates = new Map();

    // Animation loop
    this._animFrame = null;
    this._dirty = true;

    this._setupEvents();
    this._startLoop();
  }

  // ── Events ───────────────────────────────────────────────
  _setupEvents() {
    const c = this.canvas;

    c.addEventListener('mousedown', e => {
      this._isPanning = true;
      this._panStartX = e.clientX;
      this._panStartY = e.clientY;
      this._panTransX = this.transX;
      this._panTransY = this.transY;
      c.style.cursor = 'grabbing';
    });

    c.addEventListener('mousemove', e => {
      if (!this._isPanning) return;
      this.transX = this._panTransX + (e.clientX - this._panStartX);
      this.transY = this._panTransY + (e.clientY - this._panStartY);
      this._dirty = true;
    });

    c.addEventListener('mouseup',    () => { this._isPanning = false; c.style.cursor = 'grab'; });
    c.addEventListener('mouseleave', () => { this._isPanning = false; c.style.cursor = 'grab'; });

    c.addEventListener('wheel', e => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      const rect = c.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const dx = px - this.transX;
      const dy = py - this.transY;
      this.scale = Math.max(0.1, Math.min(5, this.scale * factor));
      this.transX = px - dx * factor;
      this.transY = py - dy * factor;
      this._dirty = true;
    }, { passive: false });

    c.style.cursor = 'grab';
  }

  zoomIn()  { this._zoomCenter(1.2); }
  zoomOut() { this._zoomCenter(0.8); }
  resetView() {
    this.scale = 1;
    this.transX = this.canvas.width / 2;
    this.transY = 40;
    this.relayout();
  }

  _zoomCenter(f) {
    const cx = this.canvas.width  / 2;
    const cy = this.canvas.height / 2;
    const dx = cx - this.transX;
    const dy = cy - this.transY;
    this.scale = Math.max(0.1, Math.min(5, this.scale * f));
    this.transX = cx - dx * f;
    this.transY = cy - dy * f;
    this._dirty = true;
  }

  // ── Layout ───────────────────────────────────────────────
  relayout() {
    if (!this.bst.root) { this.nodeStates.clear(); this._dirty = true; return; }

    const count   = this.bst.countNodes();
    const spacing = Math.max(55, 800 / (count + 1));
    let   idx     = 0;

    const assign = (node, depth) => {
      if (!node) return;
      assign(node.left,  depth + 1);
      const tx = spacing * idx + spacing / 2;
      const ty = 40 + depth * 70;
      const existing = this.nodeStates.get(node.value);
      if (existing) {
        existing.targetX = tx;
        existing.targetY = ty;
      } else {
        this.nodeStates.set(node.value, {
          x: tx, y: ty, targetX: tx, targetY: ty,
          color: '#2e7dd6', nodeScale: 1, glowing: false, glowColor: '#2e7dd6'
        });
      }
      idx++;
      assign(node.right, depth + 1);
    };

    assign(this.bst.root, 0);

    // Center around canvas origin (pan offset handles actual centering)
    const totalW = count * spacing;
    const offset = -totalW / 2;
    this.nodeStates.forEach(s => { s.targetX += offset; });

    // Remove nodes that no longer exist
    const alive = new Set();
    const markAlive = n => { if (!n) return; alive.add(n.value); markAlive(n.left); markAlive(n.right); };
    markAlive(this.bst.root);
    this.nodeStates.forEach((_, v) => { if (!alive.has(v)) this.nodeStates.delete(v); });

    this._dirty = true;
  }

  // ── Highlight Helpers ─────────────────────────────────────
  highlightNode(value, color, durationMs = 1200) {
    const s = this.nodeStates.get(value);
    if (!s) return;
    s.color     = color;
    s.nodeScale = 1.3;
    s.glowing   = true;
    s.glowColor = color;
    this._dirty = true;
    setTimeout(() => {
      const ss = this.nodeStates.get(value);
      if (ss) { ss.color = '#2e7dd6'; ss.nodeScale = 1; ss.glowing = false; this._dirty = true; }
    }, durationMs);
  }

  animateSearch(path, found, delayMs = 4000) {
    this.resetColors();
    path.forEach((node, i) => {
      const isLast = i === path.length - 1;
      const col = isLast ? (found ? '#27ae60' : '#c0392b') : '#f39c12';
      setTimeout(() => { this.highlightNode(node.value, col, delayMs + 2000); }, delayMs * i);
    });
  }

  resetColors() {
    this.nodeStates.forEach(s => {
      s.color = '#2e7dd6'; s.nodeScale = 1; s.glowing = false;
    });
    this._dirty = true;
  }

  // ── Render Loop ──────────────────────────────────────────
  _startLoop() {
    const tick = () => {
      this._update();
      if (this._dirty) { this._draw(); this._dirty = false; }
      this._animFrame = requestAnimationFrame(tick);
    };
    this._animFrame = requestAnimationFrame(tick);
  }

  _update() {
    this.nodeStates.forEach(s => {
      const dx = s.targetX - s.x;
      const dy = s.targetY - s.y;
      if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
        s.x += dx * 0.15;
        s.y += dy * 0.15;
        this._dirty = true;
      } else {
        s.x = s.targetX;
        s.y = s.targetY;
      }
    });
  }

  _draw() {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(this.transX, this.transY);
    ctx.scale(this.scale, this.scale);

    // Draw edges first
    this._drawEdges(this.bst.root, ctx);

    // Draw nodes
    this.nodeStates.forEach((s, value) => {
      this._drawNode(ctx, s, value);
    });

    ctx.restore();
  }

  _drawEdges(node, ctx) {
    if (!node) return;
    const drawEdge = (child) => {
      const ps = this.nodeStates.get(node.value);
      const cs = this.nodeStates.get(child.value);
      if (!ps || !cs) return;
      ctx.beginPath();
      ctx.moveTo(ps.x, ps.y + 22);
      ctx.lineTo(cs.x, cs.y - 22);
      ctx.strokeStyle = '#4a6fa5';
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    if (node.left)  { drawEdge(node.left);  this._drawEdges(node.left,  ctx); }
    if (node.right) { drawEdge(node.right); this._drawEdges(node.right, ctx); }
  }

  _drawNode(ctx, s, value) {
    const r = 22 * s.nodeScale;

    // Glow
    if (s.glowing) {
      ctx.save();
      ctx.shadowColor = s.glowColor;
      ctx.shadowBlur  = 20;
      ctx.beginPath();
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fillStyle = s.glowColor;
      ctx.fill();
      ctx.restore();
    }

    // Circle
    ctx.beginPath();
    ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
    ctx.fillStyle = s.color;
    ctx.fill();
    ctx.strokeStyle = this._darken(s.color);
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(11, 13 * s.nodeScale)}px JetBrains Mono, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(value), s.x, s.y);
  }

  _darken(hex) {
    const c = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (c >> 16) - 30);
    const g = Math.max(0, ((c >> 8) & 0xff) - 30);
    const b = Math.max(0, (c & 0xff) - 30);
    return `rgb(${r},${g},${b})`;
  }

  destroy() { cancelAnimationFrame(this._animFrame); }
}
