import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Shield, User, Lock, Mail, Building, ArrowRight, Code2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loginDemo, register } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('demo'); // 'demo' | 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCompany, setRegCompany] = useState('Google');

  const handleDemo = async (role) => {
    setLoading(true);
    setError('');
    try {
      await loginDemo(role);
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
      navigate('/learn');
    } catch (err) {
      setError('Invalid credentials. Try sushmita / shancode123');
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
      navigate('/learn');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative'
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#0d1322',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.15)',
        padding: '36px',
        position: 'relative'
      }} className="animate-fade-in">
        
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
            <Code2 size={16} /> ShanCode Platform Auth
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Sign In & Enter App
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Master DSA concepts, practice code, and track FAANG readiness
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr',
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
              color: activeTab === 'demo' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            ⚡ Demo Access
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
              color: activeTab === 'login' ? '#fff' : 'var(--text-secondary)'
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
              color: activeTab === 'register' ? '#fff' : 'var(--text-secondary)'
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
            borderRadius: '10px',
            color: '#fca5a5',
            fontSize: '0.825rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* Tab 1: One-Click Demo */}
        {activeTab === 'demo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemo('sushmita')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                borderRadius: '12px',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'left'
              }}
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
                  <User size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Student Profile (Sushmita)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1,450 XP • 14d Streak • Target Google</div>
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
                padding: '16px',
                backgroundColor: 'rgba(139, 92, 246, 0.12)',
                border: '1px solid rgba(139, 92, 246, 0.35)',
                borderRadius: '12px',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'left'
              }}
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
                  <Shield size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Platform Administrator</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Problem Creator & Curriculum Management</div>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '10px 14px' }}>
                <User size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="sushmita or user@shancode.io"
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '10px 14px' }}>
                <Lock size={16} color="var(--text-muted)" />
                <input
                  type="password"
                  placeholder="shancode123"
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
              style={{ width: '100%', padding: '12px', marginTop: '6px', fontSize: '0.95rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            </button>
          </form>
        )}

        {/* Tab 3: Sign Up */}
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
                  placeholder="dev_user"
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
                  placeholder="dev@example.com"
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
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glow-btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '6px', fontSize: '0.95rem' }}
            >
              {loading ? 'Creating...' : 'Create Account & Enter'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
