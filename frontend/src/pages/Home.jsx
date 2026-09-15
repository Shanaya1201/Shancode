import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Play, CheckCircle2, Flame, ArrowRight, Target, AlertTriangle, 
  Sparkles, TrendingUp, BookOpen, Clock, Award, ShieldAlert, BrainCircuit 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardAnalytics()
      .then(res => {
        if (res.success) setData(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BrainCircuit className="pulse-glow" size={32} /> Loading Shancode Dashboard...
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const skills = data?.skills || [];
  const weakAreas = data?.weak_areas || [];
  const strongAreas = data?.strong_areas || [];
  const recentSubs = data?.recent_submissions || [];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
      
      {/* 1. Welcome Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
        background: 'radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.15), transparent 70%)',
        padding: '24px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-glass)'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Welcome back, {user?.username || 'Yashu'} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Learn the concept. Master the pattern. Solve the problem.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{
            padding: '12px 18px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '12px',
            border: '1px solid var(--border-glass)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TARGET COMPANY</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {user?.target_company || 'Google'}
            </div>
          </div>
          <div style={{
            padding: '12px 18px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '12px',
            border: '1px solid var(--border-glass)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>INTERVIEW READINESS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success)' }}>
              {stats.interview_readiness || 68}%
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Main Dashboard Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Left Column: Continue Learning + Personalized Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Continue Learning Banner */}
          <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1, pointerEvents: 'none' }}>
              <BookOpen size={160} color="#6366f1" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-concept" style={{ marginBottom: '8px' }}>CONTINUE LEARNING</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>2. Arrays & Two Pointer Technique</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Last studied: <strong>Two Pointer Technique</strong> (Video Progress: 85%)
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>72%</span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Section Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '4px' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => navigate('/learn/two-pointer-technique')}
                className="glow-btn-primary"
              >
                <Play size={16} fill="#fff" /> Resume Lesson
              </button>
              <button 
                onClick={() => navigate('/problems/two-sum')}
                className="btn-secondary"
              >
                Practice Related Problems →
              </button>
            </div>
          </div>

          {/* Personalized Weak Areas & Recommendation Engine */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Areas You Need To Improve</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Generated by Shancode diagnostic performance telemetry</p>
              </div>
            </div>

            {weakAreas.map((w, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '12px',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  marginBottom: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#fff' }}>🔴 {w.topic}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      (Skill Score: {w.score}%)
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {w.solved}/{w.attempted} solved • Avg attempts: {w.avgAttempts}
                  </span>
                </div>

                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  <strong>Recommended Action Plan:</strong>
                  <ul style={{ paddingLeft: '18px', marginTop: '4px', color: 'var(--text-secondary)' }}>
                    {w.recommendations.map((rec, rIdx) => (
                      <li key={rIdx} style={{ marginBottom: '2px' }}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => navigate('/learn')}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Start Remedial Practice →
                </button>
              </div>
            ))}
          </div>

          {/* Strengths Card */}
          {strongAreas.length > 0 && (
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                  <Award size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Your Strong Areas</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Consistently solving with high accuracy</p>
                </div>
              </div>
              {strongAreas.map((s, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--success)' }}>🟢 {s.topic} ({s.score}%)</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{s.praise}</span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Column: Daily Goals, Spaced Repetition, Skill Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Daily Goal & Streak Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={20} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Daily Goal</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
                <Flame size={18} fill="#f59e0b" /> {user?.streak || 12} Days
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                {stats.daily_goal?.solved_problems || 2} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ {stats.daily_goal?.target_problems || 3}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Problems solved today
              </p>
            </div>

            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden', margin: '12px 0' }}>
              <div style={{
                width: `${Math.min(100, ((stats.daily_goal?.solved_problems || 2) / (stats.daily_goal?.target_problems || 3)) * 100)}%`,
                height: '100%',
                backgroundColor: 'var(--accent-primary)'
              }} />
            </div>

            <button
              onClick={() => navigate('/problems')}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'var(--bg-tertiary)',
                color: '#fff',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '6px'
              }}
            >
              Solve Daily Challenge
            </button>
          </div>

          {/* Skill Radar / Bars */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Skill Matrix</h3>
              <Link to="/progress" style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>Detailed View →</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {skills.map((s, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{s.topic}</span>
                    <span style={{ color: '#fff', fontWeight: 700 }}>{s.score}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${s.score}%`,
                      height: '100%',
                      backgroundColor: s.score >= 75 ? 'var(--success)' : (s.score >= 50 ? 'var(--warning)' : 'var(--danger)')
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Recent Submissions</h4>
            {recentSubs.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No recent submissions yet.</p>
            ) : (
              recentSubs.map((sub, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600 }}>{sub.title}</div>
                    <span className={`badge badge-${sub.difficulty?.toLowerCase()}`}>{sub.difficulty}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: sub.verdict === 'Accepted' ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                      {sub.verdict === 'Accepted' ? '✅ AC' : '❌ WA'}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sub.runtime_ms}ms</div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
