# PSVIEW Recruiter Agent Sandbox

An interactive web application that simulates an autonomous AI recruiter agent that configures its persona and messaging sequence from any company profile and carries out simulated candidate dialogues with a real-time, side-by-side **Reasoning Console**.

### 🔗 Quick Links
- **Live Demo (Vercel):** [founding-eng.vercel.app](https://founding-eng.vercel.app/)
- **Source Code (GitHub):** [github.com/ashutoshpandey18/PsView](https://github.com/ashutoshpandey18/PsView)

---


## What was Built
* **Dynamic Setup Console:** Lets users configure custom company parameters, taglines, cultures, and recruiter tone settings. Includes a "Custom (Blank)" reset option.
* **Agent Configuration Visualizer:** Renders the generated recruiter persona (name, role, bio, tone rules) and the 3-step outreach campaign sequence (custom-editable in real-time).
* **Interactive Candidate Simulator:** Features quick-reply objection triggers and custom text inputs, testing dialogues against distinct candidate profiles or custom manual test inputs.
* **Cognitive Monitor (Reasoning Terminal):** A CLI-styled pane streaming the agent's internal ReAct telemetry (`Observation` ➔ `Analysis` ➔ `Tactic` ➔ `Action`) side-by-side with the chat.

---

## Design & Technical Choices
* **Vite + React 19:** Set up as a single-page app for instantaneous builds (235ms compilation) and extremely fast, zero-delay state transitions.
* **Vanilla CSS (Monochromatic Theme):** Avoided heavy frameworks (like Tailwind) in favor of a bespoke, minimally stunning monochromatic layout inspired by Apple and Linear dashboards.
* **Offline Resiliency & Fallbacks:** Integrated a stateful rules-based generator and classifier catch block that runs locally if the API is offline or rate-limited, keeping the application 100% operational.
* **Direct REST API Calls:** Connected directly to the Gemini API using native fetch on the client, avoiding server-side overhead and storing credentials securely in `localStorage`.

---

## What Makes This Agent Intelligent (and not just an LLM call)?
> **The recruiter agent operates on a stateful ReAct (Observation-Analysis-Tactic-Action) loop that classifies candidate objections (comp, tech stack, rejection) and maps them directly to company-specific values to formulate adaptive, brand-safe counter-arguments rather than generating generic, unconstrained text.**

---

## Running Locally

### Installation
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```
