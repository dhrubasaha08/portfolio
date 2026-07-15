# Dhruba Saha - Portfolio

A playful illustrated-space portfolio focused on dependable software, backend automation, internal tools, and selective applied AI.

The opening experience combines semantic HTML with layered 2.5D artwork and a lazily loaded React Three Fiber astronaut. Native scrolling moves through stars, planets, mountains, a crater, and a sun. All readable content and navigation remain in the document; WebGL is optional visual enhancement.

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
- Lazy React Three Fiber astronaut over a static illustrated fallback
- Native document scrolling and semantic navigation
- Reduced-motion, data-saving, and WebGL failure modes
- Vitest, Testing Library, axe, Playwright, ESLint, and JavaScript type checking

## Publishing

The source branch is `dev`. The publish workflow validates approved `dev` changes, copies `public/CNAME` into the build output, and publishes `dist` to the legacy `build` branch. `agent/**` branches run validation only and cannot deploy.

## Credits

The astronaut is ["Tenhun Falling spaceman (FanArt)" by wallmasterr](https://sketchfab.com/3d-models/tenhun-falling-spaceman-fanart-9fd80b6a259f41fd99e6f56eee686dc5), used under the model page's Creative Commons Attribution license.

Barlow Condensed and Public Sans are self-hosted under the SIL Open Font License; their license notices are distributed with the font files.
