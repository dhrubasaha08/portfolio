# Portfolio Repository Instructions

This repository publishes Dhruba Saha's public portfolio. Treat professional claims, project status, ownership, confidentiality, accessibility, and deployment safety as release-critical concerns.

## Required context

Before changing professional content, read every file in `context/`, especially:

- `professional-profile.md`
- `project-inventory.md`
- `career-timeline.md`
- `verification-queue.md`
- `private-do-not-publish.md`
- `portfolio-content-strategy.md`

Repository evidence takes precedence over summaries. If evidence conflicts with context, do not guess: keep the public claim conservative and add the discrepancy to `context/verification-queue.md`.

## Publication rules

- Keep the current employer unnamed.
- Describe current work only with sanitized, public-safe language.
- The approved workflow result may be described only as reducing approximately eight hours of work to approximately five minutes. Preserve both uses of "approximately" and retain the human-review context.
- Never invent or silently update metrics, dates, ownership, licenses, downloads, project status, release status, or contribution outcomes.
- Distinguish production work, prototypes, open-source releases, demonstrations, experiments, and active R&D.
- Present Project Kyber as private active R&D. Do not link it, expose private implementation details, or imply planned functionality is complete.
- Do not include the Microsoft Planner integration until Dhruba's personal contribution has public evidence and explicit approval.
- Do not say or imply that the TensorFlow pull request was merged.
- Do not group the Arduino libraries under one license. DHT11 and SimpleUltrasonic are MIT licensed; TFminiS is Apache-2.0 and pre-release.
- Never copy prohibited material from `private-do-not-publish.md` into public pages, metadata, screenshots, commits, fixtures, or documentation.

## Design and engineering rules

- Follow the "Systems Observatory" direction: a polished AI control-plane interface with a restrained sensor-to-semantics motif.
- Lead with applied AI, backend automation, and internal tools. Use open source and embedded systems as supporting differentiation.
- Prefer semantic HTML, keyboard-operable interactions, accessible names, visible focus states, WCAG AA contrast, and readable content hierarchy.
- Respect `prefers-reduced-motion`; decorative motion must not be required to understand or navigate the site.
- Keep the experience responsive and progressively enhanced. Heavy visual effects must have lightweight fallbacks and must not block core content.
- Use evidence links where available and meaningful. Never link private repositories or employer-confidential material.

## Validation and deployment

- Use Node.js 22 and `npm ci` for reproducible validation.
- Run `npm run check` before handoff; it covers linting, JavaScript type checking, tests, the production build, and the emitted-asset budget.
- Review the final diff for unsupported claims, private details, broken links, missing accessible names, and accidental changes outside the approved scope.
- `dev` is the source branch. GitHub Pages serves the generated `build` branch through the legacy branch-based deployment.
- Never hand-edit generated files on `build`.
- Keep `public/CNAME` exactly `dhrubasaha.co.in`; Vite copies it into `dist/CNAME`, preserving the custom domain during publication.
- Pull-request validation may build the site but must not publish it. Only a push to `dev` or an explicit publish workflow dispatch may update `build`.
