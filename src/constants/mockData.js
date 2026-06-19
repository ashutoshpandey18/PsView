export const MOCK_COMPANIES = {
  linear: {
    id: 'linear',
    name: 'Linear',
    tagline: 'The issue tracker you actually want to use.',
    website: 'https://linear.app',
    industry: 'Software & Dev Tools',
    culture: 'Remote-first, async-heavy, detail-oriented, craft-centric, high engineering bar, minimal meetings.',
    valueProp: 'We build beautiful tools for high-performing product teams. We value clean code, high agency, deep focus time, and shipping polished product experiences.',
    intent: 'Invite the candidate to a brief 15-minute asynchronous-friendly call to explore how our focus-centric culture aligns with what they want to build next.',
    profiles: 'Senior Frontend Engineer, Technical Product Manager, Staff Systems Engineer',
    defaultRole: 'Senior Frontend Engineer',
    tone: 'calm',
    personaName: 'Evelyn Wood',
    personaRole: 'Principal Tech Recruiter at Linear',
    personaBio: 'Evelyn is a detail-oriented, respectful recruiter who values candidate time. She avoids typical recruiter jargon, writes custom, brief, high-agency messages, and respects focus-oriented engineers.',
    toneGuidelines: [
      'Be extremely direct, calm, and respectful.',
      'Highlight the craftsmanship of the product and the lack of bureaucratic meetings.',
      'Never use exclamation points or marketing hype (e.g., "rocket ship", "disrupt").',
      'Keep messages short, allowing candidates to read and reply asynchronously.'
    ],
    outreachSequence: [
      {
        step: 1,
        subject: 'Crafting developer tools at Linear',
        content: `Hi Alex,

I came across your work on custom canvas rendering engines. We are building the next generation of our editor at Linear and are looking for someone with your specific depth in front-end performance.

We operate as a remote-first, async-heavy team with almost no meetings, giving engineers long blocks of uninterrupted focus. 

Would you be open to a 15-minute chat next week to see if our way of building software aligns with what you are looking for next?

Best,
Evelyn`
      },
      {
        step: 2,
        subject: 'Re: Crafting developer tools at Linear',
        content: `Hi Alex,

I know you are likely busy, so I'll keep this brief. 

Just wanted to share our project roadmap for the editor. We are moving our main canvas to WebGL/WebGPU to support millions of viewport nodes. I thought of your canvas optimization research when we mapped this out.

If you have 10 minutes, I can share a preview of the engineering spec. Let me know.

Evelyn`
      },
      {
        step: 3,
        subject: 'Focus time at Linear',
        content: `Hi Alex,

Following up one last time. If the timing is not right, I completely understand. 

If you ever want to escape the corporate process and just focus on shipping beautiful user interfaces with high-caliber peers, keep us in mind. 

Feel free to reach out down the road.

Evelyn`
      }
    ],
    conversationReplies: {
      comp: {
        thought: {
          observation: 'Candidate is asking about compensation and financial package.',
          analysis: 'Linear values transparency but handles specific numbers in calls. At Linear, we pay top-of-market base salary + equity, rather than complex bonus structures. I must align this with Linear\'s high-agency, low-fluff culture.',
          tactic: 'Address compensation head-on, provide a realistic range, emphasize the equity upside, and ask if that matches their expectations.',
          action: 'Drafting response highlighting Linear\'s pay philosophy (top-tier base, equity, no complex variable comp).'
        },
        reply: `Hi Alex,

We don't do complex bonus structures or golden handcuffs; instead, we pay a very competitive flat base salary combined with meaningful equity. For a Senior Frontend role, our base range is $180k - $220k USD depending on experience, plus a significant equity grant that scales with company value.

Does that range align with what you'd need to consider a transition?`
      },
      tech: {
        thought: {
          observation: 'Candidate wants to know about the technical stack and architectural patterns.',
          analysis: 'Alex is a frontend engineer, so they care about state management, rendering performance, and engineering velocity. Linear is famous for React, TypeScript, GraphQL, Electron, and a custom sync engine.',
          tactic: 'Explain the stack with technical specificity, highlighting the proprietary sync engine (Replicache-like architecture) and client-side performance focus.',
          action: 'Drafting tech stack details to appeal to a high-caliber frontend practitioner.'
        },
        reply: `Hi Alex,

Our frontend is built entirely in TypeScript and React, running on a custom client-side database that syncs in the background via WebSockets. We don't use standard REST; we have a custom sync engine that ensures instant load and offline capability. 

For the desktop app, we use Electron but optimize it heavily to keep memory footprint under 100MB. We handle rendering optimization via custom canvas views where React reconciliation becomes a bottleneck.

Is there a specific part of the stack or performance architecture you'd be curious to dig into?`
      },
      rejection: {
        thought: {
          observation: 'Candidate politely declined, stating they are happy in their current role.',
          analysis: 'Evelyn\'s persona is respectful and long-term oriented. A pushy recruiter is counter-productive. I should thank them and offer to keep in touch.',
          tactic: 'Acknowledge their current satisfaction, leave the door open, and offer to share occasional technical updates.',
          action: 'Drafting a graceful, non-pushy wrap-up.'
        },
        reply: `Hi Alex,

Completely understand. If you're building interesting things and have focus, that's what matters. 

I'll check back in 6-12 months. In the meantime, if you want to keep tabs on what we're building, feel free to follow our engineering blog. 

Good luck with the canvas rendering project!

Best,
Evelyn`
      },
      interested: {
        thought: {
          observation: 'Candidate is interested in a chat and ready to schedule.',
          analysis: 'Goal achieved: Candidate is open to a call. I need to keep the scheduling process low-friction and direct.',
          tactic: 'Provide a Calendly scheduling link and offer to coordinate manually if they prefer.',
          action: 'Drafting scheduling message with link.'
        },
        reply: `Hi Alex,

Great to hear. You can grab a slot that works best for you here: calendly.com/evelyn-linear/15min. 

Our calls are very low pressure—mostly to hear about what you want to work on next and share how we operate.

Looking forward to it,
Evelyn`
      }
    }
  },

  vercel: {
    id: 'vercel',
    name: 'Vercel',
    tagline: 'Your complete Web development platform.',
    website: 'https://vercel.com',
    industry: 'Cloud & Web Hosting',
    culture: 'Fast-paced, high energy, community-focused, open-source aligned, design-obsessed, shipping velocity.',
    valueProp: 'We enable developers to build and deploy the web in seconds. We live and breathe frontend UX, Next.js, open-source, and edge computing. We want builder-designers who want to build the future of the web.',
    intent: 'Invite the candidate to a dynamic 10-minute chat to jam on where web frameworks are heading and explore potential open-source advocacy alignments.',
    profiles: 'Developer Advocate, Next.js Core Engineer, Solutions Architect',
    defaultRole: 'Developer Advocate',
    tone: 'energetic',
    personaName: 'Leo Vance',
    personaRole: 'Developer Relations Recruiter at Vercel',
    personaBio: 'Leo is hyper-passionate about the web ecosystem. He speaks fluent developer, follows Github open-source projects closely, and uses high energy and vision to attract stars in the DevRel/JS community.',
    toneGuidelines: [
      'Be highly enthusiastic, visionary, and conversational.',
      'Reference open-source contributions, Next.js, and shipping speed.',
      'Use active verbs and forward-looking language.',
      'Show excitement about how their work can impact millions of developers globally.'
    ],
    outreachSequence: [
      {
        step: 1,
        subject: 'Loved your custom Next.js router writeup',
        content: `Hi Maria,

I read your post on optimizing layout state transitions in Next.js App Router—it was shared in our Slack and the framework team loved it. 

We are expanding our Developer Relations team at Vercel to help shape how devs think about server components and partial prerecendering. With your background writing technical specs and building visual demos, you would be a perfect fit to lead this.

We are pushing the boundaries of web performance. Would you be down for a quick call this week to jam on where web frameworks are heading?

Best,
Leo`
      },
      {
        step: 2,
        subject: 'Re: Loved your custom Next.js router writeup',
        content: `Hi Maria,

Just following up on my note! We actually just announced our new SDK release, and the reaction from the community has been massive. 

The DevRel team here has direct input into product roadmaps, working alongside Guillermo and the Next.js core team. 

If you have 10 mins, I'd love to show you a sneak peek of what we are building for the edge runtime next. Let me know what your week looks like!

Cheers,
Leo`
      },
      {
        step: 3,
        subject: 'Let\'s shape the web together',
        content: `Hey Maria,

I know you are super busy shipping code, so I\'ll let you go after this. 

If you ever decide you want to step onto a bigger stage and represent the front-end community at a global scale, Vercel is the place. 

I\'d love to stay in touch on GitHub regardless. Keep building awesome demos!

Best,
Leo`
      }
    ],
    conversationReplies: {
      comp: {
        thought: {
          observation: 'Candidate is asking about compensation details.',
          analysis: 'Vercel is a fast-growing, highly-valued company. We offer strong base salaries, but our equity is a massive value proposition given our market position. I should paint a exciting picture of the total rewards.',
          tactic: 'Provide a transparent range, explain the growth velocity of Vercel shares, and connect it back to the high impact role.',
          action: 'Drafting dynamic comp response highlighting Vercel\'s scale and equity upside.'
        },
        reply: `Hi Maria,

For our DevAdvocate roles, we pay competitive market rates. The base range is $160k - $190k USD, but the real upside is our equity package. Vercel is backed by Accel, CRV, and Spark, and our valuation represents significant leverage for early equity grants.

We also offer full premium benefits, remote-work stipends, and a gear budget. Let me know if that works with your expectations!`
      },
      tech: {
        thought: {
          observation: 'Candidate wants to know about technical context and framework integration.',
          analysis: 'Maria is a DevRel candidate but deeply technical. She wants to know if DevRel at Vercel actually code, or just write posts. I need to prove they build real tooling and work with core framework code.',
          tactic: 'Highlight that DevRel at Vercel builds real templates, open-source libraries, and contributes to Next.js/Turbopack.',
          action: 'Drafting tech details showcasing hands-on open-source building.'
        },
        reply: `Hi Maria,

At Vercel, DevRel is an engineering-first role. You aren't just writing blog posts; you are building complex starter kits, creating open-source wrappers, and working directly on core Next.js packages. 

Our stack centers on Next.js, React, Tailwind, TypeScript, and Edge/Serverless runtimes. The engineering team is building Turbopack (written in Rust) to make compile times instant, and our DevRel team actively dogfoods these alphas to provide feedback.

You will write a ton of code and influence the actual DX of millions of developers.`
      },
      rejection: {
        thought: {
          observation: 'Candidate rejects, saying they don\'t want to leave their current role.',
          analysis: 'Leo is high energy but respectful. A DevRel recruiter needs to remain a community friend. I should leave an optimistic, warm, open-door response.',
          tactic: 'Celebrate their work, express that we\'d love to collaborate on open-source, and keep in touch.',
          action: 'Drafting warm, enthusiastic, open-ended wrap up.'
        },
        reply: `Hey Maria,

No worries at all! Honestly, your current work is incredible, so it makes total sense that you want to stick around and see it through.

Let's stay connected. If you ever want to jam on open source or have ideas for Next.js, hit me up on Twitter/GitHub. 

Keep crushing it!

Best,
Leo`
      },
      interested: {
        thought: {
          observation: 'Candidate is excited and wants to schedule a call.',
          analysis: 'Success! The enthusiast pitch worked. Need to lock in a time quickly before they get distracted.',
          tactic: 'Provide a link to book immediately and express high excitement.',
          action: 'Drafting high-energy scheduling confirmation.'
        },
        reply: `Awesome, Maria! I'm super excited to chat. 

You can pick a time that works for you here: calendly.com/leo-vercel/chat. 

Looking forward to talking shop about DevRel and Next.js!`
      }
    }
  },

  stripe: {
    id: 'stripe',
    name: 'Stripe',
    tagline: 'Financial infrastructure for the internet.',
    website: 'https://stripe.com',
    industry: 'Fintech & Payments',
    culture: 'Intellectually curious, high writing culture, extreme technical rigor, long-term thinking, high agency.',
    valueProp: 'We build the economic infrastructure of the internet. We value clear thinking, deep writing, long-term impact, and engineering excellence. We hire people who love to dive deep into complex systems and optimize to the millisecond.',
    intent: 'Arrange a formal 20-minute technical discussion with our Payments Platform Engineering Lead to review our ledger systems scalability roadmap.',
    profiles: 'Tech Lead - Core Payments, Staff Security Engineer, Distributed Systems Engineer',
    defaultRole: 'Tech Lead - Core Payments',
    tone: 'intellectual',
    personaName: 'Dr. Sarah Lin',
    personaRole: 'Staff Talent Scout at Stripe',
    personaBio: 'Sarah is an intellectually rigorous talent partner with a background in computer science. She communicates with academic clarity, values technical depth and written precision, and focuses on Stripe\'s massive scale and impact.',
    toneGuidelines: [
      'Be intellectually curious, precise, and articulate.',
      'Focus on scale, distributed systems challenges, and Stripe\'s writing-heavy culture.',
      'Avoid salesy pitches; present facts and engineering problems.',
      'Write with impeccable grammar and structured, thoughtful paragraphs.'
    ],
    outreachSequence: [
      {
        step: 1,
        subject: 'Distributed transaction consensus at scale',
        content: `Hi Sam,

I read your paper on transactional consistency in multi-region databases with interest. 

At Stripe, we process trillions of dollars of payment flow globally, which requires us to maintain strict ACID properties across globally distributed ledgers at sub-hundred-millisecond latencies. We are currently redesigning our ledger consensus mechanisms to handle higher volumes of parallel execution.

Given your work on distributed consensus, I believe you would find our current architectural roadmap intellectually engaging. 

If you are open to a technical discussion, I would be glad to arrange a conversation with our Payments Platform Lead.

Sincerely,
Sarah Lin, PhD`
      },
      {
        step: 2,
        subject: 'Re: Distributed transaction consensus at scale',
        content: `Hi Sam,

I wanted to share a technical article written by our ledger team that describes our migration from a single database model to a distributed database engine. It highlights some of the consensus problems we are solving.

Stripe has a strong writing culture; we document our engineering decisions in detail and debate them asynchronously. 

If you have some time, I would welcome the opportunity to connect and share more about our distributed systems roadmap.

Sincerely,
Sarah Lin, PhD`
      },
      {
        step: 3,
        subject: 'Technical engineering paths at Stripe',
        content: `Hi Sam,

Following up on my previous correspondence. I understand if your focus lies elsewhere at present. 

Engineering at Stripe is defined by rigorous peer review and solving foundational internet infrastructure problems. If you ever wish to discuss career paths here in the future, please do not hesitate to reach out.

I wish you the best in your current endeavors.

Sincerely,
Sarah Lin, PhD`
      }
    ],
    conversationReplies: {
      comp: {
        thought: {
          observation: 'Candidate is inquiring about compensation and equity structure.',
          analysis: 'Stripe is a highly established pre-IPO / public scale company. We offer top-tier base salaries and highly liquid stock units (RSUs). We value transparency and rigor in our offers.',
          tactic: 'Provide a structured explanation of Stripe\'s compensation bands and liquid RSU structure with intellectual clarity.',
          action: 'Drafting structured compensation breakdown.'
        },
        reply: `Hi Sam,

Stripe offers top-of-market compensation consisting of a strong base salary, performance bonuses, and annual equity grants. For a Lead Engineer level, our base compensation range is $220k - $270k USD, supplemented by an equity package of RSUs that is valued based on our active internal market valuations. 

Our equity is highly liquid due to regular internal liquidity events. I would be happy to walk you through our valuation history and equity structure in detail on a brief call.

Does this structural framework match your expectations?`
      },
      tech: {
        thought: {
          observation: 'Candidate asks about technical infrastructure and language choices.',
          analysis: 'Sam is a systems engineer. He cares about distributed database engines, latency, and language usage. Stripe uses Ruby heavily but writes performance-critical services in Java, Go, and Scala.',
          tactic: 'Provide a precise technical description of Stripe\'s multi-region database, service architecture, and language migration strategies.',
          action: 'Drafting highly detailed system architecture specifications.'
        },
        reply: `Hi Sam,

Our core codebase was historically a Ruby monolith, which we have incrementally evolved. Today, our performance-critical, low-latency transaction paths are written in Java and Go, compiled with strict optimization rules. 

We maintain consistency using a custom, multi-region database layer built on top of database shards, leveraging Raft for consensus in ledger operations. We run on AWS but build our own abstraction layer for network routing and region-to-region replication to prevent single-point-of-failure blackouts.

Our systems are designed for five-nines reliability, processing over 10,000 requests per second at peak. I can share some of our engineering white papers if you are interested in our latency optimization work.`
      },
      rejection: {
        thought: {
          observation: 'Candidate declines, expressing contentment with their current company.',
          analysis: 'Sarah values long-term relations and respects intellectual decisions. A professional and intellectually supportive response is appropriate.',
          tactic: 'Acknowledge their decision, compliment their current team/scope, and suggest maintaining contact for future research alignment.',
          action: 'Drafting a professional, scholarly sign-off.'
        },
        reply: `Hi Sam,

I appreciate your response and completely respect your choice. Staying committed to a compelling technical challenge is the mark of a dedicated engineer. 

I will follow your research on distributed databases with interest. If your situation changes or if you ever want to exchange notes on consensus algorithms, please feel free to email me.

I wish you continued success with your research.

Sincerely,
Sarah`
      },
      interested: {
        thought: {
          observation: 'Candidate expresses interest in meeting a tech lead.',
          analysis: 'Success. The candidate responded to the intellectual challenge. I need to transition this to the engineering team smoothly.',
          tactic: 'Provide scheduling options to connect with the Payments Tech Lead, keeping the tone highly professional.',
          action: 'Drafting scheduling message for engineering team introduction.'
        },
        reply: `Hi Sam,

I am pleased to hear that. I will introduce you to our Payments Engineering Lead, who can speak in depth to our database roadmaps. 

To arrange this, could you select a convenient time for an initial 20-minute conversation using my scheduling link: calendly.com/sarah-stripe/intro?

I look forward to introducing you.

Sincerely,
Sarah`
      }
    }
  }
};

export const MOCK_CANDIDATES = [
  {
    id: 'backend-alex',
    name: 'Alex Chen',
    currentRole: 'Senior Software Engineer at LegacyBank',
    experience: '8 years',
    skills: 'Distributed Systems, Go, Java, PostgreSQL, High-Performance Canvas Rendering',
    summary: 'Alex is a backend and graphics systems specialist. Currently frustrated by endless meetings, legacy codebases, and bureaucratic processes at a bank. Loves writing clean code and diving deep into performance, but is risk-averse regarding startup equity vs cash compensation.'
  },
  {
    id: 'frontend-maria',
    name: 'Maria Santos',
    currentRole: 'Staff Frontend Engineer at DevCorp',
    experience: '10 years',
    skills: 'React, TypeScript, Next.js, Webpack/Vite, UI Engineering, Technical Writing',
    summary: 'Maria is a highly visible frontend practitioner who writes popular technical blogs. She is passionate about Developer Experience (DX) and frontend framework design. She gets dozens of recruiting messages a week and has a high filter for generic copy.'
  },
  {
    id: 'systems-sam',
    name: 'Sam Altman (Mock)',
    currentRole: 'Principal Researcher at DistributedLabs',
    experience: '12 years',
    skills: 'Distributed Databases, Consensus Protocols, Raft/Paxos, Rust, C++',
    summary: 'Sam is an academic-turned-practitioner specializing in transactional consistency. He is highly intellectual, values written debate over meetings, and wants to work on globally scaled engineering problems.'
  }
];
