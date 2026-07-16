# Portfolio Repository Instructions

This public repository publishes Dhruba Saha's portfolio. Treat professional claims, project status, confidentiality, accessibility, attribution, performance, and deployment safety as release-critical concerns.

## Required context

Before changing professional copy or project links, read every file in `context/`:

- `public-content-rules.md`
- `verified-public-sources.md`
- `portfolio-strategy.md`
- `verification-queue.md`

Repository and live-project evidence take precedence over summaries. If evidence conflicts with approved context, keep the public claim conservative and add the discrepancy to the verification queue. Never guess.

## Publication rules

- Keep the current employer unnamed. Do not publish an inferred identity, exact start date, customer, proprietary prompt, internal architecture, private repository, or private screenshot.
- Describe the approved workflow result only as reducing **approximately eight hours** of work to **approximately five minutes**, with expert review retained.
- Present Project Kyber only as **Private active R&D** and a high-level research thesis. Do not link it or imply planned features are complete.
- Present Tremor Track explicitly as an earlier team hackathon project. Use only the approved repository, live-demo, and NASA project-page links.
- Never invent or silently update metrics, dates, ownership, downloads, licenses, project status, or contribution outcomes.
- Do not restore resume or LinkedIn links until their verification items are resolved.
- Do not surface electronics, hardware, embedded, Arduino, sensor, or IoT work on this current-career homepage.
- Do not include the Microsoft Planner integration or claim that the TensorFlow pull request was merged.
- Never copy confidential personal or employer information into public pages, metadata, tests, screenshots, commits, or documentation.

## Design and engineering rules

- Follow the **Animated Chapter Space Playground** direction: a dusty illustrated universe, playful layered depth, and a native-scroll journey in which every content section becomes a distinct animated chapter.
- Lead with dependable software, backend systems, workflow automation, and internal tools. Applied AI is one tool in the practice, not the site's visual identity.
- Do not add cards, pills, glass panels, numbered controls, monospace telemetry labels, gradient text, neural diagrams, dashboard grids, prominent rectangular CTA buttons, or generic AI-product styling.
- Use the self-hosted Montserrat variable family for display, body, and navigation copy. Keep its OFL notice with the font assets and make no remote font requests.
- Keep all information and navigation in semantic DOM. WebGL and 2.5D artwork are decorative progressive enhancement and never required to navigate or understand the page.
- Drive chapter motion from native document scroll, gentle desktop pointer movement, and non-blocking mobile tap impulses. Never capture touch scrolling or create nested page scroll containers.
- Keep a single transparent WebGL canvas across the page. Render only the active chapter and its transitioning neighbour; build new dioramas procedurally rather than adding models, textures, video, or animation libraries.
- Publish each section's normalized motion through stable `data-chapter` attributes and CSS custom properties. Keep the scene's active `data-scene-chapter`, `data-diorama`, and `data-astronaut-cameo` state externally observable for regression testing.
- Respect reduced motion, save-data, unsupported WebGL, context loss, hidden tabs, and offscreen rendering. Fallback content must remain complete.
- Maintain keyboard navigation, accessible names, visible focus, WCAG AA contrast, and one logical heading hierarchy.
- Keep the astronaut attribution visible and accurate. Use it for the hero and brief chapter transitions, but let the procedural chapter dioramas remain the focal point. Do not add a second model, texture, video, remote avatar, remote font, or stock-art dependency.

## Validation and deployment

- Use Node.js 22 and `npm ci` for reproducible validation.
- Run `npm run check` before handoff. It covers linting, JavaScript type checking, unit tests, production build, asset budgets, and Chromium end-to-end tests.
- Review the final diff for unsupported claims, private details, broken links, inaccessible names, accidental non-portfolio changes, and generated artifacts.
- `dev` is the source branch. GitHub Pages serves the generated `build` branch through the existing branch-based deployment.
- Never hand-edit or merge source changes directly into `build`.
- Keep `public/CNAME` exactly `dhrubasaha.co.in`; Vite copies it to `dist/CNAME` during publication.
- Pull-request and `agent/**` branch validation may build the site but must not publish it. Only a push to `dev` or an explicit publish-workflow dispatch may update `build`.
