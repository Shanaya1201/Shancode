import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Shield, User, Lock, Mail, Building, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialTab = 'demo' }) {
  const { login, loginDemo, register } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialTab); // 'demo' | 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCompany, setRegCompany] = useState('Google');

  if (!isOpen) return null;

  const handleDemo = async (role) => {
    setLoading(true);
    setError('');
    try {
      await loginDemo(role);
      onClose();
      navigate('/learn');
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(usernameOrEmail, password);
      onClose();
      navigate('/learn');
    } catch (err) {
      setError(err.message || 'Invalid username/email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regUsername || !regEmail || !regPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(regUsername, regEmail, regPassword, regCompany);
      onClose();
      navigate('/learn');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} onClick={onClose}>
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#0d1322',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(99, 102, 241, 0.2)',
          padding: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="animate-fade-in"
      >
        {/* Glow Header Accent */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '240px',
          height: '140px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '100px',
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '12px'
          }}>
            <Sparkles size={14} /> Enter ShanCode Platform
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Concept-First Mastery
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Sign in to unlock personalized learning & FAANG prep
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '20px',
          gap: '4px'
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('demo'); setError(''); }}
            style={{
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeTab === 'demo' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'demo' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            ⚡ Quick Demo
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); }}
            style={{
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeTab === 'login' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'login' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(''); }}
            style={{
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeTab === 'register' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'register' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#fca5a5',
            fontSize: '0.825rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* Tab 1: Quick 1-Click Demo */}
        {activeTab === 'demo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '4px' }}>
              Explore the platform instantly with pre-populated learning progress, test submissions, and rating metrics:
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemo('sushmita')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                borderRadius: '12px',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.22)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.12)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(99, 102, 241, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)'
                }}>
                  <User size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Student Learner Profile</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Demo User: sushmita (1,450 XP • 14d Streak)</div>
                </div>
              </div>
              <ArrowRight size={18} color="var(--accent-primary)" />
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemo('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                backgroundColor: 'rgba(139, 92, 246, 0.12)',
                border: '1px solid rgba(139, 92, 246, 0.35)',
                borderRadius: '12px',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.22)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.12)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(139, 92, 246, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-secondary)'
                }}>
                  <Shield size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Platform Administrator</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Demo User: admin (Full Curriculum & Problem CMS)</div>
                </div>
              </div>
              <ArrowRight size={18} color="var(--accent-secondary)" />
            </button>
          </div>
        )}

        {/* Tab 2: Standard Login */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                USERNAME OR EMAIL
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '10px',
                padding: '10px 14px'
              }}>
                <User size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="e.g. sushmita or user@shancode.io"
                  value={usernameOrEmail}
                  onChange={e => setUsernameOrEmail(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                PASSWORD
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '10px',
                padding: '10px 14px'
              }}>
                <Lock size={16} color="var(--text-muted)" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glow-btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px',
                fontSize: '0.95rem'
              }}
            >
              {loading ? <Loader2 size={18} className="spin" /> : 'Sign In to Workspace'}
            </button>
          </form>
        )}

        {/* Tab 3: Sign Up / Register */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                USERNAME
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '8px 12px' }}>
                <User size={15} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="alex_coder"
                  value={regUsername}
                  onChange={e => setRegUsername(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                EMAIL ADDRESS
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '8px 12px' }}>
                <Mail size={15} color="var(--text-muted)" />
                <input
                  type="email"
                  placeholder="alex@example.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                PASSWORD
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '8px 12px' }}>
                <Lock size={15} color="var(--text-muted)" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                TARGET COMPANY
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '8px 12px' }}>
                <Building size={15} color="var(--text-muted)" />
                <select
                  value={regCompany}
                  onChange={e => setRegCompany(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem' }}
                >
                  <option value="Google" style={{ background: '#0f172a' }}>Google</option>
                  <option value="Meta" style={{ background: '#0f172a' }}>Meta</option>
                  <option value="Amazon" style={{ background: '#0f172a' }}>Amazon</option>
                  <option value="Microsoft" style={{ background: '#0f172a' }}>Microsoft</option>
                  <option value="Apple" style={{ background: '#0f172a' }}>Apple</option>
                  <option value="Uber" style={{ background: '#0f172a' }}>Uber</option>
                  <option value="Netflix" style={{ background: '#0f172a' }}>Netflix</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glow-btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px',
                fontSize: '0.95rem'
              }}
            >
              {loading ? <Loader2 size={18} className="spin" /> : 'Create Account & Launch'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
