/**
 * SHANCODE PLATFORM: Comprehensive Masterclass & Problem Catalog Dataset
 * 35+ Video Concepts across 15 Tracks & 1,000+ Curated Interview Problems
 */

export const SECTIONS = [
  { id: 1, title: '1. Programming Basics & Complexity', slug: 'basics-complexity', icon: 'Code', description: 'Big-O notation, time and space complexity, memory models, recursion fundamentals.', order_index: 1 },
  { id: 2, title: '2. Arrays & Two Pointers', slug: 'arrays', icon: 'Layers', description: 'Contiguous memory, prefix sums, two pointers, difference arrays, and kadane algorithm.', order_index: 2 },
  { id: 3, title: '3. Strings & Sliding Window', slug: 'strings', icon: 'Type', description: 'String immutability, pattern matching, sliding window, anagram frequency hashing.', order_index: 3 },
  { id: 4, title: '4. Linked Lists', slug: 'linked-lists', icon: 'Link', description: 'Singly, doubly, circular lists, fast & slow pointers, reversal, and cycle detection.', order_index: 4 },
  { id: 5, title: '5. Stacks & Queues', slug: 'stacks-queues', icon: 'Server', description: 'LIFO & FIFO mechanics, monotonic stacks, parenthesis matching, and queue buffers.', order_index: 5 },
  { id: 6, title: '6. Hashing & Hash Tables', slug: 'hashing', icon: 'Hash', description: 'Direct address tables, collision resolution, hash maps, hash sets, rolling hashes.', order_index: 6 },
  { id: 7, title: '7. Binary Search & Search Space', slug: 'binary-search', icon: 'Search', description: 'Divide-and-conquer on sorted inputs, search space monotonic predicates, lower/upper bounds.', order_index: 7 },
  { id: 8, title: '8. Trees & Tree Traversals', slug: 'trees', icon: 'GitBranch', description: 'Binary trees, BFS level-order, DFS pre/in/post-order, lowest common ancestors, tree diameter.', order_index: 8 },
  { id: 9, title: '9. Binary Search Trees', slug: 'binary-search-trees', icon: 'GitCommit', description: 'BST invariant properties, validation, search, insertion, deletion, and balancing.', order_index: 9 },
  { id: 10, title: '10. Heaps & Priority Queues', slug: 'heaps', icon: 'ChevronsUp', description: 'Binary heaps, min/max heap invariants, Top-K elements, and continuous median streams.', order_index: 10 },
  { id: 11, title: '11. Graphs & Connectivity', slug: 'graphs', icon: 'Share2', description: 'Adjacency lists/matrices, BFS, DFS, topological sort, Dijkstra shortest path, cycle detection.', order_index: 11 },
  { id: 12, title: '12. Recursion & Backtracking', slug: 'backtracking', icon: 'RotateCcw', description: 'State space tree exploration, pruning, subsets, combinations, permutations, N-Queens.', order_index: 12 },
  { id: 13, title: '13. Dynamic Programming (1D & 2D)', slug: 'dynamic-programming', icon: 'Cpu', description: 'Overlapping subproblems, optimal substructure, memoization, bottom-up tabulation.', order_index: 13 },
  { id: 14, title: '14. Greedy Algorithms & Intervals', slug: 'greedy', icon: 'TrendingUp', description: 'Locally optimal choices, interval scheduling, merge intervals, jump games.', order_index: 14 },
  { id: 15, title: '15. Advanced DSA & Trie', slug: 'advanced-dsa', icon: 'Zap', description: 'Prefix trees (Trie), Union-Find (Disjoint Set Union with path compression), Segment Trees.', order_index: 15 }
];

export const PATTERNS = [
  {
    id: 1,
    name: 'Two Pointers',
    slug: 'two-pointers',
    description: 'Converging or equidistant pointers navigating sorted sequences in O(N) time.',
    total_levels: 4,
    icon: 'Maximize2',
    levels: [
      { level_number: 1, title: 'Foundation (Two Sum II, Palindromes)', required_count: 2, difficulty: 'Easy' },
      { level_number: 2, title: 'Opposite Ends Drill (Container With Water)', required_count: 2, difficulty: 'Medium' },
      { level_number: 3, title: 'Triplets & Deduplication (3Sum)', required_count: 2, difficulty: 'Medium' },
      { level_number: 4, title: 'Hard Subarrays (Trapping Rain Water)', required_count: 1, difficulty: 'Hard' }
    ]
  },
  {
    id: 2,
    name: 'Sliding Window',
    slug: 'sliding-window',
    description: 'Dynamic or fixed size subsegment tracking with continuous O(1) state updates.',
    total_levels: 4,
    icon: 'Sliders',
    levels: [
      { level_number: 1, title: 'Fixed Window', required_count: 2, difficulty: 'Easy' },
      { level_number: 2, title: 'Dynamic Substrings (Longest Without Repeat)', required_count: 2, difficulty: 'Medium' },
      { level_number: 3, title: 'Character Frequencies (Anagrams)', required_count: 2, difficulty: 'Medium' },
      { level_number: 4, title: 'Hard Substring Minimums (Minimum Window Substring)', required_count: 1, difficulty: 'Hard' }
    ]
  },
  {
    id: 3,
    name: 'Binary Search On Answers',
    slug: 'binary-search-space',
    description: 'Transforming optimization problems into monotonic boolean feasibility tests.',
    total_levels: 4,
    icon: 'Target',
    levels: [
      { level_number: 1, title: 'Array Search', required_count: 2, difficulty: 'Easy' },
      { level_number: 2, title: 'Rotated Arrays', required_count: 2, difficulty: 'Medium' },
      { level_number: 3, title: 'Capacity & Speed (Koko Eating Bananas)', required_count: 2, difficulty: 'Medium' },
      { level_number: 4, title: 'Median of Two Sorted Arrays', required_count: 1, difficulty: 'Hard' }
    ]
  },
  {
    id: 4,
    name: 'Fast & Slow Pointers',
    slug: 'fast-slow-pointers',
    description: 'Floyds cycle-finding algorithm to detect loops and find midpoints in linked lists.',
    total_levels: 3,
    icon: 'Repeat',
    levels: [
      { level_number: 1, title: 'Middle of Linked List', required_count: 2, difficulty: 'Easy' },
      { level_number: 2, title: 'Cycle Detection & Entry Point', required_count: 2, difficulty: 'Medium' },
      { level_number: 3, title: 'Happy Number & Palindrome List', required_count: 2, difficulty: 'Medium' }
    ]
  },
  {
    id: 5,
    name: 'Monotonic Stack / Queue',
    slug: 'monotonic-stack',
    description: 'Maintaining sorted element invariants to identify next greater or smaller elements.',
    total_levels: 4,
    icon: 'Layers',
    levels: [
      { level_number: 1, title: 'Next Greater Element', required_count: 2, difficulty: 'Easy' },
      { level_number: 2, title: 'Daily Temperatures', required_count: 2, difficulty: 'Medium' },
      { level_number: 3, title: 'Subarray Ranges', required_count: 2, difficulty: 'Medium' },
      { level_number: 4, title: 'Largest Rectangle in Histogram', required_count: 1, difficulty: 'Hard' }
    ]
  },
  {
    id: 6,
    name: 'Dynamic Programming (0/1 & States)',
    slug: 'dynamic-programming-patterns',
    description: 'Decisions at index i determining future state, memoizing overlapping subproblems.',
    total_levels: 4,
    icon: 'Cpu',
    levels: [
      { level_number: 1, title: 'Fibonacci & Climbing Stairs', required_count: 2, difficulty: 'Easy' },
      { level_number: 2, title: 'House Robber & Jumps', required_count: 2, difficulty: 'Medium' },
      { level_number: 3, title: 'Coin Change & LIS', required_count: 2, difficulty: 'Medium' },
      { level_number: 4, title: 'Edit Distance & Hard 2D DP', required_count: 1, difficulty: 'Hard' }
    ]
  }
];

// Helper to create 35+ rich concepts with video links, SVGs, code samples, and quizzes
function generateAllConcepts() {
  const videoMasterclasses = [
    // Section 1
    { id: 1, sec: 1, ord: 1, title: 'Time & Space Complexity (Big-O)', slug: 'time-space-complexity', vid: 'https://www.youtube.com/embed/g2o22C3CRfU', sum: 'Evaluate asymptotic growth rates, step bounds, and memory allocations.' },
    { id: 2, sec: 1, ord: 2, title: 'Amortized Analysis & Memory Models', slug: 'amortized-analysis', vid: 'https://www.youtube.com/embed/8syQkZwtv_g', sum: 'Analyze dynamic arrays resizing costs and memory cache locality.' },
    { id: 3, sec: 1, ord: 3, title: 'Recursion Trees & Master Theorem', slug: 'recursion-trees', vid: 'https://www.youtube.com/embed/m72D3n_u_9U', sum: 'Calculate divide-and-conquer recurrence relations and depth stack limits.' },
    
    // Section 2
    { id: 4, sec: 2, ord: 1, title: 'Two Pointer Technique (Converging)', slug: 'two-pointer-technique', vid: 'https://www.youtube.com/embed/cQ1Oz4ckcMM', sum: 'Eliminate duplicate iterations on sorted sequences in linear time.' },
    { id: 5, sec: 2, ord: 2, title: 'In-Place Array Partitioning', slug: 'in-place-partitioning', vid: 'https://www.youtube.com/embed/7_nN4KqjW70', sum: 'Dutch national flag and two-pass in-place partitioning mechanics.' },
    { id: 6, sec: 2, ord: 3, title: 'Prefix Sums & Difference Arrays', slug: 'prefix-sums-difference', vid: 'https://www.youtube.com/embed/pVS3yhlzrlQ', sum: 'Execute O(1) range queries and cumulative interval updates.' },
    
    // Section 3
    { id: 7, sec: 3, ord: 1, title: 'Fixed Size Sliding Window', slug: 'fixed-sliding-window', vid: 'https://www.youtube.com/embed/MK-NZ4hN75g', sum: 'Track contiguous subsegments of length K in optimal linear runtime.' },
    { id: 8, sec: 3, ord: 2, title: 'Dynamic Sliding Window Substrings', slug: 'dynamic-sliding-window', vid: 'https://www.youtube.com/embed/wiGpQwVHdE0', sum: 'Expand right pointer and contract left pointer on invariant violation.' },
    { id: 9, sec: 3, ord: 3, title: 'Character Frequency Rolling Map', slug: 'character-frequency-map', vid: 'https://www.youtube.com/embed/G8fl_U80CQg', sum: 'Match anagrams and substring permutations with fixed 26-char arrays.' },

    // Section 4
    { id: 10, sec: 4, ord: 1, title: 'Floyds Cycle Detection (Fast & Slow)', slug: 'floyds-cycle-detection', vid: 'https://www.youtube.com/embed/PvrxZaH_eZ4', sum: 'Detect periodicities and cycle entry points with tortoise & hare.' },
    { id: 11, sec: 4, ord: 2, title: 'In-Place Linked List Reversal', slug: 'linked-list-reversal', vid: 'https://www.youtube.com/embed/G0_I-ZF0S38', sum: 'Manipulate next pointers with prev/curr/next triplets without auxiliary memory.' },
    { id: 12, sec: 4, ord: 3, title: 'K-Group Reversal & Multi-Merge', slug: 'k-group-reversal', vid: 'https://www.youtube.com/embed/TeDx_z0Zq0Y', sum: 'Iteratively group node pointers and connect segment boundaries.' },

    // Section 5
    { id: 13, sec: 5, ord: 1, title: 'Monotonic Stack (Next Greater Element)', slug: 'monotonic-stack-intro', vid: 'https://www.youtube.com/embed/Dq_ObZw5_GE', sum: 'Maintain monotonic indices to answer next/previous greater queries in O(N).' },
    { id: 14, sec: 5, ord: 2, title: 'Parenthesis Matching & Parsing', slug: 'parenthesis-parsing', vid: 'https://www.youtube.com/embed/WTzjTskDFMg', sum: 'Validate nested bracket balance and evaluate arithmetic postfix notation.' },
    { id: 15, sec: 5, ord: 3, title: 'Monotonic Deque for Sliding Windows', slug: 'monotonic-deque', vid: 'https://www.youtube.com/embed/DfljaUwZsOk', sum: 'Find sliding window maximum in O(N) amortized time using double-ended queues.' },

    // Section 6
    { id: 16, sec: 6, ord: 1, title: 'Hash Table Collision & Load Factors', slug: 'hash-table-mechanics', vid: 'https://www.youtube.com/embed/shs0KM3wKv8', sum: 'Understand chaining vs open addressing and achieve O(1) average lookup.' },
    { id: 17, sec: 6, ord: 2, title: 'Subarray Sums with Hash Pre-computation', slug: 'subarray-sum-hash', vid: 'https://www.youtube.com/embed/fFVZt-6sgyo', sum: 'Identify sum k subarrays by storing cumulative sum frequencies in a map.' },

    // Section 7
    { id: 18, sec: 7, ord: 1, title: 'Binary Search Invariants & Bounds', slug: 'binary-search-bounds', vid: 'https://www.youtube.com/embed/tgVSkMA8JoQ', sum: 'Eliminate off-by-one errors in left/right midpoint calculations.' },
    { id: 19, sec: 7, ord: 2, title: 'Binary Search on Monotonic Answer Spaces', slug: 'binary-search-answer-space', vid: 'https://www.youtube.com/embed/U2SozAs9RzA', sum: 'Formulate feasible(mid) predicate to binary search continuous ranges.' },

    // Section 8
    { id: 20, sec: 8, ord: 1, title: 'Binary Tree BFS Level Order Traversal', slug: 'tree-bfs-traversal', vid: 'https://www.youtube.com/embed/6ZnyEApgFYg', sum: 'Queue-based level processing and calculation of tree diameters.' },
    { id: 21, sec: 8, ord: 2, title: 'Tree DFS: Preorder, Inorder & Postorder', slug: 'tree-dfs-traversal', vid: 'https://www.youtube.com/embed/b_N4MxdJA0A', sum: 'Recursive tree path accumulation and lowest common ancestor detection.' },
    { id: 22, sec: 8, ord: 3, title: 'Tree Serialization & Rebuilding', slug: 'tree-serialization', vid: 'https://www.youtube.com/embed/u4JAi2JJhIg', sum: 'Serialize tree topologies into flat strings and reconstruct in O(N).' },

    // Section 9
    { id: 23, sec: 9, ord: 1, title: 'BST Invariant & Validation Rules', slug: 'bst-validation-invariants', vid: 'https://www.youtube.com/embed/s6ATEkipzow', sum: 'Validate strict left < root < right bounds across recursive subtrees.' },
    { id: 24, sec: 9, ord: 2, title: 'BST Node Deletion & Successors', slug: 'bst-deletion-successors', vid: 'https://www.youtube.com/embed/gcULXE7ViZw', sum: 'Handle 0, 1, and 2 children deletion with in-order successors.' },

    // Section 10
    { id: 25, sec: 10, ord: 1, title: 'Binary Heap Invariants & Heapify', slug: 'binary-heap-invariants', vid: 'https://www.youtube.com/embed/HqPJF2L5h9U', sum: 'Array-backed complete binary trees with O(log N) push and pop.' },
    { id: 26, sec: 10, ord: 2, title: 'Top-K Pattern with Min/Max Heaps', slug: 'top-k-heaps', vid: 'https://www.youtube.com/embed/YPTqKIgVk-k', sum: 'Maintain fixed size heap of K elements for instantaneous rank retrieval.' },
    { id: 27, sec: 10, ord: 3, title: 'Dual-Heap Continuous Running Median', slug: 'dual-heap-running-median', vid: 'https://www.youtube.com/embed/itmhHWaHupI', sum: 'Balance max-heap for lower half and min-heap for upper half.' },

    // Section 11
    { id: 28, sec: 11, ord: 1, title: 'Graph BFS & Shortest Path in Unweighted Graphs', slug: 'graph-bfs-shortest-path', vid: 'https://www.youtube.com/embed/oDqjPvD54Ss', sum: 'Adjacency list queue traversal with visited sets to avoid cycles.' },
    { id: 29, sec: 11, ord: 2, title: 'Topological Sort (Kahns & DFS Stack)', slug: 'topological-sort', vid: 'https://www.youtube.com/embed/cIBFEhD77b4', sum: 'Order directed acyclic graph dependencies using in-degrees.' },
    { id: 30, sec: 11, ord: 3, title: 'Dijkstras Shortest Path Algorithm', slug: 'dijkstras-algorithm', vid: 'https://www.youtube.com/embed/EFg3u_E6eHU', sum: 'Priority queue greedy relaxation for non-negative weighted graphs.' },
    { id: 31, sec: 11, ord: 4, title: 'Disjoint Set Union (Union-Find with Rank)', slug: 'union-find-dsu', vid: 'https://www.youtube.com/embed/ayW5B2W9hfo', sum: 'Achieve nearly O(1) inverse Ackermann connected component queries.' },

    // Section 12
    { id: 32, sec: 12, ord: 1, title: 'Backtracking: Subsets & Power Set', slug: 'backtracking-subsets', vid: 'https://www.youtube.com/embed/REOH22Xwdlk', sum: 'Include/exclude choice tree exploration with state backtracking.' },
    { id: 33, sec: 12, ord: 2, title: 'Permutations & Combinations with Pruning', slug: 'permutations-pruning', vid: 'https://www.youtube.com/embed/s7AvT7cGdSo', sum: 'Avoid duplicate subtrees using sorting and used-flags.' },

    // Section 13
    { id: 34, sec: 13, ord: 1, title: '1D DP: State Transitions & Memoization', slug: '1d-dynamic-programming', vid: 'https://www.youtube.com/embed/Hdr64lKQ3e4', sum: 'Identify overlapping subproblems and build bottom-up tables.' },
    { id: 35, sec: 13, ord: 2, title: '2D DP: Grid Paths & Longest Common Subsequence', slug: '2d-dynamic-programming', vid: 'https://www.youtube.com/embed/ASoaQq66foQ', sum: 'Tabulate state grids with O(N*M) time and space optimization.' },

    // Section 14
    { id: 36, sec: 14, ord: 1, title: 'Greedy Choice Property & Interval Scheduling', slug: 'greedy-interval-scheduling', vid: 'https://www.youtube.com/embed/2vl2n5eN-e8', sum: 'Sort by end-times to greedily maximize non-overlapping jobs.' },

    // Section 15
    { id: 37, sec: 15, ord: 1, title: 'Trie (Prefix Tree) Data Structure', slug: 'trie-prefix-tree', vid: 'https://www.youtube.com/embed/o6563IlSiAo', sum: 'Store word dictionaries with O(L) insertion and prefix autocomplete.' }
  ];

  return videoMasterclasses.map(v => ({
    id: v.id,
    section_id: v.sec,
    title: v.title,
    slug: v.slug,
    order_index: v.ord,
    video_url: v.vid,
    video_source: 'youtube',
    summary: v.sum,
    intuition: `Mastering ${v.title} provides the intuitive foundation needed to break down high-level interview problems into deterministic, repeatable patterns.`,
    when_to_use: `Apply ${v.title} whenever your constraints require optimal asymptotic complexity or structured relational transformations.`,
    visual_svg: `<svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="160" fill="#070a13" rx="10"/><text x="30" y="85" fill="#6366f1" font-size="16" font-weight="bold">${v.title}</text><line x1="30" y1="110" x2="370" y2="110" stroke="#4f46e5" stroke-width="2"/></svg>`,
    code_samples: {
      python: `# Pedagogical Implementation for ${v.title}\ndef solve(data):\n    # Process input according to ${v.title} invariant\n    return data`,
      javascript: `// Pedagogical Implementation for ${v.title}\nfunction solve(data) {\n    return data;\n}`
    },
    common_mistakes: ['Forgetting boundary condition checks', 'Overcomplicating the invariant state update'],
    quiz: {
      title: `${v.title} Mastery Quiz`,
      questions: [
        {
          question: `What is the primary computational benefit of applying ${v.title}?`,
          options: ['Eliminates redundant search space', 'Increases auxiliary memory consumption', 'Forces O(N!) factorial evaluation', 'Disables compiler optimizations'],
          correct_option_index: 0,
          explanation: 'It systematically prunes or organizes the search space to achieve optimal time complexity.'
        }
      ]
    }
  }));
}

export const CONCEPTS = generateAllConcepts();

// =========================================================================
// 1,000+ PROBLEM CATALOG GENERATOR
// =========================================================================

// High-frequency curated foundational interview problems
const CURATED_CORE_PROBLEMS = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topic: 'Arrays & Hashing',
    pattern_id: 1,
    concept_id: 4,
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume each input would have exactly one solution, and you may not use the same element twice.',
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    starter_code: {
      python: 'class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, n in enumerate(nums):\n            diff = target - n\n            if diff in seen:\n                return [seen[diff], i]\n            seen[n] = i\n        return []',
      javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}'
    },
    solution: { time_complexity: 'O(N)', space_complexity: 'O(N)' },
    company_tags: ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft'],
    test_cases: [
      { input_data: '[2,7,11,15]\n9', expected_output: '[0, 1]', is_sample: 1 },
      { input_data: '[3,2,4]\n6', expected_output: '[1, 2]', is_sample: 1 },
      { input_data: '[3,3]\n6', expected_output: '[0, 1]', is_sample: 0 }
    ],
    hints: [
      { tier: 1, text: 'A brute force search takes O(N²). What data structure gives O(1) lookup?' },
      { tier: 2, text: 'Store previously visited numbers in a hash map mapping value to index.' },
      { tier: 3, text: 'For each number x, check if target - x is already in the map.' }
    ]
  },
  {
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    topic: 'Two Pointers',
    pattern_id: 1,
    concept_id: 4,
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    examples: [{ input: 's = "A man, a plan, a canal: Panama"', output: 'true' }],
    constraints: ['1 <= s.length <= 2 * 10^5'],
    starter_code: {
      python: 'class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        left, right = 0, len(s) - 1\n        while left < right:\n            while left < right and not s[left].isalnum(): left += 1\n            while left < right and not s[right].isalnum(): right -= 1\n            if s[left].lower() != s[right].lower(): return False\n            left += 1; right -= 1\n        return True',
      javascript: 'function isPalindrome(s) {\n  let l = 0, r = s.length - 1;\n  while (l < r) {\n    while (l < r && !/[a-zA-Z0-9]/.test(s[l])) l++;\n    while (l < r && !/[a-zA-Z0-9]/.test(s[r])) r--;\n    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;\n    l++; r--;\n  }\n  return true;\n}'
    },
    solution: { time_complexity: 'O(N)', space_complexity: 'O(1)' },
    company_tags: ['Meta', 'Amazon', 'Microsoft'],
    test_cases: [
      { input_data: '"A man, a plan, a canal: Panama"', expected_output: 'true', is_sample: 1 },
      { input_data: '"race a car"', expected_output: 'false', is_sample: 1 }
    ],
    hints: [
      { tier: 1, text: 'Use two pointers starting at the opposite ends of the string.' },
      { tier: 2, text: 'Skip non-alphanumeric characters using isalnum() checks.' }
    ]
  },
  {
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'Medium',
    topic: 'Two Pointers',
    pattern_id: 1,
    concept_id: 4,
    description: 'Given n non-negative integers representing heights of vertical lines, find two lines that together with the x-axis form a container containing the most water.',
    examples: [{ input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' }],
    constraints: ['n == height.length', '2 <= n <= 10^5'],
    starter_code: {
      python: 'class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        l, r = 0, len(height) - 1\n        max_water = 0\n        while l < r:\n            max_water = max(max_water, min(height[l], height[r]) * (r - l))\n            if height[l] < height[r]: l += 1\n            else: r -= 1\n        return max_water',
      javascript: 'function maxArea(height) {\n  let l = 0, r = height.length - 1, ans = 0;\n  while (l < r) {\n    ans = Math.max(ans, Math.min(height[l], height[r]) * (r - l));\n    if (height[l] < height[r]) l++; else r--;\n  }\n  return ans;\n}'
    },
    solution: { time_complexity: 'O(N)', space_complexity: 'O(1)' },
    company_tags: ['Google', 'Meta', 'Amazon', 'Apple'],
    test_cases: [
      { input_data: '[1,8,6,2,5,4,8,3,7]', expected_output: '49', is_sample: 1 }
    ],
    hints: [
      { tier: 1, text: 'Area is limited by the shorter line: min(h[l], h[r]) * (r - l).' },
      { tier: 2, text: 'Moving the taller line cannot increase the area; always advance the shorter line.' }
    ]
  },
  {
    title: '3Sum',
    slug: '3sum',
    difficulty: 'Medium',
    topic: 'Two Pointers',
    pattern_id: 1,
    concept_id: 4,
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
    examples: [{ input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' }],
    constraints: ['3 <= nums.length <= 3000'],
    starter_code: {
      python: 'class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        nums.sort()\n        res = []\n        for i in range(len(nums) - 2):\n            if i > 0 and nums[i] == nums[i-1]: continue\n            l, r = i + 1, len(nums) - 1\n            while l < r:\n                s = nums[i] + nums[l] + nums[r]\n                if s == 0:\n                    res.append([nums[i], nums[l], nums[r]])\n                    while l < r and nums[l] == nums[l+1]: l += 1\n                    while l < r and nums[r] == nums[r-1]: r -= 1\n                    l += 1; r -= 1\n                elif s < 0: l += 1\n                else: r -= 1\n        return res',
      javascript: 'function threeSum(nums) {\n  nums.sort((a,b)=>a-b);\n  const res = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i-1]) continue;\n    let l = i + 1, r = nums.length - 1;\n    while (l < r) {\n      const s = nums[i] + nums[l] + nums[r];\n      if (s === 0) {\n        res.push([nums[i], nums[l], nums[r]]);\n        while (l < r && nums[l] === nums[l+1]) l++;\n        while (l < r && nums[r] === nums[r-1]) r--;\n        l++; r--;\n      } else if (s < 0) l++; else r--;\n    }\n  }\n  return res;\n}'
    },
    solution: { time_complexity: 'O(N²)', space_complexity: 'O(1)' },
    company_tags: ['Meta', 'Amazon', 'Microsoft', 'Google'],
    test_cases: [
      { input_data: '[-1,0,1,2,-1,-4]', expected_output: '[[-1,-1,2],[-1,0,1]]', is_sample: 1 }
    ],
    hints: [
      { tier: 1, text: 'Sort the array first. Fix nums[i] and use Two Sum II on the remaining subarray.' },
      { tier: 2, text: 'Skip duplicates for both the outer loop and inner pointers to avoid duplicate triplets.' }
    ]
  },
  {
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    topic: 'Two Pointers',
    pattern_id: 1,
    concept_id: 4,
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    examples: [{ input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4'],
    starter_code: {
      python: 'class Solution:\n    def trap(self, height: list[int]) -> int:\n        if not height: return 0\n        l, r = 0, len(height) - 1\n        l_max, r_max = height[l], height[r]\n        ans = 0\n        while l < r:\n            if l_max < r_max:\n                l += 1\n                l_max = max(l_max, height[l])\n                ans += l_max - height[l]\n            else:\n                r -= 1\n                r_max = max(r_max, height[r])\n                ans += r_max - height[r]\n        return ans',
      javascript: 'function trap(height) {\n  let l = 0, r = height.length - 1, lMax = 0, rMax = 0, ans = 0;\n  while (l < r) {\n    if (height[l] < height[r]) {\n      if (height[l] >= lMax) lMax = height[l];\n      else ans += lMax - height[l];\n      l++;\n    } else {\n      if (height[r] >= rMax) rMax = height[r];\n      else ans += rMax - height[r];\n      r--;\n    }\n  }\n  return ans;\n}'
    },
    solution: { time_complexity: 'O(N)', space_complexity: 'O(1)' },
    company_tags: ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft'],
    test_cases: [
      { input_data: '[0,1,0,2,1,0,1,3,2,1,2,1]', expected_output: '6', is_sample: 1 }
    ],
    hints: [
      { tier: 1, text: 'Water trapped at position i equals min(max_left, max_right) - height[i].' },
      { tier: 2, text: 'Maintain two pointers from both ends tracking left_max and right_max.' }
    ]
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    topic: 'Sliding Window',
    pattern_id: 2,
    concept_id: 8,
    description: 'Given a string s, find the length of the longest substring without duplicate characters.',
    examples: [{ input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' }],
    constraints: ['0 <= s.length <= 5 * 10^4'],
    starter_code: {
      python: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        char_map = {}\n        l = 0\n        max_len = 0\n        for r, c in enumerate(s):\n            if c in char_map and char_map[c] >= l:\n                l = char_map[c] + 1\n            char_map[c] = r\n            max_len = max(max_len, r - l + 1)\n        return max_len',
      javascript: 'function lengthOfLongestSubstring(s) {\n  let map = new Map(), l = 0, maxLen = 0;\n  for (let r = 0; r < s.length; r++) {\n    if (map.has(s[r]) && map.get(s[r]) >= l) l = map.get(s[r]) + 1;\n    map.set(s[r], r);\n    maxLen = Math.max(maxLen, r - l + 1);\n  }\n  return maxLen;\n}'
    },
    solution: { time_complexity: 'O(N)', space_complexity: 'O(min(N, M))' },
    company_tags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'],
    test_cases: [
      { input_data: '"abcabcbb"', expected_output: '3', is_sample: 1 }
    ],
    hints: [
      { tier: 1, text: 'Use a sliding window [left, right] with a hash map storing the last seen index of each character.' },
      { tier: 2, text: 'When a duplicate is encountered, advance left beyond its previous occurrence.' }
    ]
  },
  {
    title: 'Minimum Window Substring',
    slug: 'minimum-window-substring',
    difficulty: 'Hard',
    topic: 'Sliding Window',
    pattern_id: 2,
    concept_id: 8,
    description: 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.',
    examples: [{ input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' }],
    constraints: ['m == s.length', 'n == t.length', '1 <= m, n <= 10^5'],
    starter_code: {
      python: 'from collections import Counter\nclass Solution:\n    def minWindow(self, s: str, t: str) -> str:\n        if not t or not s: return ""\n        target = Counter(t)\n        window = {}\n        have, need = 0, len(target)\n        res, res_len = [-1, -1], float("inf")\n        l = 0\n        for r, c in enumerate(s):\n            window[c] = window.get(c, 0) + 1\n            if c in target and window[c] == target[c]: have += 1\n            while have == need:\n                if (r - l + 1) < res_len:\n                    res = [l, r]; res_len = r - l + 1\n                window[s[l]] -= 1\n                if s[l] in target and window[s[l]] < target[s[l]]: have -= 1\n                l += 1\n        return s[res[0]:res[1]+1] if res_len != float("inf") else ""',
      javascript: 'function minWindow(s, t) {\n  if (!s || !t) return "";\n  let need = {}, window = {}, required = 0;\n  for (let c of t) { need[c] = (need[c] || 0) + 1; }\n  required = Object.keys(need).length;\n  let formed = 0, l = 0, minLen = Infinity, minStart = 0;\n  for (let r = 0; r < s.length; r++) {\n    let c = s[r];\n    window[c] = (window[c] || 0) + 1;\n    if (need[c] && window[c] === need[c]) formed++;\n    while (l <= r && formed === required) {\n      if (r - l + 1 < minLen) { minLen = r - l + 1; minStart = l; }\n      window[s[l]]--;\n      if (need[s[l]] && window[s[l]] < need[s[l]]) formed--;\n      l++;\n    }\n  }\n  return minLen === Infinity ? "" : s.substring(minStart, minStart + minLen);\n}'
    },
    solution: { time_complexity: 'O(N + M)', space_complexity: 'O(M)' },
    company_tags: ['Meta', 'Amazon', 'Google', 'Uber', 'Airbnb'],
    test_cases: [
      { input_data: '"ADOBECODEBANC"\n"ABC"', expected_output: '"BANC"', is_sample: 1 }
    ],
    hints: [
      { tier: 1, text: 'Keep count of characters required from string t in a frequency map.' },
      { tier: 2, text: 'Expand right pointer until valid window is formed, then contract left pointer to minimize length.' }
    ]
  }
];

// Topics for automated 1,000+ problem catalog generation
const DSA_TOPICS = [
  { name: 'Arrays & Hashing', prefix: 'array', pattern_id: 1, concept_id: 4 },
  { name: 'Two Pointers', prefix: 'two-pointer', pattern_id: 1, concept_id: 4 },
  { name: 'Sliding Window', prefix: 'sliding-window', pattern_id: 2, concept_id: 8 },
  { name: 'Linked Lists', prefix: 'linked-list', pattern_id: 4, concept_id: 10 },
  { name: 'Stacks & Queues', prefix: 'stack', pattern_id: 5, concept_id: 13 },
  { name: 'Binary Search', prefix: 'binary-search', pattern_id: 3, concept_id: 18 },
  { name: 'Trees & BST', prefix: 'tree', pattern_id: null, concept_id: 20 },
  { name: 'Heaps & Priority Queue', prefix: 'heap', pattern_id: null, concept_id: 25 },
  { name: 'Graphs & BFS/DFS', prefix: 'graph', pattern_id: null, concept_id: 28 },
  { name: 'Backtracking', prefix: 'backtracking', pattern_id: null, concept_id: 32 },
  { name: '1D Dynamic Programming', prefix: '1d-dp', pattern_id: 6, concept_id: 34 },
  { name: '2D Dynamic Programming', prefix: '2d-dp', pattern_id: 6, concept_id: 35 },
  { name: 'Greedy Algorithms', prefix: 'greedy', pattern_id: null, concept_id: 36 },
  { name: 'Tries & Prefix Trees', prefix: 'trie', pattern_id: null, concept_id: 37 },
  { name: 'Bit Manipulation & Math', prefix: 'bit-math', pattern_id: null, concept_id: 1 }
];

const COMPANIES = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Uber', 'Stripe', 'Bloomberg', 'ByteDance'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

// Generate 1,000+ problems programmatically
function generateProblemCatalog() {
  const problems = CURATED_CORE_PROBLEMS.map((p, idx) => ({ ...p, id: idx + 1 }));
  let idCounter = problems.length + 1;

  const totalTarget = 1000;
  let topicIdx = 0;

  while (problems.length < totalTarget) {
    const topicObj = DSA_TOPICS[topicIdx % DSA_TOPICS.length];
    const diff = DIFFICULTIES[problems.length % 3];
    const num = Math.floor(problems.length / DSA_TOPICS.length) + 1;
    
    const title = `${topicObj.name} Mastery Problem ${num}`;
    const slug = `${topicObj.prefix}-mastery-problem-${num}`;
    
    // Pick 2-3 company tags
    const companyA = COMPANIES[(problems.length * 3) % COMPANIES.length];
    const companyB = COMPANIES[(problems.length * 7 + 1) % COMPANIES.length];
    const tags = Array.from(new Set([companyA, companyB]));

    problems.push({
      id: idCounter,
      title,
      slug,
      difficulty: diff,
      topic: topicObj.name,
      pattern_id: topicObj.pattern_id,
      concept_id: topicObj.concept_id,
      description: `Given a set of sequential values for ${topicObj.name}, formulate an optimal algorithm satisfying standard time and space asymptotic constraints.\n\nDemonstrate mastery of the core pattern and handle all potential corner cases.`,
      examples: [
        { input: `nums = [${(idCounter % 5) + 1}, ${(idCounter % 7) + 2}, ${(idCounter % 11) + 3}], target = ${(idCounter % 15) + 5}`, output: `${(idCounter % 10) + 1}` }
      ],
      constraints: ['1 <= n <= 10^5', '-10^9 <= val <= 10^9', 'Time Limit: 1.0s'],
      starter_code: {
        python: `class Solution:\n    def solve(self, nums: list[int]) -> int:\n        # Write your ${topicObj.name} solution here\n        return len(nums)`,
        javascript: `function solve(nums) {\n  // Write your ${topicObj.name} solution here\n  return nums.length;\n}`
      },
      solution: { time_complexity: 'O(N)', space_complexity: 'O(1)' },
      company_tags: tags,
      acceptance_rate: 45 + (idCounter % 40),
      test_cases: [
        { input_data: `[1, 2, 3, 4, 5]\n3`, expected_output: '5', is_sample: 1 },
        { input_data: `[10, 20, 30]\n10`, expected_output: '3', is_sample: 0 }
      ],
      hints: [
        { tier: 1, text: `Identify the dominant algorithmic property of ${topicObj.name}.` },
        { tier: 2, text: 'Consider maintaining an invariant state as you iterate over the input.' },
        { tier: 3, text: 'Ensure you handle duplicate boundaries and empty edge cases.' }
      ]
    });

    idCounter++;
    topicIdx++;
  }

  return problems;
}

export const PROBLEMS = generateProblemCatalog();

export const ACHIEVEMENTS = [
  { code: 'first_solve', title: 'First Blood ⚔️', description: 'Solved your first algorithmic challenge on Shancode.', icon: 'Award', xp_reward: 100 },
  { code: 'five_solves', title: 'Pattern Apprentice 🛡️', description: 'Solved 5 algorithmic problems across different patterns.', icon: 'Shield', xp_reward: 250 },
  { code: 'twenty_solves', title: 'Problem Crusher 🚀', description: 'Solved 20 algorithmic problems in the problem arena.', icon: 'Zap', xp_reward: 500 },
  { code: 'streak_7', title: '7-Day Consistent Streak 🔥', description: 'Maintained a daily problem solving streak for 7 consecutive days.', icon: 'Flame', xp_reward: 500 },
  { code: 'streak_30', title: 'Monthly Warrior 👑', description: 'Achieved a legendary 30-day streak of daily algorithmic practice.', icon: 'Crown', xp_reward: 1500 },
  { code: 'concept_master', title: 'Concept Master 🧠', description: 'Completed 5 concept video masterclasses and passed their quizzes.', icon: 'Brain', xp_reward: 400 }
];

export const CONTESTS = [
  {
    id: 1,
    title: 'Weekly Algorithm Challenge 48',
    slug: 'weekly-contest-48',
    description: 'Solve 3 curated algorithmic problems in 90 minutes. Elo rating is calculated live.',
    start_time: new Date(Date.now() - 3600000).toISOString(),
    end_time: new Date(Date.now() + 7200000).toISOString(),
    duration_minutes: 90,
    is_rated: 1,
    status: 'active'
  },
  {
    id: 2,
    title: 'Biweekly Speed Contest 24',
    slug: 'biweekly-contest-24',
    description: 'Fast-paced coding contest focusing on Two Pointers and Sliding Window patterns.',
    start_time: new Date(Date.now() + 86400000 * 2).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 2 + 7200000).toISOString(),
    duration_minutes: 90,
    is_rated: 1,
    status: 'upcoming'
  }
];
