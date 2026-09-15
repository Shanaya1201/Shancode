import React, { useState } from 'react';
import { User, Award, Flame, Zap, Building2, Globe, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [bio, setBio] = useState(user?.bio || 'Passionate DSA learner targeting FAANG Software Engineer roles');
  const [targetCompany, setTargetCompany] = useState(user?.target_company || 'Google');
  const [githubUrl, setGithubUrl] = useState(user?.github_url || 'https://github.com/Shanaya1201');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await api.updateProfile({
        bio,
        target_company: targetCompany,
        github_url: githubUrl
      });
      if (res.success) {
        setSaveSuccess(true);
        refreshUser();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const badges = [
    { title: 'First Blood', desc: 'Solved first coding problem', icon: '🏆', unlocked: true },
    { title: 'Concept Scholar', desc: 'Passed first concept quiz', icon: '📖', unlocked: true },
    { title: 'Flame Keeper', desc: '7-day streak maintained', icon: '🔥', unlocked: true },
    { title: 'Two Pointer Virtuoso', desc: '100% mastery on Two Pointers', icon: '⚡', unlocked: true },
    { title: 'Arena Warrior', desc: 'Competed in rated contest', icon: '⚔️', unlocked: false },
    { title: 'Pure Intuition', desc: '10 solves without hints', icon: '🧠', unlocked: false }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
      
      {/* Profile Overview Card */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"}
            alt={user?.username}
            style={{ width: '96px', height: '96px', borderRadius: '50%', border: '3px solid var(--accent-primary)', boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}
          />

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{user?.username || 'Sushmita'}</h1>
              <span className="badge badge-concept">{user?.role?.toUpperCase() || 'STUDENT'}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>{user?.bio}</p>

            <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
              <span style={{ color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Flame size={16} fill="#f59e0b" /> {user?.streak || 12} Day Streak
              </span>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Zap size={16} fill="var(--accent-primary)" /> {user?.xp || 1250} XP
              </span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Building2 size={16} /> Target: {user?.target_company || 'Google'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
          Achievement Badges
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {badges.map((b, idx) => (
            <div
              key={idx}
              style={{
                padding: '14px',
                borderRadius: '10px',
                backgroundColor: b.unlocked ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-primary)',
                border: b.unlocked ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                opacity: b.unlocked ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '1.8rem' }}>{b.icon}</div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{b.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Settings Form */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
          Profile Settings
        </h3>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Bio</label>
            <input
              type="text"
              value={bio}
              onChange={e => setBio(e.target.value)}
              style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Target Company</label>
            <select
              value={targetCompany}
              onChange={e => setTargetCompany(e.target.value)}
              style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', outline: 'none' }}
            >
              {['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>GitHub Profile URL</label>
            <input
              type="text"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', outline: 'none' }}
            />
          </div>

          {saveSuccess && (
            <div style={{ color: 'var(--success)', fontSize: '0.85rem' }}>✓ Profile saved successfully!</div>
          )}

          <button type="submit" disabled={saving} className="glow-btn-primary" style={{ alignSelf: 'flex-start' }}>
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

    </div>
  );
}
