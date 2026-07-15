# Portfolio Repository Instructions

This public repository publishes Dhruba Saha's portfolio. Treat professional claims, project status, confidentiality, accessibility, attribution, performance, and deployment safety as release-critical concerns.

## Required context

Before changing professional content or project links, read every file in `context/`:

- `public-content-rules.md`
- `verified-public-sources.md`
- `portfolio-strategy.md`
- `verification-queue.md`

Repository and live-project evidence take precedence over summaries. If evidence conflicts with the approved context, do not guess. Keep the public claim conservative and add the discrepancy to `context/verification-queue.md`.

## Publication rules

- Keep the current employer unnamed. Do not publish an inferred identity, exact start date, customer, proprietary prompt, internal architecture, private repository, or private screenshot.
- The approved workflow result may be described only as reducing **approximately eight hours** of work to **approximately five minutes**, with expert review retained.
- Present Project Kyber only as **Private active R&D** and a high-level research thesis. Do not link it or imply planned features are complete.
- Present Tremor Track explicitly as an earlier team hackathon project. Use only the approved repository, live-demo, and NASA project-page links.
- Never invent or silently update metrics, dates, ownership, downloads, licenses, project status, or contribution outcomes.
- Do not restore résumé or LinkedIn links until the corresponding verification items are resolved.
- Do not surface the retired electronics, hardware, embedded, Arduino, or IoT project archive on this current-career homepage.
- Do not include the Microsoft Planner integration or claim that the TensorFlow pull request was merged.
- Never copy confidential personal or employer information into public pages, metadata, tests, screenshots, commits, or documentation.

## Design and engineering rules

- Follow the **Cinematic Editorial** direction: expressive typography, warm cosmic depth, restrained navigation, and continuous astronaut-led motion rather than an AI dashboard.
- Lead with dependable software, backend systems, workflow automation, and internal tools. Present applied AI as a current specialization rather than the entire identity.
- Do not add numbered navigation rails, workflow docks, telemetry readouts, terminal-style labels, status pills, project numbers, or neural-network-style visual clutter.
- Keep all information and navigation in semantic DOM. The WebGL canvas is decorative, progressively enhanced, and never required to navigate or understand the page.
- Drive the scene continuously from scroll progress. Camera keyframes are private animation data and must not become visible workflow controls.
- Respect reduced motion, save-data, unsupported WebGL, context loss, hidden tabs, and offscreen rendering. Fallback content must remain complete.
- Use native document scrolling, keyboard-operable interactions, accessible names, visible focus, WCAG AA contrast, and a single logical heading hierarchy.
- Keep the astronaut attribution visible and accurate. Do not add new model, video, remote-font, or stock-art dependencies.

## Validation and deployment

- Use Node.js 22 and `npm ci` for reproducible validation.
- Run `npm run check` before handoff. It covers linting, JavaScript type checking, unit tests, the production build, asset budgets, and Chromium end-to-end tests.
- Review the final diff for unsupported claims, private details, broken links, missing accessible names, accidental non-portfolio changes, and generated artifacts.
- `dev` is the source branch. GitHub Pages serves the generated `build` branch through the existing branch-based deployment.
- Never hand-edit or merge source changes directly into `build`.
- Keep `public/CNAME` exactly `dhrubasaha.co.in`; Vite copies it to `dist/CNAME` during publication.
- Pull-request validation may build the site but must not publish it. Only a push to `dev` or an explicit publish-workflow dispatch may update `build`.
