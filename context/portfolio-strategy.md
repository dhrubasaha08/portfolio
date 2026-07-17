# 2D-Led Chapter Space Playground Strategy

## Objective

Position Dhruba Saha as a software engineer who turns complex workflows into dependable software. The homepage is for engineering and product leaders evaluating backend systems, automation, internal tools, selective applied AI, and product-oriented delivery.

## Visual direction

The experience should preserve the memorable astronaut, depth, and motion of the original space portfolio while feeling playful, illustrated, personal, and human-authored. Every content section is a visual chapter rather than a static landing-page block.

- Build responsive 2D environments from layered stars, planets, mountains, a crater, a sun, and section-owned SVG illustrations. Keep the existing astronaut as the only optional 3D subject.
- Give every chapter an authored 2D composition reflecting its story: workflow mechanics, software tools, Kyber's boundary monolith, Tremor Track's moon, career wayfinding, photography, and contact.
- Use dusty midnight `#101A2E`, ink `#0A0D14`, warm cream `#F2E8D5`, burnt orange `#D6683C`, muted sky `#6FA8C8`, and moss `#6E7F55`.
- Use a self-hosted Montserrat variable font throughout, matching the deployed portfolio typography without remote requests.
- Prefer varied full-width compositions, underlined text links, tactile illustration, and generous pauses over reusable product cards.
- Avoid cards, pills, glass panels, numbered controls, telemetry, monospace labels, neural diagrams, grids, gradient text, and prominent rectangular CTAs.
- Keep semantic content above decorative, lazily loaded WebGL and layered artwork.

## Information architecture

1. Interactive illustrated hero: identity, software-first headline, direct summary, and underlined current-work/contact links.
2. Current workflow story: retained expert review and the approved approximately-eight-hours-to-approximately-five-minutes result.
3. What Dhruba builds: four plain-language statements covering backend systems, workflow automation, internal tools, and applied AI.
4. Project Kyber: unlinked private active R&D.
5. Tremor Track: earlier team hackathon software work with approved public evidence.
6. Experience: dominant current role and compact 2023 software/infrastructure internship.
7. About and photography.
8. Direct contact.

Native scrolling activates these chapters without pinning or hijacking the document. The active section publishes normalized enter, active, exit, and transition progress to CSS custom properties; the optional astronaut canvas follows the same state. Decorative motion may be expressive, while prose, links, focus targets, and heading positions remain stable.

## Release standard

The first screen must communicate Dhruba's name, software-engineering identity, Germany location, and current focus before WebGL loads. Every navigation path remains keyboard accessible. Capable mobile devices receive the same 2D chapters with smaller motion amplitudes, never at the expense of native touch scrolling. Reduced motion, save-data mode, unsupported WebGL, and context loss produce a complete static experience. Asset budgets and live-browser accessibility checks are enforced by `npm run check`.
