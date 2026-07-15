# Dhruba Saha — Portfolio

An immersive React portfolio focused on dependable software, backend automation, internal tools, and applied AI.

The opening experience combines a cinematic editorial HTML narrative with a lazily loaded React Three Fiber scene. An animated astronaut moves through a warm celestial field as native document scrolling advances the camera. All readable content and navigation remain in the document, while WebGL is a progressive visual enhancement.

## Local development

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

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
- Lazy React Three Fiber scene with a static fallback
- Native document scrolling and quiet semantic navigation
- Reduced-motion, data-saving, and WebGL failure modes
- Vitest, Testing Library, axe, Playwright, ESLint, and JavaScript type checking

## Publishing

Pull requests target `dev`. The repository's existing workflow publishes approved `dev` changes to the legacy `build` branch. `public/CNAME` preserves `dhrubasaha.co.in` in generated output.

## Model credit

The astronaut is [“Tenhun Falling spaceman (FanArt)” by wallmasterr](https://sketchfab.com/3d-models/tenhun-falling-spaceman-fanart-9fd80b6a259f41fd99e6f56eee686dc5), used under the model page's CC Attribution license.
