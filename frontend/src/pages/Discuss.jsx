import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Tag, Plus, Send, Search, User } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Discuss() {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newTag, setNewTag] = useState('Arrays');

  const fetchDiscussions = () => {
    setLoading(true);
    api.getDiscussions({ tag: selectedTag === 'All' ? undefined : selectedTag })
      .then(res => {
        if (res.success) {
          setDiscussions(res.discussions);
          if (res.discussions.length > 0 && !selectedPost) {
            loadPostDetails(res.discussions[0]);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDiscussions();
  }, [selectedTag]);

  const loadPostDetails = async (post) => {
    setSelectedPost(post);
    try {
      const res = await api.getComments(post.id);
      if (res.success) setComments(res.comments);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpvote = async (id, e) => {
    e.stopPropagation();
    try {
      await api.upvoteDiscussion(id);
      setDiscussions(prev => prev.map(d => d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d));
      if (selectedPost && selectedPost.id === id) {
        setSelectedPost({ ...selectedPost, upvotes: selectedPost.upvotes + 1 });
      }
    } catch (e) {}
  };

  const handleAddComment = async () => {
    if (!commentInput.trim() || !selectedPost) return;
    try {
      await api.addComment(selectedPost.id, commentInput);
      setCommentInput('');
      const res = await api.getComments(selectedPost.id);
      if (res.success) setComments(res.comments);
    } catch (e) {}
  };

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    try {
      const res = await api.createDiscussion({
        title: newTitle,
        body: newBody,
        tags: [newTag]
      });
      if (res.success) {
        setCreateModalOpen(false);
        setNewTitle('');
        setNewBody('');
        fetchDiscussions();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const tags = ['All', 'Arrays', 'TwoPointers', 'SlidingWindow', 'DynamicProgramming', 'Optimization', 'InterviewTips'];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        padding: '24px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.12))',
        border: '1px solid var(--border-glass)',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span className="badge badge-concept" style={{ marginBottom: '8px' }}>COMMUNITY FORUM</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Concept & Problem Discussions
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Ask questions, share algorithmic insights, and discuss optimal time/space tradeoffs.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="glow-btn-primary"
        >
          <Plus size={16} /> New Discussion
        </button>
      </div>

      {/* Tag Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {tags.map(t => (
          <button
            key={t}
            onClick={() => setSelectedTag(t)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: selectedTag === t ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              color: selectedTag === t ? '#fff' : 'var(--text-muted)'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main Grid: Discussion List (Left) + Post Reader / Comments (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '24px' }}>
        
        {/* Left: Thread List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '30px' }}>Loading discussions...</p>
          ) : discussions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '30px' }}>No discussions found.</p>
          ) : (
            discussions.map(d => {
              const isSelected = selectedPost?.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => loadPostDetails(d)}
                  className="glass-panel-interactive"
                  style={{
                    padding: '16px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{d.title}</h3>
                    <button
                      onClick={(e) => handleUpvote(d.id, e)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        color: 'var(--accent-primary)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <ThumbsUp size={12} /> {d.upvotes}
                    </button>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {d.body}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <img src={d.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=user"} alt="" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                      <span>{d.username}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {d.tags?.map((t, idx) => (
                        <span key={idx} style={{ padding: '2px 6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Post & Comments */}
        {selectedPost ? (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '700px' }}>
            <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{selectedPost.title}</h2>
                <button
                  onClick={(e) => handleUpvote(selectedPost.id, e)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    color: 'var(--accent-primary)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <ThumbsUp size={14} /> {selectedPost.upvotes}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <img src={selectedPost.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=user"} alt="" style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
                <span style={{ color: '#fff', fontWeight: 600 }}>{selectedPost.username}</span>
                <span>• {new Date(selectedPost.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '20px', whiteSpace: 'pre-line' }}>
              {selectedPost.body}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                Replies ({comments.length})
              </h4>
              
              {comments.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No replies yet. Be the first to reply!</p>
              ) : (
                comments.map(c => (
                  <div key={c.id} style={{ padding: '10px 14px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', marginBottom: '8px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <img src={c.avatar} alt="" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                      <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.8rem' }}>{c.username}</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>{c.body}</div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
              <input
                type="text"
                placeholder="Share your perspective or approach..."
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddComment()}
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
              <button onClick={handleAddComment} className="glow-btn-primary" style={{ padding: '8px 14px' }}>
                <Send size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Select a discussion to view details and community replies.
          </div>
        )}

      </div>

      {/* New Discussion Modal */}
      {createModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ width: '540px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Start New Discussion</h3>
            
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Title</label>
              <input
                type="text"
                placeholder="e.g. Invariant condition for 3Sum two-pointer approach..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Tag</label>
              <select
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              >
                {tags.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Content</label>
              <textarea
                placeholder="Write your explanation or query in markdown..."
                value={newBody}
                onChange={e => setNewBody(e.target.value)}
                style={{ width: '100%', height: '140px', padding: '10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setCreateModalOpen(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleCreatePost} className="glow-btn-primary">Publish Discussion</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
