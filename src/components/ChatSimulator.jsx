import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, AlertCircle, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

export default function ChatSimulator({
  selectedCandidate,
  conversationHistory,
  onSendCandidateReply,
  isThinking,
  persona
}) {
  const [inputText, setInputText] = useState('');
  const [expandedThoughts, setExpandedThoughts] = useState({});
  const chatEndRef = useRef(null);

  // Auto-scroll to the bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, isThinking]);

  const handleSendCustom = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    onSendCandidateReply(inputText.trim());
    setInputText('');
  };

  const handleQuickReply = (text) => {
    if (isThinking) return;
    onSendCandidateReply(text);
  };

  const toggleThought = (idx) => {
    setExpandedThoughts(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Panel Header */}
      <div className="panel-header">
        <h3 className="panel-title">
          <MessageSquare size={16} className="text-secondary" />
          Interactive Chat
        </h3>
        <span className="state-badge green">Simulated Session</span>
      </div>

      {/* Candidate Profile Details Banner */}
      {selectedCandidate && (
        <div className="candidate-profile-bar">
          <div className="cand-info">
            <h4 style={{ color: 'var(--text-primary)' }}>{selectedCandidate.name}</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Exp: {selectedCandidate.experience} | Skills: {selectedCandidate.skills}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.2rem' }}>
              Mindset: {selectedCandidate.summary}
            </p>
          </div>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="chat-messages" style={{ padding: '1.5rem' }}>
        {conversationHistory.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '0.5rem', textAlign: 'center', padding: '2rem' }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.85rem' }}>No active messages. Configure the Campaign to start.</span>
          </div>
        ) : (
          conversationHistory.map((msg, index) => {
            const isAgent = msg.sender === 'agent';
            const showThoughts = !!(isAgent && msg.thought);
            const isThoughtExpanded = !!expandedThoughts[index];

            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.75rem', width: '100%' }}>
                {/* Message Bubble Container */}
                <div className={`message-wrapper ${isAgent ? 'agent' : 'candidate'}`} style={{ width: '100%' }}>
                  <span className="message-meta">
                    {isAgent ? (persona?.personaName || 'Recruiter') : selectedCandidate.name}
                  </span>
                  <div className="message-bubble">
                    {msg.text}
                  </div>
                </div>

                {/* Inline Collapsible Thought Logs */}
                {showThoughts && (
                  <div style={{
                    alignSelf: 'flex-end',
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    <button
                      type="button"
                      onClick={() => toggleThought(index)}
                      className="btn-text"
                      style={{
                        fontSize: '0.72rem',
                        color: isThoughtExpanded ? 'var(--text-primary)' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        marginTop: '0.15rem',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        outline: 'none'
                      }}
                    >
                      <Terminal size={11} />
                      <span>{isThoughtExpanded ? 'Hide agent thoughts' : 'Show agent thoughts'}</span>
                      {isThoughtExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    </button>

                    {isThoughtExpanded && (
                      <div style={{
                        marginTop: '0.4rem',
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '1px solid var(--panel-border)',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 255, 255, 0.015)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.74rem',
                        lineHeight: '145%',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        textAlign: 'left',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                        animation: 'slideInLeft 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}>
                        <div className="console-segment observation" style={{ borderLeftWidth: '2px', paddingLeft: '0.5rem', margin: 0 }}>
                          <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>OBSERVATION:</span>{' '}
                          <span style={{ color: 'var(--text-primary)' }}>{msg.thought.observation}</span>
                        </div>
                        <div className="console-segment analysis" style={{ borderLeftWidth: '2px', paddingLeft: '0.5rem', margin: 0 }}>
                          <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>ANALYSIS:</span>{' '}
                          <span style={{ color: 'var(--text-primary)' }}>{msg.thought.analysis}</span>
                        </div>
                        <div className="console-segment tactic" style={{ borderLeftWidth: '2px', paddingLeft: '0.5rem', margin: 0 }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>TACTIC:</span>{' '}
                          <span style={{ color: 'var(--text-primary)' }}>{msg.thought.tactic}</span>
                        </div>
                        <div className="console-segment action" style={{ borderLeftWidth: '2px', paddingLeft: '0.5rem', margin: 0 }}>
                          <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>ACTION:</span>{' '}
                          <span style={{ color: 'var(--text-primary)' }}>{msg.thought.action}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {isThinking && (
          <div className="message-wrapper agent" style={{ alignSelf: 'flex-end' }}>
            <span className="message-meta">{persona?.personaName || 'Recruiter'} is reasoning...</span>
            <div className="message-bubble" style={{ display: 'flex', alignItems: 'center', minWidth: '70px', justifyContent: 'center' }}>
              <div className="typing-indicator">
                <div className="typing-dot" style={{ backgroundColor: 'var(--bg-color)' }} />
                <div className="typing-dot" style={{ backgroundColor: 'var(--bg-color)' }} />
                <div className="typing-dot" style={{ backgroundColor: 'var(--bg-color)' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Replies Sandbox */}
      {conversationHistory.length > 0 && (
        <div className="quick-replies-section">
          <div className="quick-replies-label">Simulate Candidate Action</div>
          <div className="quick-replies-list">
            <button
              type="button"
              className="quick-reply-btn"
              disabled={isThinking}
              onClick={() => handleQuickReply("What is the compensation package/salary range for this role?")}
            >
              💰 Ask about Comp
            </button>
            <button
              type="button"
              className="quick-reply-btn"
              disabled={isThinking}
              onClick={() => handleQuickReply("Can you tell me more about the technical stack and engineering practices?")}
            >
              🛠️ Ask about Tech Stack
            </button>
            <button
              type="button"
              className="quick-reply-btn"
              disabled={isThinking}
              onClick={() => handleQuickReply("Thanks for reaching out, but I am currently happy at my company and not looking for a change.")}
            >
              🙅 Polite Rejection
            </button>
            <button
              type="button"
              className="quick-reply-btn"
              disabled={isThinking}
              onClick={() => handleQuickReply("That sounds interesting. I would be open to a quick 15-minute chat next week.")}
            >
              📅 Accept Call / Interested
            </button>
          </div>
        </div>
      )}

      {/* Chat Custom Input Form */}
      <form onSubmit={handleSendCustom} className="chat-input-bar">
        <input
          type="text"
          className="form-input"
          style={{ flex: 1 }}
          placeholder={conversationHistory.length === 0 ? "Initialize campaign to start conversation..." : "Type custom candidate reply..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isThinking || conversationHistory.length === 0}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: '0.55rem 0.85rem' }}
          disabled={isThinking || !inputText.trim() || conversationHistory.length === 0}
          aria-label="Send message"
        >
          <Send size={13} />
        </button>
      </form>
    </div>
  );
}
