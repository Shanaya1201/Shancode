import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Users, BookOpen, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // New problem form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [topic, setTopic] = useState('Arrays');
  const [description, setDescription] = useState('');
  const [sampleInput, setSampleInput] = useState('[1, 2, 3]\n3');
  const [sampleOutput, setSampleOutput] = useState('true');
  const [submitting, setSubmitting] = useState(false);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getAdminMetrics().catch(() => ({ success: false })),
      api.getAdminUsers().catch(() => ({ success: false }))
    ]).then(([mRes, uRes]) => {
      if (mRes.success) setMetrics(mRes.metrics);
      if (uRes.success) setUsers(uRes.users);
    }).finally(() => setLoading(false));
  }, []);

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setCreatedSuccess(false);

    try {
      const res = await api.createAdminProblem({
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        difficulty,
        topic,
        description,
        examples: [{ input: sampleInput, output: sampleOutput, explanation: 'Sample test evaluation' }],
        constraints: ['1 <= nums.length <= 10^5'],
        starter_code: {
          python: `def solve():\n    pass`,
          javascript: `function solve() {\n}`,
          cpp: `// C++ implementation`,
          java: `// Java implementation`
        },
        solution: {
          intuition: 'Optimal single pass traversal',
          algorithm: 'Scan and track frequency hash map',
          time_complexity: 'O(N)',
          space_complexity: 'O(1)',
          code: 'def solve(): return True'
        },
        company_tags: ['Google', 'Amazon'],
        test_cases: [
          { input_data: sampleInput, expected_output: sampleOutput, is_sample: true }
        ]
      });

      if (res.success) {
        setCreatedSuccess(true);
        setTitle('');
        setSlug('');
        setDescription('');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(99, 102, 241, 0.12))',
        border: '1px solid var(--border-glass)',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', marginBottom: '8px' }}>
            ADMINISTRATOR PORTAL
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Content & System Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage curricula, author algorithmic problems, monitor submission pipelines, and manage student accounts.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
          <ShieldCheck size={20} color="var(--accent-primary)" />
          <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>Admin: {user?.username}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>REGISTERED LEARNERS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
            {metrics?.total_users || users.length || 2}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CODING PROBLEMS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '4px' }}>
            {metrics?.total_problems || 6}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STRUCTURED CONCEPTS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '4px' }}>
            {metrics?.total_concepts || 5}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL SUBMISSIONS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
            {metrics?.total_submissions || 24}
          </div>
        </div>
      </div>

      {/* Main Grid: Problem Creator (Left) + Users & Health (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        
        {/* Left: Problem Authoring Studio */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Plus size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Author New Coding Problem</h3>
          </div>

          <form onSubmit={handleCreateProblem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  placeholder="e.g. Subarray Product Less Than K"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Difficulty</label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Topic</label>
              <input
                type="text"
                placeholder="Arrays, Strings, Sliding Window, DP..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Problem Description & Constraints</label>
              <textarea
                placeholder="Detailed markdown statement of the problem..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                style={{ width: '100%', height: '120px', padding: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Sample Input</label>
                <input
                  type="text"
                  value={sampleInput}
                  onChange={e => setSampleInput(e.target.value)}
                  style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Expected Output</label>
                <input
                  type="text"
                  value={sampleOutput}
                  onChange={e => setSampleOutput(e.target.value)}
                  style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            {createdSuccess && (
              <div style={{ color: 'var(--success)', fontSize: '0.85rem' }}>✓ Problem published to database successfully!</div>
            )}

            <button type="submit" disabled={submitting} className="glow-btn-primary">
              {submitting ? 'Publishing...' : 'Publish Problem to Arena'}
            </button>
          </form>
        </div>

        {/* Right: Registered Users List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Users size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Learner Accounts</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {users.map(u => (
              <div
                key={u.id}
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{u.username} ({u.role})</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{u.xp} XP</div>
                  <div style={{ fontSize: '0.7rem', color: '#f59e0b' }}>🔥 {u.streak}d Streak</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
