# Dhruba Saha - Portfolio

A chapter-driven illustrated-space portfolio focused on dependable software, backend automation, internal tools, and selective applied AI.

The experience combines semantic HTML with layered 2.5D artwork and one lazily loaded, page-wide React Three Fiber scene. Native scrolling moves through eight visual chapters, from the astronaut-led landscape to small procedural dioramas for current work, Project Kyber, Tremor Track, experience, photography, and contact. All readable content and navigation remain in the document; WebGL is optional visual enhancement.

## Local development

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173/`.

Validation commands:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run budget
npm run test:e2e
npm run check
```

## Architecture

- React 18 and Vite
- Structured, JSDoc-checked public content
- One persistent, lazy React Three Fiber canvas with chapter-specific procedural dioramas
- A requestAnimationFrame-based chapter controller that publishes normalized motion through data attributes and CSS custom properties
- Native document scrolling and semantic navigation
- Reduced-motion, data-saving, and WebGL failure modes
- Vitest, Testing Library, axe, Playwright, ESLint, and JavaScript type checking

## Publishing

The source branch is `dev`. The publish workflow validates approved `dev` changes, copies `public/CNAME` into the build output, and publishes `dist` to the legacy `build` branch. `agent/**` branches, including `agent/animated-space-playground`, run validation only and cannot deploy.

## Credits

The astronaut is ["Tenhun Falling spaceman (FanArt)" by wallmasterr](https://sketchfab.com/3d-models/tenhun-falling-spaceman-fanart-9fd80b6a259f41fd99e6f56eee686dc5), used under the model page's Creative Commons Attribution license.

Montserrat is self-hosted under the SIL Open Font License; its license notice is distributed with the font files.
