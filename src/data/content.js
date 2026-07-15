/** @typedef {import("./types.js").CapabilityGroup} CapabilityGroup */
/** @typedef {import("./types.js").CaseStudy} CaseStudy */
/** @typedef {import("./types.js").ContactLink} ContactLink */
/** @typedef {import("./types.js").EvidenceLink} EvidenceLink */
/** @typedef {import("./types.js").ExperienceEntry} ExperienceEntry */
/** @typedef {import("./types.js").NavItem} NavItem */

export const identity = {
  name: "Dhruba Saha",
  role: "Software Engineer",
  location: "Germany",
  line: "Dhruba Saha · Software Engineer · Germany",
};

export const hero = {
  eyebrow: identity.line,
  headline: "I turn complex workflows into dependable software.",
  summary:
    "I design backend systems, workflow automation, and internal tools for work that is too important to remain manual. Applied AI is one part of that practice—not the whole story.",
  primaryAction: { label: "View selected work", href: "#work" },
  secondaryAction: { label: "Get in touch", href: "#contact" },
};

/** @type {readonly NavItem[]} */
export const navItems = [
  { label: "Work", href: "#work" },
  { label: "Experience", mobileLabel: "Career", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const impactCaseStudy = {
  id: "ai-workflow",
  title: "A faster path from source material to expert-ready output.",
  summary:
    "I designed and implemented an internal workflow that brings retrieval, structured outputs, service orchestration, and domain validation into one dependable process.",
  metric: {
    before: "≈ 8 hours",
    after: "≈ 5 minutes",
    label: "Approximately eight hours reduced to approximately five minutes",
  },
  outcome:
    "The system reduced an approximately eight-hour process to approximately five minutes of generation time. Expert review remains part of every final decision.",
  confidentialityNote:
    "This case study is intentionally sanitized. The employer, source material, and proprietary implementation details remain private.",
};

/** @type {readonly CaseStudy[]} */
export const caseStudies = [
  {
    id: "project-kyber",
    title: "Project Kyber",
    status: "Private active R&D",
    visibility: "private-rnd",
    summary:
      "A local-first research direction exploring how context quality, architectural governance, and controlled execution could make AI-assisted software development more dependable.",
    contribution:
      "I am defining the thesis and testing the system boundaries behind it.",
    outcome:
      "Active private research, presented without links or completed-product claims.",
    evidence: [],
  },
  {
    id: "tremor-track",
    title: "Tremor Track — Moonquake Map 2.0",
    status: "Team hackathon project · Working live demo",
    visibility: "public",
    summary:
      "An interactive 3D lunar globe created by a team for NASA Space Apps Challenge 2023, making historical moonquake and geological data easier to explore.",
    contribution:
      "I contributed to a collaborative software project spanning interactive 3D visualization, processed scientific data, and exploratory controls.",
    outcome:
      "A working public demo, source repository, and official challenge project page.",
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

/** @type {readonly CapabilityGroup[]} */
export const capabilityGroups = [
  {
    id: "backend",
    title: "Backend systems",
    description:
      "Services, APIs, and data flows with clear boundaries—built to remain understandable after launch.",
    skills: ["Python", "JavaScript & TypeScript", "Node.js", "PostgreSQL", "REST APIs"],
  },
  {
    id: "automation",
    title: "Workflow automation",
    description:
      "Operational processes translated into observable software with deliberate validation and failure paths.",
    skills: ["Service orchestration", "API integrations", "Process mapping", "Human review"],
  },
  {
    id: "internal-tools",
    title: "Internal tools",
    description:
      "Focused interfaces that make complex work easier without hiding the decisions people still need to make.",
    skills: ["Product thinking", "Internal tool UX", "Rapid prototyping", "Documentation"],
  },
  {
    id: "applied-ai",
    title: "Applied AI",
    description:
      "Model capabilities used where they earn their place, grounded in useful context and structured results.",
    skills: ["Retrieval", "Structured outputs", "Semantic search", "Context design", "Evaluation"],
  },
];

/** @type {readonly ExperienceEntry[]} */
export const experienceEntries = [
  {
    id: "current-role",
    role: "Software Engineer · Applied AI & Automation · Current",
    location: "Germany",
    summary:
      "I build internal tools, backend services, and workflow automations that turn ambiguous operational needs into reliable software.",
    highlights: [
      "Design backend services, APIs, integrations, and data workflows.",
      "Apply retrieval, structured outputs, validation, and expert review where AI adds practical value.",
      "Take projects from architecture through delivery and documentation.",
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

export const about = {
  title: "Reliable software starts with clear thinking.",
  paragraphs: [
    "My earlier infrastructure work shaped how I think about reliability, interfaces, and maintainability. That same discipline now guides the software I build for complex operational work.",
    "I am most useful when a problem is still ambiguous: listening closely, finding the real system boundary, and shipping something people can trust.",
  ],
  photography: {
    title: "A different kind of observation",
    body: "Away from software, I photograph wildlife, nature, and the night sky—a slower practice built on patience and attention.",
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

export const contact = {
  title: "Let’s make complex work simpler.",
  body:
    "For software engineering roles and collaborations around backend systems, automation, internal tools, or thoughtfully applied AI, send me an email or explore my work on GitHub.",
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
