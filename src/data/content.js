/** @typedef {import("./types.js").CaseStudy} CaseStudy */
/** @typedef {import("./types.js").ContactLink} ContactLink */
/** @typedef {import("./types.js").ExperienceEntry} ExperienceEntry */
/** @typedef {import("./types.js").NavItem} NavItem */
/** @typedef {import("./types.js").PracticeStatement} PracticeStatement */

export const identity = {
  name: "Dhruba Saha",
  role: "Software Engineer",
  location: "Germany",
};

export const hero = {
  eyebrow: `${identity.name} / ${identity.role} / ${identity.location}`,
  headline: "I turn complex workflows into dependable software.",
  summary:
    "I’m Dhruba Saha, a software engineer in Germany. I build backend systems, automation, and internal tools—and use AI when it genuinely improves the work.",
  primaryAction: { label: "See current work ↓", href: "#work" },
  secondaryAction: { label: "Contact me ↗", href: "mailto:contact@dhrubasaha.co.in" },
};

/** @type {readonly NavItem[]} */
export const navItems = [
  { label: "Work", href: "#work" },
  { label: "Experience", mobileLabel: "Career", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const impactCaseStudy = {
  id: "workflow-automation",
  title: "Eight hours of careful work, reduced without losing the careful part.",
  opening:
    "A recurring internal process was consuming most of a working day. The hard part was not simply writing faster—it was finding the right source material, keeping the output consistent, and preserving professional judgement.",
  approach:
    "I built a workflow that retrieves relevant material, creates structured output, coordinates the supporting services, and leaves the final decision with an expert.",
  metric: {
    before: "≈ 8 hours",
    after: "≈ 5 minutes",
    label: "Approximately eight hours reduced to approximately five minutes",
  },
  outcome:
    "Generation now takes approximately five minutes instead of approximately eight hours. Expert review remains part of every final decision.",
  confidentialityNote:
    "The employer, source material, and proprietary implementation stay private.",
};

/** @type {readonly PracticeStatement[]} */
export const practiceStatements = [
  {
    id: "backend",
    title: "Backend systems",
    body: "I build the quiet plumbing behind useful products: services, APIs, databases, and integrations that behave predictably when real work depends on them.",
  },
  {
    id: "automation",
    title: "Workflow automation",
    body: "I turn repetitive hand-offs into clear, observable processes while keeping people in control of the decisions that need judgement.",
  },
  {
    id: "internal-tools",
    title: "Internal tools",
    body: "I make focused software for the people doing the work, shaped around their actual process instead of forcing the process into a generic product.",
  },
  {
    id: "applied-ai",
    title: "Applied AI",
    body: "I use retrieval, structured outputs, and language models when they remove genuine friction—and conventional software when it is the better answer.",
  },
];

/** @type {readonly CaseStudy[]} */
export const caseStudies = [
  {
    id: "project-kyber",
    title: "Project Kyber",
    status: "Private active R&D",
    visibility: "private-rnd",
    summary:
      "A local-first research direction exploring how better context, architectural boundaries, and controlled execution could make software agents more dependable.",
    contribution:
      "I am defining the research thesis and testing where this kind of control layer could be useful.",
    outcome:
      "Ongoing private research—not a finished or deployed product.",
    evidence: [],
  },
  {
    id: "tremor-track",
    title: "Tremor Track — Moonquake Map 2.0",
    status: "Earlier team hackathon project",
    visibility: "public",
    summary:
      "An interactive lunar globe created by a team for NASA Space Apps Challenge 2023, making historical moonquake and geological data easier to explore.",
    contribution:
      "I contributed to a collaborative software project spanning interactive 3D visualization, processed scientific data, and exploratory controls.",
    outcome:
      "The source, working live demo, and official challenge entry are public.",
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
    role: "Software Engineer · Applied AI & Automation",
    location: "Germany",
    summary:
      "I design and deliver backend services, workflow automation, and internal software for operational work.",
    highlights: [
      "Translate loosely defined business problems into maintainable software.",
      "Connect data, services, and review steps into dependable workflows.",
      "Prototype quickly, then strengthen the parts that need to last.",
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
      "Earlier experience supporting departmental software and the infrastructure around it.",
    highlights: [
      "Worked with Linux services, deployment automation, and containerized applications.",
      "Maintained shared systems and documented routine operational work.",
    ],
    current: false,
  },
];

export const about = {
  title: "I care about the parts people have to live with.",
  paragraphs: [
    "My work is guided by reliability, clear interfaces, and maintainability. I enjoy making complicated systems understandable—both to the people using them and to the engineers who will change them later.",
    "I work best where the problem is still a little messy and the useful path has to be found, built, and explained.",
  ],
  photography: {
    title: "Away from the screen",
    body: "I photograph wildlife, nature, and the night sky. It is slower work: observe first, wait, then make the frame.",
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

export const astronautCredit = {
  title: "Tenhun Falling spaceman (FanArt)",
  creator: "wallmasterr",
  sourceHref:
    "https://sketchfab.com/3d-models/tenhun-falling-spaceman-fanart-9fd80b6a259f41fd99e6f56eee686dc5",
  licenseLabel: "CC Attribution",
  licenseHref: "https://creativecommons.org/licenses/by/4.0/",
};
