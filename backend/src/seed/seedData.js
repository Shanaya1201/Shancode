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
    name: 'Monotonic Stack',
    slug: 'monotonic-stack',
    description: 'Maintaining strictly increasing or decreasing elements for Next Greater Element in O(N).',
    total_levels: 4,
    icon: 'BarChart2',
    levels: [
      { level_number: 1, title: 'Next Greater Element', required_count: 2, difficulty: 'Easy' },
      { level_number: 2, title: 'Daily Temperatures', required_count: 2, difficulty: 'Medium' },
      { level_number: 3, title: 'Largest Rectangle in Histogram', required_count: 1, difficulty: 'Hard' },
      { level_number: 4, title: 'Maximal Rectangle', required_count: 1, difficulty: 'Hard' }
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
      { level_number: 1, title: 'Flood Fill & Matrix', required_count: 2, difficulty: 'Easy' },
      { level_number: 2, title: 'Number of Islands', required_count: 2, difficulty: 'Medium' },
      { level_number: 3, title: 'Course Schedule & Topo Sort', required_count: 2, difficulty: 'Medium' },
      { level_number: 4, title: 'Word Ladder & Shortest Paths', required_count: 1, difficulty: 'Hard' }
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
      'Using \`left <= right\` instead of \`left < right\` when pairing two distinct elements (which could reuse the same element).',
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
    title: 'Prefix Sum & Kadane\'s Algorithm',
    slug: 'prefix-sum',
    order_index: 2,
    video_url: 'https://www.youtube.com/embed/86CQq33Zoe8',
    video_source: 'youtube',
    summary: 'Precompute cumulative sums for instant O(1) range queries and find maximum contiguous subarrays with Kadane\'s algorithm.',
    intuition: 'Instead of summing elements between indices L and R repeatedly (costing O(N) per query), precalculate prefix[i] = nums[0] + ... + nums[i]. For max subarray, Kadane tracks current_max = max(x, current_max + x).',
    when_to_use: 'Use when you have multiple range sum queries, or need to find maximum subarray sums in O(N) time and O(1) space.',
    visual_svg: `<svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
      <rect x="20" y="20" width="360" height="35" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
      <text x="50" y="42" fill="#94a3b8" font-size="12">nums: [ -2, 1, -3, 4, -1, 2, 1, -5, 4 ]</text>
      <rect x="20" y="65" width="360" height="35" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
      <text x="50" y="87" fill="#10b981" font-size="12">Max Subarray [ 4, -1, 2, 1 ] -> Sum = 6</text>
    </svg>`,
    code_samples: {
      python: `def maxSubArray(nums):
    max_sum = nums[0]
    curr_sum = nums[0]
    for num in nums[1:]:
        curr_sum = max(num, curr_sum + num)
        max_sum = max(max_sum, curr_sum)
    return max_sum`,
      javascript: `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currSum = Math.max(nums[i], currSum + nums[i]);
    maxSum = Math.max(maxSum, currSum);
  }
  return maxSum;
}`,
      cpp: `#include <vector>
#include <algorithm>

int maxSubArray(const std::vector<int>& nums) {
    int maxSum = nums[0], currSum = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        currSum = std::max(nums[i], currSum + nums[i]);
        maxSum = std::max(maxSum, currSum);
    }
    return maxSum;
}`,
      java: `public class Kadane {
    public static int maxSubArray(int[] nums) {
        int maxSum = nums[0], currSum = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currSum = Math.max(nums[i], currSum + nums[i]);
            maxSum = Math.max(maxSum, currSum);
        }
        return maxSum;
    }
}`
    },
    common_mistakes: [
      'Initializing maxSum to 0 when all array elements are negative (must initialize to nums[0] or -Infinity).',
      'Forgetting that Kadane runs in strict O(N) time and O(1) auxiliary space.'
    ],
    quiz: {
      title: 'Kadane Algorithm Quiz',
      questions: [
        {
          question: 'What happens in Kadane algorithm when current_sum drops below 0?',
          options: ['We stop the algorithm', 'We reset current_sum to 0 on the next step because adding a negative prefix hurts future sums', 'We return -1', 'We multiply by -1'],
          correct_option_index: 1,
          explanation: 'If the accumulated sum is negative, any future subarray will be larger without including this negative prefix.'
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
    when_to_use: 'Use when looking for longest/shortest continuous subarrays or substrings meeting a frequency or sum condition (e.g. longest substring without repeating characters, minimum window substring).',
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
      'Using \`(low + high) / 2\` which can cause 32-bit integer overflow in languages like C++/Java (use \`low + (high - low) / 2\`).',
      'Infinite loops caused by updating \`low = mid\` without integer rounding consideration.'
    ],
    quiz: {
      title: 'Binary Search Essentials',
      questions: [
        {
          question: 'Why is \`low + (high - low) / 2\` preferred over \`(low + high) / 2\` in C++/Java?',
          options: ['It runs faster on the CPU', 'It avoids integer overflow when low + high exceeds 2^31 - 1', 'It automatically rounds floats', 'It works on unsorted lists'],
          correct_option_index: 1,
          explanation: 'When low and high are large positive integers, their direct sum can overflow the 32-bit signed integer limit, resulting in negative values.'
        }
      ]
    }
  }
];

// Expanded Suite of 20+ Top LeetCode/DSA Problems across All Categories
export const PROBLEMS = [
  // 1. Two Sum
  {
    id: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    pattern_id: 1,
    concept_id: 2,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly one solution***, and you may not use the same element twice.`,
    examples: [
      { input: '[2, 7, 11, 15]\n9', output: '[0, 1]', explanation: 'nums[0] + nums[1] == 9, return [0, 1].' },
      { input: '[3, 2, 4]\n6', output: '[1, 2]', explanation: 'nums[1] + nums[2] == 6, return [1, 2].' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i], target <= 10^9'],
    company_tags: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix'],
    starter_code: {
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your solution here
        pass`,
      javascript: `function twoSum(nums, target) {
  // Write your solution here
}`,
      cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        return {};
    }
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[]{};
    }
}`
    },
    solution: {
      intuition: 'Store each number and its index in a hash map. For each num, check if (target - num) exists in O(1).',
      algorithm: '1. seen = {}\n2. For i, num in enumerate(nums):\n3.   if target - num in seen: return [seen[target - num], i]\n4.   seen[num] = i\n5. Return []',
      time_complexity: 'O(N)',
      space_complexity: 'O(N)',
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
      { tier: 1, text: 'Can you look up complements in O(1) time?' },
      { tier: 2, text: 'For each number x, calculate target - x and check if seen.' },
      { tier: 3, text: 'Use a Hash Map mapping values to their indices.' }
    ],
    test_cases: [
      { input_data: '[2, 7, 11, 15]\n9', expected_output: '[0, 1]', is_sample: 1 },
      { input_data: '[3, 2, 4]\n6', expected_output: '[1, 2]', is_sample: 1 },
      { input_data: '[3, 3]\n6', expected_output: '[0, 1]', is_sample: 1 }
    ]
  },

  // 2. Valid Palindrome
  {
    id: 2,
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    topic: 'Strings',
    pattern_id: 1,
    concept_id: 2,
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.`,
    examples: [
      { input: '"A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: '"race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' }
    ],
    constraints: ['1 <= s.length <= 2 * 10^5'],
    company_tags: ['Meta', 'Amazon', 'Microsoft', 'Google'],
    starter_code: {
      python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        pass`,
      javascript: `function isPalindrome(s) {
}`,
      cpp: `class Solution { public: bool isPalindrome(std::string s) { return false; } };`,
      java: `class Solution { public boolean isPalindrome(String s) { return false; } }`
    },
    solution: {
      intuition: 'Two converging pointers from start and end, skipping non-alphanumeric characters.',
      algorithm: '1. left = 0, right = len(s) - 1\n2. Skip non-alphanumeric characters\n3. Compare s[left].lower() with s[right].lower()\n4. If equal, advance pointers; else return False.',
      time_complexity: 'O(N)',
      space_complexity: 'O(1)',
      code: `def isPalindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum(): left += 1
        while left < right and not s[right].isalnum(): right -= 1
        if s[left].lower() != s[right].lower(): return False
        left += 1; right -= 1
    return True`
    },
    hints: [
      { tier: 1, text: 'Use two pointers from opposite ends.' },
      { tier: 2, text: 'Skip spaces and punctuation with .isalnum().' },
      { tier: 3, text: 'Compare characters in lowercase.' }
    ],
    test_cases: [
      { input_data: '"A man, a plan, a canal: Panama"', expected_output: 'true', is_sample: 1 },
      { input_data: '"race a car"', expected_output: 'false', is_sample: 1 },
      { input_data: '" "', expected_output: 'true', is_sample: 1 }
    ]
  },

  // 3. 3Sum
  {
    id: 3,
    title: '3Sum',
    slug: '3sum',
    difficulty: 'Medium',
    topic: 'Arrays',
    pattern_id: 1,
    concept_id: 2,
    description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      { input: '[-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'Triplets summing to 0.' },
      { input: '[0,1,1]', output: '[]', explanation: 'No triplet sums to 0.' }
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    company_tags: ['Meta', 'Amazon', 'Google', 'Apple', 'Microsoft'],
    starter_code: {
      python: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        pass`,
      javascript: `function threeSum(nums) {
}`,
      cpp: `class Solution { public: std::vector<std::vector<int>> threeSum(std::vector<int>& nums) { return {}; } };`,
      java: `class Solution { public List<List<Integer>> threeSum(int[] nums) { return new ArrayList<>(); } }`
    },
    solution: {
      intuition: 'Sort array first. Fix nums[i] and use Two Pointers on the remaining subarray to find pairs summing to -nums[i], skipping duplicates.',
      algorithm: '1. nums.sort()\n2. For i in range(len(nums)-2):\n3.   if i > 0 and nums[i] == nums[i-1]: continue\n4.   left, right = i+1, len(nums)-1\n5.   while left < right: check sum and skip duplicates.',
      time_complexity: 'O(N^2)',
      space_complexity: 'O(1)',
      code: `def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]: continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0: l += 1
            elif s > 0: r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l + 1]: l += 1
                while l < r and nums[r] == nums[r - 1]: r -= 1
                l += 1; r -= 1
    return res`
    },
    hints: [
      { tier: 1, text: 'Can sorting the array make pair searching deterministic?' },
      { tier: 2, text: 'Fix the first element and use two pointers for the remaining two.' },
      { tier: 3, text: 'Always skip consecutive identical numbers to prevent duplicate triplets.' }
    ],
    test_cases: [
      { input_data: '[-1,0,1,2,-1,-4]', expected_output: '[[-1,-1,2],[-1,0,1]]', is_sample: 1 },
      { input_data: '[0,1,1]', expected_output: '[]', is_sample: 1 },
      { input_data: '[0,0,0]', expected_output: '[[0,0,0]]', is_sample: 1 }
    ]
  },

  // 4. Container With Most Water
  {
    id: 4,
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'Medium',
    topic: 'Arrays',
    pattern_id: 1,
    concept_id: 2,
    description: `Given \`n\` vertical lines, find two lines that together with the x-axis form a container, such that the container contains the most water.`,
    examples: [
      { input: '[1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Max area is 49.' }
    ],
    constraints: ['2 <= height.length <= 10^5'],
    company_tags: ['Amazon', 'Google', 'Meta'],
    starter_code: {
      python: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        pass`,
      javascript: `function maxArea(height) {
}`,
      cpp: `class Solution { public: int maxArea(std::vector<int>& height) { return 0; } };`,
      java: `class Solution { public int maxArea(int[] height) { return 0; } }`
    },
    solution: {
      intuition: 'Always move the pointer pointing to the shorter wall inward, as moving the taller wall cannot increase the water bound.',
      algorithm: '1. l, r = 0, len(height) - 1, max_a = 0\n2. While l < r:\n3.   max_a = max(max_a, min(height[l], height[r]) * (r - l))\n4.   if height[l] < height[r]: l += 1 else: r -= 1\n5. Return max_a',
      time_complexity: 'O(N)',
      space_complexity: 'O(1)',
      code: `def maxArea(height: list[int]) -> int:
    l, r = 0, len(height) - 1
    max_a = 0
    while l < r:
        max_a = max(max_a, min(height[l], height[r]) * (r - l))
        if height[l] < height[r]: l += 1
        else: r -= 1
    return max_a`
    },
    hints: [
      { tier: 1, text: 'Start with the widest container.' },
      { tier: 2, text: 'Area is bottlenecked by the shorter bar.' },
      { tier: 3, text: 'Move the shorter line inwards.' }
    ],
    test_cases: [
      { input_data: '[1,8,6,2,5,4,8,3,7]', expected_output: '49', is_sample: 1 },
      { input_data: '[1,1]', expected_output: '1', is_sample: 1 }
    ]
  },

  // 5. Longest Substring Without Repeating Characters
  {
    id: 5,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    topic: 'Strings',
    pattern_id: 2,
    concept_id: 4,
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      { input: '"abcabcbb"', output: '3', explanation: '"abc" with length 3.' },
      { input: '"bbbbb"', output: '1', explanation: '"b" with length 1.' }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4'],
    company_tags: ['Google', 'Amazon', 'Meta', 'Apple', 'Microsoft'],
    starter_code: {
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        pass`,
      javascript: `function lengthOfLongestSubstring(s) {
}`,
      cpp: `class Solution { public: int lengthOfLongestSubstring(std::string s) { return 0; } };`,
      java: `class Solution { public int lengthOfLongestSubstring(String s) { return 0; } }`
    },
    solution: {
      intuition: 'Sliding window tracking character indices. If duplicate is encountered within current window, jump left pointer past it.',
      algorithm: '1. seen = {}\n2. left = 0, max_l = 0\n3. For right, ch in enumerate(s):\n4.   if ch in seen and seen[ch] >= left: left = seen[ch] + 1\n5.   seen[ch] = right\n6.   max_l = max(max_l, right - left + 1)\n7. Return max_l',
      time_complexity: 'O(N)',
      space_complexity: 'O(min(N, M))',
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
      { tier: 1, text: 'Maintain a window of unique characters.' },
      { tier: 2, text: 'Store the last seen index of each character.' },
      { tier: 3, text: 'Advance left to seen[char] + 1 on duplicate.' }
    ],
    test_cases: [
      { input_data: '"abcabcbb"', expected_output: '3', is_sample: 1 },
      { input_data: '"bbbbb"', expected_output: '1', is_sample: 1 },
      { input_data: '"pwwkew"', expected_output: '3', is_sample: 1 }
    ]
  },

  // 6. Maximum Subarray (Kadane's)
  {
    id: 6,
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    topic: 'Arrays',
    pattern_id: 1,
    concept_id: 3,
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.`,
    examples: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: '[1]', output: '1', explanation: '[1] has sum 1.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    company_tags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'],
    starter_code: {
      python: `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        pass`,
      javascript: `function maxSubArray(nums) {
}`,
      cpp: `class Solution { public: int maxSubArray(std::vector<int>& nums) { return 0; } };`,
      java: `class Solution { public int maxSubArray(int[] nums) { return 0; } }`
    },
    solution: {
      intuition: 'Kadane\'s algorithm: At index i, either extend previous subarray or start new from current element.',
      algorithm: '1. max_sum = curr_sum = nums[0]\n2. For num in nums[1:]:\n3.   curr_sum = max(num, curr_sum + num)\n4.   max_sum = max(max_sum, curr_sum)\n5. Return max_sum',
      time_complexity: 'O(N)',
      space_complexity: 'O(1)',
      code: `def maxSubArray(nums: list[int]) -> int:
    max_s = curr_s = nums[0]
    for x in nums[1:]:
        curr_s = max(x, curr_s + x)
        max_s = max(max_s, curr_s)
    return max_s`
    },
    hints: [
      { tier: 1, text: 'If prefix sum is negative, it hurts future sums.' },
      { tier: 2, text: 'curr_sum = max(num, curr_sum + num).' },
      { tier: 3, text: 'Track global maximum sum along the scan.' }
    ],
    test_cases: [
      { input_data: '[-2,1,-3,4,-1,2,1,-5,4]', expected_output: '6', is_sample: 1 },
      { input_data: '[1]', expected_output: '1', is_sample: 1 },
      { input_data: '[5,4,-1,7,8]', expected_output: '23', is_sample: 1 }
    ]
  },

  // 7. Binary Search
  {
    id: 7,
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    topic: 'Binary Search',
    pattern_id: 3,
    concept_id: 5,
    description: `Given a sorted array of integers \`nums\` and an integer \`target\`, write a function to search \`target\` in \`nums\` in \`O(log n)\` runtime. If \`target\` exists, return its index; otherwise, return \`-1\`.`,
    examples: [
      { input: '[-1,0,3,5,9,12]\n9', output: '4', explanation: '9 exists at index 4.' },
      { input: '[-1,0,3,5,9,12]\n2', output: '-1', explanation: '2 does not exist.' }
    ],
    constraints: ['1 <= nums.length <= 10^4', 'nums is sorted in ascending order.'],
    company_tags: ['Microsoft', 'Amazon', 'Google', 'Apple'],
    starter_code: {
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        pass`,
      javascript: `function search(nums, target) {
}`,
      cpp: `class Solution { public: int search(std::vector<int>& nums, int target) { return -1; } };`,
      java: `class Solution { public int search(int[] nums, int target) { return -1; } }`
    },
    solution: {
      intuition: 'Halve the search space on each comparison with middle element.',
      algorithm: '1. low = 0, high = len(nums) - 1\n2. while low <= high:\n3.   mid = low + (high - low) // 2\n4.   if nums[mid] == target: return mid\n5.   elif nums[mid] < target: low = mid + 1\n6.   else: high = mid - 1\n7. return -1',
      time_complexity: 'O(log N)',
      space_complexity: 'O(1)',
      code: `def search(nums: list[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target: return mid
        elif nums[mid] < target: low = mid + 1
        else: high = mid - 1
    return -1`
    },
    hints: [
      { tier: 1, text: 'The array is already sorted.' },
      { tier: 2, text: 'Compute mid = low + (high - low) / 2.' },
      { tier: 3, text: 'Adjust low or high to discard half the search space.' }
    ],
    test_cases: [
      { input_data: '[-1,0,3,5,9,12]\n9', expected_output: '4', is_sample: 1 },
      { input_data: '[-1,0,3,5,9,12]\n2', expected_output: '-1', is_sample: 1 }
    ]
  },

  // 8. Climbing Stairs
  {
    id: 8,
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    pattern_id: 6,
    concept_id: 1,
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top. Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: '2', output: '2', explanation: '1+1 or 2 steps.' },
      { input: '3', output: '3', explanation: '1+1+1, 1+2, or 2+1 steps.' }
    ],
    constraints: ['1 <= n <= 45'],
    company_tags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'],
    starter_code: {
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        pass`,
      javascript: `function climbStairs(n) {
}`,
      cpp: `class Solution { public: int climbStairs(int n) { return 0; } };`,
      java: `class Solution { public int climbStairs(int n) { return 0; } }`
    },
    solution: {
      intuition: 'Ways(n) = Ways(n - 1) + Ways(n - 2) (Fibonacci sequence).',
      algorithm: '1. If n <= 2 return n\n2. prev1 = 1, prev2 = 2\n3. For i from 3 to n: prev1, prev2 = prev2, prev1 + prev2\n4. Return prev2',
      time_complexity: 'O(N)',
      space_complexity: 'O(1)',
      code: `def climbStairs(n: int) -> int:
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1): a, b = b, a + b
    return b`
    },
    hints: [
      { tier: 1, text: 'To arrive at step n, where could you have come from?' },
      { tier: 2, text: 'f(n) = f(n-1) + f(n-2).' },
      { tier: 3, text: 'Keep two variables to optimize space to O(1).' }
    ],
    test_cases: [
      { input_data: '2', expected_output: '2', is_sample: 1 },
      { input_data: '3', expected_output: '3', is_sample: 1 }
    ]
  },

  // 9. Valid Parentheses
  {
    id: 9,
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    topic: 'Stacks',
    pattern_id: 4,
    concept_id: 1,
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.`,
    examples: [
      { input: '"()"', output: 'true', explanation: 'Matching brackets.' },
      { input: '"()[]{}"', output: 'true', explanation: 'All valid brackets.' },
      { input: '"(]"', output: 'false', explanation: 'Mismatched brackets.' }
    ],
    constraints: ['1 <= s.length <= 10^4'],
    company_tags: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple'],
    starter_code: {
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        pass`,
      javascript: `function isValid(s) {
}`,
      cpp: `class Solution { public: bool isValid(std::string s) { return false; } };`,
      java: `class Solution { public boolean isValid(String s) { return false; } }`
    },
    solution: {
      intuition: 'Use a LIFO Stack to match opening brackets with corresponding closing brackets.',
      algorithm: '1. stack = []\n2. mapping = {")": "(", "}": "{", "]": "["}\n3. For char in s:\n4.   if char in mapping:\n5.     top = stack.pop() if stack else "#"\n6.     if mapping[char] != top: return False\n7.   else: stack.append(char)\n8. Return not stack',
      time_complexity: 'O(N)',
      space_complexity: 'O(N)',
      code: `def isValid(s: str) -> bool:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for c in s:
        if c in pairs:
            if not stack or stack.pop() != pairs[c]: return False
        else: stack.append(c)
    return len(stack) == 0`
    },
    hints: [
      { tier: 1, text: 'Which bracket must be closed first? The most recent one (LIFO).' },
      { tier: 2, text: 'Push open brackets to a stack, pop when matching close bracket.' },
      { tier: 3, text: 'Ensure stack is empty at the end.' }
    ],
    test_cases: [
      { input_data: '"()"', expected_output: 'true', is_sample: 1 },
      { input_data: '"()[]{}"', expected_output: 'true', is_sample: 1 },
      { input_data: '"(]"', expected_output: 'false', is_sample: 1 }
    ]
  },

  // 10. Coin Change
  {
    id: 10,
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    pattern_id: 6,
    concept_id: 1,
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money. Return the *fewest number of coins* that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.`,
    examples: [
      { input: '[1,2,5]\n11', output: '3', explanation: '11 = 5 + 5 + 1 (3 coins)' },
      { input: '[2]\n3', output: '-1', explanation: 'Cannot make 3 with 2s.' }
    ],
    constraints: ['1 <= coins.length <= 12', '0 <= amount <= 10^4'],
    company_tags: ['Amazon', 'Google', 'Microsoft', 'Meta'],
    starter_code: {
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        pass`,
      javascript: `function coinChange(coins, amount) {
}`,
      cpp: `class Solution { public: int coinChange(std::vector<int>& coins, int amount) { return -1; } };`,
      java: `class Solution { public int coinChange(int[] coins, int amount) { return -1; } }`
    },
    solution: {
      intuition: 'Bottom-up DP: dp[i] is the minimum coins needed to make amount i. dp[i] = min(dp[i], dp[i - coin] + 1).',
      algorithm: '1. dp = [Infinity] * (amount + 1); dp[0] = 0\n2. For i from 1 to amount:\n3.   For coin in coins:\n4.     if i - coin >= 0: dp[i] = min(dp[i], dp[i - coin] + 1)\n5. Return dp[amount] if dp[amount] != Infinity else -1',
      time_complexity: 'O(amount * len(coins))',
      space_complexity: 'O(amount)',
      code: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if i >= c:
                dp[i] = min(dp[i], dp[i - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`
    },
    hints: [
      { tier: 1, text: 'Can you build solutions for smaller sub-amounts from 0 to amount?' },
      { tier: 2, text: 'dp[i] = min(dp[i - c] + 1 for c in coins).' },
      { tier: 3, text: 'Initialize with Infinity and base case dp[0] = 0.' }
    ],
    test_cases: [
      { input_data: '[1,2,5]\n11', expected_output: '3', is_sample: 1 },
      { input_data: '[2]\n3', expected_output: '-1', is_sample: 1 },
      { input_data: '[1]\n0', expected_output: '0', is_sample: 1 }
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
