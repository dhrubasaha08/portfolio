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
- Present Project Kyber only as **Private active R&D** and a high-level research thesis. Do not link it or imply planned functionality is complete.
- Present Tremor Track explicitly as an earlier team hackathon project. Use only the approved repository, live-demo, and NASA project-page links.
- Never invent or silently update metrics, dates, ownership, downloads, project status, or contribution outcomes.
- Keep education, earlier roles, omitted legacy projects, unapproved integrations, public career-document links, and professional-network links off this release.
- Never copy confidential personal or employer information into public pages, metadata, tests, screenshots, commits, or documentation.

## Design and engineering rules

- Preserve the recognizable original space journey: layered stars, planets, sun, mountains, crater, an astronaut, oversized identity, and asymmetric editorial composition.
- Lead with the current software role, workflow automation, backend systems, internal tools, and selective applied AI.
- Do not add product-dashboard styling, repetitive interface panels, numbered controls, telemetry, neural imagery, fabricated machinery, symbolic chapter dioramas, gradient text, or generated-looking UI decoration.
- Keep all information and navigation in semantic DOM. WebGL and layered artwork are decorative progressive enhancement and never required to navigate or understand the page.
- Drive scene motion from native document scroll and gentle pointer movement. Never capture touch scrolling or create a nested page-scroll container.
- Respect reduced motion, save-data, unsupported WebGL, context loss, hidden tabs, and offscreen rendering. Fallback content must remain complete.
- Maintain keyboard navigation, accessible names, visible focus, WCAG AA contrast, and one logical heading hierarchy.
- Keep the astronaut attribution visible and accurate. Do not add another model, video, remote avatar, remote font, or stock-art dependency.

## Validation and deployment

- Use Node.js 22 and `npm ci` for reproducible validation.
- Run `npm run check` before handoff.
- Review the final diff for unsupported claims, private details, broken links, inaccessible names, accidental non-portfolio changes, and generated artifacts.
- `dev` is the source branch. GitHub Pages serves the generated `build` branch through the existing branch-based deployment.
- Never hand-edit or merge source changes directly into `build`.
- Keep `public/CNAME` exactly `dhrubasaha.co.in`; Vite copies it to `dist/CNAME` during publication.
- Review branches and pull-request validation may build the site but must never publish it.
