export const SECTIONS = [
  { id: 1, title: '1. Programming Basics & Complexity', slug: 'basics-complexity', icon: 'Code', description: 'Big-O notation, time and space complexity, memory models, recursion fundamentals.', order_index: 1 },
  { id: 2, title: '2. Arrays & Memory Buffers', slug: 'arrays', icon: 'Layers', description: 'Contiguous memory, prefix sums, two pointers, and difference arrays.', order_index: 2 },
  { id: 3, title: '3. Strings & Character Encodings', slug: 'strings', icon: 'Type', description: 'String immutability, pattern matching, sliding window, and anagram frequency hashing.', order_index: 3 },
  { id: 4, title: '4. Linked Lists', slug: 'linked-lists', icon: 'Link', description: 'Singly, doubly, circular lists, fast & slow pointers, reversal, and cycle detection.', order_index: 4 },
  { id: 5, title: '5. Stacks & Queues', slug: 'stacks-queues', icon: 'Server', description: 'LIFO & FIFO mechanics, monotonic stacks, parenthesis matching, and sliding window maximum.', order_index: 5 },
  { id: 6, title: '6. Hashing & Hash Tables', slug: 'hashing', icon: 'Hash', description: 'Direct address tables, collision resolution, hash maps, hash sets, and rolling hashes.', order_index: 6 },
  { id: 7, title: '7. Binary Search & Search Space', slug: 'binary-search', icon: 'Search', description: 'Divide-and-conquer on sorted inputs, search space monotonic predicates, lower/upper bounds.', order_index: 7 },
  { id: 8, title: '8. Trees & Tree Traversals', slug: 'trees', icon: 'GitBranch', description: 'Binary trees, BFS level-order, DFS pre/in/post-order, lowest common ancestors, tree diameter.', order_index: 8 },
  { id: 9, title: '9. Binary Search Trees', slug: 'binary-search-trees', icon: 'GitCommit', description: 'BST invariant properties, validation, search, insertion, deletion, and balancing.', order_index: 9 },
  { id: 10, title: '10. Heaps & Priority Queues', slug: 'heaps', icon: 'ChevronsUp', description: 'Binary heaps, min/max heap invariants, Top-K elements, and continuous median streams.', order_index: 10 },
  { id: 11, title: '11. Graphs & Connectivity', slug: 'graphs', icon: 'Share2', description: 'Adjacency lists/matrices, BFS, DFS, topological sort, Dijkstra shortest path, and cycle detection.', order_index: 11 },
  { id: 12, title: '12. Recursion & Backtracking', slug: 'backtracking', icon: 'RotateCcw', description: 'State space tree exploration, pruning, subsets, permutations, N-Queens, and Sudoku.', order_index: 12 },
  { id: 13, title: '13. Dynamic Programming (1D & 2D)', slug: 'dynamic-programming', icon: 'Cpu', description: 'Overlapping subproblems, optimal substructure, memoization, bottom-up tabulation, space optimization.', order_index: 13 },
  { id: 14, title: '14. Greedy Algorithms', slug: 'greedy', icon: 'TrendingUp', description: 'Locally optimal choices, interval scheduling, Huffman coding, jump games.', order_index: 14 },
  { id: 15, title: '15. Advanced DSA & Trie', slug: 'advanced-dsa', icon: 'Zap', description: 'Prefix trees (Trie), Union-Find (Disjoint Set Union with path compression), and Segment Trees.', order_index: 15 }
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
      { level_number: 1, title: 'Foundation', required_count: 2, difficulty: 'Easy' },
      { level_number: 2, title: 'Opposite Ends Drill', required_count: 3, difficulty: 'Easy' },
      { level_number: 3, title: 'Triplets & Intervals', required_count: 3, difficulty: 'Medium' },
      { level_number: 4, title: 'Subarray Mastery', required_count: 2, difficulty: 'Hard' }
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
      { level_number: 2, title: 'Dynamic Subarrays', required_count: 3, difficulty: 'Medium' },
      { level_number: 3, title: 'Character Frequencies', required_count: 3, difficulty: 'Medium' },
      { level_number: 4, title: 'Hard Substring Minimums', required_count: 2, difficulty: 'Hard' }
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
      { level_number: 2, title: 'Rotated Arrays', required_count: 3, difficulty: 'Medium' },
      { level_number: 3, title: 'Capacity & Speed', required_count: 3, difficulty: 'Medium' },
      { level_number: 4, title: 'Median of Arrays', required_count: 2, difficulty: 'Hard' }
    ]
  },
  {
    id: 4,
    name: 'Monotonic Stack',
    slug: 'monotonic-stack',
    description: 'Maintaining strictly increasing or decreasing elements for Next Greater Element in O(N).',
    total_levels: 4,
    icon: 'BarChart2',
    levels: [
      { level_number: 1, title: 'Next Greater Element', required_count: 2, difficulty: 'Easy' },
      { level_number: 2, title: 'Daily Temperatures', required_count: 2, difficulty: 'Medium' },
      { level_number: 3, title: 'Histogram Area', required_count: 2, difficulty: 'Hard' },
      { level_number: 4, title: 'Maximal Rectangle', required_count: 2, difficulty: 'Hard' }
    ]
  },
  {
    id: 5,
    name: 'Graph Traversal (BFS / DFS)',
    slug: 'graph-traversal',
    description: 'Exploration of vertices, cycle detection, connected components, and topological ordering.',
    total_levels: 4,
    icon: 'Share2',
    levels: [
      { level_number: 1, title: 'Grid Flood Fill', required_count: 2, difficulty: 'Easy' },
      { level_number: 2, title: 'Number of Islands', required_count: 3, difficulty: 'Medium' },
      { level_number: 3, title: 'Course Schedule & Topo', required_count: 3, difficulty: 'Medium' },
      { level_number: 4, title: 'Word Ladder & Shortest Paths', required_count: 2, difficulty: 'Hard' }
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
      { level_number: 1, title: 'Fibonacci & Stairs', required_count: 2, difficulty: 'Easy' },
      { level_number: 2, title: 'House Robber & Jumps', required_count: 3, difficulty: 'Medium' },
      { level_number: 3, title: 'Coin Change & Subsets', required_count: 3, difficulty: 'Medium' },
      { level_number: 4, title: 'Edit Distance & Stocks', required_count: 2, difficulty: 'Hard' }
    ]
  }
];

export const CONCEPTS = [
  {
    id: 1,
    section_id: 1,
    title: 'Time & Space Complexity (Big-O)',
    slug: 'time-space-complexity',
    order_index: 1,
    video_url: 'https://www.youtube.com/embed/g2o22C3CRfU',
    video_source: 'youtube',
    summary: 'Master how to evaluate algorithmic asymptotic growth, CPU step counts, and memory allocations.',
    intuition: 'Big-O describes how the execution time or memory footprint scales as input size N grows toward infinity. We discard constants and lower-order terms to focus on dominant bottlenecks.',
    when_to_use: 'Use before writing any code to predict whether your approach will pass within execution limits (usually 10^8 operations per second in standard judges).',
    visual_svg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto text-indigo-400">
      <path d="M 40 160 L 360 160" stroke="#4b5563" stroke-width="2"/>
      <path d="M 40 160 L 40 20" stroke="#4b5563" stroke-width="2"/>
      <path d="M 40 160 Q 200 155 360 145" stroke="#10b981" stroke-width="3" fill="none"/>
      <path d="M 40 160 L 360 40" stroke="#6366f1" stroke-width="3" fill="none"/>
      <path d="M 40 160 Q 180 140 240 20" stroke="#ef4444" stroke-width="3" fill="none"/>
      <text x="365" y="145" fill="#10b981" font-size="12">O(log N)</text>
      <text x="365" y="40" fill="#6366f1" font-size="12">O(N)</text>
      <text x="245" y="25" fill="#ef4444" font-size="12">O(N²)</text>
    </svg>`,
    code_samples: {
      python: `# O(1) Constant Time
def get_first(arr):
    return arr[0] if arr else None

# O(N) Linear Time
def find_sum(arr):
    total = 0
    for x in arr:
        total += x
    return total

# O(N^2) Quadratic Time
def find_pairs(arr):
    pairs = []
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            pairs.append((arr[i], arr[j]))
    return pairs`,
      javascript: `// O(1) Constant
function getFirst(arr) {
  return arr[0] ?? null;
}

// O(N) Linear
function findSum(arr) {
  return arr.reduce((acc, curr) => acc + curr, 0);
}

// O(N^2) Quadratic
function findPairs(arr) {
  const pairs = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]]);
    }
  }
  return pairs;
}`,
      cpp: `#include <vector>

int getFirst(const std::vector<int>& arr) {
    return arr.empty() ? -1 : arr[0]; // O(1)
}

int findSum(const std::vector<int>& arr) {
    int total = 0;
    for (int x : arr) total += x; // O(N)
    return total;
}`,
      java: `public class Complexity {
    public static int getFirst(int[] arr) {
        return arr.length == 0 ? -1 : arr[0]; // O(1)
    }
    
    public static int findSum(int[] arr) {
        int total = 0;
        for (int x : arr) total += x; // O(N)
        return total;
    }
}`
    },
    common_mistakes: [
      'Assuming that a loop running up to a constant like 1000 is O(N) — it is actually O(1).',
      'Ignoring auxiliary stack memory in recursive calls (recursion depth contributes to Space Complexity).',
      'Forgetting that string concatenation inside a loop can be O(N^2) due to string immutability in languages like Java/Python.'
    ],
    quiz: {
      title: 'Time & Space Complexity Check',
      questions: [
        {
          question: 'What is the time complexity of binary search on a sorted array of size N?',
          options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
          correct_option_index: 1,
          explanation: 'Binary search halves the search range at each iteration, giving logarithmic time O(log N).'
        },
        {
          question: 'If an algorithm uses a 2D matrix of dimensions N x N, what is its auxiliary space complexity?',
          options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(1)'],
          correct_option_index: 2,
          explanation: 'An N x N matrix allocates N^2 elements in memory, yielding O(N^2) space complexity.'
        }
      ]
    }
  },
  {
    id: 2,
    section_id: 2,
    title: 'Two Pointer Technique',
    slug: 'two-pointer-technique',
    order_index: 1,
    video_url: 'https://www.youtube.com/embed/On03HWe2tZM',
    video_source: 'youtube',
    summary: 'Use two converging or coordinated indices to reduce nested O(N^2) loops into single-pass O(N) operations.',
    intuition: 'When dealing with sorted arrays or palindromic sequences, testing all pairs (i, j) naively takes O(N^2). By comparing elements at the opposite ends (left and right), we can make a deterministic decision to increment left (if sum is too small) or decrement right (if sum is too large), eliminating half of the redundant pair combinations.',
    when_to_use: 'Use when the array is sorted, or when searching for pairs that satisfy a sum/difference condition, or checking palindromes and reversing arrays in-place.',
    visual_svg: `<svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
      <rect x="20" y="30" width="50" height="40" rx="6" fill="#1e293b" stroke="#6366f1" stroke-width="2"/>
      <text x="45" y="55" fill="#f8fafc" font-size="16" text-anchor="middle">2</text>
      <rect x="80" y="30" width="50" height="40" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1"/>
      <text x="105" y="55" fill="#f8fafc" font-size="16" text-anchor="middle">7</text>
      <rect x="140" y="30" width="50" height="40" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1"/>
      <text x="165" y="55" fill="#f8fafc" font-size="16" text-anchor="middle">11</text>
      <rect x="200" y="30" width="50" height="40" rx="6" fill="#1e293b" stroke="#6366f1" stroke-width="2"/>
      <text x="225" y="55" fill="#f8fafc" font-size="16" text-anchor="middle">15</text>
      <text x="45" y="95" fill="#10b981" font-size="13" text-anchor="middle">Left →</text>
      <text x="225" y="95" fill="#ef4444" font-size="13" text-anchor="middle">← Right</text>
    </svg>`,
    code_samples: {
      python: `def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left + 1, right + 1] # 1-indexed
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
      javascript: `function twoSumSorted(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [];
}`,
      cpp: `#include <vector>

std::vector<int> twoSumSorted(const std::vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return {left + 1, right + 1};
        else if (sum < target) left++;
        else right--;
    }
    return {};
}`,
      java: `public class TwoPointer {
    public static int[] twoSumSorted(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int sum = nums[left] + nums[right];
            if (sum == target) return new int[]{left + 1, right + 1};
            else if (sum < target) left++;
            else right--;
        }
        return new int[]{};
    }
}`
    },
    common_mistakes: [
      'Applying two pointers on an unsorted array without sorting first.',
      'Using `left <= right` instead of `left < right` when pairing two distinct elements (which could reuse the same element).',
      'Forgetting to handle duplicate elements when finding triplets (3Sum).'
    ],
    quiz: {
      title: 'Two Pointer Mastery Quiz',
      questions: [
        {
          question: 'When can two pointers from opposite ends guarantee finding a target sum in O(N)?',
          options: ['Any random array', 'Only when the array is sorted', 'Only when all numbers are positive', 'Only for arrays of even length'],
          correct_option_index: 1,
          explanation: 'The monotonic property of a sorted array ensures that incrementing left increases the sum and decrementing right decreases the sum.'
        },
        {
          question: 'What is the auxiliary space complexity of the Two Pointer approach?',
          options: ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'],
          correct_option_index: 1,
          explanation: 'Two pointers only require two integer variables (left, right), running in O(1) space.'
        }
      ]
    }
  },
  {
    id: 3,
    section_id: 2,
    title: 'Prefix Sum & Range Queries',
    slug: 'prefix-sum',
    order_index: 2,
    video_url: 'https://www.youtube.com/embed/scD3KsKMrgk',
    video_source: 'youtube',
    summary: 'Precompute cumulative sums to answer any subarray sum query [L, R] in instant O(1) time.',
    intuition: 'Instead of summing elements between indices L and R repeatedly (costing O(N) per query), precalculate prefix[i] = nums[0] + ... + nums[i]. Then the sum of any range [L, R] is simply prefix[R] - prefix[L - 1].',
    when_to_use: 'Use when you have multiple range sum queries, or need to count subarrays with a specific target sum K using a hash map in O(N) total time.',
    visual_svg: `<svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
      <rect x="20" y="20" width="360" height="35" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
      <text x="50" y="42" fill="#94a3b8" font-size="12">nums: [ 3, 1, 4, 1, 5 ]</text>
      <rect x="20" y="65" width="360" height="35" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
      <text x="50" y="87" fill="#10b981" font-size="12">prefix: [ 0, 3, 4, 8, 9, 14 ]</text>
    </svg>`,
    code_samples: {
      python: `class NumArray:
    def __init__(self, nums):
        self.prefix = [0] * (len(nums) + 1)
        for i in range(len(nums)):
            self.prefix[i + 1] = self.prefix[i] + nums[i]

    def sumRange(self, left, right):
        return self.prefix[right + 1] - self.prefix[left]`,
      javascript: `class NumArray {
  constructor(nums) {
    this.prefix = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
      this.prefix[i + 1] = this.prefix[i] + nums[i];
    }
  }

  sumRange(left, right) {
    return this.prefix[right + 1] - this.prefix[left];
  }
}`,
      cpp: `#include <vector>

class NumArray {
    std::vector<int> prefix;
public:
    NumArray(const std::vector<int>& nums) {
        prefix.resize(nums.size() + 1, 0);
        for (size_t i = 0; i < nums.size(); i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }
    int sumRange(int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
};`,
      java: `public class NumArray {
    private int[] prefix;
    public NumArray(int[] nums) {
        prefix = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }
    public int sumRange(int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
}`
    },
    common_mistakes: [
      'Off-by-one indexing error when accessing prefix array without an initial dummy 0.',
      'Integer overflow when summing large values (use 64-bit long in C++/Java).'
    ],
    quiz: {
      title: 'Prefix Sum Quiz',
      questions: [
        {
          question: 'What is the query time complexity for range sum [L, R] using a precomputed prefix sum array?',
          options: ['O(R - L)', 'O(1)', 'O(log N)', 'O(N)'],
          correct_option_index: 1,
          explanation: 'Range sum queries on a precomputed array require a single subtraction: prefix[R+1] - prefix[L], which executes in O(1).'
        }
      ]
    }
  },
  {
    id: 4,
    section_id: 3,
    title: 'Sliding Window Technique',
    slug: 'sliding-window-technique',
    order_index: 1,
    video_url: 'https://www.youtube.com/embed/MK-NZ4hN7Rs',
    video_source: 'youtube',
    summary: 'Maintain a dynamic continuous subsegment window [L, R] to solve substring/subarray optimization problems in O(N).',
    intuition: 'Instead of recalculating the window content from scratch on every step (O(N^2)), expand the right pointer to include elements, and contract the left pointer only when the window constraint is violated.',
    when_to_use: 'Use when looking for longest/shortest continuous subarrays or substrings meeting a frequency or sum condition (e.g. longest substring without repeating characters).',
    visual_svg: `<svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
      <rect x="30" y="30" width="340" height="45" rx="6" fill="#111827" stroke="#374151" stroke-width="1"/>
      <rect x="70" y="26" width="170" height="53" rx="8" fill="#6366f1" fill-opacity="0.2" stroke="#6366f1" stroke-width="2"/>
      <text x="200" y="105" fill="#a5b4fc" font-size="13" text-anchor="middle">Active Valid Window [Left, Right]</text>
    </svg>`,
    code_samples: {
      python: `def lengthOfLongestSubstring(s):
    char_index = {}
    left = 0
    max_len = 0
    
    for right, ch in enumerate(s):
        if ch in char_index and char_index[ch] >= left:
            left = char_index[ch] + 1
        char_index[ch] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len`,
      javascript: `function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (seen.has(ch) && seen.get(ch) >= left) {
      left = seen.get(ch) + 1;
    }
    seen.set(ch, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      cpp: `#include <string>
#include <vector>
#include <algorithm>

int lengthOfLongestSubstring(std::string s) {
    std::vector<int> charIndex(128, -1);
    int left = 0, maxLen = 0;
    for (int right = 0; right < s.size(); right++) {
        if (charIndex[s[right]] >= left) {
            left = charIndex[s[right]] + 1;
        }
        charIndex[s[right]] = right;
        maxLen = std::max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      java: `import java.util.HashMap;

public class SlidingWindow {
    public int lengthOfLongestSubstring(String s) {
        HashMap<Character, Integer> map = new HashMap<>();
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`
    },
    common_mistakes: [
      'Not updating the left pointer correctly when a repeating character was seen before the current left boundary.',
      'Re-iterating the entire window on every move instead of maintaining incremental frequencies.'
    ],
    quiz: {
      title: 'Sliding Window Check',
      questions: [
        {
          question: 'Why does the sliding window technique run in O(N) total time even though it contains an inner while loop?',
          options: ['Because the while loop never runs', 'Because both the left and right pointers each visit every index at most once', 'Because hashing takes O(log N)', 'Because array indices are cached'],
          correct_option_index: 1,
          explanation: 'Each element is added to the window by the right pointer at most once and removed by the left pointer at most once, bounding total steps to 2N = O(N).'
        }
      ]
    }
  },
  {
    id: 5,
    section_id: 7,
    title: 'Binary Search & Monotonic Predicates',
    slug: 'binary-search-predicates',
    order_index: 1,
    video_url: 'https://www.youtube.com/embed/GU7DpgHINWQ',
    video_source: 'youtube',
    summary: 'Harness binary search not just on sorted arrays, but on monotonic answer spaces (TTTTFFFF).',
    intuition: 'Whenever a problem asks for the "minimum maximum" or "maximum minimum" and has a monotonic feasibility function (if capacity K works, any capacity > K also works), binary search directly on the answer space [low, high] in O(log(range) * cost(check)).',
    when_to_use: 'Koko Eating Bananas, Capacity to Ship Packages Within D Days, Split Array Largest Sum.',
    visual_svg: `<svg viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
      <text x="30" y="30" fill="#10b981" font-size="14">[ True, True, True, </text>
      <text x="180" y="30" fill="#ef4444" font-size="14">False, False, False ]</text>
      <path d="M 170 45 L 170 80" stroke="#f59e0b" stroke-width="2"/>
      <text x="170" y="95" fill="#f59e0b" font-size="12" text-anchor="middle">Boundary: Last True / First False</text>
    </svg>`,
    code_samples: {
      python: `def binary_search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
      javascript: `function binarySearch(nums, target) {
  let low = 0;
  let high = nums.length - 1;
  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
      cpp: `#include <vector>

int binarySearch(const std::vector<int>& nums, int target) {
    int low = 0, high = (int)nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      java: `public class BinarySearch {
    public static int search(int[] nums, int target) {
        int low = 0, high = nums.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}`
    },
    common_mistakes: [
      'Using `(low + high) / 2` which can cause 32-bit integer overflow in languages like C++/Java (use `low + (high - low) / 2`).',
      'Infinite loops caused by updating `low = mid` without integer rounding consideration.'
    ],
    quiz: {
      title: 'Binary Search Essentials',
      questions: [
        {
          question: 'Why is `low + (high - low) / 2` preferred over `(low + high) / 2` in C++/Java?',
          options: ['It runs faster on the CPU', 'It avoids integer overflow when low + high exceeds 2^31 - 1', 'It automatically rounds floats', 'It works on unsorted lists'],
          correct_option_index: 1,
          explanation: 'When low and high are large positive integers, their direct sum can overflow the 32-bit signed integer limit, resulting in negative values.'
        }
      ]
    }
  }
];

export const PROBLEMS = [
  {
    id: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    pattern_id: 1,
    concept_id: 2,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly one solution***, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      { input: '[2, 7, 11, 15]\n9', output: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: '[3, 2, 4]\n6', output: '[1, 2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
      { input: '[3, 3]\n6', output: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].' }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    company_tags: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix'],
    starter_code: {
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your code here
        pass`,
      javascript: `function twoSum(nums, target) {
  // Write your code here
}`,
      cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};`,
      java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`
    },
    solution: {
      intuition: 'A brute force approach checks all pairs in O(N^2). We can optimize to O(N) by storing seen values and their indices in a hash map as we iterate. For each element x, we check if (target - x) exists in the map.',
      algorithm: '1. Initialize an empty hash map seen = {}\n2. Iterate through nums with index i and value num\n3. Calculate complement = target - num\n4. If complement is in seen, return [seen[complement], i]\n5. Otherwise, store seen[num] = i',
      time_complexity: 'O(N) - We traverse the list containing N elements exactly once with O(1) hash map lookups.',
      space_complexity: 'O(N) - The hash map stores up to N elements in memory.',
      code: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`
    },
    hints: [
      { tier: 1, text: 'A naive search takes O(N^2) by checking every pair. Can you find what you need in O(1) time?' },
      { tier: 2, text: 'For each number x, you are looking for target - x. What data structure gives O(1) lookups?' },
      { tier: 3, text: 'Use a Hash Map mapping each value to its index. Check if target - num exists before adding num to the map.' }
    ],
    test_cases: [
      { input_data: '[2, 7, 11, 15]\n9', expected_output: '[0, 1]', is_sample: 1 },
      { input_data: '[3, 2, 4]\n6', expected_output: '[1, 2]', is_sample: 1 },
      { input_data: '[3, 3]\n6', expected_output: '[0, 1]', is_sample: 1 },
      { input_data: '[1, 5, 8, 12, 19]\n20', expected_output: '[0, 4]', is_sample: 0 },
      { input_data: '[-3, 4, 3, 90]\n0', expected_output: '[0, 2]', is_sample: 0 }
    ]
  },
  {
    id: 2,
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    topic: 'Strings',
    pattern_id: 1,
    concept_id: 2,
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` *if it is a palindrome, or* \`false\` *otherwise*.`,
    examples: [
      { input: '"A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: '"race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' },
      { input: '" "', output: 'true', explanation: 's is an empty string "" after removing non-alphanumeric characters.' }
    ],
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    company_tags: ['Meta', 'Amazon', 'Microsoft', 'Google'],
    starter_code: {
      python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Write your code here
        pass`,
      javascript: `function isPalindrome(s) {
  // Write your code here
}`,
      cpp: `#include <string>
#include <cctype>

class Solution {
public:
    bool isPalindrome(std::string s) {
        // Write your code here
        return false;
    }
};`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        // Write your code here
        return false;
    }
}`
    },
    solution: {
      intuition: 'Use two pointers starting at opposite ends of the string. Skip non-alphanumeric characters and compare the lowercased characters.',
      algorithm: '1. Set left = 0, right = len(s) - 1\n2. While left < right, increment left if s[left] is not alphanumeric\n3. Decrement right if s[right] is not alphanumeric\n4. Compare s[left].lower() with s[right].lower(). If unequal, return false\n5. Advance both pointers. If loop completes, return true.',
      time_complexity: 'O(N) - Each character is inspected at most twice.',
      space_complexity: 'O(1) - Pointers operate in-place without copying the string.',
      code: `def isPalindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`
    },
    hints: [
      { tier: 1, text: 'Can you compare characters from both ends without allocating a new string?' },
      { tier: 2, text: 'Use two pointers (left and right) and advance past whitespace/punctuation.' },
      { tier: 3, text: 'Compare characters in lowercase when both pointers land on alphanumeric characters.' }
    ],
    test_cases: [
      { input_data: '"A man, a plan, a canal: Panama"', expected_output: 'true', is_sample: 1 },
      { input_data: '"race a car"', expected_output: 'false', is_sample: 1 },
      { input_data: '" "', expected_output: 'true', is_sample: 1 },
      { input_data: '"0P"', expected_output: 'false', is_sample: 0 },
      { input_data: '"ab_a"', expected_output: 'true', is_sample: 0 }
    ]
  },
  {
    id: 3,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    topic: 'Strings',
    pattern_id: 2,
    concept_id: 4,
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      { input: '"abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: '"bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: '"pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    company_tags: ['Google', 'Amazon', 'Meta', 'Apple', 'Microsoft'],
    starter_code: {
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your code here
        pass`,
      javascript: `function lengthOfLongestSubstring(s) {
  // Write your code here
}`,
      cpp: `#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    int lengthOfLongestSubstring(std::string s) {
        // Write your code here
        return 0;
    }
};`,
      java: `import java.util.HashMap;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
        return 0;
    }
}`
    },
    solution: {
      intuition: 'Maintain a sliding window [left, right] of unique characters. If a character at index right is already in our map and its last position >= left, jump left to last_position + 1.',
      algorithm: '1. seen = map of char -> index\n2. left = 0, max_len = 0\n3. For right from 0 to len(s)-1:\n4.   if s[right] in seen and seen[s[right]] >= left: left = seen[s[right]] + 1\n5.   seen[s[right]] = right\n6.   max_len = max(max_len, right - left + 1)\n7. Return max_len',
      time_complexity: 'O(N) - Right pointer scans string once.',
      space_complexity: 'O(min(N, M)) - M is the alphabet charset size.',
      code: `def lengthOfLongestSubstring(s: str) -> int:
    seen = {}
    left = 0
    max_len = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        max_len = max(max_len, right - left + 1)
    return max_len`
    },
    hints: [
      { tier: 1, text: 'Think about maintaining a sliding window of distinct characters.' },
      { tier: 2, text: 'Store the most recent index where each character appeared.' },
      { tier: 3, text: 'When you encounter a duplicate within the current window, move the left boundary to index + 1.' }
    ],
    test_cases: [
      { input_data: '"abcabcbb"', expected_output: '3', is_sample: 1 },
      { input_data: '"bbbbb"', expected_output: '1', is_sample: 1 },
      { input_data: '"pwwkew"', expected_output: '3', is_sample: 1 },
      { input_data: '""', expected_output: '0', is_sample: 0 },
      { input_data: '"au"', expected_output: '2', is_sample: 0 }
    ]
  },
  {
    id: 4,
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'Medium',
    topic: 'Arrays',
    pattern_id: 1,
    concept_id: 2,
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.`,
    examples: [
      { input: '[1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.' },
      { input: '[1,1]', output: '1', explanation: 'Max area is 1 * 1 = 1.' }
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    company_tags: ['Amazon', 'Google', 'Meta', 'Apple'],
    starter_code: {
      python: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        # Write your code here
        pass`,
      javascript: `function maxArea(height) {
  // Write your code here
}`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int maxArea(std::vector<int>& height) {
        // Write your code here
        return 0;
    }
};`,
      java: `class Solution {
    public int maxArea(int[] height) {
        // Write your code here
        return 0;
    }
}`
    },
    solution: {
      intuition: 'The area is bounded by the shorter line: min(height[left], height[right]) * (right - left). Moving the taller line inward can only decrease the width without increasing the bounded height. Thus, we always move the shorter line inward.',
      algorithm: '1. left = 0, right = len(height) - 1, max_area = 0\n2. While left < right:\n3.   current_area = min(height[left], height[right]) * (right - left)\n4.   max_area = max(max_area, current_area)\n5.   If height[left] < height[right]: left += 1 else: right -= 1\n6. Return max_area',
      time_complexity: 'O(N) - Pointers converge in single pass.',
      space_complexity: 'O(1) - Constant auxiliary space.',
      code: `def maxArea(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_area = 0
    while left < right:
        h = min(height[left], height[right])
        max_area = max(max_area, h * (right - left))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_area`
    },
    hints: [
      { tier: 1, text: 'Start with the widest possible container (indices 0 and n-1).' },
      { tier: 2, text: 'The water volume is limited by the shorter of the two bars.' },
      { tier: 3, text: 'Always move the pointer pointing to the shorter bar inward to try to find a taller line.' }
    ],
    test_cases: [
      { input_data: '[1,8,6,2,5,4,8,3,7]', expected_output: '49', is_sample: 1 },
      { input_data: '[1,1]', expected_output: '1', is_sample: 1 },
      { input_data: '[4,3,2,1,4]', expected_output: '16', is_sample: 0 },
      { input_data: '[1,2,1]', expected_output: '2', is_sample: 0 }
    ]
  },
  {
    id: 5,
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    topic: 'Binary Search',
    pattern_id: 3,
    concept_id: 5,
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      { input: '[-1,0,3,5,9,12]\n9', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: '[-1,0,3,5,9,12]\n2', output: '-1', explanation: '2 does not exist in nums so return -1.' }
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.'
    ],
    company_tags: ['Microsoft', 'Amazon', 'Google', 'Apple'],
    starter_code: {
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        # Write your code here
        pass`,
      javascript: `function search(nums, target) {
  // Write your code here
}`,
      cpp: `#include <vector>

class Solution {
public:
    int search(std::vector<int>& nums, int target) {
        // Write your code here
        return -1;
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your code here
        return -1;
    }
}`
    },
    solution: {
      intuition: 'Since nums is sorted, compare target with middle element nums[mid]. If target is smaller, search left half; if greater, search right half.',
      algorithm: '1. low = 0, high = len(nums) - 1\n2. While low <= high:\n3.   mid = low + (high - low) // 2\n4.   if nums[mid] == target: return mid\n5.   elif nums[mid] < target: low = mid + 1\n6.   else: high = mid - 1\n7. Return -1',
      time_complexity: 'O(log N) - Search space halved on each iteration.',
      space_complexity: 'O(1) - Constant auxiliary space.',
      code: `def search(nums: list[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`
    },
    hints: [
      { tier: 1, text: 'The array is sorted in ascending order.' },
      { tier: 2, text: 'Compute mid = low + (high - low) / 2 to avoid overflow.' },
      { tier: 3, text: 'Adjust low = mid + 1 or high = mid - 1 based on comparison.' }
    ],
    test_cases: [
      { input_data: '[-1,0,3,5,9,12]\n9', expected_output: '4', is_sample: 1 },
      { input_data: '[-1,0,3,5,9,12]\n2', expected_output: '-1', is_sample: 1 },
      { input_data: '[5]\n5', expected_output: '0', is_sample: 0 },
      { input_data: '[2, 5]\n5', expected_output: '1', is_sample: 0 }
    ]
  },
  {
    id: 6,
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    pattern_id: 6,
    concept_id: 1,
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: '2', output: '2', explanation: 'There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps.' },
      { input: '3', output: '3', explanation: 'There are three ways: 1. 1+1+1, 2. 1+2, 3. 2+1.' }
    ],
    constraints: [
      '1 <= n <= 45'
    ],
    company_tags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'],
    starter_code: {
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        # Write your code here
        pass`,
      javascript: `function climbStairs(n) {
  // Write your code here
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Write your code here
        return 0;
    }
};`,
      java: `class Solution {
    public int climbStairs(int n) {
        // Write your code here
        return 0;
    }
}`
    },
    solution: {
      intuition: 'To reach step n, you must come from either step (n - 1) or step (n - 2). Thus, ways(n) = ways(n - 1) + ways(n - 2), identical to the Fibonacci recurrence.',
      algorithm: '1. If n <= 2: return n\n2. Maintain prev1 = 1, prev2 = 2\n3. For i from 3 to n: current = prev1 + prev2; prev1 = prev2; prev2 = current\n4. Return prev2',
      time_complexity: 'O(N) - Linear single-pass accumulation.',
      space_complexity: 'O(1) - Constant space tracking last two states.',
      code: `def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`
    },
    hints: [
      { tier: 1, text: 'Think about the base cases: How many ways to reach step 1? Step 2?' },
      { tier: 2, text: 'To arrive at step n, you could only jump from step n-1 or step n-2.' },
      { tier: 3, text: 'The recurrence is f(n) = f(n-1) + f(n-2). Keep two variables for O(1) space.' }
    ],
    test_cases: [
      { input_data: '2', expected_output: '2', is_sample: 1 },
      { input_data: '3', expected_output: '3', is_sample: 1 },
      { input_data: '4', expected_output: '5', is_sample: 0 },
      { input_data: '5', expected_output: '8', is_sample: 0 }
    ]
  }
];

export const ACHIEVEMENTS = [
  { code: 'FIRST_PROBLEM', title: 'First Blood', description: 'Solve your very first coding problem on Shancode.', icon: 'Award', xp_reward: 100 },
  { code: 'CONCEPT_MASTER', title: 'Concept Scholar', description: 'Complete your first concept video and pass the comprehension quiz.', icon: 'BookOpen', xp_reward: 150 },
  { code: 'STREAK_7', title: 'Flame Keeper', description: 'Maintain a 7-day learning streak.', icon: 'Flame', xp_reward: 300 },
  { code: 'TWO_POINTER_PRO', title: 'Two Pointer Virtuoso', description: 'Achieve 100% mastery on the Two Pointers pattern.', icon: 'Zap', xp_reward: 500 },
  { code: 'CONTEST_CHALLENGER', title: 'Arena Warrior', description: 'Participate in a weekly rated contest.', icon: 'Trophy', xp_reward: 400 },
  { code: 'NO_HINTS_HERO', title: 'Pure Intuition', description: 'Solve 10 problems without opening hints.', icon: 'Shield', xp_reward: 450 }
];

export const CONTESTS = [
  {
    id: 1,
    title: 'Shancode Weekly Contest 42',
    slug: 'weekly-contest-42',
    description: '4 algorithmic problems ranging from pattern fundamentals to hard dynamic programming.',
    start_time: new Date(Date.now() + 86400000 * 2).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 2 + 5400000).toISOString(),
    duration_minutes: 90,
    is_rated: 1,
    status: 'upcoming'
  },
  {
    id: 2,
    title: 'Shancode Biweekly Contest 18',
    slug: 'biweekly-contest-18',
    description: 'Speed and accuracy test on Graph traversals and Sliding Windows.',
    start_time: new Date(Date.now() - 86400000 * 3).toISOString(),
    end_time: new Date(Date.now() - 86400000 * 3 + 5400000).toISOString(),
    duration_minutes: 90,
    is_rated: 1,
    status: 'finished'
  }
];
