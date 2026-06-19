# PSVIEW Recruiter Agent Sandbox

A premium, interactive dashboard that simulates an autonomous AI recruiter agent. The agent self-configures its persona and messaging sequence from any company profile and culture, and carries out simulated candidate dialogues with a real-time, side-by-side **Reasoning Console** displaying its internal cognitive steps.

***

## What Makes This Agent Intelligent (and not just an LLM call)?
> **The recruiter agent operates on a stateful Observation-Reasoning-Action (ReAct) loop that maps candidate objections directly to company-specific cultural values, dynamically selecting recruitment tactics (e.g., radical compensation transparency, technical stack depth, or long-term relation building) to guide the dialogue toward scheduling a call while respecting the candidate’s sentiment.**
> 
> Rather than a simple prompt wrapper that outputs generic text, the agent models:
> 1. **Cognitive Mapping:** It parses candidate replies to classify sentiment and isolate specific objections (e.g., compensation anxiety, tech stack match, or developer workflow fatigue).
> 2. **Context & Value Alignment:** It references the configured company culture (e.g., Linear's async/no-meeting focus vs. Vercel's framework advocacy) to construct context-accurate counter-arguments instead of generic copy.
> 3. **Tactical Action Selection:** It determines whether to address salary, provide distributed systems detail, coordinate calendars, or bow out gracefully to protect brand reputation.

***

## Features

- 🌐 **100% Live AI Execution (Pre-filled for Convenience):**
  - Powered directly by Google's `gemini-2.5-flash` model.
  - A working evaluation API key is **pre-filled by default**, meaning the agent is fully interactive and runs real-time reasoning immediately out-of-the-box.
  - Users can optionally override the API key with their own key in the setup console.
- ✍️ **Tailored Outreach Editor:**
  - Dynamic template parser replaces candidate placeholders with their actual names in Step 2.
  - Allows you to edit or completely rewrite the initial outreach message prior to launching the dialogue.
  - The AI agent dynamically absorbs your custom outreach message as its conversational starting point.
- 🧠 **Visualized "Agent Brain":** 
  - A developer-style terminal console that streams the agent's step-by-step thinking (`Observation` ➔ `Analysis` ➔ `Tactic` ➔ `Action`) side-by-side with the chat.
- 💬 **Interactive Candidate Sandbox:**
  - Simulate diverse candidate personas (e.g., Alex Chen at LegacyBank tired of meetings; Maria Santos at DevCorp gets flooded with spam).
  - Quick-reply triggers (💰 Ask about Comp, 🛠️ Ask about Tech Stack, 🙅 Polite Rejection, 📅 Accept Call) or write arbitrary custom messages to test the agent's general reasoning capability.
- 🎨 **Premium Glassmorphic UI:**
  - Modern dark-theme dashboard, fluid animations, custom scrollbars, and high-fidelity layouts designed to impress.

***

## Tech Stack & Architecture

- **Frontend Core:** React 19 + Vite 8 (extremely fast build and load speeds).
- **Styling:** Pure Vanilla CSS (for maximum layout control, smooth transitions, and responsive styling without bloating the bundle).
- **Icons:** Lucide React.
- **LLM Integration:** Direct Gemini REST Client (allows clean client-side API requests, eliminating server overhead and preserving API key security via local storage).

***

## Setup & Running Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd FoundingEng
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the address shown (usually `http://localhost:5173`).

### Production Build
To build the static application assets:
```bash
npm run build
```
This will compile and optimize all code into a `./dist` folder, ready to be hosted on Vercel, Netlify, or GitHub Pages.
