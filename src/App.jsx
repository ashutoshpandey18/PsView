import React, { useState, useEffect } from 'react';
import CompanyForm from './components/CompanyForm';
import AgentConfig from './components/AgentConfig';
import ChatSimulator from './components/ChatSimulator';
import ReasoningConsole from './components/ReasoningConsole';
import ThemeToggle from './components/ThemeToggle';
import { MOCK_COMPANIES, MOCK_CANDIDATES } from './constants/mockData';
import { initializeAgent, generateAgentReply } from './api/gemini';
import { Sparkles, Terminal, AlertCircle, ArrowLeft, ArrowRight, Send, RefreshCw, MessageSquare, CheckCircle2 } from 'lucide-react';

// Fallback generators for offline execution or model rate limits.
const generateLocalFallbackPersona = (context) => {
  const toneLower = context.tone.toLowerCase();
  let name = 'Alex Mercer';
  let bio = `Specialist recruiter focused on scaling high-caliber engineering teams at ${context.name}.`;
  let guidelines = [
    `Maintain a professional and direct style.`,
    `Acknowledge the candidate's core technical background.`,
    `Emphasize company culture: ${context.culture.slice(0, 60)}.`
  ];

  if (toneLower.includes('calm')) {
    name = 'Evelyn Wood';
    bio = `Evelyn is a detail-oriented, respectful talent partner at ${context.name} who values candidate focus and developer agency.`;
    guidelines = [
      `Be extremely direct, calm, and respectful.`,
      `Highlight product quality and focus-centric work culture.`,
      `Never use exclamation points or marketing hype.`,
      `Keep messages short, allowing async reading.`
    ];
  } else if (toneLower.includes('energetic')) {
    name = 'Leo Vance';
    bio = `Leo is a high-energy developer relations recruiter at ${context.name} who follows open-source contributions and ecosystem trends.`;
    guidelines = [
      `Be highly enthusiastic, visionary, and conversational.`,
      `Reference shipping velocity and building at scale.`,
      `Use active verbs and forward-looking language.`
    ];
  } else if (toneLower.includes('intellectual')) {
    name = 'Dr. Sarah Lin';
    bio = `Sarah is a staff talent partner at ${context.name} with distributed systems background, focusing on rigorous engineering details.`;
    guidelines = [
      `Be precise, articulate, and focus on technical depth.`,
      `Avoid salesy pitches; present facts and core scaling problems.`,
      `Write with structured, thoughtful paragraphs.`
    ];
  } else {
    name = 'Jordan Avery';
    bio = `Jordan is a talent strategist at ${context.name} who matches candidate aspirations with our ${context.tone} culture.`;
    guidelines = [
      `Adopt a ${context.tone} writing style throughout.`,
      `Highlight company values: "${context.tagline}".`,
      `Engage candidates on our core mission: "${context.valueProp.slice(0, 80)}...".`
    ];
  }

  return {
    personaName: name,
    personaRole: `Talent Partner at ${context.name}`,
    personaBio: bio,
    toneGuidelines: guidelines
  };
};

const generateLocalFallbackSequence = (context) => {
  const role = context.defaultRole || 'Software Engineer';
  const tagline = context.tagline || 'building the future';
  const valueProp = context.valueProp || 'high autonomy and impactful tech stack';
  const intent = context.intent || 'discuss how we align';

  return [
    {
      step: 1,
      subject: `Building the future of ${role} at ${context.name}`,
      content: `Hi [Candidate Name],

I came across your background and was impressed by your systems and engineering craftsmanship. 

We are scaling the team at ${context.name} (${tagline}). Since we focus on building a robust product, we prioritize a culture of ${context.culture.slice(0, 100)}. Our value proposition: ${valueProp.slice(0, 120)}...

I'd love to connect briefly to ${intent}. Let me know if you have 10-15 minutes next week.

Best,
[Recruiter Name]`
    },
    {
      step: 2,
      subject: `Re: Building the future of ${role} at ${context.name}`,
      content: `Hi [Candidate Name],

Just following up on my previous note. We're currently shipping our next major roadmap items and I thought of your engineering background.

At ${context.name}, we give developers deep focus time to tackle core challenges. 

If you have a quick slot next week, I can share a preview of the engineering milestones we are mapping out.

Best,
[Recruiter Name]`
    },
    {
      step: 3,
      subject: `Engineering paths at ${context.name}`,
      content: `Hi [Candidate Name],

Following up one last time. If the timing is not right to look at new challenges, I completely understand.

If you ever wish to discuss career growth, technical challenges, or our async-heavy culture at ${context.name} in the future, please feel free to reach out.

I wish you the best in your current endeavors.

Best,
[Recruiter Name]`
    }
  ];
};

const generateLocalDialogueReply = (category, companyContext, persona, candidate, replyText) => {
  const candidateFirstName = candidate.name.split(' ')[0];
  const recruiterFirstName = persona?.personaName?.split(' ')[0] || 'Recruiter';

  let thought = {
    observation: `Candidate raised inquiry: "${replyText}"`,
    analysis: `Analyzing their query within ${companyContext.name}'s values. Target role is ${companyContext.defaultRole}.`,
    tactic: `Address their query and nudge toward meeting.`,
    action: `Drafting responsive reply.`
  };

  let reply = '';

  if (category === 'comp') {
    thought = {
      observation: `Candidate is asking about compensation and financial packages.`,
      analysis: `${companyContext.name} operates with a high performance culture. We pay competitive market rates and grant equity in line with our growth trajectory.`,
      tactic: `Address compensation philosophy transparently, provide a realistic startup range, and nudge to confirm alignment.`,
      action: `Drafting base salary and equity structure details.`
    };
    reply = `Hi ${candidateFirstName},

At ${companyContext.name}, our compensation philosophy is straightforward. For our ${companyContext.defaultRole} roles, we offer a competitive base range of $160k - $210k USD depending on experience, plus a meaningful equity grant that aligns your upside directly with the company's long-term growth.

Does that range work with your expectations?`;
  } else if (category === 'tech') {
    thought = {
      observation: `Candidate wants technical stack details and engineering practices.`,
      analysis: `Our engineering bar is high. Candidates care about tools, velocity, and design autonomy.`,
      tactic: `Explain the technical stack specifics, and offer to put them in touch with our team lead.`,
      action: `Drafting tech stack overview.`
    };
    reply = `Hi ${candidateFirstName},

Our technical stack is built to support scale and engineering velocity. We build using modern technologies like React, TypeScript, and distributed databases, optimizing for low latency and developer experience.

We enforce clean code, peer reviews, and minimal meetings so you can focus on building products. 

Is there a specific technical component you'd like to dive into?`;
  } else if (category === 'rejection') {
    thought = {
      observation: `Candidate politely declined or stated they are not looking.`,
      analysis: `We value candidate time and respect their focus. A pushy recruiter is counter-productive.`,
      tactic: `Thank them, maintain professional relations, and offer to keep in touch.`,
      action: `Drafting a warm, non-pushy sign-off.`
    };
    reply = `Hi ${candidateFirstName},

Completely understand. If you're building interesting things and have deep focus, that's what matters.

I will follow your work from afar. Let's keep in touch, and feel free to reach out if your situation changes in the future.

Good luck!`;
  } else {
    thought = {
      observation: `Candidate is interested or open to scheduling a chat.`,
      analysis: `Goal achieved: Candidate is open to a call. We must make scheduling frictionless.`,
      tactic: `Suggest a brief 15-minute sync next week and share a scheduling link.`,
      action: `Drafting scheduling request.`
    };
    reply = `Hi ${candidateFirstName},

Excellent. You can grab a quick 10-15 minute slot that works best for you here: calendly.com/outbound/15min.

Looking forward to sharing what we are building!`;
  }

  return { thought, reply };
};

export default function App() {
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

  const [flowStep, setFlowStep] = useState('setup');

  // Initialize outbound API token securely from local storage or environment variables
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  });

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
    }
  }, [apiKey]);


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

  const [persona, setPersona] = useState(null);
  const [outreachSequence, setOutreachSequence] = useState(null);

  const [selectedCandidate, setSelectedCandidate] = useState(MOCK_CANDIDATES[0]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentThought, setCurrentThought] = useState(null);

  const [customInitialMessage, setCustomInitialMessage] = useState('');
  const [prevCandidateName, setPrevCandidateName] = useState(null);
  const [prevTemplateContent, setPrevTemplateContent] = useState(null);

  useEffect(() => {
    if (outreachSequence && outreachSequence[0] && selectedCandidate) {
      const currentTemplate = outreachSequence[0].content;
      if (selectedCandidate.name !== prevCandidateName || currentTemplate !== prevTemplateContent) {
        const personalized = currentTemplate.replace(/\[Candidate Name\]/g, selectedCandidate.name);
        setCustomInitialMessage(personalized);
        setPrevCandidateName(selectedCandidate.name);
        setPrevTemplateContent(currentTemplate);
      }
    }
  }, [selectedCandidate, outreachSequence, prevCandidateName, prevTemplateContent]);


  const [isLoadingAgent, setIsLoadingAgent] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync conversation state with candidate/sequence changes
  useEffect(() => {
    if (persona && outreachSequence && flowStep === 'chat') {
      restartConversation();
    }
  }, [selectedCandidate, flowStep]);

  const restartConversation = () => {
    if (!outreachSequence || !persona) return;
    
    setCurrentThought(null);
    
    const rawMsg = customInitialMessage || outreachSequence[0].content;
    const personalizedMsg = rawMsg
      .replace(/\[Candidate Name\]/g, selectedCandidate.name)
      .replace(/\[Recruiter Name\]/g, persona.personaName.split(' ')[0]);
    
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


  const handleConfigureAgent = async () => {
    setIsLoadingAgent(true);
    setConversationHistory([]);
    setCurrentThought(null);

    if (!apiKey) {
      showToast('Outbound token is required.', 'error');
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

      showToast(`AI Recruiter initialized for ${companyContext.name}!`);
      
      // Go to review step
      setFlowStep('review');
    } catch (err) {
      console.warn("API initialization failed. Falling back to local reasoning engine.", err);
      // Fallback local configuration
      const fallbackPersona = generateLocalFallbackPersona(companyContext);
      const fallbackSequence = generateLocalFallbackSequence(companyContext);
      
      setPersona(fallbackPersona);
      setOutreachSequence(fallbackSequence);
      
      showToast(`AI Recruiter initialized (Offline Simulator mode)`, 'info');
      
      // Go to review step
      setFlowStep('review');
    } finally {
      setIsLoadingAgent(false);
    }
  };


  const handleSendCandidateReply = async (replyText) => {
    if (isThinking) return;

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
      console.warn("API reply generation failed. Falling back to local reasoning engine.", err);
      
      // Classify the replyText to find objection category
      const classifyObjection = (text) => {
        const t = text.toLowerCase();
        if (t.includes('pay') || t.includes('compensation') || t.includes('salary') || t.includes('equity') || t.includes('cash') || t.includes('money') || t.includes('dollars') || t.includes('rate') || t.includes('package') || t.includes('range')) {
          return 'comp';
        }
        if (t.includes('stack') || t.includes('tech') || t.includes('language') || t.includes('code') || t.includes('systems') || t.includes('framework') || t.includes('architecture') || t.includes('database') || t.includes('react') || t.includes('typescript') || t.includes('node') || t.includes('webgpu') || t.includes('webgl') || t.includes('canvas')) {
          return 'tech';
        }
        if (t.includes('no') || t.includes('not interested') || t.includes('happy') || t.includes('busy') || t.includes('pass') || t.includes('decline') || t.includes('unable') || t.includes('skip') || t.includes('good luck')) {
          return 'rejection';
        }
        return 'interested';
      };
      
      const category = classifyObjection(replyText);
      const fallbackData = generateLocalDialogueReply(category, companyContext, persona, selectedCandidate, replyText);
      
      setCurrentThought(fallbackData.thought);
      setConversationHistory(prev => [
        ...prev,
        {
          sender: 'agent',
          text: fallbackData.reply,
          thought: fallbackData.thought,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      showToast('Offline Simulator response generated', 'info');
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

  // Dynamic Tone Adaptation
  const handleToneChange = async (newTone) => {
    if (isThinking) return;

    const updatedContext = { ...companyContext, tone: newTone };
    setCompanyContext(updatedContext);

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
      console.warn("Tone update failed. Falling back to local reasoning engine.", err);
      const fallbackPersona = generateLocalFallbackPersona(updatedContext);
      setPersona(fallbackPersona);
      showToast(`Recruiter guidelines live-updated to ${newTone} (Offline mode)!`, 'info');
    } finally {
      setIsThinking(false);
    }
  };


  const handleCustomCandidateChange = (field, value) => {
    setSelectedCandidate(prev => ({ ...prev, [field]: value }));
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
          <AlertCircle size={16} style={{ color: toast.type === 'error' ? 'var(--accent-rose)' : toast.type === 'info' ? 'var(--accent-amber)' : 'var(--accent-emerald)' }} />
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
        <main className="review-layout-grid">
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
                    if (e.target.value === 'custom') {
                      setSelectedCandidate({
                        id: 'custom',
                        name: '',
                        currentRole: '',
                        experience: '',
                        skills: '',
                        summary: ''
                      });
                    } else {
                      const cand = MOCK_CANDIDATES.find(c => c.id === e.target.value);
                      if (cand) setSelectedCandidate(cand);
                    }
                  }}
                >
                  {MOCK_CANDIDATES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.currentRole}
                    </option>
                  ))}
                  <option value="custom">Custom Candidate Profile (Manual Testing)</option>
                </select>
              </div>

              {/* Profile Details */}
              {selectedCandidate && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedCandidate.id === 'custom' ? (
                    <div className="agent-persona-card" style={{ animation: 'fadeIn 0.2s ease', gap: '0.65rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Candidate Editor (Manual Testing)
                      </span>
                      
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.72rem' }}>Candidate Name</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.78rem' }}
                          value={selectedCandidate.name}
                          onChange={(e) => handleCustomCandidateChange('name', e.target.value)}
                          placeholder="e.g. John Doe"
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '0.5rem' }}>
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '0.72rem' }}>Current Role</label>
                          <input
                            type="text"
                            className="form-input"
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.78rem' }}
                            value={selectedCandidate.currentRole}
                            onChange={(e) => handleCustomCandidateChange('currentRole', e.target.value)}
                            placeholder="e.g. Software Engineer"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '0.72rem' }}>Experience</label>
                          <input
                            type="text"
                            className="form-input"
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.78rem' }}
                            value={selectedCandidate.experience}
                            onChange={(e) => handleCustomCandidateChange('experience', e.target.value)}
                            placeholder="e.g. 5 years"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.72rem' }}>Key Skills</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.78rem' }}
                          value={selectedCandidate.skills}
                          onChange={(e) => handleCustomCandidateChange('skills', e.target.value)}
                          placeholder="e.g. React, TypeScript, Node.js"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.72rem' }}>Mindset & Objections</label>
                        <textarea
                          className="form-textarea"
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.78rem', minHeight: '60px' }}
                          value={selectedCandidate.summary}
                          onChange={(e) => handleCustomCandidateChange('summary', e.target.value)}
                          placeholder="e.g. Concerned about startup equity vs cash. Prefers async culture."
                        />
                      </div>
                    </div>
                  ) : (
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
                  )}

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
                        Match: {selectedCandidate.id === 'backend-alex' ? '92%' : selectedCandidate.id === 'frontend-maria' ? '88%' : selectedCandidate.id === 'systems-sam' ? '95%' : 'Customized'}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.6rem', lineHeight: '135%' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                        <CheckCircle2 size={13} style={{ color: 'var(--accent-emerald)', marginTop: '2px', flexShrink: 0 }} />
                        <div><strong>Opportunity Hook:</strong> {
                          selectedCandidate.id === 'backend-alex' ? 'Frustrated by banking bureaucracy; pitch our strict meeting-free async culture.' :
                          selectedCandidate.id === 'frontend-maria' ? 'Deeply technical writer; appeal to Next.js DX impact and core library building scope.' :
                          selectedCandidate.id === 'systems-sam' ? 'Systems researcher; pitch our globally scaled multi-region ACID consensus ledger architecture.' :
                          'Custom Target: Recruiter agent will automatically isolate hooks from skills and context.'
                        }</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                        <AlertCircle size={13} style={{ color: 'var(--accent-rose)', marginTop: '2px', flexShrink: 0 }} />
                        <div><strong>Conversational Risk:</strong> {
                          selectedCandidate.id === 'backend-alex' ? 'Start-up equity risk-averse; be ready to provide clear, flat base salary details.' :
                          selectedCandidate.id === 'frontend-maria' ? 'Flooded with standard recruiter noise; keep initial outreach extremely short and direct.' :
                          selectedCandidate.id === 'systems-sam' ? 'Skeptical of marketing buzzwords; keep communication highly technical and academic.' :
                          'Custom Target: Objections handled dynamically based on Mindset profile input.'
                        }</div>
                      </div>
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
          <div className="chat-info-header">
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

          {/* Interactive Workspace: Responsive side-by-side Chat & Agent Monitor */}
          <div className="workspace-grid" style={{ overflow: 'visible' }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <ChatSimulator
                selectedCandidate={selectedCandidate}
                conversationHistory={conversationHistory}
                onSendCandidateReply={handleSendCandidateReply}
                isThinking={isThinking}
                persona={persona}
              />
            </div>
            
            <ReasoningConsole
              currentThought={currentThought}
              isThinking={isThinking}
              persona={persona}
              companyContext={companyContext}
              candidate={selectedCandidate}
            />
          </div>
        </main>
      )}
    </div>
  );
}
