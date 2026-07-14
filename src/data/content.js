/** @typedef {import("./types.js").CapabilityGroup} CapabilityGroup */
/** @typedef {import("./types.js").CaseStudy} CaseStudy */
/** @typedef {import("./types.js").ContactLink} ContactLink */
/** @typedef {import("./types.js").CurrentScopeItem} CurrentScopeItem */
/** @typedef {import("./types.js").EvidenceLink} EvidenceLink */
/** @typedef {import("./types.js").ExperienceEntry} ExperienceEntry */
/** @typedef {import("./types.js").NavItem} NavItem */
/** @typedef {import("./types.js").SceneStage} SceneStage */

export const identity = {
  name: "Dhruba Saha",
  role: "Software Engineer",
  location: "Germany",
  line: "Dhruba Saha · Software Engineer · Germany",
};

export const hero = {
  eyebrow: identity.line,
  headline:
    "I build applied AI systems that turn manual work into dependable software.",
  summary:
    "I design and ship AI workflows, backend services, and internal tools—combining useful context, structured outputs, orchestration, and human review to make operational work faster and more reliable.",
  primaryAction: { label: "Explore current work", href: "#impact" },
  secondaryAction: { label: "Contact", href: "#contact" },
};

/** @type {readonly NavItem[]} */
export const navItems = [
  { label: "Home", href: "#home" },
  { label: "Impact", href: "#impact" },
  { label: "Now", href: "#now" },
  { label: "Work", href: "#work" },
  { label: "Career", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/** @type {readonly SceneStage[]} */
export const sceneStages = [
  {
    id: "ingest",
    label: "Ingest",
    title: "Bring the right inputs into focus.",
    description:
      "Gather the operational context, source material, and constraints that define a useful result.",
    accent: "amber",
    cameraTarget: [-3.4, 0.9, 5.8],
    nodeTarget: [-3.5, 0.6, 0],
  },
  {
    id: "retrieve",
    label: "Retrieve",
    title: "Select context with intent.",
    description:
      "Find the examples and domain knowledge that matter for the task instead of sending everything at once.",
    accent: "cyan",
    cameraTarget: [-1.6, 1.2, 5.2],
    nodeTarget: [-1.7, 1.1, 0],
  },
  {
    id: "orchestrate",
    label: "Orchestrate",
    title: "Turn model calls into a system.",
    description:
      "Coordinate services, data, instructions, and structured outputs as one observable workflow.",
    accent: "violet",
    cameraTarget: [0, 0.5, 4.7],
    nodeTarget: [0, 0.25, 0],
  },
  {
    id: "validate",
    label: "Validate",
    title: "Keep expert judgment in the loop.",
    description:
      "Check outputs against domain rules and route consequential decisions through expert review.",
    accent: "cyan",
    cameraTarget: [1.8, 1.1, 5.2],
    nodeTarget: [1.7, 1, 0],
  },
  {
    id: "deliver",
    label: "Deliver",
    title: "Ship a dependable working tool.",
    description:
      "Return useful output through software that fits the real operational workflow and remains understandable.",
    accent: "violet",
    cameraTarget: [3.5, 0.8, 5.8],
    nodeTarget: [3.5, 0.55, 0],
  },
];

export const impactCaseStudy = {
  id: "ai-workflow",
  eyebrow: "Current systems impact · Sanitized case study",
  title: "AI-assisted workflow automation",
  summary:
    "Designed and implemented an AI-assisted workflow for a time-intensive operational process, combining retrieval, structured outputs, orchestration, validation, and expert review.",
  metric: {
    before: "Approximately eight hours",
    after: "Approximately five minutes",
    label: "Manual process → AI-assisted generation",
  },
  outcome:
    "Reduced an approximately eight-hour process to approximately five minutes while retaining expert review.",
  confidentialityNote:
    "The case study is intentionally sanitized; source material and implementation details remain confidential.",
};

/** @type {readonly CurrentScopeItem[]} */
export const currentScope = [
  {
    id: "backend",
    label: "01 · Connect",
    title: "Backend services & APIs",
    description:
      "Services, integrations, and data flows that turn business requirements into stable system boundaries.",
    accent: "cyan",
  },
  {
    id: "context",
    label: "02 · Ground",
    title: "Retrieval & context systems",
    description:
      "Purposeful context selection, semantic retrieval, and structured knowledge flows for useful model output.",
    accent: "violet",
  },
  {
    id: "orchestration",
    label: "03 · Coordinate",
    title: "AI workflow orchestration",
    description:
      "Observable workflows that coordinate models, services, validation, and human decisions.",
    accent: "amber",
  },
  {
    id: "internal-tools",
    label: "04 · Deliver",
    title: "Internal tools & dependable delivery",
    description:
      "Focused software that removes repetitive work while remaining clear enough to operate and maintain.",
    accent: "cyan",
  },
];

/** @type {readonly CaseStudy[]} */
export const caseStudies = [
  {
    id: "ai-workflow",
    eyebrow: "01 · Current systems impact",
    title: "AI-assisted workflow automation",
    status: "Sanitized internal case study",
    visibility: "sanitized",
    summary:
      "A production-oriented workflow that combines retrieval, structured outputs, orchestration, validation, and expert review.",
    contribution:
      "Designed and implemented the workflow architecture, service connections, context flow, and review path.",
    outcome:
      "Reduced an approximately eight-hour process to approximately five minutes while retaining expert review.",
    accent: "amber",
    evidence: [],
  },
  {
    id: "project-kyber",
    eyebrow: "02 · Developer tooling research",
    title: "Project Kyber",
    status: "Private active R&D",
    visibility: "private-rnd",
    summary:
      "Researching a local-first control plane for AI coding agents, focused on architectural governance, context quality, sandboxed execution, and cost-aware model routing.",
    contribution:
      "Defining the research thesis and exploring how stronger context and governance could make agent-assisted software development more dependable.",
    outcome:
      "An active private research direction—not presented as a completed or deployed product.",
    accent: "violet",
    evidence: [],
  },
  {
    id: "tremor-track",
    eyebrow: "03 · Earlier software work",
    title: "Tremor Track — Moonquake Map 2.0",
    status: "Team hackathon project · Working live demo",
    visibility: "public",
    summary:
      "An interactive 3D lunar globe created by a team for NASA Space Apps Challenge 2023 to make historical moonquake and geological data easier to explore.",
    contribution:
      "Contributed to a collaborative software project spanning interactive 3D visualization, processed scientific data, and exploratory controls.",
    outcome:
      "A working public demo, source repository, and official challenge project page.",
    accent: "cyan",
    evidence: [
      {
        label: "Repository",
        href: "https://github.com/dhrubasaha08/tremortrack",
        kind: "repository",
        external: true,
      },
      {
        label: "Live demo",
        href: "https://tremortrack.dhrubasaha.co.in/",
        kind: "live-demo",
        external: true,
      },
      {
        label: "NASA project page",
        href: "https://www.spaceappschallenge.org/2023/find-a-team/tremor-track/?tab=project",
        kind: "project-page",
        external: true,
      },
    ],
  },
];

/** @type {readonly ExperienceEntry[]} */
export const experienceEntries = [
  {
    id: "current-role",
    role: "Software Engineer · Applied AI & Automation · Current",
    location: "Germany",
    summary:
      "Builds AI-assisted internal tools, backend services, and workflow automations that translate operational needs into reliable software.",
    highlights: [
      "Designs backend services, APIs, integrations, and data workflows.",
      "Applies retrieval, structured outputs, validation, and expert review to operational processes.",
      "Takes ambiguous problems from architecture through delivery and documentation.",
    ],
    current: true,
  },
  {
    id: "dcss-internship",
    role: "DevOps & Systems Administration Intern",
    organization: "DCSS, Visva-Bharati University",
    period: "2023",
    location: "Santiniketan, India",
    summary:
      "Supported departmental software and Linux systems while automating recurring operational work and documenting workflows.",
    highlights: [
      "Worked with Linux services, containers, networking, and self-hosted applications.",
      "Automated routine administration with Python and shell tooling.",
    ],
    current: false,
  },
];

/** @type {readonly CapabilityGroup[]} */
export const capabilityGroups = [
  {
    id: "applied-ai",
    title: "Applied AI systems",
    description:
      "Application-layer AI designed around useful context, structured results, evaluation, and human judgment.",
    skills: [
      "Retrieval-augmented generation",
      "Structured outputs",
      "Semantic search",
      "Context design",
      "Human-in-the-loop validation",
    ],
    accent: "violet",
  },
  {
    id: "backend",
    title: "Backend engineering",
    description:
      "Services and data interfaces that connect workflows to dependable system boundaries.",
    skills: ["Python", "JavaScript & TypeScript", "Node.js", "PostgreSQL", "REST APIs"],
    accent: "cyan",
  },
  {
    id: "automation",
    title: "Automation & integrations",
    description:
      "Maintainable workflows that coordinate software, data, validation, and operational decisions.",
    skills: [
      "Workflow orchestration",
      "API integrations",
      "Business process mapping",
      "Internal tool UX",
      "Rapid prototyping",
    ],
    accent: "amber",
  },
  {
    id: "delivery",
    title: "Delivery & operations",
    description:
      "The practical engineering needed to ship, observe, and maintain software beyond a prototype.",
    skills: ["Docker", "Linux", "Git & GitHub", "GitHub Actions", "Technical documentation"],
    accent: "cyan",
  },
];

export const about = {
  eyebrow: "About",
  title: "Curious about complex systems. Focused on useful outcomes.",
  paragraphs: [
    "Earlier open-source and infrastructure work shaped how I think about reliability, clear interfaces, and maintainability.",
    "Today I apply that discipline to applied AI, backend automation, and internal tools—especially where the problem is ambiguous and the software has to fit real operational work.",
  ],
  photography: {
    title: "Away from the screen",
    body: "I photograph wildlife, nature, and the night sky through astrophotography—a slower practice built on patience and observation.",
  },
};

/** @type {readonly ContactLink[]} */
export const contactLinks = [
  {
    label: "Email",
    value: "contact@dhrubasaha.co.in",
    href: "mailto:contact@dhrubasaha.co.in",
    kind: "email",
  },
  {
    label: "GitHub",
    value: "github.com/dhrubasaha08",
    href: "https://github.com/dhrubasaha08",
    kind: "profile",
  },
];

export const contact = {
  eyebrow: "Contact",
  title: "Let’s build software that makes complex work simpler.",
  body:
    "For roles and collaborations in applied AI, backend automation, internal tools, or developer tooling, send me an email or explore my work on GitHub.",
  links: contactLinks,
};

/** @type {readonly EvidenceLink[]} */
export const evidenceLinks = caseStudies.flatMap((study) => study.evidence);

export const astronautCredit = {
  title: "Tenhun Falling spaceman (FanArt)",
  creator: "wallmasterr",
  license: "CC Attribution",
  source: {
    label: "View the original model on Sketchfab",
    href: "https://sketchfab.com/3d-models/tenhun-falling-spaceman-fanart-9fd80b6a259f41fd99e6f56eee686dc5",
    kind: "source",
    external: true,
  },
};
