import React, { useState, useEffect } from 'react';
import CompanyForm from './components/CompanyForm';
import AgentConfig from './components/AgentConfig';
import ChatSimulator from './components/ChatSimulator';
import ThemeToggle from './components/ThemeToggle';
import { MOCK_COMPANIES, MOCK_CANDIDATES } from './constants/mockData';
import { initializeAgent, generateAgentReply } from './api/gemini';
import { Sparkles, Terminal, AlertCircle, ArrowLeft, ArrowRight, Send, RefreshCw, MessageSquare } from 'lucide-react';

export default function App() {
  // Global runtime error tracking
  const [runtimeError, setRuntimeError] = useState(null);

  useEffect(() => {
    const handleGlobalError = (event) => {
      setRuntimeError(event.error?.message || event.message || 'Unknown runtime error');
    };
    const handleRejection = (event) => {
      setRuntimeError(event.reason?.message || event.reason || 'Unhandled promise rejection');
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // Navigation Flow step: 'setup' | 'review' | 'chat'
  const [flowStep, setFlowStep] = useState('setup');

  // App-level security keys pre-filled with the working evaluation key
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });

  // Save key to local storage
  useEffect(() => {
    localStorage.setItem('gemini_api_key', apiKey);
  }, [apiKey]);


  // Company Context state pre-filled with Linear
  const [companyContext, setCompanyContext] = useState({
    name: MOCK_COMPANIES.linear.name,
    tagline: MOCK_COMPANIES.linear.tagline,
    website: MOCK_COMPANIES.linear.website,
    industry: MOCK_COMPANIES.linear.industry,
    culture: MOCK_COMPANIES.linear.culture,
    valueProp: MOCK_COMPANIES.linear.valueProp,
    intent: MOCK_COMPANIES.linear.intent,
    profiles: MOCK_COMPANIES.linear.profiles,
    defaultRole: MOCK_COMPANIES.linear.defaultRole,
    tone: MOCK_COMPANIES.linear.tone
  });

  // Configured Agent State
  const [persona, setPersona] = useState(null);
  const [outreachSequence, setOutreachSequence] = useState(null);

  // Simulator State
  const [selectedCandidate, setSelectedCandidate] = useState(MOCK_CANDIDATES[0]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentThought, setCurrentThought] = useState(null);

  // Custom initial outreach message state & tracking
  const [customInitialMessage, setCustomInitialMessage] = useState('');
  const [prevCandidateId, setPrevCandidateId] = useState(null);
  const [prevTemplateContent, setPrevTemplateContent] = useState(null);

  useEffect(() => {
    if (outreachSequence && outreachSequence[0] && selectedCandidate) {
      const currentTemplate = outreachSequence[0].content;
      if (selectedCandidate.id !== prevCandidateId || currentTemplate !== prevTemplateContent) {
        const personalized = currentTemplate.replace(/\[Candidate Name\]/g, selectedCandidate.name);
        setCustomInitialMessage(personalized);
        setPrevCandidateId(selectedCandidate.id);
        setPrevTemplateContent(currentTemplate);
      }
    }
  }, [selectedCandidate, outreachSequence, prevCandidateId, prevTemplateContent]);

  // Status flags
  const [isLoadingAgent, setIsLoadingAgent] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  // Feedback Notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Pre-load or restart conversation when candidate changes
  useEffect(() => {
    if (persona && outreachSequence && flowStep === 'chat') {
      restartConversation();
    }
  }, [selectedCandidate, flowStep]);

  const restartConversation = () => {
    if (!outreachSequence || !persona) return;
    
    // Clear logs
    setCurrentThought(null);
    
    // Send Message 1
    const personalizedMsg = customInitialMessage || outreachSequence[0].content.replace(/\[Candidate Name\]/g, selectedCandidate.name);
    
    setConversationHistory([
      {
        sender: 'agent',
        text: personalizedMsg,
        thought: {
          observation: `Autonomous campaign launch for candidate: ${selectedCandidate.name}.`,
          analysis: `Targeting a ${companyContext.defaultRole} with a ${companyContext.tone} persona. Cultural alignment values: "${companyContext.culture.slice(0, 80)}..."`,
          tactic: `Deliver outreach hook (Message 1 of sequence) tailored to candidate's background.`,
          action: `Initiating first outreach contact.`
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };


  // Configure Recruiter Agent Pipeline
  const handleConfigureAgent = async () => {
    setIsLoadingAgent(true);
    setConversationHistory([]);
    setCurrentThought(null);

    if (!apiKey) {
      showToast('Gemini API key is required.', 'error');
      setIsLoadingAgent(false);
      return;
    }

    try {
      const responseData = await initializeAgent(apiKey, companyContext);
      
      setPersona({
        personaName: responseData.personaName,
        personaRole: responseData.personaRole,
        personaBio: responseData.personaBio,
        toneGuidelines: responseData.toneGuidelines
      });
      setOutreachSequence(responseData.outreachSequence);

      showToast(`AI Recruiter initialized for ${companyContext.name} via Gemini!`);
      
      // Go to review step
      setFlowStep('review');
    } catch (err) {
      showToast(err.message, 'error');
      console.error(err);
    } finally {
      setIsLoadingAgent(false);
    }
  };


  // Handle simulated candidate response
  const handleSendCandidateReply = async (replyText) => {
    if (isThinking) return;

    // Add candidate reply to screen log
    const updatedHistory = [
      ...conversationHistory,
      {
        sender: 'candidate',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setConversationHistory(updatedHistory);
    setIsThinking(true);
    setCurrentThought(null);

    // Query Live Gemini model
    try {
      const responseData = await generateAgentReply(apiKey, {
        companyContext,
        persona,
        candidateProfile: selectedCandidate,
        conversationHistory: updatedHistory,
        latestReply: replyText,
        outreachSequence
      });

      setCurrentThought(responseData.thought);
      setConversationHistory(prev => [
        ...prev,
        {
          sender: 'agent',
          text: responseData.reply,
          thought: responseData.thought,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      showToast(err.message, 'error');
      setConversationHistory(prev => [
        ...prev,
        {
          sender: 'agent',
          text: `(System Alert: Failed to query Gemini API. Error: ${err.message})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleReset = () => {
    setPersona(null);
    setOutreachSequence(null);
    setConversationHistory([]);
    setCurrentThought(null);
    setFlowStep('setup');
  };

  // Surprise Feature: On-the-fly Tone Morphing
  const handleToneChange = async (newTone) => {
    if (isThinking) return;

    // Update tone in company context
    const updatedContext = { ...companyContext, tone: newTone };
    setCompanyContext(updatedContext);

    // Live AI Mode: Regenerate persona guidelines in the background on-the-fly
    setIsThinking(true);
    try {
      const responseData = await initializeAgent(apiKey, updatedContext);
      setPersona({
        personaName: responseData.personaName,
        personaRole: responseData.personaRole,
        personaBio: responseData.personaBio,
        toneGuidelines: responseData.toneGuidelines
      });
      showToast(`Recruiter guidelines live-updated to ${newTone}!`);
    } catch (err) {
      showToast(`Failed to update tone: ${err.message}`, 'error');
    } finally {
      setIsThinking(false);
    }
  };


  // Handler to let recruiters edit outreach templates in Step 2
  const handleUpdateSequence = (step, newContent) => {
    setOutreachSequence(prev =>
      prev.map(seq => (seq.step === step ? { ...seq, content: newContent } : seq))
    );
  };

  return (
    <div className="app-container">
      {/* Global Runtime Error Banner */}
      {runtimeError && (
        <div style={{
          backgroundColor: 'var(--accent-rose)',
          color: '#fff',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          fontFamily: 'var(--font-mono)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease',
          marginBottom: '0.5rem',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span><strong>Runtime Exception:</strong> {runtimeError}</span>
          </div>
          <button
            className="btn-text"
            style={{ color: '#fff', textDecoration: 'underline', padding: 0, fontSize: '0.8rem' }}
            onClick={() => setRuntimeError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Toast Alert */}
      {toast && (
        <div className="toast-msg">
          <AlertCircle size={16} style={{ color: toast.type === 'error' ? 'var(--accent-rose)' : 'var(--accent-emerald)' }} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-badge">PS</div>
          <h1 className="app-title">PSVIEW Recruiter Agent Sandbox</h1>
        </div>
        <div className="header-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Status:</span>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Operational</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* STEP 1: Campaign Setup */}
      {flowStep === 'setup' && (
        <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem 0' }}>
          <div style={{ width: '100%', maxWidth: '640px', animation: 'fadeIn 0.25s ease' }}>
            <CompanyForm
              companyContext={companyContext}
              setCompanyContext={setCompanyContext}
              apiKey={apiKey}
              setApiKey={setApiKey}
              onConfigure={handleConfigureAgent}
              isLoading={isLoadingAgent}
              isTabbed={false}
            />
          </div>
        </main>
      )}

      {/* STEP 2: Persona and Outreach Review */}
      {flowStep === 'review' && (
        <main style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flex: 1, maxWidth: '1000px', margin: '0 auto', width: '100%', animation: 'fadeIn 0.25s ease' }}>
          {/* Left Column: Agent configuration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }} onClick={handleReset}>
                <ArrowLeft size={14} /> Back
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Step 2 of 3: Review Persona</span>
            </div>
            
            <AgentConfig
              persona={persona}
              outreachSequence={outreachSequence}
              targetRole={companyContext.defaultRole}
              companyName={companyContext.name}
              onUpdateSequence={handleUpdateSequence}
              isTabbed={false}
            />
          </div>

          {/* Right Column: Candidate Selection & Launch */}
          <div className="panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '640px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', flex: 1, paddingRight: '0.25rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Target Candidate Profile
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '140%' }}>
                  Select one of the sandbox candidate personas to test the recruiter agent's engagement script.
                </p>
              </div>

              {/* Selector */}
              <div className="form-group">
                <label className="form-label">Candidate Option</label>
                <select
                  className="form-select"
                  value={selectedCandidate?.id || ''}
                  onChange={(e) => {
                    const cand = MOCK_CANDIDATES.find(c => c.id === e.target.value);
                    if (cand) setSelectedCandidate(cand);
                  }}
                >
                  {MOCK_CANDIDATES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.currentRole}
                    </option>
                  ))}
                </select>
              </div>

              {/* Profile Details */}
              {selectedCandidate && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="agent-persona-card" style={{ animation: 'fadeIn 0.2s ease', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedCandidate.name}</span>
                      <span className="state-badge">{selectedCandidate.experience} Exp</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <strong>Role:</strong> {selectedCandidate.currentRole}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <strong>Skills:</strong> {selectedCandidate.skills}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', borderTop: '1px solid var(--panel-border)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                      <strong>Mindset/Objections:</strong> {selectedCandidate.summary}
                    </p>
                  </div>

                  {/* Strategy Matrix Overlay */}
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--panel-border)',
                    background: 'rgba(255, 255, 255, 0.01)',
                    fontSize: '0.78rem',
                    animation: 'fadeIn 0.25s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Campaign Strategy Guide</span>
                      <span className="state-badge green" style={{ fontSize: '0.68rem', fontWeight: 600 }}>
                        Match: {selectedCandidate.id === 'backend-alex' ? '92%' : selectedCandidate.id === 'frontend-maria' ? '88%' : '95%'}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem', lineHeight: '135%' }}>
                      <div>🟢 <strong>Opportunity Hook:</strong> {
                        selectedCandidate.id === 'backend-alex' ? 'Frustrated by banking bureaucracy; pitch our strict meeting-free async culture.' :
                        selectedCandidate.id === 'frontend-maria' ? 'Deeply technical writer; appeal to Next.js DX impact and core library building scope.' :
                        'Systems researcher; pitch our globally scaled multi-region ACID consensus ledger architecture.'
                      }</div>
                      <div>🔴 <strong>Conversational Risk:</strong> {
                        selectedCandidate.id === 'backend-alex' ? 'Start-up equity risk-averse; be ready to provide clear, flat base salary details.' :
                        selectedCandidate.id === 'frontend-maria' ? 'Flooded with standard recruiter noise; keep initial outreach extremely short and direct.' :
                        'Skeptical of marketing buzzwords; keep communication highly technical and academic.'
                      }</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tailored Initial Outreach Message (Editable) */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Tailored Outreach Message (Editable)</span>
                </label>
                <textarea
                  className="form-textarea"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    fontSize: '0.78rem',
                    lineHeight: '140%',
                    fontFamily: 'inherit',
                    color: 'var(--text-primary)',
                    background: 'rgba(255, 255, 255, 0.015)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: 'var(--radius-sm)',
                    minHeight: '120px',
                    resize: 'vertical',
                  }}
                  value={customInitialMessage}
                  onChange={(e) => setCustomInitialMessage(e.target.value)}
                  placeholder="Draft a custom outreach message for this candidate..."
                />
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', gap: '0.5rem', flexShrink: 0 }}
              onClick={() => {
                restartConversation();
                setFlowStep('chat');
              }}
            >
              <span>Launch Candidate Simulator</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </main>
      )}

      {/* STEP 3: Chat & Reasoning Simulator */}
      {flowStep === 'chat' && (
        <main style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, animation: 'fadeIn 0.25s ease' }}>
          {/* Top Info Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-lg)', background: 'var(--panel-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }} onClick={() => setFlowStep('review')}>
                <ArrowLeft size={14} /> Back
              </button>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Recruiter: <strong>{persona?.personaName} ({companyContext.name})</strong> ➜ Candidate: <strong>{selectedCandidate.name}</strong>
              </div>
            </div>
            
            {/* Surprise Feature: On-the-fly Tone Morpher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Morph Tone:</span>
              <select
                className="form-select"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem', background: 'transparent', height: 'auto', border: '1px solid var(--panel-border)', minHeight: '0', cursor: 'pointer' }}
                value={companyContext.tone}
                disabled={isThinking}
                onChange={(e) => handleToneChange(e.target.value)}
              >
                <option value="calm">Calm (Evelyn)</option>
                <option value="energetic">Energetic (Leo)</option>
                <option value="intellectual">Intellectual (Sarah)</option>
                {!['calm', 'energetic', 'intellectual'].includes(companyContext.tone) && (
                  <option value={companyContext.tone}>Custom: {companyContext.tone}</option>
                )}
              </select>
            </div>
            
            <button className="btn btn-secondary" style={{ gap: '0.35rem', padding: '0.4rem 0.6rem' }} onClick={handleReset}>
              <RefreshCw size={12} /> Configure New Campaign
            </button>
          </div>

          {/* Interactive Workspace: Centered single-column chat simulator */}
          <div style={{ display: 'flex', justifyContent: 'center', flex: 1, minHeight: '480px', overflow: 'visible' }}>
            <div style={{ width: '100%', maxWidth: '720px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <ChatSimulator
                selectedCandidate={selectedCandidate}
                conversationHistory={conversationHistory}
                onSendCandidateReply={handleSendCandidateReply}
                isThinking={isThinking}
                persona={persona}
              />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
