import axe from "axe-core";
import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import App from "./App";

const HEADLINE = "I turn complex workflows into dependable software.";
const CURRENT_ROLE = "Software Engineer · Applied AI & Automation · Current";
const PAGE_SECTION_IDS = [
  "home",
  "impact",
  "work",
  "practice",
  "experience",
  "about",
  "contact",
];
const RETIRED_STAGE_NAMES = [
  "Ingest",
  "Retrieve",
  "Orchestrate",
  "Validate",
  "Deliver",
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
 * @param {HTMLElement[]} elements
 */
function expectDocumentOrder(elements) {
  for (let index = 0; index < elements.length - 1; index += 1) {
    expect(
      elements[index].compareDocumentPosition(elements[index + 1]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  }
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
  it("leads with the approved software-first positioning", () => {
    const { container } = renderPortfolio();

    const headline = screen.getByRole("heading", {
      level: 1,
      name: HEADLINE,
    });
    const heroSection = headline.closest("section");

    expect(heroSection).toHaveAttribute("id", "home");
    expect(heroSection).toHaveTextContent(/Dhruba Saha/i);
    expect(heroSection).toHaveTextContent(/Software Engineer/i);
    expect(heroSection).toHaveTextContent(/Germany/i);
    expect(container).toHaveTextContent(CURRENT_ROLE);
    expect(container).toHaveTextContent(/backend systems/i);
    expect(container).toHaveTextContent(/workflow automation/i);
    expect(container).toHaveTextContent(/internal tools/i);
    expect(container).toHaveTextContent(
      /Applied AI is one part of that practice.not the whole story/i,
    );
  });

  it("presents the approved editorial story and projects in order", () => {
    const { container } = renderPortfolio();

    const sections = PAGE_SECTION_IDS.map((id) => {
      const section = container.querySelector(`#${id}`);
      expect(section, `Missing #${id} section`).toBeTruthy();
      return /** @type {HTMLElement} */ (section);
    });
    expectDocumentOrder(sections);

    const impactHeading = screen.getByRole("heading", {
      name: /A faster path from source material to expert-ready output/i,
    });
    const kyberHeading = screen.getByRole("heading", { name: /Project Kyber/i });
    const tremorHeading = screen.getByRole("heading", { name: /Tremor Track/i });
    expectDocumentOrder([impactHeading, kyberHeading, tremorHeading]);

    expect(screen.getByText(/Private active R&D/i)).toBeInTheDocument();
    expect(screen.getByText(/team hackathon project/i)).toBeInTheDocument();
    expect(container).toHaveTextContent(/approximately eight-hour process/i);
    expect(container).toHaveTextContent(/approximately five minutes/i);
    expect(container).toHaveTextContent(/Expert review remains/i);
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

  it("removes the numbered control-panel presentation", () => {
    const { container } = renderPortfolio();
    const navigation = screen.getByRole("navigation", { name: /primary/i });

    expect(within(navigation).getByRole("link", { name: /^Work$/i })).toHaveAttribute(
      "href",
      "#work",
    );
    expect(
      within(navigation).getByRole("link", { name: /^Experience$/i }),
    ).toHaveAttribute("href", "#experience");
    expect(within(navigation).getByRole("link", { name: /^About$/i })).toHaveAttribute(
      "href",
      "#about",
    );
    expect(
      within(navigation).getByRole("link", { name: /^Contact$/i }),
    ).toHaveAttribute("href", "#contact");
    expect(navigation).not.toHaveTextContent(/\b0[1-9]\b/);
    expect(container.querySelector(".site-progress")).toHaveAttribute(
      "aria-hidden",
      "true",
    );

    expect(
      container.querySelector(
        ".nav-index, .stage-dock, .stage-narrative, .stage-panel, .project-number, .status-label, .scene-readout, [aria-label='AI workflow stages']",
      ),
    ).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(/ORBITAL WORKSPACE|SCROLL TO TRAVERSE/i);
    for (const stageName of RETIRED_STAGE_NAMES) {
      expect(
        screen.queryByRole("button", { name: new RegExp(`^${stageName}$`, "i") }),
      ).not.toBeInTheDocument();
    }
  });

  it("keeps the first-paint shell aligned with the editorial headline", () => {
    const indexHtml = readFileSync("index.html", "utf8");

    expect(indexHtml).toMatch(
      /I turn complex workflows[\s\S]*into dependable software\./,
    );
    expect(indexHtml).not.toMatch(/I build applied AI systems/i);
    expect(indexHtml).toContain('content="#05070B"');
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
    expect(renderedMarkup).not.toMatch(/getform\.io|dropbox\.com|linkedin\.com/i);
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

  it("keeps the quiet navigation keyboard accessible", async () => {
    const user = userEvent.setup();
    renderPortfolio();

    const workLink = within(
      screen.getByRole("navigation", { name: /primary/i }),
    ).getByRole("link", { name: /^Work$/i });
    workLink.focus();
    expect(workLink).toHaveFocus();

    await user.keyboard("{Tab}");
    expect(
      screen.getByRole("link", { name: /^Experience$/i }),
    ).toHaveFocus();
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
