/** @typedef {import("./types.js").AboutContent} AboutContent */
/** @typedef {import("./types.js").AstronautCredit} AstronautCredit */
/** @typedef {import("./types.js").ContactLink} ContactLink */
/** @typedef {import("./types.js").CurrentRole} CurrentRole */
/** @typedef {import("./types.js").NavItem} NavItem */
/** @typedef {import("./types.js").PublicProject} PublicProject */
/** @typedef {import("./types.js").ResearchProject} ResearchProject */
/** @typedef {import("./types.js").WorkflowCaseStudy} WorkflowCaseStudy */

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
  { label: "Workflow", href: "#workflow" },
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
    "I take substantial ownership of internal software from an initially unclear operational need through architecture, implementation, validation, documentation, and maintenance. The work spans backend services, APIs, data flows, integrations, and operational tooling built to stay understandable after the first release.",
  responsibilities: [
    "Discover requirements with the people closest to the work and translate them into a tractable software boundary.",
    "Design and implement backend services, APIs, data flows, integrations, and operational tooling.",
    "Validate outcomes with domain experts, document decisions, and maintain systems as needs change.",
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

/** @type {WorkflowCaseStudy} */
export const workflowCaseStudy = {
  id: "workflow",
  title: "AI-assisted workflow automation",
  status: "Sanitized internal case study",
  problem:
    "A recurring operational workflow required people to gather source material, identify relevant context, produce a consistent draft, and prepare it for expert review. The complete manual process took approximately eight hours.",
  contribution:
    "I designed and implemented a workflow that selects relevant context, produces structured output, coordinates supporting services, and presents the result for expert validation.",
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
  outcome:
    "Reduced approximately eight hours of work to approximately five minutes while retaining expert review.",
  reviewBoundary:
    "Expert review remains mandatory before the output is used.",
  confidentialityNote:
    "The employer, source material, prompts, private data, screenshots, and proprietary implementation remain confidential.",
};

/** @type {ResearchProject} */
export const researchProject = {
  id: "project-kyber",
  title: "Project Kyber",
  status: "Private active R&D",
  visibility: "private",
  thesis:
    "A local-first AI coding control-plane research direction focused on context quality, architectural boundaries, controlled execution, and cost-aware model routing.",
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
    "A team project created for NASA International Space Apps Challenge 2023, presenting historical lunar seismic activity through an interactive experience.",
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
    "I care about the parts of software that make it dependable after the demo: clear boundaries, maintainable interfaces, useful documentation, and room for the people using it to stay in control.",
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
