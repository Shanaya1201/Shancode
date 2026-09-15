import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, CheckCircle, Clock, Circle, ArrowUpDown, 
  Sparkles, Zap, Building2, BookOpen, BrainCircuit, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from 'lucide-react';
import { api } from '../services/api';

export default function Problems() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [difficulty, setDifficulty] = useState('All');
  const [topic, setTopic] = useState('All');
  const [company, setCompany] = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const fetchProblems = () => {
    setLoading(true);
    api.getProblems({ difficulty, topic, company, status, search })
      .then(res => {
        if (res.success) {
          setProblems(res.problems || []);
          setCurrentPage(1);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProblems();
  }, [difficulty, topic, company, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProblems();
  };

  const topics = [
    'All', 'Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Linked Lists',
    'Stacks & Queues', 'Binary Search', 'Trees & BST', 'Heaps & Priority Queue',
    'Graphs & BFS/DFS', 'Backtracking', '1D Dynamic Programming', '2D Dynamic Programming',
    'Greedy Algorithms', 'Tries & Prefix Trees', 'Bit Manipulation & Math'
  ];
  const companies = ['All', 'Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix', 'Uber', 'Stripe', 'Bloomberg'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const statuses = ['All', 'Solved', 'Attempted', 'Unsolved'];

  // Pagination calculations
  const totalProblems = problems.length;
  const totalPages = Math.ceil(totalProblems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProblems = problems.slice(startIndex, startIndex + pageSize);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
        padding: '24px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))',
        border: '1px solid var(--border-glass)'
      }}>
        <div>
          <span className="badge badge-concept" style={{ marginBottom: '8px' }}>1,000+ PROBLEM ARENA</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Curated Coding Problems
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Every problem connects back to a foundational concept. Total in Catalog: <strong>{totalProblems} Problems</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/patterns')}
            className="glow-btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Sparkles size={16} /> Pattern Mastery Mode
          </button>
        </div>
      </div>

      {/* Multi-Filter Bar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '8px',
            padding: '8px 14px',
            border: '1px solid var(--border-glass)'
          }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search 1,000+ problems by title, topic, or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#fff',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <button type="submit" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Search
          </button>
        </form>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Difficulty filter */}
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Difficulty</span>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: '#fff',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              {difficulties.map(d => <option key={d} value={d} style={{ background: '#0f172a' }}>{d}</option>)}
            </select>
          </div>

          {/* Topic filter */}
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Topic</span>
            <select
              value={topic}
              onChange={e => setTopic(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: '#fff',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              {topics.map(t => <option key={t} value={t} style={{ background: '#0f172a' }}>{t}</option>)}
            </select>
          </div>

          {/* Company filter */}
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Target Company</span>
            <select
              value={company}
              onChange={e => setCompany(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: '#fff',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              {companies.map(c => <option key={c} value={c} style={{ background: '#0f172a' }}>{c}</option>)}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>My Status</span>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: '#fff',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              {statuses.map(s => <option key={s} value={s} style={{ background: '#0f172a' }}>{s}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* Problems Data Table */}
      <div className="glass-panel" style={{ overflow: 'hidden', marginBottom: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading problems...
          </div>
        ) : problems.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No problems match the selected filters.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', backgroundColor: 'var(--bg-primary)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 18px', width: '50px' }}>Status</th>
                <th style={{ padding: '14px 18px' }}>Title</th>
                <th style={{ padding: '14px 18px' }}>Difficulty</th>
                <th style={{ padding: '14px 18px' }}>Topic / Pattern</th>
                <th style={{ padding: '14px 18px' }}>Prerequisite Concept</th>
                <th style={{ padding: '14px 18px' }}>Acceptance</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProblems.map((p, idx) => {
                const isSolved = p.status === 'solved';
                const isAttempted = p.status === 'attempted';
                return (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/problems/${p.slug}`)}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                      backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.06)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                  >
                    <td style={{ padding: '16px 18px' }}>
                      {isSolved ? (
                        <CheckCircle size={18} color="var(--success)" />
                      ) : isAttempted ? (
                        <Clock size={18} color="var(--warning)" />
                      ) : (
                        <Circle size={18} color="var(--text-dim)" />
                      )}
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                        {p.title}
                      </div>
                      {p.company_tags?.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                          {p.company_tags.slice(0, 3).map(c => (
                            <span key={c} style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <span className={`badge badge-${p.difficulty?.toLowerCase()}`}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '16px 18px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {p.topic}
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      {p.concept_title ? (
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/learn/${p.concept_slug}`);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--accent-primary)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textDecoration: 'none'
                          }}
                        >
                          <BookOpen size={13} /> {p.concept_title}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Direct Practice</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 18px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                      {p.acceptance_rate}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Bar */}
      {totalProblems > pageSize && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '12px',
          border: '1px solid var(--border-glass)'
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + pageSize, totalProblems)}</strong> of <strong>{totalProblems}</strong> problems
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              style={{
                padding: '6px 10px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '6px',
                color: currentPage === 1 ? 'var(--text-muted)' : '#fff',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronsLeft size={16} />
            </button>

            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '6px 12px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '6px',
                color: currentPage === 1 ? 'var(--text-muted)' : '#fff',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>

            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', padding: '0 8px' }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '6px 12px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '6px',
                color: currentPage === totalPages ? 'var(--text-muted)' : '#fff',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              style={{
                padding: '6px 10px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '6px',
                color: currentPage === totalPages ? 'var(--text-muted)' : '#fff',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
