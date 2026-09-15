const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.map(cb => cb(token));
  refreshSubscribers = [];
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('shancode_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    // If unauthorized and we have a refresh token, attempt token rotation
    if (res.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register') && !endpoint.includes('/auth/refresh')) {
      const refreshToken = localStorage.getItem('shancode_refresh_token');
      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken })
            });
            const refreshData = await refreshRes.json();
            if (refreshData.success && refreshData.accessToken) {
              localStorage.setItem('shancode_token', refreshData.accessToken);
              if (refreshData.refreshToken) {
                localStorage.setItem('shancode_refresh_token', refreshData.refreshToken);
              }
              isRefreshing = false;
              onRefreshed(refreshData.accessToken);
            } else {
              isRefreshing = false;
              localStorage.removeItem('shancode_token');
              localStorage.removeItem('shancode_refresh_token');
            }
          } catch (e) {
            isRefreshing = false;
            localStorage.removeItem('shancode_token');
            localStorage.removeItem('shancode_refresh_token');
          }
        }

        // Retry original request with new token
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((newToken) => {
            fetch(`${API_BASE}${endpoint}`, {
              ...options,
              headers: {
                ...headers,
                Authorization: `Bearer ${newToken}`
              }
            })
              .then(r => r.json())
              .then(resolve)
              .catch(reject);
          });
        });
      }
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP error! status: ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (emailOrUsername, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ emailOrUsername, password }) }),
  register: (username, email, password, target_company) => request('/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password, target_company }) }),
  logout: (refreshToken) => request('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (data) => request('/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),

  // Learn & Roadmap
  getRoadmap: () => request('/learn/roadmap'),
  getConcept: (slugOrId) => request(`/learn/concepts/${slugOrId}`),
  updateVideoProgress: (id, progress_pct, resume_sec) => request(`/learn/concepts/${id}/video-progress`, { method: 'POST', body: JSON.stringify({ progress_pct, resume_sec }) }),
  submitQuiz: (id, answers) => request(`/learn/concepts/${id}/quiz-submit`, { method: 'POST', body: JSON.stringify({ answers }) }),
  saveNotes: (id, notes) => request(`/learn/concepts/${id}/notes`, { method: 'POST', body: JSON.stringify({ notes }) }),
  getDueSpacedRevisions: () => request('/learn/spaced-repetition/due'),

  // Problems
  getProblemFilters: () => request('/problems/meta/filters'),
  getProblems: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/problems${query ? `?${query}` : ''}`);
  },
  getProblem: (slugOrId) => request(`/problems/${slugOrId}`),
  unlockHint: (problemId, tier) => request(`/problems/${problemId}/unlock-hint`, { method: 'POST', body: JSON.stringify({ tier }) }),
  getSolution: (problemId) => request(`/problems/${problemId}/solution`),

  // Code Execution & Submissions
  runCode: (data) => request('/submissions/run', { method: 'POST', body: JSON.stringify(data) }),
  submitCode: (data) => request('/submissions/submit', { method: 'POST', body: JSON.stringify(data) }),
  getSubmissionsHistory: (problemId) => request(`/submissions/history${problemId ? `?problem_id=${problemId}` : ''}`),

  // Patterns
  getPatterns: () => request('/patterns'),

  // Contests
  getContests: () => request('/contests'),
  getContest: (id) => request(`/contests/${id}`),
  submitContestProblem: (contestId, data) => request(`/contests/${contestId}/submit`, { method: 'POST', body: JSON.stringify(data) }),

  // Analytics & Dashboard
  getDashboardAnalytics: () => request('/analytics/dashboard'),
  updateInterviewReadiness: (company) => request('/analytics/interview-readiness', { method: 'POST', body: JSON.stringify({ company }) }),

  // AI Tutor
  askAiTutor: (data) => request('/tutor/chat', { method: 'POST', body: JSON.stringify(data) }),

  // Discussions
  getDiscussions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/discussions${query ? `?${query}` : ''}`);
  },
  createDiscussion: (data) => request('/discussions', { method: 'POST', body: JSON.stringify(data) }),
  upvoteDiscussion: (id) => request(`/discussions/${id}/upvote`, { method: 'POST' }),
  getComments: (id) => request(`/discussions/${id}/comments`),
  addComment: (id, body) => request(`/discussions/${id}/comments`, { method: 'POST', body: JSON.stringify({ body }) }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'POST' }),

  // Admin
  getAdminMetrics: () => request('/admin/metrics'),
  createAdminProblem: (data) => request('/admin/problems', { method: 'POST', body: JSON.stringify(data) }),
  getAdminUsers: () => request('/admin/users')
};
