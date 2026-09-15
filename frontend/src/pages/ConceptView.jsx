import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Play, CheckCircle2, Award, BookOpen, BrainCircuit, 
  HelpCircle, Code2, AlertTriangle, FileText, Bot, 
  ArrowRight, Sparkles, Send, Check, Copy 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ConceptView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [concept, setConcept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('intuition'); // intuition, visual, code, mistakes, notes
  const [codeLang, setCodeLang] = useState('python');
  
  // Video tracking
  const [videoProgress, setVideoProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  // Notes state
  const [notes, setNotes] = useState('');
  const [notesSaving, setNotesSaving] = useState(false);

  // AI Tutor Chat state
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorMessages, setTutorMessages] = useState([
    {
      sender: 'ai',
      text: '👋 Hello! I am your Socratic AI Tutor. Ask me any conceptual question, request a step-by-step intuition walk-through, or explore common interview edge cases!'
    }
  ]);
  const [tutorInput, setTutorInput] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getConcept(slug)
      .then(res => {
        if (res.success) {
          setConcept(res.concept);
          setVideoProgress(res.concept.user_progress?.video_progress_pct || 0);
          setNotes(res.concept.user_progress?.notes || '');
          if (res.concept.user_progress?.quiz_passed) {
            setQuizResult({ passed: true, score_pct: 100 });
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleVideoProgress = async (pct) => {
    setVideoProgress(pct);
    if (concept) {
      await api.updateVideoProgress(concept.id, pct, Math.floor(pct * 3));
    }
  };

  const handleQuizOptionSelect = (questionId, optionIndex) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleQuizSubmit = async () => {
    if (!concept) return;
    setQuizSubmitting(true);
    try {
      const res = await api.submitQuiz(concept.id, quizAnswers);
      if (res.success) {
        setQuizResult(res);
        if (res.passed) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setQuizSubmitting(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!concept) return;
    setNotesSaving(true);
    try {
      await api.saveNotes(concept.id, notes);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setNotesSaving(false), 500);
    }
  };

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
        conceptTitle: concept?.title,
        codeContext: concept?.code_samples?.[codeLang],
        mode: 'explain_concept'
      });

      if (res.success) {
        setTutorMessages(prev => [...prev, {
          sender: 'ai',
          text: res.reply,
          suggested_actions: res.suggested_actions
        }]);
      }
    } catch (e) {
      setTutorMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I ran into an issue answering. Please try again!' }]);
    } finally {
      setTutorLoading(false);
    }
  };

  if (loading || !concept) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BrainCircuit className="pulse-glow" size={32} /> Loading Concept Lesson...
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
      
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
        <Link to="/learn" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Roadmap</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>{concept.section?.title || 'Arrays'}</span>
        <span>/</span>
        <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{concept.title}</span>
      </div>

      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              {concept.title}
            </h1>
            {concept.user_progress?.completed ? (
              <span className="badge badge-easy">
                <CheckCircle2 size={14} /> Completed
              </span>
            ) : (
              <span className="badge badge-concept">In Progress</span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '800px' }}>
            {concept.summary}
          </p>
        </div>

        {/* AI Tutor Assistant Trigger */}
        <button
          onClick={() => setTutorOpen(!tutorOpen)}
          className="glow-btn-primary"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
        >
          <Bot size={18} /> {tutorOpen ? 'Close AI Tutor' : 'Ask AI Tutor'}
        </button>
      </div>

      {/* Main Grid: Video & Tabs (Left) + Quiz / Problems / AI Tutor (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: tutorOpen ? '1.4fr 1fr' : '1.7fr 1fr', gap: '24px' }}>
        
        {/* Left Side: Video + Detailed Learning Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Video Lesson Player */}
          <div className="glass-panel" style={{ padding: '20px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Play size={18} color="var(--accent-primary)" fill="var(--accent-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>Structured Video Masterclass</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Playback speed selector */}
                <select
                  value={playbackSpeed}
                  onChange={e => setPlaybackSpeed(e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="0.75x">0.75x Speed</option>
                  <option value="1x">1.0x Normal</option>
                  <option value="1.25x">1.25x Speed</option>
                  <option value="1.5x">1.5x Speed</option>
                  <option value="2x">2.0x Fast</option>
                </select>

                <button
                  onClick={() => handleVideoProgress(100)}
                  style={{
                    backgroundColor: videoProgress >= 90 ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-tertiary)',
                    color: videoProgress >= 90 ? 'var(--success)' : 'var(--text-secondary)',
                    border: '1px solid var(--border-glass)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {videoProgress >= 90 ? '✓ Watched' : 'Mark Watched'}
                </button>
              </div>
            </div>

            {/* Video IFrame Player */}
            <div style={{
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#000',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              position: 'relative'
            }}>
              <iframe
                src={concept.video_url || 'https://www.youtube.com/embed/On03HWe2tZM'}
                title={concept.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>

            {/* Video Watch Progress Tracker */}
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                <span>Watch Progress</span>
                <span style={{ fontWeight: 700, color: '#fff' }}>{videoProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${videoProgress}%`, height: '100%', backgroundColor: 'var(--accent-primary)', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          </div>

          {/* Deep Intuition & Explanation Tabs */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            {/* Tab navigation */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', marginBottom: '20px' }}>
              {[
                { id: 'intuition', label: 'Intuition & Why It Works', icon: BrainCircuit },
                { id: 'when_to_use', label: 'When To Use & Signals', icon: HelpCircle },
                { id: 'visual', label: 'Visual Animation', icon: Sparkles },
                { id: 'code', label: 'Multi-Language Code', icon: Code2 },
                { id: 'mistakes', label: 'Common Mistakes', icon: AlertTriangle },
                { id: 'notes', label: 'Personal Notes', icon: FileText }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                      color: isActive ? '#fff' : 'var(--text-muted)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent'
                    }}
                  >
                    <Icon size={15} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Intuition */}
            {activeTab === 'intuition' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                  The Core Intuition
                </h3>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  <p style={{ marginBottom: '16px' }}>{concept.intuition}</p>
                  
                  <div style={{ padding: '16px', backgroundColor: 'rgba(99, 102, 241, 0.08)', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <h4 style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px' }}>
                      💡 Mathematical Proof & Invariant
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      By exploiting monotonicity or invariant state conditions, we eliminate entire branches of redundant computation. Instead of exploring all N² combinations, every comparison yields directional certainty.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: When To Use */}
            {activeTab === 'when_to_use' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                  Recognizable Interview Signals
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '16px' }}>
                  {concept.when_to_use}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>✅ Ideal Scenarios</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sorted arrays, continuous subarray/substring constraints, palindrome checks, target sum pairs.</div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>❌ Anti-Patterns</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Unordered hash lookups with frequent modifications, disconnected graph trees.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Visual SVG */}
            {activeTab === 'visual' && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
                  Visual Execution Model
                </h3>
                <div 
                  dangerouslySetInnerHTML={{ __html: concept.visual_svg || '' }} 
                  style={{ maxWidth: '480px', margin: '0 auto', padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}
                />
              </div>
            )}

            {/* Tab 4: Code Samples in 4 Languages */}
            {activeTab === 'code' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['python', 'javascript', 'cpp', 'java'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => setCodeLang(lang)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          backgroundColor: codeLang === lang ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                          color: codeLang === lang ? '#fff' : 'var(--text-muted)'
                        }}
                      >
                        {lang === 'cpp' ? 'C++' : (lang === 'javascript' ? 'JS' : lang)}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(concept.code_samples?.[codeLang] || '')}
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
                    <Copy size={13} /> Copy Code
                  </button>
                </div>

                <pre style={{
                  backgroundColor: 'var(--bg-primary)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-glass)',
                  fontFamily: 'var(--font-code)',
                  fontSize: '0.875rem',
                  color: '#e2e8f0',
                  overflowX: 'auto',
                  lineHeight: 1.6
                }}>
                  <code>{concept.code_samples?.[codeLang] || '// Code sample loading...'}</code>
                </pre>
              </div>
            )}

            {/* Tab 5: Common Mistakes */}
            {activeTab === 'mistakes' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                  Common Interview Pitfalls & Traps
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {concept.common_mistakes?.map((mistake, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px 16px',
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <AlertTriangle size={18} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{mistake}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 6: Notes */}
            {activeTab === 'notes' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Your Personal Learning Notes</h3>
                  <button
                    onClick={handleSaveNotes}
                    disabled={notesSaving}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'var(--accent-primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {notesSaving ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Type your notes, key takeaways, or interview tips here..."
                  style={{
                    width: '100%',
                    height: '140px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: '0.875rem',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
              </div>
            )}

          </div>

        </div>

        {/* Right Side: Socratic AI Tutor OR Concept Quiz + Practice Unlock */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* AI Tutor Chat Drawer if Open */}
          {tutorOpen ? (
            <div className="glass-panel" style={{ padding: '20px', height: '620px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px', marginBottom: '12px' }}>
                <Bot size={20} color="#a855f7" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Socratic AI Tutor</h3>
              </div>

              {/* Chat Message Box */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
                {tutorMessages.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                      backgroundColor: m.sender === 'user' ? 'var(--accent-primary)' : 'var(--bg-primary)',
                      border: m.sender === 'user' ? 'none' : '1px solid var(--border-glass)',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      maxWidth: '90%',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      color: '#fff'
                    }}
                  >
                    <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
                    
                    {/* Suggested prompts */}
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
                    AI Tutor is formulating a Socratic explanation...
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-glass)' }}>
                <input
                  type="text"
                  placeholder="Ask intuition, time complexity, or hints..."
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
                <button
                  onClick={() => handleAskTutor()}
                  className="glow-btn-primary"
                  style={{ padding: '8px 12px' }}
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          ) : (
            /* Concept Comprehension Quiz */
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Award size={20} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                  Comprehension Quiz
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Pass the concept test to unlock practice problems.
              </p>

              {concept.quiz?.questions ? (
                <div>
                  {concept.quiz.questions.map((q, qIdx) => (
                    <div key={q.id} style={{ marginBottom: '18px' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
                        {qIdx + 1}. {q.question}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {q.options.map((opt, oIdx) => {
                          const isSelected = quizAnswers[q.id] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleQuizOptionSelect(q.id, oIdx)}
                              style={{
                                textAlign: 'left',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-primary)',
                                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                                color: isSelected ? '#fff' : 'var(--text-secondary)'
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleQuizSubmit}
                    disabled={quizSubmitting}
                    className="glow-btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                  >
                    {quizSubmitting ? 'Evaluating...' : 'Submit Quiz & Verify'}
                  </button>

                  {/* Quiz Verdict Banner */}
                  {quizResult && (
                    <div style={{
                      marginTop: '16px',
                      padding: '14px',
                      borderRadius: '10px',
                      backgroundColor: quizResult.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      border: quizResult.passed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontWeight: 700, color: quizResult.passed ? 'var(--success)' : 'var(--danger)', fontSize: '0.95rem' }}>
                        {quizResult.passed ? '🎉 Concept Mastered! Score: ' + quizResult.score_pct + '%' : '❌ Score: ' + quizResult.score_pct + '%. Review the intuition and try again.'}
                      </div>
                      {quizResult.passed && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          Practice problems for {concept.title} are now unlocked!
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No quiz required for this module.</p>
              )}
            </div>
          )}

          {/* Unlocked Related Practice Problems */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
              Practice Problems
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {concept.related_problems?.length > 0 ? (
                concept.related_problems.map(p => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/problems/${p.slug}`)}
                    className="glass-panel-interactive"
                    style={{
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>{p.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Acceptance: {p.acceptance_rate}%</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge badge-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                      <ArrowRight size={14} color="var(--text-muted)" />
                    </div>
                  </div>
                ))
              ) : (
                <div 
                  onClick={() => navigate('/problems/two-sum')}
                  className="glass-panel-interactive" 
                  style={{ padding: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>Two Sum</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Two Pointers / Hash Map</div>
                  </div>
                  <span className="badge badge-easy">Easy</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
