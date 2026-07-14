import axe from "axe-core";
import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "./App";

const PROJECT_HEADINGS = [
  /AI-assisted workflow automation/i,
  /DHT11 Arduino Library/i,
  /Tremor Track/i,
  /Zephyr\s*\+\s*LVGL Touch UI/i,
  /Project Kyber/i,
];

const VERIFIED_LINKS = [
  /^https:\/\/github\.com\/dhrubasaha08\/DHT11\/?$/,
  /^https:\/\/(?:docs\.arduino\.cc|www\.arduino\.cc)\/.*dht11.*$/i,
  /^https:\/\/(?:doi\.org\/10\.5281\/zenodo\.10633701|zenodo\.org\/records\/10633701)\/?$/,
  /^https:\/\/github\.com\/dhrubasaha08\/tremortrack\/?$/,
  /^https:\/\/tremortrack\.dhrubasaha\.co\.in\/?$/,
  /^https:\/\/.*spaceappschallenge\.org\/.*$/i,
  /^https:\/\/github\.com\/dhrubasaha08\/zephyr-lvgl-touch-demo\/?$/,
];

function renderPortfolio() {
  return render(<App />);
}

/**
 * @param {HTMLElement} container
 * @param {RegExp} expectedHref
 */
function findLinkByHref(container, expectedHref) {
  const links = /** @type {NodeListOf<HTMLAnchorElement>} */ (
    container.querySelectorAll("a[href]")
  );

  return [...links].find((link) =>
    expectedHref.test(link.href),
  );
}

describe("portfolio content", () => {
  it("leads with the approved positioning and current public context", () => {
    renderPortfolio();

    const headline = screen.getByRole("heading", { level: 1 });
    const hero = headline.closest("section");

    expect(headline).toHaveTextContent(
      /I build applied AI systems that turn manual work into dependable software/i,
    );
    expect(hero).toHaveTextContent(
      /Software Engineer.*Applied AI.*Backend Automation.*Internal Tools/i,
    );
    expect(screen.getAllByText(/Germany/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        "Software Engineer \u00b7 Applied AI & Automation \u00b7 Current",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/approximately eight(?: hours?|[- ]hour)/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/approximately five minutes/i)).toBeInTheDocument();
  });

  it("presents the approved work in evidence-first order", () => {
    renderPortfolio();

    const headings = PROJECT_HEADINGS.map((name) =>
      screen.getByRole("heading", { name }),
    );

    for (let index = 0; index < headings.length - 1; index += 1) {
      expect(
        headings[index].compareDocumentPosition(headings[index + 1]) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }

    expect(screen.getByText("Released · v2.1.0 · MIT")).toBeInTheDocument();
    expect(screen.getByText("Working live demo · MIT")).toBeInTheDocument();
    expect(
      screen.getByText("Documented hardware-free demo · MIT"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Private active R&D · Not publicly linked"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Pre-release · v0.0.1 · Apache-2.0"),
    ).toBeInTheDocument();
  });

  it("exposes only verified public project destinations", () => {
    const { container } = renderPortfolio();

    for (const expectedHref of VERIFIED_LINKS) {
      const link = findLinkByHref(container, expectedHref);
      expect(link, `Missing verified link matching ${expectedHref}`).toBeTruthy();
      expect(link).toHaveAccessibleName();
    }

    const kyberHeading = screen.getByRole("heading", { name: /Project Kyber/i });
    const kyberCard = kyberHeading.closest("article");
    if (!kyberCard) {
      throw new Error("Project Kyber must be presented in a dedicated article.");
    }
    expect(within(kyberCard).queryByRole("link")).not.toBeInTheDocument();
    expect(within(kyberCard).getByText(/active R&D/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email Dhruba" })).toHaveAttribute(
      "href",
      "mailto:contact@dhrubasaha.co.in",
    );
  });

  it("omits unsupported, stale, private, and deferred claims", () => {
    const { container } = renderPortfolio();
    const renderedText = container.textContent ?? "";
    const renderedMarkup = container.innerHTML;

    expect(renderedText).not.toMatch(/TensorFlow/i);
    expect(renderedText).not.toMatch(/Microsoft Planner/i);
    expect(renderedText).not.toMatch(/\bstars?\b/i);
    expect(renderedText).not.toMatch(/\bdownloads?\b/i);
    expect(renderedText).not.toMatch(
      /salary|compensation|visa|immigration|passport|residence.?permit|medical|mental health|health information|insurance|customer data|customer count|conversion rate|financial projection|proprietary prompt|employer/i,
    );
    expect(renderedText).not.toMatch(/three[^.!?]{0,100}\bMIT\b/i);
    expect(renderedMarkup).not.toMatch(/getform\.io/i);
    expect(renderedMarkup).not.toMatch(/dropbox\.com/i);
    expect(renderedMarkup).not.toMatch(/linkedin\.com/i);
    expect(renderedText).not.toMatch(
      /June 2023|December 2023|November 2022|September 2024/i,
    );
  });
});

describe("portfolio semantics and accessibility", () => {
  it("provides semantic page landmarks and a usable skip link", () => {
    renderPortfolio();

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /primary/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("main")).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: /skip to (?:main )?content/i }),
    ).toHaveAttribute("href", "#main-content");
  });

  it("has no automatically detectable axe violations", async () => {
    const { container } = renderPortfolio();
    const results = await axe.run(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });

    expect(results.violations).toEqual([]);
  });

  it("keeps focus visible and provides a complete reduced-motion mode", () => {
    const stylesheet = readFileSync("src/index.css", "utf8");

    expect(stylesheet).toMatch(/:focus-visible\s*{/);
    expect(stylesheet).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    expect(stylesheet).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
    expect(stylesheet).toMatch(/animation-iteration-count:\s*1\s*!important/);
    expect(stylesheet).toMatch(/scroll-behavior:\s*auto\s*!important/);
  });
});
