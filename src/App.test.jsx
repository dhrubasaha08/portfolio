import axe from "axe-core";
import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import App from "./App";

const PROJECT_HEADINGS = [
  /AI-assisted workflow automation/i,
  /Project Kyber/i,
  /Tremor Track/i,
];

const STAGE_NAMES = [
  /^Ingest$/i,
  /^Retrieve$/i,
  /^Orchestrate$/i,
  /^Validate$/i,
  /^Deliver$/i,
];

const VERIFIED_LINKS = [
  /^https:\/\/github\.com\/dhrubasaha08\/tremortrack\/?$/,
  /^https:\/\/tremortrack\.dhrubasaha\.co\.in\/?$/,
  /^https:\/\/www\.spaceappschallenge\.org\/2023\/find-a-team\/tremor-track\/?(?:\?tab=project)?$/,
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

  return [...links].find((link) => expectedHref.test(link.href));
}

describe("portfolio content", () => {
  it("leads with the approved current-career positioning", () => {
    renderPortfolio();

    const headline = screen.getByRole("heading", {
      level: 1,
      name: /I build applied AI systems that turn manual work into dependable software/i,
    });
    const hero = headline.closest("section");

    expect(hero).toHaveTextContent(/Dhruba Saha/i);
    expect(hero).toHaveTextContent(/Software Engineer/i);
    expect(hero).toHaveTextContent(/Germany/i);
    expect(
      screen.getByText(
        "Software Engineer · Applied AI & Automation · Current",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/approximately eight hours/i)).toBeInTheDocument();
    expect(screen.getByText(/approximately five minutes/i)).toBeInTheDocument();
    expect(screen.getAllByText(/expert review/i).length).toBeGreaterThan(0);
  });

  it("presents the approved work in current-first order", () => {
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

    expect(screen.getByText(/Private active R&D/i)).toBeInTheDocument();
    expect(screen.getByText(/team hackathon project/i)).toBeInTheDocument();
  });

  it("exposes only the approved public destinations", () => {
    const { container } = renderPortfolio();

    for (const expectedHref of VERIFIED_LINKS) {
      const link = findLinkByHref(container, expectedHref);
      expect(link, `Missing approved link matching ${expectedHref}`).toBeTruthy();
      expect(link).toHaveAccessibleName();
    }

    const kyberHeading = screen.getByRole("heading", { name: /Project Kyber/i });
    const kyberArticle = kyberHeading.closest("article");
    if (!kyberArticle) {
      throw new Error("Project Kyber must be presented in a dedicated article.");
    }
    expect(within(kyberArticle).queryByRole("link")).not.toBeInTheDocument();
    expect(
      findLinkByHref(container, /^mailto:contact@dhrubasaha\.co\.in$/),
    ).toHaveAccessibleName();
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/dhrubasaha08",
    );
  });

  it("omits the retired career narrative and confidential claims", () => {
    const { container } = renderPortfolio();
    const renderedText = container.textContent ?? "";
    const renderedMarkup = container.innerHTML;

    expect(renderedText).not.toMatch(
      /Arduino|DHT11|TFminiS|SimpleUltrasonic|Zephyr|\bIoT\b|embedded systems?|electronics?|electrical|\bsensors?\b|\bhardware\b|Microsoft Planner|TensorFlow/i,
    );
    expect(renderedText).not.toMatch(
      /salary|compensation|visa|immigration|passport|residence.?permit|medical|mental health|health information|insurance|customer data|customer count|conversion rate|financial projection|proprietary prompt/i,
    );
    expect(renderedText).not.toMatch(
      /June 2023|December 2023|November 2022|September 2024/i,
    );
    expect(renderedMarkup).not.toMatch(
      /getform\.io|dropbox\.com|linkedin\.com/i,
    );
  });
});

describe("portfolio semantics and interaction", () => {
  it("provides semantic landmarks and a usable skip link", () => {
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

  it("offers keyboard-native stage controls with a clear selected state", async () => {
    const user = userEvent.setup();
    renderPortfolio();

    const stageButtons = STAGE_NAMES.map((name) =>
      screen.getByRole("button", { name }),
    );
    expect(stageButtons).toHaveLength(5);

    const retrieveButton = stageButtons[1];
    retrieveButton.focus();
    expect(retrieveButton).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(retrieveButton).toHaveAttribute("aria-pressed", "true");
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

  it("defines visible focus and a complete reduced-motion mode", () => {
    const stylesheet = readFileSync("src/index.css", "utf8");

    expect(stylesheet).toMatch(/:focus-visible\s*{/);
    expect(stylesheet).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    expect(stylesheet).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
    expect(stylesheet).toMatch(/animation-iteration-count:\s*1\s*!important/);
    expect(stylesheet).toMatch(/scroll-behavior:\s*auto\s*!important/);
  });
});
