import React, { useState } from 'react';
import { UserCheck, MessageSquare, ChevronDown, ChevronUp, FileText, CheckCircle2 } from 'lucide-react';

export default function AgentConfig({ persona, outreachSequence, targetRole, companyName, onUpdateSequence, isTabbed = false }) {
  const [expandedStep, setExpandedStep] = useState(1);

  if (!persona) {
    return (
      <div className="panel" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '2px dashed var(--panel-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}
          >
            <UserCheck size={24} className="text-muted" />
          </div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No Recruiter Campaign Active
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '140%', maxWidth: '260px', margin: '0 auto' }}>
            Configure your company parameters on the left and click 'Initialize Recruiter Agent' to generate a persona.
          </p>
        </div>
      </div>
    );
  }

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const renderBody = () => (
    <>
      {/* Recruiter Persona Display Card */}
      <div className="agent-persona-card">
        <div className="agent-profile">
          <div className="agent-avatar">
            {getInitials(persona.personaName)}
            <span className="status-indicator" />
          </div>
          <div className="agent-info">
            <span className="agent-name">{persona.personaName}</span>
            <span className="agent-role">{persona.personaRole}</span>
          </div>
        </div>
        <p className="agent-bio">"{persona.personaBio}"</p>
      </div>

      {/* Tone Guidelines */}
      <div className="form-group">
        <label className="form-label" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Communication Rules
        </label>
        <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {persona.toneGuidelines?.map((guide, idx) => (
            <li
              key={idx}
              style={{
                fontSize: '0.8rem',
                lineHeight: '130%',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.45rem'
              }}
            >
              <CheckCircle2 size={12} className="text-primary" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>{guide}</span>
            </li>
          ))}
        </ul>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--panel-border)', margin: '0.5rem 0' }} />

      {/* Outreach Sequence */}
      <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <label className="form-label" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          Engagement Sequence (Editable)
        </label>
        <div className="sequence-timeline">
          {outreachSequence?.map((seq) => {
            const isActive = expandedStep === seq.step;
            return (
              <div key={seq.step} className={`sequence-step ${isActive ? 'active' : ''}`}>
                <div className="sequence-badge" />
                
                <div className="sequence-header">
                  <span className="sequence-number">Step {seq.step}: {seq.step === 1 ? 'Initial outreach' : seq.step === 2 ? 'Follow-up' : 'Final nudge'}</span>
                  <button
                    type="button"
                    className="btn-text"
                    onClick={() => setExpandedStep(isActive ? 0 : seq.step)}
                    aria-expanded={isActive}
                    aria-label={`Toggle Step ${seq.step} content`}
                  >
                    {isActive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                <div className="sequence-subject" style={{ fontWeight: isActive ? '600' : '400' }}>
                  {seq.subject}
                </div>

                {isActive && (
                  <textarea
                    className="form-textarea"
                    style={{
                      marginTop: '0.4rem',
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      fontSize: '0.78rem',
                      lineHeight: '140%',
                      fontFamily: 'inherit',
                      color: 'var(--text-primary)',
                      background: 'rgba(255, 255, 255, 0.015)',
                      border: '1px solid var(--panel-border)',
                      borderRadius: 'var(--radius-sm)',
                      minHeight: '110px',
                      resize: 'vertical',
                      animation: 'fadeIn 0.2s ease'
                    }}
                    value={seq.content}
                    onChange={(e) => onUpdateSequence && onUpdateSequence(seq.step, e.target.value)}
                    placeholder="Outreach message template..."
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  if (isTabbed) {
    return <div className="panel-body" style={{ padding: '1.25rem' }}>{renderBody()}</div>;
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="panel-title">
          <UserCheck size={18} className="text-secondary" />
          Agent Persona
        </h3>
        <span className="state-badge green">Configured</span>
      </div>

      <div className="panel-body">
        {renderBody()}
      </div>
    </div>
  );
}
