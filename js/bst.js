/**
 * bst.js — Core Binary Search Tree logic in JavaScript
 * Used by both Explorer and Challenge pages.
 */

class BSTNode {
  constructor(value) {
    this.value = value;
    this.left  = null;
    this.right = null;
    this.parent = null;
  }
}

class BST {
  constructor() { this.root = null; }

  insert(value) {
    const node = new BSTNode(value);
    if (!this.root) { this.root = node; return node; }
    let cur = this.root;
    while (true) {
      if (value === cur.value) return null; // duplicate
      if (value < cur.value) {
        if (!cur.left)  { cur.left  = node; node.parent = cur; return node; }
        cur = cur.left;
      } else {
        if (!cur.right) { cur.right = node; node.parent = cur; return node; }
        cur = cur.right;
      }
    }
  }

  find(value, node = this.root) {
    if (!node) return null;
    if (value === node.value) return node;
    return value < node.value ? this.find(value, node.left) : this.find(value, node.right);
  }

  searchPath(value) {
    const path = [];
    let cur = this.root;
    while (cur) {
      path.push(cur);
      if (value === cur.value) break;
      cur = value < cur.value ? cur.left : cur.right;
    }
    return path;
  }

  delete(value) {
    const node = this.find(value);
    if (!node) return false;
    this._deleteNode(node);
    return true;
  }

  _deleteNode(node) {
    if (!node.left && !node.right) {
      this._removeFromParent(node);
    } else if (!node.left || !node.right) {
      const child = node.left || node.right;
      this._replaceNode(node, child);
    } else {
      const successor = this._minNode(node.right);
      const val = successor.value;
      this._deleteNode(successor);
      node.value = val;
    }
  }

  _removeFromParent(node) {
    if (!node.parent) { this.root = null; return; }
    if (node.parent.left  === node) node.parent.left  = null;
    if (node.parent.right === node) node.parent.right = null;
  }

  _replaceNode(old, replacement) {
    if (!old.parent) { this.root = replacement; }
    else if (old.parent.left  === old) old.parent.left  = replacement;
    else                               old.parent.right = replacement;
    if (replacement) replacement.parent = old.parent;
  }

  _minNode(node) {
    while (node.left) node = node.left;
    return node;
  }

  _maxNode(node) {
    while (node.right) node = node.right;
    return node;
  }

  min() { return this.root ? this._minNode(this.root).value : null; }
  max() { return this.root ? this._maxNode(this.root).value : null; }

  inorder(node = this.root, result = []) {
    if (!node) return result;
    this.inorder(node.left, result);
    result.push(node.value);
    this.inorder(node.right, result);
    return result;
  }

  levelOrder() {
    if (!this.root) return [];
    const result = [], queue = [this.root];
    while (queue.length) {
      const node = queue.shift();
      result.push(node.value);
      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return result;
  }

  height(node = this.root) {
    if (!node) return 0;
    return 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  countNodes(node = this.root) {
    if (!node) return 0;
    return 1 + this.countNodes(node.left) + this.countNodes(node.right);
  }

  isValidBST(node = this.root, min = -Infinity, max = Infinity) {
    if (!node) return true;
    if (node.value <= min || node.value >= max) return false;
    return this.isValidBST(node.left, min, node.value)
        && this.isValidBST(node.right, node.value, max);
  }

  lca(value1, value2, node = this.root) {
    if (!node) return null;
    if (value1 < node.value && value2 < node.value) return this.lca(value1, value2, node.left);
    if (value1 > node.value && value2 > node.value) return this.lca(value1, value2, node.right);
    return node;
  }

  kthSmallest(k) {
    let count = 0, result = null;
    const inorder = (node) => {
      if (!node || result !== null) return;
      inorder(node.left);
      if (++count === k) { result = node.value; return; }
      inorder(node.right);
    };
    inorder(this.root);
    return result;
  }

  sortedArrayToBST(arr, lo = 0, hi = arr.length - 1) {
    if (lo > hi) return null;
    const mid = Math.floor((lo + hi) / 2);
    const node = new BSTNode(arr[mid]);
    node.left  = this.sortedArrayToBST(arr, lo, mid - 1);
    node.right = this.sortedArrayToBST(arr, mid + 1, hi);
    if (node.left)  node.left.parent  = node;
    if (node.right) node.right.parent = node;
    return node;
  }

  isBalanced(node = this.root) {
    const check = (n) => {
      if (!n) return 0;
      const l = check(n.left);
      if (l === -1) return -1;
      const r = check(n.right);
      if (r === -1) return -1;
      if (Math.abs(l - r) > 1) return -1;
      return Math.max(l, r) + 1;
    };
    return check(node) !== -1;
  }

  successor(value) {
    const node = this.find(value);
    if (!node) return null;
    if (node.right) return this._minNode(node.right).value;
    let cur = node.parent;
    let child = node;
    while (cur && child === cur.right) { child = cur; cur = cur.parent; }
    return cur ? cur.value : null;
  }

  predecessor(value) {
    const node = this.find(value);
    if (!node) return null;
    if (node.left) return this._maxNode(node.left).value;
    let cur = node.parent;
    let child = node;
    while (cur && child === cur.left) { child = cur; cur = cur.parent; }
    return cur ? cur.value : null;
  }

  clear() { this.root = null; }

  toJSON(node = this.root) {
    if (!node) return null;
    return { value: node.value, left: this.toJSON(node.left), right: this.toJSON(node.right) };
  }
}
