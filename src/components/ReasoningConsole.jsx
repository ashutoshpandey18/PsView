import React from 'react';
import { Terminal, Cpu } from 'lucide-react';

export default function ReasoningConsole({ currentThought, isThinking }) {
  return (
    <div className="panel console-panel" style={{ flex: 1 }}>
      <div className="console-header">
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-rose)', opacity: 0.8 }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-amber)', opacity: 0.8 }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)', opacity: 0.8 }} />
        </div>
        <span className="console-title-text" style={{ fontSize: '0.72rem', paddingLeft: '0.5rem' }}>
          agent_recruiterd.log
        </span>
        <span className={`console-indicator ${isThinking ? 'busy' : ''}`} />
      </div>

      <div className="console-body">
        {/* If agent is thinking, show thinking logs */}
        {isThinking && !currentThought && (
          <div className="console-welcome" style={{ animation: 'fadeIn 0.2s ease' }}>
            <span className="console-prompt-line">$ agent_reasoner --assess-context</span>
            <span style={{ color: 'var(--accent-amber)' }}>&gt; Instantiating reasoning loop...</span>
            <span style={{ color: 'var(--accent-amber)' }}>&gt; Reading candidate profile & history...</span>
            <span style={{ color: 'var(--text-muted)' }}>&gt; Synthesizing alignment strategies...</span>
          </div>
        )}

        {/* If we have an active thought model, show step-by-step reasoning steps */}
        {currentThought ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.3s ease' }}>
            <div className="console-prompt-line">$ cat /var/log/agent_decisions.json</div>
            
            {currentThought.observation && (
              <div className="console-segment observation">
                <div className="console-label-tag">Observation</div>
                <div className="console-text">{currentThought.observation}</div>
              </div>
            )}

            {currentThought.analysis && (
              <div className="console-segment analysis">
                <div className="console-label-tag">Culture & Persona Analysis</div>
                <div className="console-text">{currentThought.analysis}</div>
              </div>
            )}

            {currentThought.tactic && (
              <div className="console-segment tactic">
                <div className="console-label-tag">Tactic Selection</div>
                <div className="console-text">{currentThought.tactic}</div>
              </div>
            )}

            {currentThought.action && (
              <div className="console-segment action">
                <div className="console-label-tag">Draft Action</div>
                <div className="console-text">{currentThought.action}</div>
              </div>
            )}
          </div>
        ) : (
          !isThinking && (
            <div className="console-welcome">
              <span className="console-prompt-line">$ systemctl status recruiter-agent</span>
              <span>● recruiter-agent.service - Autonomous Outbound Engine</span>
              <span>   Loaded: loaded (/etc/systemd/system/recruiter-agent.service)</span>
              <span>   Active: <span style={{ color: 'var(--accent-emerald)' }}>active (running)</span> since Fri 2026-06-19; 10:19:24 PDT</span>
              <br />
              <span className="console-prompt-line">$ tail -f /var/log/recruiter-agent.log</span>
              <span style={{ color: 'var(--text-muted)' }}>[INFO] Recruiter agent spawned. Awaiting campaign.</span>
              <span style={{ color: 'var(--text-muted)' }}>[INFO] Standing by for candidate interaction...</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
