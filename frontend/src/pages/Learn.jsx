import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, CheckCircle, Lock, Play, Layers, GitBranch, 
  Sparkles, ArrowRight, BrainCircuit, ShieldAlert, Cpu 
} from 'lucide-react';
import { api } from '../services/api';

export default function Learn() {
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('curriculum'); // 'curriculum' or 'skill_tree'

  useEffect(() => {
    api.getRoadmap()
      .then(res => {
        if (res.success) setRoadmap(res.roadmap);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BrainCircuit className="pulse-glow" size={32} /> Loading DSA Curriculum & Skill Tree...
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        padding: '24px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.12))',
        border: '1px solid var(--border-glass)'
      }}>
        <div>
          <span className="badge badge-concept" style={{ marginBottom: '8px' }}>DSA LEARNING ROADMAP</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Structured Concept Mastery
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '650px' }}>
            Learn the core intuition through video lessons, visual animations, and comprehension quizzes before writing a single line of code.
          </p>
        </div>

        {/* View mode switcher */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-primary)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid var(--border-glass)'
        }}>
          <button
            onClick={() => setViewMode('curriculum')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              backgroundColor: viewMode === 'curriculum' ? 'var(--accent-primary)' : 'transparent',
              color: viewMode === 'curriculum' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Curriculum View
          </button>
          <button
            onClick={() => setViewMode('skill_tree')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              backgroundColor: viewMode === 'skill_tree' ? 'var(--accent-primary)' : 'transparent',
              color: viewMode === 'skill_tree' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Interactive Skill Tree
          </button>
        </div>
      </div>

      {/* Skill Tree DAG View */}
      {viewMode === 'skill_tree' ? (
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            Interactive Dependency Skill Tree
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '32px' }}>
            Advanced patterns unlock as you complete prerequisite foundations.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            position: 'relative'
          }}>
            {/* Level 0: Basics */}
            <div style={{ display: 'flex', gap: '20px' }}>
              <div 
                onClick={() => navigate('/learn/time-space-complexity')}
                className="glass-panel-interactive" 
                style={{ padding: '16px 24px', cursor: 'pointer', border: '1px solid #10b981' }}
              >
                <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>✅ Programming Basics & Big-O</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Foundation (100% Completed)</div>
              </div>
            </div>

            <div style={{ width: '2px', height: '20px', backgroundColor: 'var(--accent-primary)' }} />

            {/* Level 1: Arrays & Memory */}
            <div style={{ display: 'flex', gap: '20px' }}>
              <div 
                onClick={() => navigate('/learn/two-pointer-technique')}
                className="glass-panel-interactive" 
                style={{ padding: '16px 24px', cursor: 'pointer', border: '1px solid var(--accent-primary)' }}
              >
                <div style={{ color: '#a5b4fc', fontWeight: 700, fontSize: '0.9rem' }}>▶ Arrays & Two Pointers</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>In Progress (85%)</div>
              </div>
              <div 
                onClick={() => navigate('/learn/prefix-sum')}
                className="glass-panel-interactive" 
                style={{ padding: '16px 24px', cursor: 'pointer', border: '1px solid var(--border-glass)' }}
              >
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Prefix Sum & Range Queries</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unlocked</div>
              </div>
            </div>

            <div style={{ width: '2px', height: '20px', backgroundColor: 'var(--accent-primary)' }} />

            {/* Level 2: Sliding Window & Binary Search */}
            <div style={{ display: 'flex', gap: '20px' }}>
              <div 
                onClick={() => navigate('/learn/sliding-window-technique')}
                className="glass-panel-interactive" 
                style={{ padding: '16px 24px', cursor: 'pointer', border: '1px solid var(--border-glass)' }}
              >
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Sliding Window Technique</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prerequisite: Two Pointers</div>
              </div>
              <div 
                onClick={() => navigate('/learn/binary-search-predicates')}
                className="glass-panel-interactive" 
                style={{ padding: '16px 24px', cursor: 'pointer', border: '1px solid var(--border-glass)' }}
              >
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Binary Search on Answers</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prerequisite: Arrays</div>
              </div>
            </div>

            <div style={{ width: '2px', height: '20px', backgroundColor: 'var(--border-glass)' }} />

            {/* Level 3: Trees & Dynamic Programming */}
            <div style={{ display: 'flex', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '16px 24px', opacity: 0.75 }}>
                <div style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={14} /> Trees & Tree Traversals
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Requires Recursion</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px 24px', opacity: 0.75 }}>
                <div style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={14} /> Dynamic Programming
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Requires Recursion & Memoization</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Curriculum View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {roadmap.map(section => (
            <div key={section.id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                    {section.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {section.description}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: section.progress_pct === 100 ? 'var(--success)' : 'var(--accent-primary)' }}>
                    {section.progress_pct}%
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {section.completed_count}/{section.concepts_count} Completed
                  </div>
                </div>
              </div>

              {/* Concept Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {section.concepts.map(c => {
                  const isDone = c.completed;
                  const isRunning = c.status === 'in_progress';
                  return (
                    <div
                      key={c.id}
                      onClick={() => navigate(`/learn/${c.slug}`)}
                      className="glass-panel-interactive"
                      style={{
                        padding: '14px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: isDone ? 'rgba(16, 185, 129, 0.05)' : (isRunning ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-primary)')
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isDone ? (
                          <CheckCircle size={18} color="var(--success)" />
                        ) : isRunning ? (
                          <Play size={18} color="var(--accent-primary)" fill="var(--accent-primary)" />
                        ) : (
                          <BookOpen size={18} color="var(--text-muted)" />
                        )}
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: isDone ? 'var(--text-primary)' : '#fff' }}>
                            {c.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {isDone ? 'Completed 🎉' : (isRunning ? `Progress: ${c.video_progress_pct}%` : 'Not Started')}
                          </div>
                        </div>
                      </div>

                      <ArrowRight size={16} color="var(--text-muted)" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
