import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Play, CheckCircle2, Flame, ArrowRight, Target, AlertTriangle, 
  Sparkles, TrendingUp, BookOpen, Clock, Award, ShieldAlert, BrainCircuit,
  Zap, Code2, Shield, User, Lock, Mail, Building, Terminal, Layers, Cpu,
  Search, GitBranch, Trophy, BarChart3, Check, Star, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import AuthModal from '../components/AuthModal';

export default function Home() {
  const { user, loginDemo, login, register } = useAuth();
  const navigate = useNavigate();

  // State
  const [data, setData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('demo'); // 'demo' | 'login' | 'register'
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Auth Form Inputs
  const [loginIdent, setLoginIdent] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regTarget, setRegTarget] = useState('Google');

  // Interactive Live Demo tab state
  const [interactiveTab, setInteractiveTab] = useState('concept'); // 'concept' | 'tutor' | 'patterns'

  useEffect(() => {
    if (user) {
      setLoadingDashboard(true);
      api.getDashboardAnalytics()
        .then(res => {
          if (res.success) setData(res);
        })
        .catch(console.error)
        .finally(() => setLoadingDashboard(false));
    }
  }, [user]);

  const handleInlineDemo = async (role) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      await loginDemo(role);
      navigate('/learn');
    } catch (err) {
      setAuthError(err.message || 'Demo login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInlineLogin = async (e) => {
    e.preventDefault();
    if (!loginIdent || !loginPass) {
      setAuthError('Please provide both username/email and password.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      await login(loginIdent, loginPass);
      navigate('/learn');
    } catch (err) {
      setAuthError('Invalid credentials. Try sushmita / shancode123');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInlineRegister = async (e) => {
    e.preventDefault();
    if (!regUser || !regEmail || !regPass) {
      setAuthError('Please fill out all registration fields.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      await register(regUser, regEmail, regPass, regTarget);
      navigate('/learn');
    } catch (err) {
      setAuthError(err.message || 'Registration failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const stats = data?.stats || {};
  const skills = data?.skills || [];
  const weakAreas = data?.weak_areas || [];
  const strongAreas = data?.strong_areas || [];
  const recentSubs = data?.recent_submissions || [];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070a13', color: '#f8fafc' }}>
      
      {/* ========================================================================= */}
      {/* 1. HERO & LANDING SECTION */}
      {/* ========================================================================= */}
      <section style={{
        position: 'relative',
        padding: '56px 24px 72px',
        maxWidth: '1320px',
        margin: '0 auto',
        overflow: 'hidden'
      }}>
        {/* Background Ambient Glows */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '15%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '10%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: user ? '1fr' : '1.15fr 0.85fr',
          gap: '40px',
          alignItems: 'center'
        }}>
          
          {/* Left Hero Column */}
          <div>
            {/* Pill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '100px',
              backgroundColor: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '20px'
            }}>
              <Sparkles size={16} color="var(--accent-primary)" />
              <span>THE CONCEPT-FIRST DSA & INTERVIEW INTELLIGENCE SYSTEM</span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '20px'
            }}>
              Stop Memorizing 500+ Questions. <br />
              <span style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Master the 15 Core Patterns.
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '1.125rem',
              lineHeight: 1.6,
              color: '#94a3b8',
              maxWidth: '620px',
              marginBottom: '32px'
            }}>
              Learn algorithmic concepts with visual intuition, practice code in our live sandbox, unlock progressive hints with the <strong>Socratic AI Tutor</strong>, and track your interview readiness for <strong>FAANG & Top Tech</strong>.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              {user ? (
                <>
                  <button
                    onClick={() => navigate('/learn')}
                    className="glow-btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px 28px',
                      fontSize: '1.05rem',
                      fontWeight: 700
                    }}
                  >
                    <BookOpen size={20} /> Enter Learning Roadmap
                  </button>
                  <button
                    onClick={() => navigate('/problems')}
                    className="btn-secondary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '14px 24px',
                      fontSize: '1rem',
                      fontWeight: 600
                    }}
                  >
                    <Zap size={18} color="var(--accent-primary)" /> Solve Problems
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleInlineDemo('sushmita')}
                    disabled={authLoading}
                    className="glow-btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px 28px',
                      fontSize: '1.05rem',
                      fontWeight: 700
                    }}
                  >
                    <Play size={18} fill="#fff" /> Quick Student Demo Login
                  </button>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="btn-secondary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '14px 24px',
                      fontSize: '1rem',
                      fontWeight: 600
                    }}
                  >
                    Sign In / Register →
                  </button>
                </>
              )}
            </div>

            {/* Quick Metrics Under CTA */}
            <div style={{
              display: 'flex',
              gap: '32px',
              marginTop: '40px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>15</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Curriculum Tracks</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>150+</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Curated Patterns</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>100%</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>PostgreSQL Backed</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>AI</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Socratic Tutor</div>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Direct Quick-Access Auth Card (When Logged Out) */}
          {!user && (
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.15)',
              position: 'relative'
            }}>
              {/* Header */}
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  WORKSPACE ACCESS
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                  Enter ShanCode
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
                  Access your interactive coding workspace & progress
                </p>
              </div>

              {/* Tabs */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: '4px',
                borderRadius: '12px',
                marginBottom: '20px',
                gap: '4px'
              }}>
                <button
                  type="button"
                  onClick={() => { setAuthTab('demo'); setAuthError(''); }}
                  style={{
                    padding: '8px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: authTab === 'demo' ? 'var(--accent-primary)' : 'transparent',
                    color: authTab === 'demo' ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  ⚡ Demo Login
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthTab('login'); setAuthError(''); }}
                  style={{
                    padding: '8px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: authTab === 'login' ? 'var(--accent-primary)' : 'transparent',
                    color: authTab === 'login' ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthTab('register'); setAuthError(''); }}
                  style={{
                    padding: '8px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: authTab === 'register' ? 'var(--accent-primary)' : 'transparent',
                    color: authTab === 'register' ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  Sign Up
                </button>
              </div>

              {authError && (
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  color: '#fca5a5',
                  fontSize: '0.825rem',
                  marginBottom: '16px'
                }}>
                  {authError}
                </div>
              )}

              {/* Tab 1: One Click Demo */}
              {authTab === 'demo' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    type="button"
                    disabled={authLoading}
                    onClick={() => handleInlineDemo('sushmita')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
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
                        width: '38px',
                        height: '38px',
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
                        <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>Login as Student (Sushmita)</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>1,450 XP • 14-Day Streak • Target Google</div>
                      </div>
                    </div>
                    <ArrowRight size={18} color="var(--accent-primary)" />
                  </button>

                  <button
                    type="button"
                    disabled={authLoading}
                    onClick={() => handleInlineDemo('admin')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
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
                        width: '38px',
                        height: '38px',
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
                        <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>Login as Admin</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Full Content & Problem CMS Control</div>
                      </div>
                    </div>
                    <ArrowRight size={18} color="var(--accent-secondary)" />
                  </button>
                </div>
              )}

              {/* Tab 2: Standard Login */}
              {authTab === 'login' && (
                <form onSubmit={handleInlineLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                      USERNAME OR EMAIL
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#070a13', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px' }}>
                      <User size={16} color="#64748b" />
                      <input
                        type="text"
                        placeholder="sushmita or user@shancode.io"
                        value={loginIdent}
                        onChange={e => setLoginIdent(e.target.value)}
                        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                      PASSWORD
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#070a13', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px' }}>
                      <Lock size={16} color="#64748b" />
                      <input
                        type="password"
                        placeholder="shancode123"
                        value={loginPass}
                        onChange={e => setLoginPass(e.target.value)}
                        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="glow-btn-primary"
                    style={{ width: '100%', padding: '12px', marginTop: '6px', fontSize: '0.95rem', fontWeight: 700 }}
                  >
                    {authLoading ? 'Authenticating...' : 'Sign In to Workspace'}
                  </button>
                </form>
              )}

              {/* Tab 3: Register */}
              {authTab === 'register' && (
                <form onSubmit={handleInlineRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                      USERNAME
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#070a13', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px' }}>
                      <User size={14} color="#64748b" />
                      <input
                        type="text"
                        placeholder="sushmita_dev"
                        value={regUser}
                        onChange={e => setRegUser(e.target.value)}
                        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                      EMAIL
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#070a13', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px' }}>
                      <Mail size={14} color="#64748b" />
                      <input
                        type="email"
                        placeholder="sushmita@example.com"
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                      PASSWORD
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#070a13', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px' }}>
                      <Lock size={14} color="#64748b" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={regPass}
                        onChange={e => setRegPass(e.target.value)}
                        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                      TARGET COMPANY
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#070a13', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px' }}>
                      <Building size={14} color="#64748b" />
                      <select
                        value={regTarget}
                        onChange={e => setRegTarget(e.target.value)}
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
                    disabled={authLoading}
                    className="glow-btn-primary"
                    style={{ width: '100%', padding: '10px', marginTop: '6px', fontSize: '0.9rem', fontWeight: 700 }}
                  >
                    {authLoading ? 'Creating...' : 'Create Account & Start'}
                  </button>
                </form>
              )}

            </div>
          )}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LOGGED-IN LEARNER COMMAND CENTER (When Authenticated) */}
      {/* ========================================================================= */}
      {user && (
        <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px 64px' }} className="animate-fade-in">
          
          {/* Welcome Banner */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
            background: 'radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.2), transparent 70%), rgba(15, 23, 42, 0.6)',
            padding: '24px 32px',
            borderRadius: '20px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span className="badge badge-concept">AUTHENTICATED LEARNER</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Role: {user.role?.toUpperCase()}</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                Welcome back, {user?.username ? (user.username.charAt(0).toUpperCase() + user.username.slice(1)) : 'Learner'} 👋
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                Your FAANG preparation pipeline is active. Target: <strong style={{ color: 'var(--accent-cyan)' }}>{user?.target_company || 'Google'}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                onClick={() => navigate('/learn')}
                className="glow-btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 22px' }}
              >
                <BookOpen size={18} /> Open Roadmap
              </button>
              <button
                onClick={() => navigate('/problems')}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}
              >
                <Zap size={18} /> Daily Practice
              </button>
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
                    <span className="badge badge-concept" style={{ marginBottom: '8px' }}>CONTINUE MASTERCLASS</span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>2. Arrays & Two Pointer Technique</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Last studied: <strong>Two Pointer Technique (Converging)</strong> (Video: 85%)
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
                    Practice Related Problem (Two Sum) →
                  </button>
                </div>
              </div>

              {/* Personalized Weak Areas */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Algorithmic Weak Area Diagnostic</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Generated by ShanCode performance telemetry</p>
                  </div>
                </div>

                {weakAreas.length > 0 ? (
                  weakAreas.map((w, idx) => (
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
                        <span style={{ fontWeight: 700, color: '#fff' }}>🔴 {w.topic}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {w.solved}/{w.attempted} solved • Skill: {w.score}%
                        </span>
                      </div>

                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                        <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
                          {w.recommendations?.map((rec, rIdx) => (
                            <li key={rIdx}>{rec}</li>
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
                  ))
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Great job! No critical weak areas detected. Keep solving daily.</p>
                )}
              </div>

            </div>

            {/* Right Column: Daily Goals, Spaced Repetition, Skill Overview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Daily Goal Card */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Target size={20} color="var(--accent-primary)" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Daily Goal</h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
                    <Flame size={18} fill="#f59e0b" /> {user?.streak || 14} Days Streak
                  </div>
                </div>

                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>
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
                  Solve Today's Challenge →
                </button>
              </div>

              {/* Skill Matrix Preview */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Bloom's Skill Matrix</h3>
                  <Link to="/progress" style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>Detailed Radar →</Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {skills.slice(0, 4).map((s, idx) => (
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

            </div>

          </div>

        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. PLATFORM CORE ARCHITECTURE & FEATURE SHOWCASES */}
      {/* ========================================================================= */}
      <section style={{
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '64px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ENGINEERED FOR INTERVIEW MASTERY
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginTop: '6px' }}>
            Why ShanCode is Different
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '640px', margin: '8px auto 0' }}>
            Traditional platforms reward memorization. ShanCode builds foundational pattern intuition through a structured 5-pillar learning system.
          </p>
        </div>

        {/* 3 Main Feature Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Card 1: Sequential Unlocking */}
          <div className="glass-panel" style={{ padding: '32px', position: 'relative' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              marginBottom: '20px'
            }}>
              <GitBranch size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
              Sequential Prerequisite Graph
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Never get stuck jumping into Advanced DP without understanding recursion invariants. Our PostgreSQL DAG engine unlocks lessons only when prerequisites are mastered.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 700 }}>
              <span>Explored in 15 Sections</span> <ChevronRight size={16} />
            </div>
          </div>

          {/* Card 2: Socratic AI Tutor */}
          <div className="glass-panel" style={{ padding: '32px', position: 'relative' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-secondary)',
              marginBottom: '20px'
            }}>
              <BrainCircuit size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
              Socratic AI Progressive Guidance
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Get hints without spoiling the solution. The AI Tutor asks guiding questions, analyzes time/space complexity bottlenecks, and teaches you how to think like an interviewer.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-secondary)', fontSize: '0.85rem', fontWeight: 700 }}>
              <span>3-Tier Pedagogical Hints</span> <ChevronRight size={16} />
            </div>
          </div>

          {/* Card 3: 4-Tier Pattern Engine */}
          <div className="glass-panel" style={{ padding: '32px', position: 'relative' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
              marginBottom: '20px'
            }}>
              <Layers size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
              4-Tier Pattern Mastery Track
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
              From two pointers to monotonic search spaces. Progress through Level 1 Foundations, Level 2 Standard, Level 3 Variations, and Level 4 FAANG Hard scenarios.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 700 }}>
              <span>Pattern Radar Tracking</span> <ChevronRight size={16} />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CURRICULUM PREVIEW GRID */}
      {/* ========================================================================= */}
      <section style={{
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '32px 24px 72px'
      }}>
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '40px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge badge-concept" style={{ marginBottom: '8px' }}>CURRICULUM SYLLABUS</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>Structured Learning Roadmap</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Master each concept with structured video lessons, visual SVGs, and automated quizzes.</p>
            </div>
            <button
              onClick={() => navigate('/learn')}
              className="glow-btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              Explore All 15 Tracks →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { id: 1, title: '1. Complexity & Big-O', icon: 'Cpu', desc: 'Asymptotic growth, runtime invariants, and memory stack models.', status: 'Unlocked' },
              { id: 2, title: '2. Arrays & Two Pointers', icon: 'Layers', desc: 'Fast-slow pointers, converging bounds, and in-place swapping.', status: 'Unlocked' },
              { id: 3, title: '3. Sliding Window', icon: 'Maximize2', desc: 'Dynamic boundary windows and frequency map caching.', status: 'Prerequisite Required' },
              { id: 4, title: '4. Binary Search Space', icon: 'Search', desc: 'Monotonic predicate search spaces and boundary invariants.', status: 'Prerequisite Required' },
              { id: 5, title: '5. Trees & Graph Traversals', icon: 'GitBranch', desc: 'BFS level-order, DFS recursion, and cycle reachability.', status: 'Prerequisite Required' },
              { id: 6, title: '6. Dynamic Programming', icon: 'Sparkles', desc: 'Overlapping subproblems, state transitions, and tabulation.', status: 'Prerequisite Required' }
            ].map(track => (
              <div
                key={track.id}
                onClick={() => navigate(user ? '/learn' : '/learn')}
                style={{
                  padding: '20px',
                  backgroundColor: '#070a13',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>{track.title}</span>
                  <span className={`badge ${track.status === 'Unlocked' ? 'badge-easy' : 'badge-hard'}`}>
                    {track.status}
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.825rem', lineHeight: 1.5 }}>{track.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FOOTER & DEPLOYMENT HEALTH INDICATOR */}
      {/* ========================================================================= */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: '#05070d',
        padding: '48px 24px 32px'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Code2 size={20} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                SHAN<span style={{ color: 'var(--accent-primary)' }}>CODE</span>
              </span>
            </div>

            {/* Live Stack Badges */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--success)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                <CheckCircle2 size={13} /> Supabase PostgreSQL Online
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#a5b4fc',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                <Zap size={13} /> Socratic AI Ready
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: '#64748b',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '20px'
          }}>
            <div>© 2026 ShanCode Platform. Learn the concept. Master the pattern. Solve the problem.</div>
            <div>Deployment Status: Production Ready</div>
          </div>
        </div>
      </footer>

      {/* Auth Modal Triggerable from Hero */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />

    </div>
  );
}
