import React, { useState, useEffect } from 'react';
import { Settings, Sparkles, Building2, Key, Info, HelpCircle } from 'lucide-react';
import { MOCK_COMPANIES } from '../constants/mockData';

export default function CompanyForm({
  companyContext,
  setCompanyContext,
  apiKey,
  setApiKey,
  onConfigure,
  isLoading,
  isTabbed = false
}) {
  const handlePreFill = (companyKey) => {
    const preset = MOCK_COMPANIES[companyKey];
    if (preset) {
      setCompanyContext({
        name: preset.name,
        tagline: preset.tagline,
        website: preset.website,
        industry: preset.industry,
        culture: preset.culture,
        valueProp: preset.valueProp,
        intent: preset.intent,
        profiles: preset.profiles,
        defaultRole: preset.defaultRole,
        tone: preset.tone
      });
    }
  };

  const handleFieldChange = (field, value) => {
    setCompanyContext(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfigure();
  };

  const renderBody = () => (
    <>
      {/* Gemini API Key Input */}
      <div className="form-group">
        <label className="form-label">
          Gemini API Key
          <a
            href="https://aistudio.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-text"
            style={{ fontSize: '0.75rem' }}
          >
            Get Free Key
          </a>
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="password"
            className="form-input"
            style={{ width: '100%', paddingLeft: '2.25rem' }}
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Key
            size={14}
            className="text-muted"
            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>
        <p className="form-label" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '130%' }}>
          Pre-filled with evaluation key for your convenience. Stored locally.
        </p>
      </div>

      {/* Presets Row */}
      <div className="form-group">
        <label className="form-label">Pre-fill From Presets</label>
        <div className="presets-container">
          <button type="button" className="preset-badge" onClick={() => handlePreFill('linear')}>
            Linear
          </button>
          <button type="button" className="preset-badge" onClick={() => handlePreFill('vercel')}>
            Vercel
          </button>
          <button type="button" className="preset-badge" onClick={() => handlePreFill('stripe')}>
            Stripe
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            required
            className="form-input"
            value={companyContext.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="e.g. Acme Corp"
          />
        </div>

        <div className="form-group">
          <label className="form-label">One-line Tagline</label>
          <input
            type="text"
            className="form-input"
            value={companyContext.tagline}
            onChange={(e) => handleFieldChange('tagline', e.target.value)}
            placeholder="e.g. Next-gen database systems"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Target Hiring Role</label>
          <input
            type="text"
            required
            className="form-input"
            value={companyContext.defaultRole}
            onChange={(e) => handleFieldChange('defaultRole', e.target.value)}
            placeholder="e.g. Distributed Database Engineer"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Company Culture & Work Style</label>
          <textarea
            className="form-textarea"
            required
            value={companyContext.culture}
            onChange={(e) => handleFieldChange('culture', e.target.value)}
            placeholder="Describe work rhythm, meetings, async preferences, office policy, or culture guidelines..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Engineering Value Proposition</label>
          <textarea
            className="form-textarea"
            required
            value={companyContext.valueProp}
            onChange={(e) => handleFieldChange('valueProp', e.target.value)}
            placeholder="Why would a star developer join you? Tech stack, scaling challenges, product impact..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Campaign Intent / Goal</label>
          <textarea
            className="form-textarea"
            required
            value={companyContext.intent || ''}
            onChange={(e) => handleFieldChange('intent', e.target.value)}
            placeholder="e.g. Schedule a 15m intro call, or invite them to a coffee chat in SF to discuss our new funding round..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Recruiter Personality Tone</label>
          <div className="tone-selector">
            {['calm', 'energetic', 'intellectual'].map((t) => (
              <button
                key={t}
                type="button"
                className={`tone-option ${companyContext.tone === t && !['calm', 'energetic', 'intellectual'].includes(companyContext.tone) ? '' : companyContext.tone === t ? 'active' : ''}`}
                onClick={() => handleFieldChange('tone', t)}
              >
                {t}
              </button>
            ))}
            <button
              type="button"
              className={`tone-option ${!['calm', 'energetic', 'intellectual'].includes(companyContext.tone) ? 'active' : ''}`}
              onClick={() => handleFieldChange('tone', 'witty')} /* Default custom tone value */
            >
              Custom
            </button>
          </div>
          
          {/* Custom Tone Input Field */}
          {!['calm', 'energetic', 'intellectual'].includes(companyContext.tone) && (
            <input
              type="text"
              className="form-input"
              style={{ marginTop: '0.4rem', animation: 'fadeIn 0.2s ease' }}
              value={companyContext.tone}
              onChange={(e) => handleFieldChange('tone', e.target.value)}
              placeholder="e.g. sarcastic, dry humor, aggressively technical, witty"
              required
            />
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ marginTop: '0.5rem', width: '100%' }}
          disabled={isLoading || !apiKey}
        >
          {isLoading ? (
            <>
              <div className="typing-indicator" style={{ display: 'inline-flex', padding: 0 }}>
                <div className="typing-dot" style={{ backgroundColor: '#fff' }} />
                <div className="typing-dot" style={{ backgroundColor: '#fff' }} />
                <div className="typing-dot" style={{ backgroundColor: '#fff' }} />
              </div>
              <span>Configuring Agent...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Initialize Recruiter Agent</span>
            </>
          )}
        </button>
      </form>
    </>
  );

  if (isTabbed) {
    return <div className="panel-body" style={{ padding: '1.25rem' }}>{renderBody()}</div>;
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="panel-title">
          <Settings size={18} className="text-secondary" />
          Campaign Setup
        </h3>
        <span className="state-badge green">Live AI Recruiter</span>
      </div>

      <div className="panel-body">
        {renderBody()}
      </div>
    </div>
  );
}
