/** @typedef {import("./types.js").AboutContent} AboutContent */
/** @typedef {import("./types.js").AstronautCredit} AstronautCredit */
/** @typedef {import("./types.js").ContactLink} ContactLink */
/** @typedef {import("./types.js").CurrentRole} CurrentRole */
/** @typedef {import("./types.js").DeliveryPhase} DeliveryPhase */
/** @typedef {import("./types.js").NavItem} NavItem */
/** @typedef {import("./types.js").PublicProject} PublicProject */
/** @typedef {import("./types.js").ResearchProject} ResearchProject */
/** @typedef {import("./types.js").WorkflowCaseStudy} WorkflowCaseStudy */
/** @typedef {import("./types.js").Workstream} Workstream */

export const identity = {
  name: "Dhruba Saha",
  role: "Software Engineer · Applied AI & Automation",
  location: "Germany",
};

export const hero = {
  title: identity.name,
  identityLine: `${identity.role} · ${identity.location}`,
  introduction:
    "I build backend systems, automation, and internal tools—and use AI where it genuinely improves the work.",
  primaryAction: {
    label: "Explore current work ↓",
    href: "#role",
  },
  secondaryAction: {
    label: "Contact ↗",
    href: "#contact",
  },
};

/** @type {readonly NavItem[]} */
export const navItems = [
  { label: "Home", href: "#hero" },
  { label: "Role", href: "#role" },
  { label: "Focus", href: "#what-i-build" },
  { label: "Workflow", href: "#workflow" },
  { label: "Method", href: "#how-i-work" },
  { label: "Projects", href: "#project-kyber" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/** @type {CurrentRole} */
export const currentRole = {
  id: "role",
  label: "Software Engineer · Applied AI & Automation · Current",
  location: "Germany",
  summary:
    "I work across the full delivery path: requirements discovery, architecture, implementation, validation, documentation, and maintenance. That means understanding the real process before defining a technical boundary, then building and supporting the software that carries it.",
  responsibilities: [
    "Turn an unclear operational need into explicit responsibilities, interfaces, and data flows.",
    "Build backend services, APIs, workflow automation, integrations, and internal tools.",
    "Review outcomes with the people closest to the work, document decisions, and keep the implementation understandable as requirements change.",
  ],
  stack: [
    "Python",
    "JavaScript/TypeScript",
    "Node.js",
    "PostgreSQL",
    "REST APIs",
    "n8n",
    "OpenAI APIs",
    "Docker",
    "Git",
    "Linux",
  ],
};

/** @type {readonly Workstream[]} */
export const workstreams = [
  {
    id: "backend",
    title: "Backend systems and APIs",
    description:
      "Services that give an operational process a clear software boundary and predictable interfaces.",
  },
  {
    id: "automation",
    title: "Workflow automation",
    description:
      "Software that coordinates data, services, and handoffs while keeping the result visible to the people responsible for it.",
  },
  {
    id: "internal-tools",
    title: "Internal tools",
    description:
      "Operational interfaces built around how people actually work, with documentation and maintenance considered from the beginning.",
  },
  {
    id: "applied-ai",
    title: "Applied AI",
    description:
      "Retrieval, context selection, structured outputs, and orchestration used where they genuinely improve a workflow—with an explicit validation boundary.",
  },
];

/** @type {WorkflowCaseStudy} */
export const workflowCaseStudy = {
  id: "workflow",
  title: "AI-assisted workflow automation",
  status: "Sanitized internal case study",
  problem:
    "The work began as a recurring manual sequence: gather approved source material, identify the relevant context, prepare a consistent draft, and hand it to an expert for review. End to end, the process took approximately eight hours.",
  contribution:
    "I mapped that sequence into a software workflow and designed the path from source material through retrieval, structured output, orchestration, and validation. The final decision remains outside the automation.",
  metric: {
    before: "≈8 hours",
    after: "≈5 minutes",
    accessibleLabel:
      "Approximately eight hours reduced to approximately five minutes",
  },
  architecture: [
    {
      id: "source",
      label: "Source material",
      description:
        "Approved material enters the workflow without exposing its private contents.",
    },
    {
      id: "retrieval",
      label: "Retrieval / context",
      description:
        "Relevant examples and context are selected for the task.",
    },
    {
      id: "structured-output",
      label: "Structured output",
      description:
        "The generated response is constrained to a predictable structure.",
    },
    {
      id: "orchestration",
      label: "Orchestration",
      description:
        "Supporting services move the result through the workflow.",
    },
    {
      id: "validation",
      label: "Validation",
      description:
        "Checks prepare the result for review by a domain expert.",
    },
    {
      id: "expert-decision",
      label: "Expert decision",
      description:
        "An expert decides whether the result is ready to use.",
    },
  ],
  rationale:
    "Retrieval selects relevant context. Structured output creates a predictable shape. Orchestration moves the result through the required services. Validation makes the handoff to an expert explicit.",
  outcome:
    "Reduced approximately eight hours of work to approximately five minutes while retaining expert review.",
  reviewBoundary:
    "Expert review remains mandatory before the output is used.",
  confidentialityNote:
    "The employer, source material, prompts, private data, screenshots, and proprietary implementation remain confidential.",
};

/** @type {readonly DeliveryPhase[]} */
export const deliveryPhases = [
  {
    id: "discover",
    title: "Discover",
    description:
      "Understand the operational need, the people closest to it, and how information currently moves.",
  },
  {
    id: "define",
    title: "Define",
    description:
      "Establish the software boundary, interfaces, data flows, and decisions that remain with people.",
  },
  {
    id: "build",
    title: "Build",
    description:
      "Implement the backend services, APIs, integrations, automation, and operational tooling.",
  },
  {
    id: "validate",
    title: "Validate",
    description:
      "Review outcomes with the people using the system and document the important decisions.",
  },
  {
    id: "maintain",
    title: "Maintain",
    description:
      "Keep the system understandable as requirements and surrounding processes change.",
  },
];

/** @type {ResearchProject} */
export const researchProject = {
  id: "project-kyber",
  title: "Project Kyber",
  status: "Private active R&D",
  visibility: "private",
  thesis:
    "Project Kyber is my private research direction for a local-first AI coding control plane. The thesis is that context quality, architectural boundaries, controlled execution, and cost-aware model routing should be treated as one connected system.",
  boundary:
    "This is active private research, not a finished or deployed product, and it has no public link.",
  evidence: [],
};

/** @type {PublicProject} */
export const tremorTrack = {
  id: "tremor-track",
  title: "Tremor Track",
  status: "Earlier team hackathon project",
  visibility: "public",
  summary:
    "Created collaboratively for NASA International Space Apps Challenge 2023, Tremor Track presents historical lunar seismic activity through an interactive experience.",
  contribution:
    "Created collaboratively during the hackathon; this portfolio keeps the contribution wording at team level.",
  outcome:
    "The repository, working live demo, and official challenge entry are public.",
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
};

/** @type {readonly (ResearchProject | PublicProject)[]} */
export const projects = [researchProject, tremorTrack];

/** @type {AboutContent} */
export const about = {
  title: "Make the complicated understandable.",
  body:
    "I am most useful when an operational need spans several systems and the right boundary is not obvious yet. I care about making that situation understandable, then leaving behind clear interfaces, useful documentation, and software that remains maintainable.",
  photography: {
    title: "Photography",
    body:
      "Away from software, I photograph wildlife, nature, and the night sky—a slower practice shaped by patience, attention, and noticing what would otherwise be missed.",
  },
};

/** @type {readonly ContactLink[]} */
export const contactLinks = [
  {
    label: "Email",
    value: "contact@dhrubasaha.co.in",
    href: "mailto:contact@dhrubasaha.co.in",
    kind: "email",
    external: false,
  },
  {
    label: "GitHub",
    value: "github.com/dhrubasaha08",
    href: "https://github.com/dhrubasaha08",
    kind: "profile",
    external: true,
  },
];

/** @type {AstronautCredit} */
export const astronautCredit = {
  title: "Tenhun Falling spaceman (FanArt)",
  creator: "wallmasterr",
  sourceHref:
    "https://sketchfab.com/3d-models/tenhun-falling-spaceman-fanart-9fd80b6a259f41fd99e6f56eee686dc5",
  licenseLabel: "Creative Commons Attribution",
  licenseHref: "https://creativecommons.org/licenses/by/4.0/",
};
