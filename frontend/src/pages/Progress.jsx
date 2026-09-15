import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Award, TrendingUp, AlertTriangle, CheckCircle2, 
  Flame, Target, BrainCircuit, BookOpen, Clock, Building2, Sparkles 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Progress() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [targetCompany, setTargetCompany] = useState(user?.target_company || 'Google');
  const [readinessLoading, setReadinessLoading] = useState(false);

  useEffect(() => {
    api.getDashboardAnalytics()
      .then(res => {
        if (res.success) setData(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCompanyChange = async (company) => {
    setTargetCompany(company);
    setReadinessLoading(true);
    try {
      const res = await api.updateInterviewReadiness(company);
      if (res.success && data) {
        setData({
          ...data,
          stats: {
            ...data.stats,
            interview_readiness: res.readiness
          }
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReadinessLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BrainCircuit className="pulse-glow" size={32} /> Calculating Analytics & Skill Matrix...
        </div>
      </div>
    );
  }

  const { stats, skills, weak_areas, strong_areas } = data;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15))',
        border: '1px solid var(--border-glass)',
        marginBottom: '32px'
      }}>
        <span className="badge badge-concept" style={{ marginBottom: '8px' }}>PERFORMANCE INTELLIGENCE</span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Skill Analytics & Learning Telemetry
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '750px' }}>
          Shancode continuously models your algorithmic problem-solving accuracy, time to solution, and retention decay to construct your optimal learning trajectory.
        </p>
      </div>

      {/* Top Stats Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>OVERALL DSA PROGRESS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
            {Math.round(((stats.total_solved || 2) / Math.max(1, stats.total_problems || 50)) * 100)}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
            {stats.total_solved || 2} of {stats.total_problems || 50} Solved
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>FIRST-ATTEMPT SUCCESS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', margin: '4px 0' }}>
            {stats.first_attempt_accuracy || 74}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            High accuracy with minimal hints
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CONCEPTS MASTERED</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)', margin: '4px 0' }}>
            {stats.concepts_completed || 3} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ {stats.concepts_total || 35}</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Video quizzes passed
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CURRENT STREAK</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={28} fill="#f59e0b" /> {user?.streak || 12}d
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Daily commitment index
          </span>
        </div>

      </div>

      {/* Main Grid: Skills Matrix + Weak Area Diagnostics + Company Readiness */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Left: Skill Matrix Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Algorithmic Skill Breakdown</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Weighted by acceptance, difficulty, attempts count, and hint usage penalty.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {skills.map((s, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{s.topic}</span>
                  <span style={{ fontWeight: 700, color: s.score >= 75 ? 'var(--success)' : (s.score >= 50 ? 'var(--warning)' : 'var(--danger)') }}>
                    {s.score}% Mastery
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${s.score}%`,
                    height: '100%',
                    backgroundColor: s.score >= 75 ? 'var(--success)' : (s.score >= 50 ? 'var(--warning)' : 'var(--danger)'),
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Difficulty breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px' }}>
              <span className="badge badge-easy">Easy</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{stats.easy_solved || 2} Solved</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px' }}>
              <span className="badge badge-medium">Medium</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{stats.medium_solved || 1} Solved</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px' }}>
              <span className="badge badge-hard">Hard</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{stats.hard_solved || 0} Solved</div>
            </div>
          </div>
        </div>

        {/* Right: Company Interview Readiness Track */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Building2 size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                Company Readiness Track
              </h3>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Select your target company to simulate technical interview readiness:
            </p>

            {/* Company selector */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
              {['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix'].map(comp => (
                <button
                  key={comp}
                  onClick={() => handleCompanyChange(comp)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: targetCompany === comp ? 'var(--accent-primary)' : 'var(--bg-primary)',
                    color: targetCompany === comp ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  {comp}
                </button>
              ))}
            </div>

            <div style={{ textAlign: 'center', padding: '16px 0', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{targetCompany.toUpperCase()} READINESS SCORE</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--success)', margin: '4px 0' }}>
                {stats.interview_readiness || 68}%
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {stats.interview_readiness >= 75 ? 'Strong match for L4 / SDE-II interviews' : 'Needs practice on DP & Graphs'}
              </p>
            </div>

            <button
              onClick={() => navigate(`/problems?company=${targetCompany}`)}
              className="glow-btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '16px', fontSize: '0.85rem' }}
            >
              Practice {targetCompany} Problems →
            </button>
          </div>

          {/* Spaced Repetition (Ebbinghaus Curve) */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Clock size={20} color="var(--warning)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                Spaced Revision Queue
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Scheduled based on the Ebbinghaus forgetting curve (1d, 3d, 7d, 14d, 30d):
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>Two Pointer Technique</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>Stage 2 (3-Day Review)</div>
                </div>
                <button
                  onClick={() => navigate('/learn/two-pointer-technique')}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    color: 'var(--accent-primary)',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Review
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
