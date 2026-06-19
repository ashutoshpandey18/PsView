import React, { useEffect, useState } from 'react';
import { Terminal, Cpu, Activity, Sparkles, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

export default function ReasoningConsole({ currentThought, isThinking, persona, companyContext, candidate }) {
  const [activeStep, setActiveStep] = useState(0);

  // Animate the cognitive pipeline steps when thinking
  useEffect(() => {
    if (isThinking) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 4);
      }, 600);
      return () => clearInterval(interval);
    } else {
      setActiveStep(-1);
    }
  }, [isThinking]);

  // Initials helper
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AI';
  };

  return (
    <div className="panel console-panel" style={{ flex: 1, height: '640px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="console-header">
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-rose)', opacity: 0.8 }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-amber)', opacity: 0.8 }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)', opacity: 0.8 }} />
        </div>
        <span className="console-title-text" style={{ fontSize: '0.72rem', paddingLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Activity size={10} className={isThinking ? 'text-primary' : ''} style={{ animation: isThinking ? 'pulse-glow 1s infinite' : 'none' }} />
          agent_cognitive_monitor.sys
        </span>
        <span className={`console-indicator ${isThinking ? 'busy' : ''}`} />
      </div>

      <div className="console-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', padding: '1rem' }}>
        
        {/* SECTION 1: Dynamic ReAct Pipeline Visualizer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Live ReAct Pipeline
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            
            {/* Step 1: Observe */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--panel-border)',
              background: activeStep === 0 ? 'rgba(251, 191, 36, 0.05)' : 'rgba(255, 255, 255, 0.005)',
              transition: 'all 0.2s ease',
              opacity: isThinking && activeStep !== 0 ? 0.4 : 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-amber)',
                  boxShadow: activeStep === 0 ? '0 0 8px var(--accent-amber)' : 'none',
                  animation: activeStep === 0 ? 'pulse-glow 0.8s infinite' : 'none'
                }} />
                <span style={{ fontSize: '0.74rem', fontWeight: activeStep === 0 ? 600 : 400, color: 'var(--text-primary)' }}>1. Observe & Classify</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Classifying Objections</span>
            </div>

            {/* Step 2: Reflect */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--panel-border)',
              background: activeStep === 1 ? 'rgba(192, 132, 252, 0.05)' : 'rgba(255, 255, 255, 0.005)',
              transition: 'all 0.2s ease',
              opacity: isThinking && activeStep !== 1 ? 0.4 : 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-purple)',
                  boxShadow: activeStep === 1 ? '0 0 8px var(--accent-purple)' : 'none',
                  animation: activeStep === 1 ? 'pulse-glow 0.8s infinite' : 'none'
                }} />
                <span style={{ fontSize: '0.74rem', fontWeight: activeStep === 1 ? 600 : 400, color: 'var(--text-primary)' }}>2. Evaluate Alignment</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Cultural Constraints</span>
            </div>

            {/* Step 3: Strategize */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--panel-border)',
              background: activeStep === 2 ? 'rgba(250, 250, 250, 0.05)' : 'rgba(255, 255, 255, 0.005)',
              transition: 'all 0.2s ease',
              opacity: isThinking && activeStep !== 2 ? 0.4 : 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--text-primary)',
                  boxShadow: activeStep === 2 ? '0 0 8px #fff' : 'none',
                  animation: activeStep === 2 ? 'pulse-glow 0.8s infinite' : 'none'
                }} />
                <span style={{ fontSize: '0.74rem', fontWeight: activeStep === 2 ? 600 : 400, color: 'var(--text-primary)' }}>3. Select Tactic</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Strategic Counter-measure</span>
            </div>

            {/* Step 4: Execute */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--panel-border)',
              background: activeStep === 3 ? 'rgba(52, 211, 153, 0.05)' : 'rgba(255, 255, 255, 0.005)',
              transition: 'all 0.2s ease',
              opacity: isThinking && activeStep !== 3 ? 0.4 : 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-emerald)',
                  boxShadow: activeStep === 3 ? '0 0 8px var(--accent-emerald)' : 'none',
                  animation: activeStep === 3 ? 'pulse-glow 0.8s infinite' : 'none'
                }} />
                <span style={{ fontSize: '0.74rem', fontWeight: activeStep === 3 ? 600 : 400, color: 'var(--text-primary)' }}>4. Draft Response</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Context & Tone Hook</span>
            </div>

          </div>
        </div>

        {/* SECTION 2: Active Persona & Parameters */}
        {persona && (
          <div style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--panel-border)',
            background: 'rgba(255, 255, 255, 0.01)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: '50%',
                background: 'var(--text-primary)',
                color: 'var(--bg-color)',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {getInitials(persona.personaName)}
                <span className="status-indicator" style={{ width: '6px', height: '6px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{persona.personaName}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{persona.personaRole}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', borderTop: '1px solid var(--panel-border)', paddingTop: '0.5rem', fontSize: '0.72rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target Role:</span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{companyContext?.defaultRole || 'Developer'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Active Tone:</span>
                <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize', fontWeight: 500 }}>{companyContext?.tone}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.2rem', gap: '0.1rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Campaign Objective:</span>
                <span style={{ color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '130%', marginTop: '0.1rem' }}>
                  "{companyContext?.intent?.slice(0, 100) || 'Schedule intro chat'}..."
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: Live Decision Logs */}
        <div style={{ flex: 1, minHeight: '180px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Decision Telemetry Log
          </span>
          
          <div style={{
            flex: 1,
            border: '1px solid var(--panel-border)',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '0.75rem',
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            lineHeight: '140%',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {isThinking && !currentThought && (
              <div style={{ animation: 'fadeIn 0.2s ease', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>$ tail -f /var/log/agent_reasoner.log</span>
                <span style={{ color: 'var(--accent-amber)' }}>&gt; Ingesting candidate conversation history...</span>
                <span style={{ color: 'var(--accent-purple)' }}>&gt; Running semantic value matching weights...</span>
                <span style={{ color: 'var(--text-muted)' }}>&gt; Formatting conversational guidelines constraints...</span>
              </div>
            )}

            {currentThought ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'fadeIn 0.25s ease' }}>
                <div style={{ borderLeft: '2px solid var(--accent-amber)', paddingLeft: '0.5rem' }}>
                  <div style={{ color: 'var(--accent-amber)', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '0.1rem' }}>OBSERVATION</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{currentThought.observation}</div>
                </div>

                <div style={{ borderLeft: '2px solid var(--accent-purple)', paddingLeft: '0.5rem' }}>
                  <div style={{ color: 'var(--accent-purple)', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '0.1rem' }}>REFLECT & ANALYZE</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{currentThought.analysis}</div>
                </div>

                <div style={{ borderLeft: '2px solid var(--text-primary)', paddingLeft: '0.5rem' }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '0.1rem' }}>SELECTED TACTIC</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{currentThought.tactic}</div>
                </div>

                <div style={{ borderLeft: '2px solid var(--accent-emerald)', paddingLeft: '0.5rem' }}>
                  <div style={{ color: 'var(--accent-emerald)', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '0.1rem' }}>ACTION DEPLOYED</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{currentThought.action}</div>
                </div>
              </div>
            ) : (
              !isThinking && (
                <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span>$ systemctl status agent-outbound</span>
                  <span>● agent-outbound.service - Live Outbound Dialogue Broker</span>
                  <span>   Active: <span style={{ color: 'var(--accent-emerald)' }}>active (running)</span></span>
                  <br />
                  <span>&gt; Standby mode. Awaiting dialogue telemetry...</span>
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
