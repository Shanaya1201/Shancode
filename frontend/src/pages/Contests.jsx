import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, Users, ArrowRight, Award, Shield, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function Contests() {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeContest, setActiveContest] = useState(null);

  useEffect(() => {
    api.getContests()
      .then(res => {
        if (res.success) {
          setContests(res.contests);
          if (res.contests.length > 0) {
            // Fetch details of first contest for leaderboard
            api.getContest(res.contests[0].id).then(cRes => {
              if (cRes.success) setActiveContest(cRes.contest);
            });
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(99, 102, 241, 0.12))',
        border: '1px solid var(--border-glass)',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: '8px' }}>
            RATED CONTESTS
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Competitive Coding Arena
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Test your problem-solving speed under time pressure and climb the Shancode global ELO leaderboard.
          </p>
        </div>

        <div style={{
          padding: '16px 24px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '12px',
          border: '1px solid var(--border-glass)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>YOUR CONTEST RATING</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)' }}>1540</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Top 12%</span>
        </div>
      </div>

      {/* Contests Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        
        {/* Left: Contests List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Scheduled & Past Contests</h2>
          
          {contests.map(c => {
            const isUpcoming = c.status === 'upcoming';
            return (
              <div key={c.id} className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span className={`badge badge-${isUpcoming ? 'easy' : 'concept'}`} style={{ marginBottom: '6px' }}>
                      {isUpcoming ? '🟢 UPCOMING' : 'FINISHED'}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{c.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.description}</p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                      <Clock size={15} color="var(--accent-primary)" /> {c.duration_minutes} Mins
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rated: ELO Rating</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Starts: {new Date(c.start_time).toLocaleDateString()} at {new Date(c.start_time).toLocaleTimeString()}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigate('/problems/two-sum')}
                      className={isUpcoming ? 'glow-btn-primary' : 'btn-secondary'}
                      style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                    >
                      {isUpcoming ? 'Register for Contest' : 'Virtual Contest Mode'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Live Standings / Leaderboard */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Trophy size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
              Contest Leaderboard
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { rank: 1, name: 'alex_code', score: 300, penalty: 24, delta: '+45', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alex' },
              { rank: 2, name: 'yashu', score: 200, penalty: 38, delta: '+28', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80' },
              { rank: 3, name: 'sarah_dsa', score: 200, penalty: 44, delta: '+18', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sarah' },
              { rank: 4, name: 'dev_master', score: 100, penalty: 12, delta: '+5', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dev' },
              { rank: 5, name: 'coder_99', score: 100, penalty: 29, delta: '-12', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=99' }
            ].map(p => (
              <div
                key={p.rank}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: p.name === 'yashu' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-primary)',
                  borderRadius: '8px',
                  border: p.name === 'yashu' ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 800, width: '20px', color: p.rank === 1 ? '#f59e0b' : (p.rank === 2 ? '#94a3b8' : '#64748b') }}>
                    #{p.rank}
                  </span>
                  <img src={p.avatar} alt={p.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                  <span style={{ fontWeight: 600, color: '#fff' }}>{p.name}</span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{p.score} pts</span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.penalty}m penalty ({p.delta})</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
