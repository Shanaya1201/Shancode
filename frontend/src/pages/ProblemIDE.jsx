import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Play, Send, RotateCcw, CheckCircle2, XCircle, Clock, 
  HelpCircle, Sparkles, BookOpen, Bot, Award, FileCode, 
  ChevronRight, AlertTriangle, Eye, ShieldCheck 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProblemIDE() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [leftTab, setLeftTab] = useState('description'); // description, hints, solution, tutor, submissions
  
  // Code Editor state
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  
  // Test case runner state
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [executing, setExecuting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submissionsHistory, setSubmissionsHistory] = useState([]);

  // Progressive Hints state
  const [unlockedHints, setUnlockedHints] = useState({});
  const [hintUnlocking, setHintUnlocking] = useState(false);

  // Full Solution state
  const [solutionData, setSolutionData] = useState(null);
  const [solutionUnlocked, setSolutionUnlocked] = useState(false);

  // Socratic AI Tutor state
  const [tutorMessages, setTutorMessages] = useState([
    { sender: 'ai', text: '👋 Hi! Need a directional clue or want me to diagnose an edge case in your code? Ask away!' }
  ]);
  const [tutorInput, setTutorInput] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);

  // Anti-cheating telemetry
  const [pasteCount, setPasteCount] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) setTabSwitches(prev => prev + 1);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    api.getProblem(slug)
      .then(res => {
        if (res.success && res.problem) {
          setProblem(res.problem);
          const defaultCode = res.problem.starter_code?.[language] || '# Write your solution here\n';
          setCode(defaultCode);
          if (res.problem.sample_tests?.length > 0) {
            setCustomInput(res.problem.sample_tests[0].input_data);
          }
        } else {
          setLoadError(res.error || 'Problem not found');
        }
      })
      .catch(err => {
        console.error('Failed to load problem:', err);
        setLoadError(err.message || 'Error loading coding workspace');
      })
      .finally(() => setLoading(false));

    // Fetch submission history
    api.getSubmissionsHistory()
      .then(res => {
        if (res.success) setSubmissionsHistory(res.submissions);
      })
      .catch(() => {});
  }, [slug]);

  // Handle language switch
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (problem?.starter_code?.[newLang]) {
      setCode(problem.starter_code[newLang]);
    }
  };

  // Run code on test cases
  const handleRunCode = async () => {
    if (!problem) return;
    setExecuting(true);
    setRunResult(null);
    setSubmissionResult(null);

    try {
      const res = await api.runCode({
        problem_id: problem.id,
        language,
        code,
        custom_test_cases: problem.sample_tests
      });

      if (res.success) {
        setRunResult(res.result);
      }
    } catch (err) {
      setRunResult({ verdict: 'Runtime Error', error: err.message });
    } finally {
      setExecuting(false);
    }
  };

  // Submit code for full evaluation
  const handleFinalSubmit = async () => {
    if (!problem) return;
    setExecuting(true);
    setRunResult(null);
    setSubmissionResult(null);

    try {
      const res = await api.submitCode({
        problem_id: problem.id,
        language,
        code,
        integrity_meta: {
          paste_count: pasteCount,
          tab_switches: tabSwitches
        }
      });

      if (res.success) {
        setSubmissionResult(res);
        if (res.verdict === 'Accepted') {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 }
          });
        }
        // Refresh submissions
        api.getSubmissionsHistory(problem.id).then(hRes => {
          if (hRes.success) setSubmissionsHistory(hRes.submissions);
        });
      }
    } catch (err) {
      setSubmissionResult({ verdict: 'Runtime Error', failed_case: { error_message: err.message } });
    } finally {
      setExecuting(false);
    }
  };

  // Unlock progressive hint
  const handleUnlockHint = async (tier) => {
    if (!problem) return;
    setHintUnlocking(true);
    try {
      const res = await api.unlockHint(problem.id, tier);
      if (res.success) {
        setUnlockedHints(prev => ({ ...prev, [tier]: res.hint_text }));
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setHintUnlocking(false);
    }
  };

  // Unlock solution
  const handleUnlockSolution = async () => {
    if (!problem) return;
    try {
      const res = await api.getSolution(problem.id);
      if (res.success) {
        setSolutionData(res.solution);
        setSolutionUnlocked(true);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // AI Tutor chat
  const handleAskTutor = async (customPrompt) => {
    const q = customPrompt || tutorInput;
    if (!q.trim()) return;

    const newMsgs = [...tutorMessages, { sender: 'user', text: q }];
    setTutorMessages(newMsgs);
    setTutorInput('');
    setTutorLoading(true);

    try {
      const res = await api.askAiTutor({
        question: q,
        problemTitle: problem?.title,
        conceptTitle: problem?.concept?.title,
        codeContext: code,
        failedTestDiff: submissionResult?.failed_case || runResult?.failed_case,
        mode: submissionResult && submissionResult.verdict !== 'Accepted' ? 'debug_submission' : 'hint'
      });

      if (res.success) {
        setTutorMessages(prev => [...prev, {
          sender: 'ai',
          text: res.reply,
          suggested_actions: res.suggested_actions
        }]);
      }
    } catch (e) {
      setTutorMessages(prev => [...prev, { sender: 'ai', text: 'Error contacting AI tutor. Please try again!' }]);
    } finally {
      setTutorLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Loading Coding Workspace...
        </div>
      </div>
    );
  }

  if (loadError || !problem) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: '16px', textAlign: 'center', padding: '24px' }}>
        <AlertTriangle size={48} color="#ef4444" />
        <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700 }}>Problem Unavailable</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>
          {loadError || 'The requested problem could not be loaded.'}
        </p>
        <Link to="/problems" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginTop: '8px' }}>
          <ChevronRight size={18} /> Back to Problems Catalog
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      height: 'calc(100vh - 64px)',
      display: 'grid',
      gridTemplateColumns: '1fr 1.15fr',
      backgroundColor: 'var(--bg-primary)',
      overflow: 'hidden'
    }}>
      
      {/* ================= LEFT PANE: Problem Description & Learning Guidance ================= */}
      <div style={{
        borderRight: '1px solid var(--border-glass)',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-secondary)',
        overflowY: 'hidden'
      }}>
        {/* Left Sub-Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-glass)',
          padding: '0 12px',
          backgroundColor: 'var(--bg-primary)'
        }}>
          {[
            { id: 'description', label: 'Description', icon: FileCode },
            { id: 'hints', label: 'Progressive Hints', icon: HelpCircle },
            { id: 'solution', label: 'Solution Analysis', icon: Award },
            { id: 'tutor', label: 'AI Tutor', icon: Bot },
            { id: 'submissions', label: 'Submissions', icon: Clock }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = leftTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setLeftTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  background: 'transparent',
                  border: 'none',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Icon size={14} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Left Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* TAB 1: Description */}
          {leftTab === 'description' && (
            <div>
              {/* Title & Difficulty Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                  {problem.title}
                </h1>
                <span className={`badge badge-${problem.difficulty?.toLowerCase()}`}>
                  {problem.difficulty}
                </span>
              </div>

              {/* Concept Prerequisite Check */}
              {problem.concept && !problem.concept.is_completed && (
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '10px',
                  marginBottom: '18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>
                      ⚡ Concept Prerequisite: {problem.concept.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      We recommend mastering the intuition first.
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/learn/${problem.concept.slug}`)}
                    className="glow-btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    Learn Concept →
                  </button>
                </div>
              )}

              {/* Company Tags */}
              {problem.company_tags?.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', marginBottom: '18px', flexWrap: 'wrap' }}>
                  {problem.company_tags.map(c => (
                    <span key={c} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                      🏢 {c}
                    </span>
                  ))}
                </div>
              )}

              {/* Problem Description Body */}
              <div style={{
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                marginBottom: '24px',
                whiteSpace: 'pre-line'
              }}>
                {problem.description}
              </div>

              {/* Examples */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Examples</h3>
                {problem.examples?.map((ex, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px',
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-glass)',
                      marginBottom: '12px',
                      fontFamily: 'var(--font-code)',
                      fontSize: '0.825rem'
                    }}
                  >
                    <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <strong style={{ color: '#fff' }}>Input:</strong> {ex.input}
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <strong style={{ color: 'var(--success)' }}>Output:</strong> {ex.output}
                    </div>
                    {ex.explanation && (
                      <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-main)', fontSize: '0.8rem', marginTop: '6px' }}>
                        <strong>Explanation:</strong> {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Constraints</h3>
                <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.825rem', fontFamily: 'var(--font-code)' }}>
                  {problem.constraints?.map((c, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{c}</li>
                  ))}
                </ul>
              </div>

            </div>
          )}

          {/* TAB 2: Progressive Hints */}
          {leftTab === 'hints' && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Progressive Hint System</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Get incremental directional clues without spoiling the solution. (Using hints slightly adjusts skill metrics).
                </p>
              </div>

              {[
                { tier: 1, title: 'Hint 1: Directional Clue' },
                { tier: 2, title: 'Hint 2: Key Observation & Invariant' },
                { tier: 3, title: 'Hint 3: Algorithmic Step-by-Step' }
              ].map(h => {
                const isUnlocked = unlockedHints[h.tier];
                return (
                  <div
                    key={h.tier}
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-glass)',
                      marginBottom: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{h.title}</div>
                      {!isUnlocked && (
                        <button
                          onClick={() => handleUnlockHint(h.tier)}
                          disabled={hintUnlocking}
                          style={{
                            padding: '4px 10px',
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            color: 'var(--accent-primary)',
                            border: '1px solid rgba(99, 102, 241, 0.4)',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Unlock Hint
                        </button>
                      )}
                    </div>
                    {isUnlocked ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '8px' }}>
                        💡 {isUnlocked}
                      </p>
                    ) : (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                        Hint locked. Click unlock if you are stuck.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: Solution Analysis */}
          {leftTab === 'solution' && (
            <div>
              {!solutionUnlocked ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <Award size={48} color="var(--accent-primary)" style={{ marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                    Unlock Official Solution
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 20px' }}>
                    We recommend attempting the problem first or using Progressive Hints before viewing the full solution code.
                  </p>
                  <button
                    onClick={handleUnlockSolution}
                    className="glow-btn-primary"
                  >
                    <Eye size={16} /> Reveal Solution & Complexity Analysis
                  </button>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                    Official Solution Breakdown
                  </h3>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '6px' }}>Intuition</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{solutionData.intuition}</p>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '6px' }}>Algorithm</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{solutionData.algorithm}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TIME COMPLEXITY</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--success)' }}>{solutionData.time_complexity}</div>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SPACE COMPLEXITY</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--success)' }}>{solutionData.space_complexity}</div>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Reference Implementation</h4>
                    <pre style={{
                      backgroundColor: 'var(--bg-primary)',
                      padding: '14px',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-code)',
                      fontSize: '0.825rem',
                      color: '#e2e8f0',
                      overflowX: 'auto'
                    }}>
                      <code>{solutionData.code}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Socratic AI Tutor */}
          {leftTab === 'tutor' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {tutorMessages.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                      backgroundColor: m.sender === 'user' ? 'var(--accent-primary)' : 'var(--bg-primary)',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      maxWidth: '85%',
                      fontSize: '0.85rem',
                      color: '#fff',
                      lineHeight: 1.5
                    }}
                  >
                    <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
                    {m.suggested_actions && (
                      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {m.suggested_actions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => handleAskTutor(act)}
                            style={{
                              textAlign: 'left',
                              backgroundColor: 'var(--bg-tertiary)',
                              color: 'var(--accent-cyan)',
                              border: '1px solid var(--border-glass)',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            💡 {act}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {tutorLoading && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    AI Tutor is diagnosing your solution...
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Ask a question or explain where you're stuck..."
                  value={tutorInput}
                  onChange={e => setTutorInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAskTutor()}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button onClick={() => handleAskTutor()} className="glow-btn-primary" style={{ padding: '8px 12px' }}>
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: Submissions */}
          {leftTab === 'submissions' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Submission History
              </h3>
              {submissionsHistory.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No submissions for this problem yet.</p>
              ) : (
                submissionsHistory.map(sub => (
                  <div
                    key={sub.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-glass)',
                      marginBottom: '8px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, color: sub.verdict === 'Accepted' ? 'var(--success)' : 'var(--danger)' }}>
                        {sub.verdict === 'Accepted' ? '✅ Accepted' : '❌ ' + sub.verdict}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {sub.language} • {new Date(sub.submitted_at).toLocaleTimeString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <div>{sub.runtime_ms} ms</div>
                      <div>{sub.passed_tests}/{sub.total_tests} passed</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>

      {/* ================= RIGHT PANE: Code Editor & Test Console ================= */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--bg-primary)' }}>
        
        {/* Editor Toolbar */}
        <div style={{
          height: '44px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
          borderBottom: '1px solid var(--border-glass)',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Language:</span>
            <select
              value={language}
              onChange={e => handleLanguageChange(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: '#fff',
                border: '1px solid var(--border-glass)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="python">Python 3</option>
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="cpp">C++ (GCC)</option>
              <option value="java">Java 17</option>
            </select>
          </div>

          {/* Reset Code button */}
          <button
            onClick={() => setCode(problem.starter_code?.[language] || '')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={13} /> Reset Starter Code
          </button>
        </div>

        {/* Code Editor Area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            onPaste={() => setPasteCount(prev => prev + 1)}
            spellCheck="false"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#0d1117',
              color: '#e6edf3',
              border: 'none',
              outline: 'none',
              padding: '16px',
              fontFamily: 'var(--font-code)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              resize: 'none',
              tabSize: 4
            }}
          />
        </div>

        {/* Test Cases & Execution Verdict Drawer */}
        <div style={{
          height: '240px',
          borderTop: '1px solid var(--border-glass)',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Console Header Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 16px',
            borderBottom: '1px solid var(--border-glass)',
            backgroundColor: 'var(--bg-primary)'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {problem.sample_tests?.map((tc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedTestCaseIdx(idx);
                    setCustomInput(tc.input_data);
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: selectedTestCaseIdx === idx ? 'var(--bg-tertiary)' : 'transparent',
                    color: selectedTestCaseIdx === idx ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  Case {idx + 1}
                </button>
              ))}
            </div>

            {/* Run & Submit Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleRunCode}
                disabled={executing}
                className="btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <Play size={14} /> {executing ? 'Running...' : 'Run Code'}
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={executing}
                className="glow-btn-primary"
                style={{ padding: '6px 18px', fontSize: '0.8rem' }}
              >
                <Send size={14} /> Submit
              </button>
            </div>
          </div>

          {/* Console Output Body */}
          <div style={{ flex: 1, padding: '12px 16px', overflowY: 'auto', fontFamily: 'var(--font-code)', fontSize: '0.8rem' }}>
            {submissionResult ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  {submissionResult.verdict === 'Accepted' ? (
                    <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '1.1rem' }}>
                      ✅ Accepted
                    </span>
                  ) : (
                    <span style={{ color: 'var(--danger)', fontWeight: 800, fontSize: '1.1rem' }}>
                      ❌ {submissionResult.verdict}
                    </span>
                  )}
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    Runtime: {submissionResult.runtime_ms} ms • Memory: {Math.round(submissionResult.memory_kb / 1024)} MB
                  </span>
                </div>

                {submissionResult.failed_case && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <div style={{ color: 'var(--danger)', fontWeight: 700, marginBottom: '4px' }}>
                      Test Case #{submissionResult.failed_case.test_index} Failed
                    </div>
                    <div style={{ color: '#fff' }}>Input: {submissionResult.failed_case.input}</div>
                    <div style={{ color: 'var(--success)' }}>Expected: {submissionResult.failed_case.expected_output}</div>
                    <div style={{ color: 'var(--danger)' }}>Actual: {submissionResult.failed_case.actual_output}</div>
                  </div>
                )}
              </div>
            ) : runResult ? (
              <div>
                <div style={{ fontWeight: 700, color: runResult.verdict === 'Accepted' ? 'var(--success)' : 'var(--danger)', marginBottom: '6px' }}>
                  {runResult.verdict === 'Accepted' ? '✅ Sample Tests Passed' : '❌ ' + runResult.verdict}
                </div>
                {runResult.outputs?.map((out, idx) => (
                  <div key={idx} style={{ marginBottom: '6px' }}>
                    <span style={{ color: out.passed ? 'var(--success)' : 'var(--danger)' }}>
                      Case {idx + 1}: {out.passed ? 'Passed' : 'Failed'}
                    </span>
                    <div style={{ color: 'var(--text-muted)' }}>Input: {out.input}</div>
                    <div style={{ color: '#fff' }}>Output: {out.actual}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Input:</div>
                <div style={{ padding: '6px 10px', backgroundColor: 'var(--bg-primary)', borderRadius: '6px', color: '#fff', marginBottom: '8px' }}>
                  {customInput}
                </div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Expected Output:</div>
                <div style={{ padding: '6px 10px', backgroundColor: 'var(--bg-primary)', borderRadius: '6px', color: 'var(--success)' }}>
                  {problem.sample_tests?.[selectedTestCaseIdx]?.expected_output || ''}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
