# Dhruba Saha — Systems Observatory

[dhrubasaha.co.in](https://dhrubasaha.co.in/) is Dhruba Saha's portfolio for applied AI, backend automation, internal tools, open source, and embedded systems.

The redesign uses a **Systems Observatory** direction: a polished AI control-plane interface with a restrained sensor-to-semantics motif. The experience prioritizes evidence-backed case studies, readable hierarchy, responsive behavior, accessible interaction, performance, and reduced-motion support.

## Stack

- React 19 and Vite 8
- Token-based vanilla CSS with code-native SVG illustrations
- ESLint, TypeScript `checkJs`, Vitest, Testing Library, and axe-core
- GitHub Pages using the existing generated deployment branch

## Local development

Use Node.js 22 and the committed npm lockfile.

```bash
npm ci
npm run dev
```

Available scripts:

- `npm run dev` — start the Vite development server.
- `npm run build` — create the production build in `dist/`.
- `npm run preview` — preview the production build locally.
- `npm run lint` — lint source, tests, scripts, and configuration.
- `npm run typecheck` — type-check JavaScript and JSDoc schemas.
- `npm run test` — run the content, privacy, and accessibility regression suite.
- `npm run check:assets` — enforce the production asset budget and block GLB, GLTF, and MP4 output.
- `npm run check` — run the complete validation sequence.

## Content governance

Public professional claims and project treatment are defined in [`context/`](context/). Read [`AGENTS.md`](AGENTS.md) and all context files before changing professional content. Do not invent metrics, dates, ownership, licenses, or project status, and never add employer-confidential or private material.

## Deployment

- `dev` is the source and pull-request base branch.
- Pull requests run the complete validation workflow and do not deploy.
- A push to `dev`, or a manual publish dispatch, builds the site and publishes `dist/` to the generated `build` branch.
- GitHub Pages serves the repository root of `build` using the existing legacy branch deployment.
- [`public/CNAME`](public/CNAME) is copied into every Vite build and must remain exactly `dhrubasaha.co.in` so publishing preserves the custom domain.

Do not edit `build` manually; it is generated output.
