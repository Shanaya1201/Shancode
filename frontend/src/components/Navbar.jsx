import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Code2, Flame, Zap, Bell, Search, User, LogOut, CheckCircle, 
  BookOpen, Trophy, BarChart3, MessageSquare, ShieldCheck, Sparkles, LogIn, ArrowRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { user, logout, loginDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ concepts: [], problems: [] });
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      api.getNotifications()
        .then(res => {
          if (res.success) setNotifications(res.notifications);
        })
        .catch(() => {});
    }
  }, [user]);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 1) {
      try {
        const probRes = await api.getProblems({ search: q });
        setSearchResults({
          problems: probRes.problems?.slice(0, 5) || []
        });
      } catch (err) {}
    } else {
      setSearchResults({ problems: [] });
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Code2 },
    { name: 'Learn', path: '/learn', icon: BookOpen },
    { name: 'Problems', path: '/problems', icon: Zap },
    { name: 'Patterns', path: '/patterns', icon: Sparkles },
    { name: 'Contests', path: '/contests', icon: Trophy },
    { name: 'Progress', path: '/progress', icon: BarChart3 },
    { name: 'Discuss', path: '/discuss', icon: MessageSquare }
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/admin', icon: ShieldCheck });
  }

  return (
    <>
      <nav style={{
        height: '64px',
        backgroundColor: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-glass)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
            }}>
              <Code2 size={22} />
            </div>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                SHAN<span style={{ color: 'var(--accent-primary)' }}>CODE</span>
              </span>
              <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '-3px' }}>
                CONCEPT FIRST
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={16} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right actions: Search, Streaks, XP, Notifications, Profile / Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Quick Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              fontSize: '0.825rem',
              cursor: 'pointer'
            }}
          >
            <Search size={14} />
            <span>Search concepts, problems...</span>
            <kbd style={{ backgroundColor: 'var(--bg-primary)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>⌘K</kbd>
          </button>

          {user ? (
            <>
              {/* Streak Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '8px',
                color: '#f59e0b',
                fontSize: '0.85rem',
                fontWeight: 700
              }}>
                <Flame size={16} fill="#f59e0b" />
                <span>{user.streak || 14}d</span>
              </div>

              {/* XP Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: '8px',
                color: '#a5b4fc',
                fontSize: '0.85rem',
                fontWeight: 700
              }}>
                <Zap size={16} fill="#a5b4fc" />
                <span>{user.xp || 1450} XP</span>
              </div>

              {/* Notifications */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Bell size={17} />
                  {notifications.filter(n => !n.is_read).length > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'var(--accent-primary)',
                      borderRadius: '50%'
                    }} />
                  )}
                </button>

                {notificationsOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '44px',
                    width: '320px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '12px',
                    zIndex: 60
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Notifications</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', cursor: 'pointer' }}>Mark all read</span>
                    </div>
                    {notifications.length === 0 ? (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>No new notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{
                          padding: '8px',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          fontSize: '0.8rem'
                        }}>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{n.title}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* User Profile dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"}
                    alt={user.username}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }}
                  />
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '46px',
                    width: '210px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '8px',
                    zIndex: 60
                  }}>
                    <div style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{user.username}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Target: {user.target_company || 'Google'}</div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        borderRadius: '6px'
                      }}
                    >
                      <User size={15} /> My Profile
                    </Link>
                    <button
                      onClick={() => { loginDemo(user.role === 'admin' ? 'sushmita' : 'admin'); setUserMenuOpen(false); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-secondary)',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        borderRadius: '6px'
                      }}
                    >
                      <ShieldCheck size={15} /> Switch to {user.role === 'admin' ? 'Student' : 'Admin'} Mode
                    </button>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--danger)',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        borderRadius: '6px'
                      }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="glow-btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  fontSize: '0.85rem'
                }}
              >
                <LogIn size={15} /> Sign In / Demo
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />

      {/* Global Search Modal */}
      {searchOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '100px'
        }}
        onClick={() => setSearchOpen(false)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              width: '560px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-glass)',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <Search size={20} color="var(--accent-primary)" />
              <input
                autoFocus
                type="text"
                placeholder="Search concepts, patterns, problems (e.g. Sliding Window, Two Sum)..."
                value={searchQuery}
                onChange={handleSearch}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ESC to close</span>
            </div>

            <div style={{ marginTop: '14px', maxHeight: '350px', overflowY: 'auto' }}>
              {searchResults.problems?.length > 0 ? (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>PROBLEMS & CONCEPTS</div>
                  {searchResults.problems.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        navigate(`/problems/${p.slug}`);
                        setSearchOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: 'var(--bg-tertiary)',
                        marginBottom: '6px'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{p.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.topic} • {p.pattern_name || 'Pattern'}</div>
                      </div>
                      <span className={`badge badge-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Type keywords like "Two Pointers", "Sliding Window", or "Binary Search" to explore.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
