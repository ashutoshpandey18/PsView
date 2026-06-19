/**
 * Gemini API client helper.
 * Uses the Generative Language API direct endpoint for client-side execution.
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Calls Gemini API with contents and system instructions, enforcing JSON output.
 */
async function callGemini(apiKey, systemInstruction, prompt) {
  const url = `${GEMINI_API_URL}?key=${apiKey.trim()}`;
  
  const body = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    systemInstruction: {
      parts: [
        { text: systemInstruction }
      ]
    },
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errText = await response.text();
    let errJson;
    try {
      errJson = JSON.parse(errText);
    } catch (e) {
      // Not JSON
    }
    throw new Error(
      errJson?.error?.message || `Gemini API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error('Invalid response payload from Gemini API.');
  }

  return JSON.parse(textOutput.trim());
}

/**
 * Step 1 & 2: Configures the agent persona and outreach sequence from company context.
 */
export async function initializeAgent(apiKey, companyContext) {
  const systemInstruction = `You are a world-class executive talent acquisition strategist.
Your task is to take a company's profile and culture, and configure a custom recruiter agent persona and a 3-step outreach sequence.

You MUST respond with a JSON object matching this exact schema:
{
  "personaName": "Full name of the recruiter persona",
  "personaRole": "Recruiter title (e.g. Lead Talent Partner at [Company])",
  "personaBio": "A 2-sentence description of who they are, their background, and recruiting philosophy.",
  "toneGuidelines": [
    "Guideline 1 for how this recruiter writes (e.g. no hype words, extremely brief, highly technical)",
    "Guideline 2...",
    "Guideline 3..."
  ],
  "outreachSequence": [
    {
      "step": 1,
      "subject": "Email/LinkedIn subject line for outreach 1",
      "content": "Full text of Message 1, highly tailored to the company's culture and value prop. Use [Candidate Name] as placeholder."
    },
    {
      "step": 2,
      "subject": "Subject/Follow-up line for outreach 2",
      "content": "Full text of Message 2. A polite and brief follow-up referencing another aspect of company culture or context. Use [Candidate Name]."
    },
    {
      "step": 3,
      "subject": "Subject/Follow-up line for outreach 3",
      "content": "Full text of Message 3. A final nudge, polite, leaving the door open. Use [Candidate Name]."
    }
  ]
}

Make sure the persona and message sequence reflect the true nature of the company:
- If company is calm/async (like Linear), the recruiter should be direct, brief, non-pushy, and zero-hype.
- If company is fast/community (like Vercel), the recruiter should be highly enthusiastic, open-source friendly, and visionary.
- If company is intellectual/rigorous (like Stripe), the recruiter should write with high literacy, structured paragraphs, focusing on hard scaling/consensus problems.
`;

  const prompt = `Here is the company context:
Company Name: ${companyContext.name}
Tagline: ${companyContext.tagline}
Website: ${companyContext.website}
Industry: ${companyContext.industry}
Culture: ${companyContext.culture}
Value Proposition: ${companyContext.valueProp}
Campaign Intent / Goal: ${companyContext.intent || 'Invite to a 15-minute call'}
Profiles we hire: ${companyContext.profiles}
Target role for this campaign: ${companyContext.defaultRole || 'Software Engineer'}
recruiter tone setting: ${companyContext.tone} (e.g. calm, energetic, intellectual, professional)

Create the agent recruiter persona and the 3-step sequence for a candidate named [Candidate Name]. Return ONLY the valid JSON object.`;

  return callGemini(apiKey, systemInstruction, prompt);
}

/**
 * Step 3: Simulates the agent reasoning and replying to a candidate's message.
 */
export async function generateAgentReply(apiKey, params) {
  const {
    companyContext,
    persona,
    candidateProfile,
    conversationHistory,
    latestReply,
    outreachSequence
  } = params;

  const sequenceStr = outreachSequence && outreachSequence.length > 0
    ? `\nPlanned Outreach Sequence Templates:\n${outreachSequence.map(s => `- Step ${s.step} (${s.subject}): "${s.content}"`).join('\n')}`
    : '';

  const systemInstruction = `You are an autonomous AI recruiter agent named ${persona.personaName} (${persona.personaRole}).
Your company is ${companyContext.name}.
Your personality bio: ${persona.personaBio}

Your guidelines:
${persona.toneGuidelines.map(g => `- ${g}`).join('\n')}
${sequenceStr}

You are engaging in a conversation with a candidate. Your ultimate goal is to achieve this campaign intent/goal: ${companyContext.intent || 'get them to agree to a 15-minute introductory call'}.
You must be highly autonomous. Read the conversation history, analyze the candidate's last message, identify objections/questions/sentiment, reason about the strategic action to take, and write the response.

You MUST respond with a JSON object matching this exact schema:
{
  "thought": {
    "observation": "Detailed observation of the candidate's message: what is their tone, what did they ask, what objection or concern did they raise?",
    "analysis": "Strategic reflection: check how this relates to the company's culture/values and your recruiter persona. How do we address this naturally and honestly?",
    "tactic": "Action choice: what is our tactical response? (e.g. state our exact compensation range to be transparent, explain our tech stack detail, be warm and offer scheduling, or write a polite wrap-up if they rejected us)",
    "action": "Description of drafting action (e.g. 'Drafting a precise, non-hype answer about base salary and equity bands.')"
  },
  "reply": "The actual message text you send to the candidate. Keep it in character, direct, and aligned with your tone guidelines."
}
`;

  const historyStr = conversationHistory.map(m => `${m.sender === 'agent' ? 'Recruiter' : 'Candidate'}: ${m.text}`).join('\n');

  const prompt = `
Candidate Profile:
Name: ${candidateProfile.name}
Role: ${candidateProfile.currentRole}
Experience: ${candidateProfile.experience}
Key Skills: ${candidateProfile.skills}
Summary: ${candidateProfile.summary}

Company Context:
Name: ${companyContext.name}
Culture: ${companyContext.culture}
Value Proposition: ${companyContext.valueProp}

Conversation History so far:
${historyStr}

Candidate's Latest Message:
"${latestReply}"

Generate your reasoning thought steps and your response. Return ONLY the valid JSON object.`;

  return callGemini(apiKey, systemInstruction, prompt);
}

