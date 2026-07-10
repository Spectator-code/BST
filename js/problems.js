/**
 * problems.js — All 14 BST challenge problems with descriptions and test cases
 */

const PROBLEMS = [
  {
    id: 1,
    title: 'Insert a Node',
    difficulty: 'easy',
    description: `
<h3>Insert a Node into a BST</h3>
<p>Given a Binary Search Tree and a value, insert the value into the correct position.</p>

<h4>Rules:</h4>
<ul>
  <li>Values smaller than the current node go to the <strong>left</strong></li>
  <li>Values larger than the current node go to the <strong>right</strong></li>
  <li>Duplicate values should be ignored</li>
</ul>

<h4>Example:</h4>
<pre>Insert 25 into:
    50
   /  \\
  30   70

Result:
    50
   /  \\
  30   70
  /
 25</pre>

<h4>Your task:</h4>
<p>Build a tree by inserting these values in order and then search for <code>25</code>:</p>
<pre>Insert: 50, 30, 70, 20, 40</pre>
`,
    starterCode:
`BinarySearchTree tree = new BinarySearchTree();

// Insert values here:
tree.insert(50);
// Add more inserts...

// Search to verify:
tree.search(30);
`,
    testCases: [
      { setup: [50, 30, 70, 20, 40], action: 'search', value: 30, expected: true },
      { setup: [50, 30, 70, 20, 40], action: 'search', value: 70, expected: true },
      { setup: [50, 30, 70, 20, 40], action: 'search', value: 99, expected: false },
    ],
    hints: [
      'Start with a root node, then insert smaller values to the left.',
      'Use tree.insert(value) for each number.',
      'Try inserting: 50, 30, 70, 20, 40 in that order.'
    ]
  },
  {
    id: 2,
    title: 'Search in a BST',
    difficulty: 'easy',
    description: `
<h3>Search in a Binary Search Tree</h3>
<p>Given a BST and a target value, determine if the value exists in the tree.</p>
<p>The search traverses left when target &lt; current, right when target &gt; current.</p>

<h4>Example:</h4>
<pre>Search 40 in:
    50
   /  \\
  30   70
 /  \\
20  40   ← Found!</pre>

<h4>Your task:</h4>
<p>Build the tree and search for both existing and non-existing values.</p>
`,
    starterCode:
`BinarySearchTree tree = new BinarySearchTree();
tree.insert(50);
tree.insert(30);
tree.insert(70);
tree.insert(20);
tree.insert(40);

// Search existing value:
tree.search(40);

// Search non-existing value:
tree.search(99);
`,
    testCases: [
      { setup: [50,30,70,20,40], action: 'search', value: 40,  expected: true  },
      { setup: [50,30,70,20,40], action: 'search', value: 99,  expected: false },
      { setup: [50,30,70,20,40], action: 'search', value: 20,  expected: true  },
    ],
    hints: [
      'At each node: if target < node, go left. If target > node, go right.',
      'If you reach null, the value was not found.',
    ]
  },
  {
    id: 3,
    title: 'Delete a Node',
    difficulty: 'medium',
    description: `
<h3>Delete a Node from BST</h3>
<p>Deleting from a BST has three cases:</p>
<ol>
  <li><strong>Leaf node</strong> — Simply remove it</li>
  <li><strong>One child</strong> — Replace node with its child</li>
  <li><strong>Two children</strong> — Replace with in-order successor (smallest in right subtree)</li>
</ol>

<h4>Your task:</h4>
<p>Build a tree, delete a node with two children, and verify the tree is still valid.</p>
`,
    starterCode:
`BinarySearchTree tree = new BinarySearchTree();
tree.insert(50);
tree.insert(30);
tree.insert(70);
tree.insert(20);
tree.insert(40);

// Delete node with two children:
tree.delete(30);

// Verify tree still works:
tree.search(20);
tree.search(40);
tree.search(30); // should not be found
`,
    testCases: [
      { setup: [50,30,70,20,40], action: 'delete', value: 30, expected: true  },
      { setup: [50,30,70,20,40], action: 'searchAfterDelete', value: 30, deleteFirst: 30, expected: false },
      { setup: [50,30,70,20,40], action: 'searchAfterDelete', value: 20, deleteFirst: 30, expected: true  },
    ],
    hints: [
      'Case 3: find the in-order successor (leftmost node in right subtree).',
      'Replace deleted node\'s value with successor\'s value, then delete the successor.',
    ]
  },
  {
    id: 4,
    title: 'Find Minimum / Maximum',
    difficulty: 'easy',
    description: `
<h3>Find Min and Max in a BST</h3>
<p>In a BST:</p>
<ul>
  <li>The <strong>minimum</strong> is always the leftmost node</li>
  <li>The <strong>maximum</strong> is always the rightmost node</li>
</ul>

<h4>Your task:</h4>
<p>Build a tree and use System.out.println to print the min and max.</p>
`,
    starterCode:
`BinarySearchTree tree = new BinarySearchTree();
int[] vals = {50, 30, 70, 10, 90, 40, 60};
for (int x : vals) { tree.insert(x); }

// The visualizer will show you the tree!
// Min is the leftmost node, max is the rightmost.
// After running, observe the tree and verify:
tree.search(10); // minimum
tree.search(90); // maximum
`,
    testCases: [
      { setup: [50,30,70,10,90,40,60], action: 'search', value: 10, expected: true },
      { setup: [50,30,70,10,90,40,60], action: 'search', value: 90, expected: true },
    ],
    hints: [
      'Keep going left from the root to find the minimum.',
      'Keep going right from the root to find the maximum.',
    ]
  },
  {
    id: 5,
    title: 'Inorder Traversal',
    difficulty: 'easy',
    description: `
<h3>Inorder Traversal of BST</h3>
<p>Inorder traversal visits nodes in <strong>Left → Root → Right</strong> order.</p>
<p>For a BST, this produces a <strong>sorted sequence</strong>!</p>

<h4>Example:</h4>
<pre>Tree:
    50
   /  \\
  30   70
 /  \\
20  40

Inorder: 20, 30, 40, 50, 70</pre>

<h4>Your task:</h4>
<p>Build the tree below and search each node in inorder sequence to trace the traversal:</p>
`,
    starterCode:
`BinarySearchTree tree = new BinarySearchTree();
tree.insert(50);
tree.insert(30);
tree.insert(70);
tree.insert(20);
tree.insert(40);

// Trace inorder by searching each node in sorted order:
tree.search(20); // 1st
tree.search(30); // 2nd
tree.search(40); // 3rd
tree.search(50); // 4th
tree.search(70); // 5th

System.out.println("Inorder: 20, 30, 40, 50, 70");
`,
    testCases: [
      { setup: [50,30,70,20,40], action: 'inorder', expected: [20,30,40,50,70] },
    ],
    hints: [
      'Inorder = Left subtree first, then root, then right subtree.',
      'A BST\'s inorder traversal always gives sorted output.',
    ]
  },
  {
    id: 6,
    title: 'Level Order Traversal',
    difficulty: 'medium',
    description: `
<h3>Level Order Traversal (BFS)</h3>
<p>Visit nodes <strong>level by level</strong>, from left to right. Uses a queue.</p>

<h4>Example:</h4>
<pre>Tree:
    50
   /  \\
  30   70

Level order: 50, 30, 70</pre>

<h4>Your task:</h4>
<p>Build the tree and search all nodes from top to bottom (root, then each level):</p>
`,
    starterCode:
`BinarySearchTree tree = new BinarySearchTree();
tree.insert(50);
tree.insert(30);
tree.insert(70);
tree.insert(20);
tree.insert(40);
tree.insert(60);
tree.insert(80);

// Search in level-order sequence:
tree.search(50); // Level 0 (root)
tree.search(30); // Level 1 left
tree.search(70); // Level 1 right
tree.search(20); // Level 2
tree.search(40);
tree.search(60);
tree.search(80);

System.out.println("Level order: 50, 30, 70, 20, 40, 60, 80");
`,
    testCases: [
      { setup: [50,30,70,20,40,60,80], action: 'levelOrder', expected: [50,30,70,20,40,60,80] },
    ],
    hints: [
      'Use a queue: enqueue root, then dequeue and enqueue children.',
    ]
  },
  {
    id: 7,
    title: 'Height of BST',
    difficulty: 'easy',
    description: `
<h3>Height of a Binary Search Tree</h3>
<p>The height is the number of levels from the root to the deepest leaf.</p>

<h4>Example:</h4>
<pre>    50       Height = 3
   /  \\
  30   70   (Level 2)
 /
20         (Level 3 — deepest)</pre>

<h4>Your task:</h4>
<p>Build the tree below. The height should be 3. Then add one more level and observe.</p>
`,
    starterCode:
`BinarySearchTree tree = new BinarySearchTree();
tree.insert(50);
tree.insert(30);
tree.insert(70);
tree.insert(20);

// Height is 3 (50 → 30 → 20)
// Now add a node to make height 4:
tree.insert(10);

// Search the deepest node to confirm it's reachable:
tree.search(10);

System.out.println("Height increased to 4!");
`,
    testCases: [
      { setup: [50,30,70,20], action: 'height', expected: 3 },
      { setup: [50,30,70,20,10], action: 'height', expected: 4 },
    ],
    hints: [
      'Height = 1 + max(height(left), height(right))',
      'A single-node tree has height 1. Empty tree has height 0.',
    ]
  },
  {
    id: 8,
    title: 'Count Nodes',
    difficulty: 'easy',
    description: `
<h3>Count Total Nodes in a BST</h3>
<p>Count all nodes in the tree using recursion:</p>
<pre>count(node) = 1 + count(left) + count(right)</pre>

<h4>Your task:</h4>
<p>Build a tree with exactly 7 nodes:</p>
`,
    starterCode:
`BinarySearchTree tree = new BinarySearchTree();

// Insert exactly 7 nodes:
tree.insert(50);
tree.insert(30);
tree.insert(70);
tree.insert(20);
tree.insert(40);
tree.insert(60);
tree.insert(80);

// Verify all 7 are reachable:
tree.search(20);
tree.search(40);
tree.search(60);
tree.search(80);

System.out.println("Tree has 7 nodes!");
`,
    testCases: [
      { setup: [50,30,70,20,40,60,80], action: 'count', expected: 7 },
    ],
    hints: [
      'Recursively count: left subtree count + right subtree count + 1 (for current node).',
    ]
  },
  {
    id: 9,
    title: 'Check if Valid BST',
    difficulty: 'medium',
    description: `
<h3>Validate Binary Search Tree</h3>
<p>Check if a tree is a valid BST. A valid BST satisfies:</p>
<ul>
  <li>All nodes in the left subtree are <strong>less</strong> than the current node</li>
  <li>All nodes in the right subtree are <strong>greater</strong> than the current node</li>
  <li>Both subtrees are also valid BSTs</li>
</ul>

<h4>Your task:</h4>
<p>Build a valid BST and verify by searching all inserted values — they should all be found:</p>
`,
    starterCode:
`BinarySearchTree tree = new BinarySearchTree();
tree.insert(50);
tree.insert(30);
tree.insert(70);
tree.insert(20);
tree.insert(40);
tree.insert(60);
tree.insert(80);

// All searches should succeed (tree is valid BST):
tree.search(20);
tree.search(30);
tree.search(40);
tree.search(50);
tree.search(60);
tree.search(70);
tree.search(80);

System.out.println("All nodes found — valid BST!");
`,
    testCases: [
      { setup: [50,30,70,20,40,60,80], action: 'isValidBST', expected: true },
    ],
    hints: [
      'Use min/max bounds: each node must satisfy min < value < max.',
      'Pass down bounds recursively: left child gets max = parent.value.',
    ]
  },
  {
    id: 10,
    title: 'Lowest Common Ancestor',
    difficulty: 'medium',
    description: `
<h3>Lowest Common Ancestor (LCA)</h3>
<p>The LCA of two nodes is the lowest node that has both as descendants.</p>

<h4>BST Property for LCA:</h4>
<ul>
  <li>If both values are less than current → LCA is in left subtree</li>
  <li>If both values are greater than current → LCA is in right subtree</li>
  <li>Otherwise → current node is the LCA</li>
</ul>

<h4>Example:</h4>
<pre>    50
   /  \\
  30   70
 /  \\
20  40

LCA(20, 40) = 30
LCA(20, 70) = 50</pre>

<h4>Your task:</h4>
<p>Build the tree and identify the LCA by searching the split point:</p>
`,
    starterCode:
`BinarySearchTree tree = new BinarySearchTree();
tree.insert(50);
tree.insert(30);
tree.insert(70);
tree.insert(20);
tree.insert(40);

// LCA of 20 and 40 is 30 (the split point):
tree.search(30);

// LCA of 20 and 70 is 50 (the root):
tree.search(50);

System.out.println("LCA identified!");
`,
    testCases: [
      { setup: [50,30,70,20,40], action: 'lca', v1: 20, v2: 40, expected: 30 },
      { setup: [50,30,70,20,40], action: 'lca', v1: 20, v2: 70, expected: 50 },
    ],
    hints: [
      'Start from the root. If both values are on the same side, recurse that way.',
      'The first node where they split is the LCA.',
    ]
  },
  {
    id: 11,
    title: 'Kth Smallest Element',
    difficulty: 'medium',
    description: `
<h3>Kth Smallest Element in BST</h3>
<p>Since inorder traversal of a BST gives sorted output, the Kth smallest is the Kth element in inorder traversal.</p>

<h4>Example:</h4>
<pre>Tree: 50, 30, 70, 20, 40
Inorder: 20, 30, 40, 50, 70

1st smallest = 20
2nd smallest = 30
3rd smallest = 40</pre>

<h4>Your task:</h4>
<p>Find the 3rd smallest element:</p>
`,
    starterCode:
`BinarySearchTree tree = new BinarySearchTree();
tree.insert(50);
tree.insert(30);
tree.insert(70);
tree.insert(20);
tree.insert(40);

// Inorder: 20, 30, 40, 50, 70
// 3rd smallest = 40
tree.search(40); // highlight the 3rd smallest

System.out.println("3rd smallest is 40");
`,
    testCases: [
      { setup: [50,30,70,20,40], action: 'kthSmallest', k: 1, expected: 20 },
      { setup: [50,30,70,20,40], action: 'kthSmallest', k: 3, expected: 40 },
      { setup: [50,30,70,20,40], action: 'kthSmallest', k: 5, expected: 70 },
    ],
    hints: [
      'Inorder traversal gives sorted order. Count as you go.',
      'When your counter reaches K, that node is the answer.',
    ]
  },
  {
    id: 12,
    title: 'Convert Sorted Array to BST',
    difficulty: 'hard',
    description: `
<h3>Sorted Array to Balanced BST</h3>
<p>Given a sorted array, convert it to a height-balanced BST.</p>
<p>Pick the <strong>middle element as root</strong> for each subarray to ensure balance.</p>

<h4>Example:</h4>
<pre>Array: [10, 20, 30, 40, 50, 60, 70]
Middle = 40 → root
Left half  [10,20,30] → left subtree (mid=20)
Right half [50,60,70] → right subtree (mid=60)

Result:
    40
   /  \\
  20   60
 / \\ / \\
10 30 50 70</pre>

<h4>Your task:</h4>
<p>Build the balanced tree by inserting in the correct order:</p>
`,
    starterCode:
`BinarySearchTree tree = new BinarySearchTree();

// Sorted array: [10, 20, 30, 40, 50, 60, 70]
// To get balanced BST, insert middle first:
tree.insert(40); // mid of whole array
tree.insert(20); // mid of [10,20,30]
tree.insert(60); // mid of [50,60,70]
tree.insert(10);
tree.insert(30);
tree.insert(50);
tree.insert(70);

// Tree should be balanced now!
tree.search(40);
tree.search(20);
tree.search(60);

System.out.println("Balanced BST created!");
`,
    testCases: [
      { setup: [], action: 'customInsert', inserts:[40,20,60,10,30,50,70], action2: 'isBalanced', expected: true },
      { setup: [40,20,60,10,30,50,70], action: 'isBalanced', expected: true },
    ],
    hints: [
      'Always pick the middle element of the current subarray as the root.',
      'Recursively do the same for left and right halves.',
    ]
  },
  {
    id: 13,
    title: 'Balanced BST Check',
    difficulty: 'hard',
    description: `
<h3>Check if BST is Height-Balanced</h3>
<p>A BST is height-balanced if for every node, the difference between left and right subtree heights is <strong>at most 1</strong>.</p>

<h4>Balanced example:</h4>
<pre>    50          Heights: L=2, R=2 ✅
   /  \\
  30   70
 /  \\
20  40</pre>

<h4>Unbalanced example:</h4>
<pre>50             Heights: L=3, R=0 ❌
/
30
/
20
/
10</pre>

<h4>Your task:</h4>
<p>Build a balanced tree (heights differ by ≤1) and an unbalanced one:</p>
`,
    starterCode:
`BinarySearchTree tree = new BinarySearchTree();

// BALANCED tree:
tree.insert(50);
tree.insert(30);
tree.insert(70);
tree.insert(20);
tree.insert(40);
tree.insert(60);
tree.insert(80);

// Verify by observing the tree visually — it should look symmetric!
tree.search(50);

System.out.println("Balanced tree built!");
`,
    testCases: [
      { setup: [50,30,70,20,40,60,80], action: 'isBalanced', expected: true  },
      { setup: [50,30,20,10],          action: 'isBalanced', expected: false },
    ],
    hints: [
      'Compute height of left and right subtrees at every node.',
      'If abs(leftHeight - rightHeight) > 1 at any node, it\'s unbalanced.',
    ]
  },
  {
    id: 14,
    title: 'Find Successor / Predecessor',
    difficulty: 'hard',
    description: `
<h3>In-order Successor and Predecessor</h3>
<p><strong>Successor</strong>: The next larger value (next in inorder traversal).</p>
<p><strong>Predecessor</strong>: The next smaller value (previous in inorder traversal).</p>

<h4>Algorithm:</h4>
<ul>
  <li>If node has right subtree → successor = leftmost node in right subtree</li>
  <li>Otherwise → successor = ancestor where we came from the left</li>
  <li>Similar logic for predecessor (using left subtree)</li>
</ul>

<h4>Example:</h4>
<pre>Inorder: 20, 30, 40, 50, 70
Successor of 30 = 40
Predecessor of 30 = 20</pre>

<h4>Your task:</h4>
<p>Build the tree and search the successor and predecessor of 30:</p>
`,
    starterCode:
`BinarySearchTree tree = new BinarySearchTree();
tree.insert(50);
tree.insert(30);
tree.insert(70);
tree.insert(20);
tree.insert(40);

// Successor of 30 is 40 (next in inorder):
tree.search(40);

// Predecessor of 30 is 20 (previous in inorder):
tree.search(20);

System.out.println("Successor=40, Predecessor=20");
`,
    testCases: [
      { setup: [50,30,70,20,40], action: 'successor',   value: 30, expected: 40 },
      { setup: [50,30,70,20,40], action: 'predecessor',  value: 30, expected: 20 },
      { setup: [50,30,70,20,40], action: 'successor',   value: 50, expected: 70 },
    ],
    hints: [
      'Successor: if right subtree exists, go to leftmost node there.',
      'Predecessor: if left subtree exists, go to rightmost node there.',
    ]
  }
];
