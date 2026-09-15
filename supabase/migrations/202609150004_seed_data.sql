-- ==============================================================================
-- SHANCODE PLATFORM: Supabase PostgreSQL Seed Dataset (004)
-- ==============================================================================

-- 1. SECTIONS
INSERT INTO sections (id, title, slug, description, icon, order_index) VALUES
(1, 'Foundations of Algorithmic Complexity', 'foundations', 'Core fundamentals of Big-O analysis, memory structures, and recursion invariants.', 'Cpu', 1),
(2, 'Arrays, Pointers & Two-Pointer Patterns', 'arrays-pointers', 'Mastering sequential arrays, in-place manipulation, and fast-slow pointers.', 'Layers', 2),
(3, 'Sliding Window & Substring Patterns', 'sliding-window', 'Dynamic and fixed-size windows for optimization problems.', 'Maximize2', 3),
(4, 'Binary Search & Monotonic Spaces', 'binary-search', 'Binary search over sorted collections and continuous predicate search spaces.', 'Search', 4),
(5, 'Trees, Graphs & Recursive Backtracking', 'trees-graphs', 'Tree traversals, binary search trees, graph reachability, and state-space pruning.', 'GitBranch', 5),
(6, 'Dynamic Programming & Memoization', 'dynamic-programming', 'Overlapping subproblems, state transitions, bottom-up tabulation, and space compression.', 'Sparkles', 6)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index;

-- 2. PATTERNS & LEVELS
INSERT INTO patterns (id, name, slug, description, total_levels, icon) VALUES
(1, 'Two Pointers (Converging & Monotonic)', 'two-pointers', 'Shrinking or expanding boundary pointers across sorted/structured sequences.', 4, 'MoveHorizontal'),
(2, 'Sliding Window (Fixed & Dynamic)', 'sliding-window', 'Maintaining continuous state over substrings and subarrays in linear time.', 4, 'Maximize2'),
(3, 'Fast & Slow Pointers (Cycle Detection)', 'fast-slow-pointers', 'Hare-and-tortoise pointers for detecting periodicities and cycles.', 3, 'Repeat'),
(4, 'Binary Search on Solution Space', 'binary-search-answers', 'Formulating validation predicates over monotonic search boundaries.', 4, 'Search'),
(5, 'Prefix Sum & Difference Arrays', 'prefix-sum', 'Precomputing cumulative values for O(1) range query evaluations.', 3, 'TrendingUp')
ON CONFLICT (id) DO NOTHING;

-- 3. CONCEPTS
INSERT INTO concepts (
  id, section_id, title, slug, summary, intuition, when_to_use, visual_svg,
  code_samples_json, common_mistakes_json, video_url, video_source, order_index
) VALUES
(1, 1, 'Time & Space Complexity Intuition', 'time-space-complexity',
 'Understand asymptotic growth rates, Big-O bounds, and how to analyze runtime and memory in interview scenarios.',
 'Think of Big-O as identifying the computational bottleneck as input size approaches infinity. Constants and lower-order terms fade away; only the fastest-growing term dictates scalability.',
 'Use Big-O analysis before writing code to verify if your algorithm will pass within standard 1.0s to 3.5s CPU limits (typically ~10^8 operations per second).',
 '<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#070a13" rx="10"/><path d="M 40 160 Q 200 155 360 40" stroke="#6366f1" stroke-width="3" fill="none"/><circle cx="200" cy="140" r="5" fill="#10b981"/><text x="50" y="50" fill="#f8fafc" font-family="sans-serif" font-size="12">O(N²) vs O(N log N)</text></svg>',
 '{"python": "def analyze(n):\n    # O(N) linear scan\n    total = sum(i for i in range(n))\n    return total", "javascript": "function analyze(n) {\n  let total = 0;\n  for(let i=0; i<n; i++) total += i;\n  return total;\n}"}'::jsonb,
 '["Confusing auxiliary space with total space complexity", "Forgetting recursion stack frames in depth analysis"]'::jsonb,
 'https://www.youtube.com/embed/On03HWe2tZM', 'youtube', 1),

(2, 2, 'Two Pointer Technique (Converging)', 'two-pointer-technique',
 'Eliminate redundant checks on sorted arrays by moving two boundary pointers towards each other based on sum/difference.',
 'When an array is sorted, comparing elements at the opposite ends gives a monotonic directional decision: if sum is too large, decrement the right pointer; if sum is too small, increment the left pointer.',
 'Apply when input array is sorted (or can be sorted) and you need to find pairs, triples, palindromes, or maximum trapped area.',
 '<svg viewBox="0 0 400 140" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="140" fill="#070a13" rx="10"/><rect x="40" y="50" width="40" height="40" fill="#151c2e" stroke="#6366f1"/><text x="55" y="75" fill="#fff">2</text><rect x="90" y="50" width="40" height="40" fill="#151c2e" stroke="#6366f1"/><text x="105" y="75" fill="#fff">7</text><rect x="310" y="50" width="40" height="40" fill="#151c2e" stroke="#6366f1"/><text x="320" y="75" fill="#fff">15</text><text x="45" y="115" fill="#10b981">Left ↑</text><text x="315" y="115" fill="#ef4444">Right ↑</text></svg>',
 '{"python": "def two_sum_sorted(nums, target):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        s = nums[left] + nums[right]\n        if s == target: return [left, right]\n        elif s < target: left += 1\n        else: right -= 1\n    return []"}'::jsonb,
 '["Forgetting that the array must be sorted first", "Off-by-one errors when advancing pointer bounds"]'::jsonb,
 'https://www.youtube.com/embed/cQ1Oz4ckcMM', 'youtube', 1)
ON CONFLICT (id) DO NOTHING;

-- 4. QUIZZES & QUESTIONS
INSERT INTO quizzes (id, concept_id, title, passing_score) VALUES
(1, 1, 'Big-O & Algorithmic Growth Quiz', 80),
(2, 2, 'Two Pointer Verification Quiz', 80)
ON CONFLICT (id) DO NOTHING;

INSERT INTO quiz_questions (id, quiz_id, question, options_json, correct_option_index, explanation) VALUES
(1, 1, 'What is the time complexity of searching an element in a balanced binary search tree of size N?', '["O(1)", "O(log N)", "O(N)", "O(N²)"]'::jsonb, 1, 'In a balanced binary search tree, the search space is halved at every level, yielding O(log N) depth.'),
(2, 1, 'If an algorithm processes an array with a nested loop where inner loop runs up to outer loop index (1 + 2 + ... + N), what is the Big-O bound?', '["O(N)", "O(N log N)", "O(N²)", "O(2^N)"]'::jsonb, 2, 'The sum of 1 to N is N(N+1)/2, which simplifies to O(N²).'),
(3, 2, 'What prerequisite condition is strictly required before applying the converging Two Pointer technique for pair sum?', '["The array must contain only positive integers", "The array elements must be sorted", "The array size must be a power of two", "The array must not contain duplicate numbers"]'::jsonb, 1, 'Monotonicity is required; sorting guarantees that moving pointers monotonically increases or decreases the sum.')
ON CONFLICT (id) DO NOTHING;

-- 5. PROBLEMS & TEST CASES
INSERT INTO problems (
  id, title, slug, difficulty, topic, pattern_id, concept_id, description,
  examples_json, constraints_json, starter_code_json, solution_json,
  acceptance_rate, company_tags_json
) VALUES
(1, 'Two Sum', 'two-sum', 'Easy', 'Arrays & Hashing', 1, 2,
 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
 '[{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."}]'::jsonb,
 '["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."]'::jsonb,
 '{"python": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, n in enumerate(nums):\n            diff = target - n\n            if diff in seen:\n                return [seen[diff], i]\n            seen[n] = i\n        return []", "javascript": "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}"}'::jsonb,
 '{"intuition": "Trade O(N) auxiliary space in a hash map to achieve O(1) instantaneous lookup.", "time_complexity": "O(N)", "space_complexity": "O(N)", "code": "def twoSum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i"}'::jsonb,
 78, '["Google", "Amazon", "Meta", "Apple"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_sample) VALUES
(1, 1, '[2,7,11,15]\n9', '[0, 1]', 1),
(2, 1, '[3,2,4]\n6', '[1, 2]', 1),
(3, 1, '[3,3]\n6', '[0, 1]', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO hints (id, problem_id, tier, hint_text) VALUES
(1, 1, 1, 'A brute force search checks all pairs in O(N²). What data structure allows instantaneous lookup?'),
(2, 1, 2, 'As you iterate through the array, can you store the complement `target - current_number` in a hash table?'),
(3, 1, 3, 'Maintain a map of `value -> index`. For each index `i`, check if `target - nums[i]` exists in the map.')
ON CONFLICT (id) DO NOTHING;

-- 6. ACHIEVEMENTS
INSERT INTO achievements (code, title, description, icon, xp_reward) VALUES
('first_solve', 'First Blood ⚔️', 'Solved your first algorithmic challenge on Shancode.', 'Award', 100),
('five_solves', 'Pattern Apprentice 🛡️', 'Solved 5 algorithmic problems across different patterns.', 'Shield', 250),
('streak_7', '7-Day Consistent Streak 🔥', 'Maintained a daily problem solving streak for 7 consecutive days.', 'Flame', 500),
('concept_master', 'Concept Master 🧠', 'Completed 5 concept video masterclasses and passed their quizzes.', 'Brain', 400)
ON CONFLICT (code) DO NOTHING;

-- 7. USERS & PROFILES (Demo accounts with bcrypt hashes for 'shancode123')
INSERT INTO users (id, username, email, password_hash, role, rating, xp, streak, last_active_date) VALUES
(1, 'sushmita', 'sushmita@shancode.io', '$2a$12$e6m21E1N85D2G7N.rVzLxeVfU81s4/c3d18eF0u1yV3vG.1k2o.Oe', 'student', 1620, 1450, 14, CURRENT_DATE),
(2, 'admin', 'admin@shancode.io', '$2a$12$e6m21E1N85D2G7N.rVzLxeVfU81s4/c3d18eF0u1yV3vG.1k2o.Oe', 'admin', 2150, 9200, 45, CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (user_id, avatar, bio, target_company, interview_readiness) VALUES
(1, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80', 'Aspiring Senior Software Engineer targeting FAANG', 'Google', 78),
(2, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', 'Shancode Lead Architect', 'Meta', 95)
ON CONFLICT (user_id) DO NOTHING;

-- ==============================================================================
-- 8. POSTGRESQL SEQUENCE REALIGNMENT
-- Synchronize all BIGSERIAL sequences with the highest explicitly inserted IDs
-- to ensure subsequent nextval() calls auto-generate unique primary keys properly.
-- ==============================================================================
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval(pg_get_serial_sequence('sections', 'id'), COALESCE((SELECT MAX(id) FROM sections), 1));
SELECT setval(pg_get_serial_sequence('concepts', 'id'), COALESCE((SELECT MAX(id) FROM concepts), 1));
SELECT setval(pg_get_serial_sequence('patterns', 'id'), COALESCE((SELECT MAX(id) FROM patterns), 1));
SELECT setval(pg_get_serial_sequence('quizzes', 'id'), COALESCE((SELECT MAX(id) FROM quizzes), 1));
SELECT setval(pg_get_serial_sequence('quiz_questions', 'id'), COALESCE((SELECT MAX(id) FROM quiz_questions), 1));
SELECT setval(pg_get_serial_sequence('problems', 'id'), COALESCE((SELECT MAX(id) FROM problems), 1));
SELECT setval(pg_get_serial_sequence('test_cases', 'id'), COALESCE((SELECT MAX(id) FROM test_cases), 1));
SELECT setval(pg_get_serial_sequence('hints', 'id'), COALESCE((SELECT MAX(id) FROM hints), 1));
SELECT setval(pg_get_serial_sequence('achievements', 'id'), COALESCE((SELECT MAX(id) FROM achievements), 1));
