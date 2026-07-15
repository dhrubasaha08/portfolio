import axe from "axe-core";
import { existsSync, readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import App from "./App";

const HEADLINE = "I turn complex workflows into dependable software.";
const HERO_SUMMARY =
  "I’m Dhruba Saha, a software engineer in Germany. I build backend systems, automation, and internal tools—and use AI when it genuinely improves the work.";
const PAGE_SECTION_IDS = [
  "home",
  "work",
  "practice",
  "project-kyber",
  "tremor-track",
  "experience",
  "about",
  "contact",
];
const VERIFIED_LINKS = [
  "https://github.com/dhrubasaha08/tremortrack",
  "https://tremortrack.dhrubasaha.co.in/",
  "https://www.spaceappschallenge.org/2023/find-a-team/tremor-track/?tab=project",
];

function renderPortfolio() {
  return render(<App />);
}

/** @param {HTMLElement[]} elements */
function expectDocumentOrder(elements) {
  for (let index = 0; index < elements.length - 1; index += 1) {
    expect(
      elements[index].compareDocumentPosition(elements[index + 1]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  }
}

describe("portfolio content", () => {
  it("leads with the approved direct software-first positioning", () => {
    const { container } = renderPortfolio();

    const headline = screen.getByRole("heading", { level: 1, name: HEADLINE });
    const heroSection = headline.closest("section");
    expect(heroSection).toHaveAttribute("id", "home");
    expect(heroSection).toHaveTextContent(/Dhruba Saha/i);
    expect(heroSection).toHaveTextContent(/Software Engineer/i);
    expect(heroSection).toHaveTextContent(/Germany/i);
    expect(screen.getByText(HERO_SUMMARY, { exact: true })).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /See current work/i }),
    ).toHaveAttribute("href", "#work");
    expect(screen.getByRole("link", { name: /Contact me/i })).toHaveAttribute(
      "href",
      "mailto:contact@dhrubasaha.co.in",
    );
    expect(container).toHaveTextContent(/Software Engineer · Applied AI & Automation/i);
    expect(container).toHaveTextContent(/Current/i);
  });

  it("presents the approved story and projects in order", () => {
    const { container } = renderPortfolio();
    const sections = PAGE_SECTION_IDS.map((id) => {
      const section = container.querySelector(`#${id}`);
      expect(section, `Missing #${id} section`).toBeTruthy();
      return /** @type {HTMLElement} */ (section);
    });
    expectDocumentOrder(sections);

    const workflowHeading = screen.getByRole("heading", {
      name: /Eight hours of careful work/i,
    });
    const kyberHeading = screen.getByRole("heading", { name: /^Project Kyber$/i });
    const tremorHeading = screen.getByRole("heading", { name: /Tremor Track/i });
    expectDocumentOrder([workflowHeading, kyberHeading, tremorHeading]);

    expect(screen.getByText("≈ 8 hours")).toBeInTheDocument();
    expect(screen.getByText("≈ 5 minutes")).toBeInTheDocument();
    expect(container).toHaveTextContent(/approximately eight hours/i);
    expect(container).toHaveTextContent(/approximately five minutes/i);
    expect(container).toHaveTextContent(/Expert review remains/i);
    expect(screen.getByText("Private active R&D")).toBeInTheDocument();
    expect(screen.getByText("Earlier team hackathon project")).toBeInTheDocument();
  });

  it("exposes only approved project and contact destinations", () => {
    const { container } = renderPortfolio();

    for (const href of VERIFIED_LINKS) {
      const link = container.querySelector(`a[href="${href}"]`);
      expect(link, `Missing approved link ${href}`).toBeTruthy();
      expect(link).toHaveAccessibleName();
    }

    const kyberHeading = screen.getByRole("heading", { name: /^Project Kyber$/i });
    const kyberSection = kyberHeading.closest("section");
    expect(kyberSection).toBeTruthy();
    expect(within(/** @type {HTMLElement} */ (kyberSection)).queryByRole("link"))
      .not.toBeInTheDocument();

    expect(container.querySelector('a[href="mailto:contact@dhrubasaha.co.in"]'))
      .toHaveAccessibleName();
    expect(screen.getByRole("link", { name: /GitHub/i })).toHaveAttribute(
      "href",
      "https://github.com/dhrubasaha08",
    );
  });

  it("avoids AI-dashboard and generic product-card presentation", () => {
    const { container } = renderPortfolio();
    const navigation = screen.getByRole("navigation", { name: /primary/i });

    for (const [label, href] of [
      ["Work", "#work"],
      ["Experience", "#experience"],
      ["About", "#about"],
      ["Contact", "#contact"],
    ]) {
      expect(within(navigation).getByRole("link", { name: new RegExp(label, "i") }))
        .toHaveAttribute("href", href);
    }

    expect(navigation).not.toHaveTextContent(/\b0[1-9]\b/);
    expect(container.querySelector("button")).not.toBeInTheDocument();
    expect(
      container.querySelector(
        '[class*="card"], [class*="pill"], [class*="glass"], [class*="dashboard"], [class*="telemetry"], [class*="stage-dock"], [class*="nav-index"], [class*="project-number"]',
      ),
    ).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(/ORBITAL WORKSPACE|SCROLL TO TRAVERSE/i);
    for (const stage of ["Ingest", "Retrieve", "Orchestrate", "Validate", "Deliver"]) {
      expect(screen.queryByRole("button", { name: stage })).not.toBeInTheDocument();
    }
  });

  it("keeps the first-paint shell, fonts, and metadata aligned", () => {
    const indexHtml = readFileSync("index.html", "utf8");
    const stylesheet = readFileSync("src/index.css", "utf8");

    expect(indexHtml).toContain(HEADLINE);
    expect(indexHtml).toContain('content="#101A2E"');
    expect(indexHtml).toContain('rel="canonical" href="https://dhrubasaha.co.in/"');
    expect(stylesheet).toMatch(/@font-face[\s\S]*Barlow Condensed/i);
    expect(stylesheet).toMatch(/@font-face[\s\S]*Public Sans/i);
    expect(stylesheet).not.toMatch(/url\(["']?https?:\/\//i);
    expect(existsSync("public/fonts/BARLOW-LICENSE.txt")).toBe(true);
    expect(existsSync("public/fonts/PUBLIC-SANS-LICENSE.txt")).toBe(true);
  });

  it("omits retired career and confidential claims", () => {
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
  it("provides semantic landmarks, ordered headings, and a skip link", () => {
    const { container } = renderPortfolio();

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("main")).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: /skip to content/i })).toHaveAttribute(
      "href",
      "#main-content",
    );

    const levels = [...container.querySelectorAll("h1, h2, h3")].map(
      (heading) => Number(heading.tagName.slice(1)),
    );
    expect(levels[0]).toBe(1);
    for (let index = 1; index < levels.length; index += 1) {
      expect(levels[index] - levels[index - 1]).toBeLessThanOrEqual(1);
    }
  });

  it("keeps navigation keyboard accessible", async () => {
    const user = userEvent.setup();
    renderPortfolio();
    const navigation = screen.getByRole("navigation", { name: /primary/i });
    const workLink = within(navigation).getByRole("link", { name: /^Work$/i });
    workLink.focus();
    expect(workLink).toHaveFocus();
    await user.keyboard("{Tab}");
    expect(within(navigation).getByRole("link", { name: /Experience/i })).toHaveFocus();
  });

  it("has no automatically detectable axe violations", async () => {
    const { container } = renderPortfolio();
    const results = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(results.violations).toEqual([]);
  });

  it("defines visible focus and complete reduced-motion CSS", () => {
    const stylesheet = readFileSync("src/index.css", "utf8");
    expect(stylesheet).toMatch(/:focus-visible\s*{/);
    expect(stylesheet).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    expect(stylesheet).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
    expect(stylesheet).toMatch(/animation-iteration-count:\s*1\s*!important/);
    expect(stylesheet).toMatch(/scroll-behavior:\s*auto\s*!important/);
  });
});
