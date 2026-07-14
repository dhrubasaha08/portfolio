/**
 * @typedef {"public" | "sanitized" | "private-rnd"} Visibility
 */

/**
 * @typedef {"source" | "documentation" | "release-record" | "live-demo" | "project-page"} LinkKind
 */

/**
 * @typedef {Object} PortfolioLink
 * @property {string} label
 * @property {string} href
 * @property {LinkKind} kind
 * @property {boolean} external
 * @property {string} verifiedOn ISO date of the most recent link verification.
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} eyebrow
 * @property {string} status
 * @property {string} title
 * @property {string} summary
 * @property {string[]} details
 * @property {string[]} technologies
 * @property {PortfolioLink[]} links
 * @property {string} visual
 * @property {Visibility} visibility
 */

/**
 * @typedef {Object} Experience
 * @property {string} period
 * @property {string} role
 * @property {string} organization
 * @property {string} summary
 * @property {string[]} highlights
 */

/**
 * @typedef {Object} Capability
 * @property {string} title
 * @property {string} description
 * @property {string[]} items
 */

/**
 * @typedef {Object} SupportingOss
 * @property {string} name
 * @property {string} status
 * @property {string} description
 * @property {string} href
 */

/**
 * @typedef {Object} Photography
 * @property {string} title
 * @property {string} body
 * @property {string[]} interests
 */

/**
 * @typedef {Object} PortfolioContent
 * @property {{
 *   name: string,
 *   initials: string,
 *   eyebrow: string,
 *   headline: string,
 *   summary: string,
 *   location: string,
 *   email: string,
 *   github: string
 * }} site
 * @property {{label: string, href: string}[]} nav
 * @property {{
 *   eyebrow: string,
 *   title: string,
 *   summary: string,
 *   metric: {before: string, after: string, label: string},
 *   system: string[],
 *   outcome: string,
 *   note: string
 * }} impact
 * @property {Project[]} projects
 * @property {Experience[]} experience
 * @property {Capability[]} capabilities
 * @property {SupportingOss[]} supportingOss
 * @property {{
 *   eyebrow: string,
 *   title: string,
 *   paragraphs: string[],
 *   photography: Photography
 * }} about
 * @property {{
 *   eyebrow: string,
 *   title: string,
 *   body: string,
 *   email: string,
 *   github: string
 * }} contact
 */

/** @type {PortfolioContent} */
export const portfolio = {
  site: {
    name: "Dhruba Saha",
    initials: "DS",
    eyebrow: "Dhruba Saha · Software Engineer · Germany",
    headline: "I build applied AI systems that turn manual work into dependable software.",
    summary:
      "Backend automation, internal tools, and production-oriented workflows—grounded in open source and embedded systems.",
    location: "Germany",
    email: "contact@dhrubasaha.co.in",
    github: "https://github.com/dhrubasaha08",
  },

  nav: [
    { label: "Work", href: "#work" },
    { label: "Experience", href: "#experience" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],

  impact: {
    eyebrow: "Sanitized professional impact",
    title: "AI-assisted workflow automation",
    summary:
      "Designed and implemented an AI-assisted workflow for a time-intensive content process, combining structured generation, retrieval, validation, and expert review.",
    metric: {
      before: "~8 hours",
      after: "~5 minutes",
      label: "manual workflow → AI-assisted generation",
    },
    system: [
      "Structured generation",
      "Retrieval-augmented generation",
      "Workflow orchestration",
      "Domain validation",
      "Expert review",
    ],
    outcome:
      "Reduced an approximately eight-hour manual workflow to approximately five minutes while retaining expert review.",
    note:
      "Sanitized case study; source materials and implementation details remain confidential.",
  },

  projects: [
    {
      id: "dht11",
      eyebrow: "Open-source flagship",
      status: "Released · v2.1.0 · MIT",
      title: "DHT11 Arduino Library",
      summary:
        "A dependency-free Arduino library that turns timing-sensitive DHT11 sensor reads into a small, documented API with explicit error handling.",
      details: [
        "Published through Arduino Library Manager as a contributed library.",
        "Version 2.1.0 was released on February 8, 2024.",
        "Includes examples plus explicit timeout and checksum error handling.",
        "Documented as tested on Arduino Uno R3, ESP32, and ESP8266 boards.",
      ],
      technologies: ["C++", "Arduino", "Single-wire sensor protocol"],
      links: [
        {
          label: "Source",
          href: "https://github.com/dhrubasaha08/DHT11",
          kind: "source",
          external: true,
          verifiedOn: "2026-07-14",
        },
        {
          label: "Arduino documentation",
          href: "https://docs.arduino.cc/libraries/dht11/",
          kind: "documentation",
          external: true,
          verifiedOn: "2026-07-14",
        },
        {
          label: "Zenodo release record",
          href: "https://zenodo.org/records/10633701",
          kind: "release-record",
          external: true,
          verifiedOn: "2026-07-14",
        },
      ],
      visual: "sensor",
      visibility: "public",
    },
    {
      id: "tremor-track",
      eyebrow: "Team hackathon project",
      status: "Working live demo · MIT",
      title: "Tremor Track — Moonquake Map 2.0",
      summary:
        "An interactive 3D lunar globe created for NASA Space Apps Challenge 2023 to make historical moonquake and geological data easier to explore.",
      details: [
        "Presented as a team project without overstating individual authorship.",
        "The official NASA project page links both the source repository and the live demo.",
        "Provides timeline navigation, quake-type filters, data overlays, rotation and zoom, and day/night controls.",
      ],
      technologies: ["JavaScript", "Three.js", "WebGL", "HTML", "CSS"],
      links: [
        {
          label: "Live demo",
          href: "https://tremortrack.dhrubasaha.co.in/",
          kind: "live-demo",
          external: true,
          verifiedOn: "2026-07-14",
        },
        {
          label: "Source",
          href: "https://github.com/dhrubasaha08/tremortrack",
          kind: "source",
          external: true,
          verifiedOn: "2026-07-14",
        },
        {
          label: "NASA project page",
          href: "https://www.spaceappschallenge.org/2023/find-a-team/tremor-track/?tab=project",
          kind: "project-page",
          external: true,
          verifiedOn: "2026-07-14",
        },
      ],
      visual: "moon",
      visibility: "public",
    },
    {
      id: "zephyr-lvgl-touch-demo",
      eyebrow: "Embedded systems demo",
      status: "Documented hardware-free demo · MIT",
      title: "Zephyr + LVGL Touch UI Demo",
      summary:
        "A hardware-free Zephyr RTOS and LVGL interface that runs in an SDL2 window on Linux and uses mouse input as touch.",
      details: [
        "Targets Zephyr's native_sim/native/64 board and runs without physical embedded hardware.",
        "Demonstrates two views, slider and switch callbacks, pointer input, and a periodically updated uptime label.",
        "The README provides a complete build-and-run path; no packaged release is claimed.",
      ],
      technologies: ["C", "Zephyr RTOS", "LVGL", "SDL2", "CMake"],
      links: [
        {
          label: "Source and reproduction steps",
          href: "https://github.com/dhrubasaha08/zephyr-lvgl-touch-demo",
          kind: "source",
          external: true,
          verifiedOn: "2026-07-14",
        },
      ],
      visual: "interface",
      visibility: "public",
    },
    {
      id: "project-kyber",
      eyebrow: "Private R&D",
      status: "Private active R&D · Not publicly linked",
      title: "Project Kyber",
      summary:
        "Exploring a local-first control plane for AI coding agents, focused on architectural governance, context quality, sandboxed execution, and cost-aware model routing.",
      details: [
        "Presented as an active research direction, not a completed or deployed product.",
        "Concepts and implemented functionality are not conflated.",
        "Public evidence is intentionally limited to the research thesis.",
      ],
      technologies: [
        "Local-first AI tooling",
        "Architecture governance",
        "Context systems",
        "Sandboxed execution",
      ],
      links: [],
      visual: "research",
      visibility: "private-rnd",
    },
  ],

  experience: [
    {
      period: "Current",
      role: "Software Engineer · Applied AI & Automation · Current",
      organization: "Current role · Germany",
      summary:
        "Builds AI-assisted internal tools, backend services, and workflow automations that translate operational requirements into reliable software.",
      highlights: [
        "Designs backend services, APIs, integrations, and data workflows.",
        "Applies retrieval, structured generation, validation, and human review to business processes.",
        "Works across Python, Node.js, PostgreSQL, n8n, and REST-based systems.",
        "Takes ownership of ambiguous problems from architecture through delivery and documentation.",
      ],
    },
    {
      period: "Ongoing",
      role: "Open-source Author & Maintainer",
      organization: "Independent",
      summary:
        "Authors and maintains embedded libraries and public technical projects with an emphasis on usable APIs, documentation, examples, and explicit release status.",
      highlights: [
        "Released the DHT11 and SimpleUltrasonic Arduino libraries.",
        "Maintains TFminiS as an Apache-2.0 pre-release project under active development.",
        "Keeps licensing, ownership, and project maturity distinct across public work.",
      ],
    },
    {
      period: "2023",
      role: "DevOps & System Administration Intern",
      organization: "Department of Computer & System Sciences, Visva-Bharati University",
      summary:
        "Built and operated departmental infrastructure while automating recurring administration and documenting operational workflows.",
      highlights: [
        "Built a Docker Compose-based departmental intranet.",
        "Automated updates, health checks, and log rotation with Python and shell tooling.",
        "Worked on Linux networking, service hardening, and self-hosted infrastructure.",
      ],
    },
    {
      period: "2022 — 2024",
      role: "Founder & Lead",
      organization: "VBDCSS IoT Club",
      summary:
        "Founded and led a practical student community focused on embedded systems, IoT, and hardware-software integration.",
      highlights: [
        "Organized hands-on workshops and technical labs.",
        "Mentored students working with microcontrollers and Raspberry Pi systems.",
        "Led collaborative projects spanning sensing, automation, and robotics.",
      ],
    },
  ],

  capabilities: [
    {
      title: "Applied AI & LLM systems",
      description:
        "Application-layer AI systems designed around useful context, dependable outputs, and human validation.",
      items: [
        "OpenAI APIs",
        "Retrieval-augmented generation",
        "Vector search",
        "Structured outputs",
        "Context and memory patterns",
        "Human-in-the-loop validation",
      ],
    },
    {
      title: "Backend & integrations",
      description:
        "Services and interfaces that connect business workflows to dependable data and system boundaries.",
      items: [
        "Python",
        "JavaScript & TypeScript",
        "Node.js",
        "PostgreSQL",
        "REST APIs",
        "OAuth2",
      ],
    },
    {
      title: "Workflow automation & internal tools",
      description:
        "Turning manual operational processes into understandable, maintainable software workflows.",
      items: [
        "n8n",
        "Business process mapping",
        "Integration design",
        "Validation workflows",
        "Internal tool UX",
        "Rapid prototyping",
      ],
    },
    {
      title: "Infrastructure & delivery",
      description:
        "The practical delivery layer needed to run, observe, and maintain software beyond the prototype.",
      items: ["Docker", "Linux", "Git & GitHub", "GitHub Actions", "Nginx"],
    },
    {
      title: "Embedded systems & IoT",
      description:
        "A systems foundation built through sensors, microcontrollers, RTOS work, and hardware-software interfaces.",
      items: [
        "C & C++",
        "Arduino",
        "ESP32 & ESP8266",
        "Zephyr RTOS",
        "LVGL",
        "Raspberry Pi",
      ],
    },
  ],

  supportingOss: [
    {
      name: "SimpleUltrasonic",
      status: "Released · v1.0.0 · MIT",
      description:
        "A dependency-free Arduino library for measuring distance with the HC-SR04 ultrasonic sensor.",
      href: "https://github.com/dhrubasaha08/SimpleUltrasonic",
    },
    {
      name: "TFminiS",
      status: "Pre-release · v0.0.1 · Apache-2.0",
      description:
        "An active-development Arduino library for reading the TFmini-S LiDAR over hardware UART on ESP32 and Arduino Mega.",
      href: "https://github.com/dhrubasaha08/TFminiS",
    },
  ],

  about: {
    eyebrow: "From signals to systems",
    title: "The through-line is systems thinking.",
    paragraphs: [
      "I started close to the hardware: sensors, microcontrollers, Linux infrastructure, and open-source libraries. That work taught me to respect timing, failure modes, interfaces, and the gap between a demo and a dependable tool.",
      "Today I apply the same discipline to backend automation and AI-assisted systems—selecting useful context, structuring outputs, connecting services, validating results, and keeping people in control of consequential decisions.",
      "Embedded systems and open source remain part of the story: they are the foundation for how I reason about software, not a separate identity competing with my current work.",
    ],
    photography: {
      title: "Wildlife, nature & astrophotography",
      body:
        "Outside software, I photograph wildlife and the night sky—a practice that gets me away from screens and reinforces patience, observation, and technical curiosity.",
      interests: ["Wildlife", "Nature", "Astrophotography"],
    },
  },

  contact: {
    eyebrow: "Contact",
    title: "Let’s build systems that make complex work simpler.",
    body:
      "For roles and collaborations in applied AI, backend automation, internal tools, or developer tooling, email me or connect on GitHub.",
    email: "contact@dhrubasaha.co.in",
    github: "https://github.com/dhrubasaha08",
  },
};
