import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Award, CheckCircle2, Lock, ArrowRight, 
  Maximize2, Sliders, Target, BarChart2, Share2, Cpu 
} from 'lucide-react';
import { api } from '../services/api';

export default function PatternMastery() {
  const navigate = useNavigate();
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPatterns()
      .then(res => {
        if (res.success) setPatterns(res.patterns);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Maximize2': return <Maximize2 size={24} color="var(--accent-primary)" />;
      case 'Sliders': return <Sliders size={24} color="var(--accent-cyan)" />;
      case 'Target': return <Target size={24} color="var(--success)" />;
      case 'BarChart2': return <BarChart2 size={24} color="var(--warning)" />;
      case 'Share2': return <Share2 size={24} color="#a855f7" />;
      case 'Cpu': return <Cpu size={24} color="#ec4899" />;
      default: return <Sparkles size={24} color="var(--accent-primary)" />;
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
        border: '1px solid var(--border-glass)',
        marginBottom: '32px'
      }}>
        <span className="badge badge-concept" style={{ marginBottom: '8px' }}>KILLER FEATURE</span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Pattern Mastery Mode
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '750px' }}>
          Don't memorize random problems. Master underlying algorithmic archetypes across progressive difficulty tiers to develop instant pattern recognition during interviews.
        </p>
      </div>

      {/* Pattern Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
        {patterns.map(p => (
          <div key={p.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Pattern Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    padding: '10px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-glass)'
                  }}>
                    {getIcon(p.icon)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{p.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                      Level {p.current_level} of {p.total_levels}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: p.mastery_pct >= 80 ? 'var(--success)' : 'var(--accent-primary)' }}>
                    {p.mastery_pct}%
                  </span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mastery</div>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
                {p.description}
              </p>

              {/* Levels Progression */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {p.levels?.map(lvl => {
                  const isCompleted = p.current_level > lvl.level_number;
                  const isCurrent = p.current_level === lvl.level_number;
                  return (
                    <div
                      key={lvl.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        backgroundColor: isCurrent ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-primary)',
                        border: isCurrent ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isCompleted ? (
                          <CheckCircle2 size={16} color="var(--success)" />
                        ) : isCurrent ? (
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
                        ) : (
                          <Lock size={14} color="var(--text-dim)" />
                        )}
                        <span style={{ fontWeight: 600, color: isCurrent ? '#fff' : 'var(--text-secondary)' }}>
                          Level {lvl.level_number}: {lvl.title}
                        </span>
                      </div>
                      <span className={`badge badge-${lvl.difficulty.toLowerCase()}`}>
                        {lvl.required_count} {lvl.difficulty}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => navigate(`/problems?pattern=${p.slug}`)}
              className="glow-btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
            >
              Practice {p.name} Drill <ArrowRight size={15} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
