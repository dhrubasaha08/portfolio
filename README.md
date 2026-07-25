# Dhruba Saha — Portfolio

A content-rich personal portfolio built with React and Vite. The interface
preserves the original layered space artwork and animated astronaut, then
extends the journey with an authored, scroll-driven 2D illustration in every
chapter. The public narrative focuses on backend systems, automation, internal
tools, and selective applied AI.

## Local preview

```powershell
npm.cmd ci
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

Open <http://127.0.0.1:5173/>.

For a production-equivalent preview:

```powershell
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1 --port 4173
```

## Validation

```powershell
npm.cmd run check
```

The aggregate check runs linting, JavaScript type checking, unit and
accessibility tests, a production build, asset-budget validation, and browser
tests.

With the production preview running on port `4173`, capture the desktop and
mobile chapter screenshots with:

```powershell
npm.cmd run screenshots
```

## Publishing

`dev` is the source branch. A successful approved update to `dev` is built into
the legacy `build` branch by GitHub Actions. Feature branches only run
validation and never deploy.

Public professional content is governed by the files in `context/` and the
repository instructions in `AGENTS.md`.
