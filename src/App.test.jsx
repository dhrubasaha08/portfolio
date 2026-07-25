import axe from "axe-core";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

const approvedEvidence = [
  "https://github.com/dhrubasaha08/tremortrack",
  "https://tremortrack.dhrubasaha.co.in/",
  "https://www.spaceappschallenge.org/2023/find-a-team/tremor-track/?tab=project",
];

describe("animated 2D space portfolio", () => {
  it("leads with the approved current-career identity", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Dhruba Saha" }),
    ).toBeInTheDocument();
    expect(document.body).toHaveTextContent(
      "Software Engineer · Applied AI & Automation · Germany",
    );
    expect(document.body).toHaveTextContent(
      "I build backend systems, automation, and internal tools—and use AI where it genuinely improves the work.",
    );
    expect(document.body).toHaveTextContent(
      "Software Engineer · Applied AI & Automation · Current",
    );

    for (const technology of [
      "Python",
      "JavaScript/TypeScript",
      "Node.js",
      "PostgreSQL",
      "REST APIs",
      "n8n",
      "OpenAI APIs",
      "Docker",
      "Git",
      "Linux",
    ]) {
      expect(document.body).toHaveTextContent(technology);
    }
  });

  it("keeps the expanded story, approved project order, metric, and evidence", () => {
    const { container } = render(<App />);

    const role = container.querySelector("#role");
    const buildNow = container.querySelector("#what-i-build");
    const workflow = container.querySelector("#workflow");
    const method = container.querySelector("#how-i-work");
    const kyber = container.querySelector("#project-kyber");
    const tremor = container.querySelector("#tremor-track");
    if (
      !(role instanceof HTMLElement) ||
      !(buildNow instanceof HTMLElement) ||
      !(workflow instanceof HTMLElement) ||
      !(method instanceof HTMLElement) ||
      !(kyber instanceof HTMLElement) ||
      !(tremor instanceof HTMLElement)
    ) {
      throw new Error("Expected role, focus, workflow, method, and project sections.");
    }

    expect(
      role.compareDocumentPosition(buildNow) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      buildNow.compareDocumentPosition(workflow) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      workflow.compareDocumentPosition(method) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      method.compareDocumentPosition(kyber) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      kyber.compareDocumentPosition(tremor) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    expect(document.body).toHaveTextContent("≈8 hours");
    expect(document.body).toHaveTextContent("≈5 minutes");
    expect(document.body).toHaveTextContent(
      "Expert review remains mandatory before the output is used.",
    );
    expect(document.body).toHaveTextContent("Private active R&D");
    expect(document.body).toHaveTextContent("Earlier team hackathon project");
    expect(within(buildNow).getAllByRole("listitem")).toHaveLength(4);
    expect(within(method).getAllByRole("listitem")).toHaveLength(5);

    for (const href of approvedEvidence) {
      const link = container.querySelector(`a[href="${href}"]`);
      expect(link).toBeTruthy();
      expect(link).toHaveAccessibleName();
    }

    expect(within(kyber).queryByRole("link")).not.toBeInTheDocument();
  });

  it("keeps retired and private material out of rendered content", () => {
    const { container } = render(<App />);
    const text = container.textContent ?? "";

    expect(text).not.toMatch(
      /Arduino|DHT11|TFminiS|SimpleUltrasonic|Zephyr|\bIoT\b|embedded|electronics|electrical|\bhardware\b|Microsoft Planner|TensorFlow/i,
    );
    expect(text).not.toMatch(
      /salary|visa|immigration|passport|residence permit|health information|customer data|conversion rate|financial projection|private prompt/i,
    );
    expect(text).not.toMatch(/résumé|resume|LinkedIn|internship|bachelor/i);
  });

  it("gives every chapter authored decorative artwork and keeps content outside it", () => {
    const { container } = render(<App />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /skip to content/i })).toHaveAttribute(
      "href",
      "#main-content",
    );
    const chapters = container.querySelectorAll("[data-journey-section]");
    const artworks = container.querySelectorAll("[data-chapter-artwork]");
    expect(chapters).toHaveLength(9);
    expect(artworks).toHaveLength(9);
    for (const chapter of chapters) {
      const artwork = chapter.querySelector(":scope > [data-chapter-artwork]");
      const content = chapter.querySelector(":scope > [data-content-layer]");
      expect(artwork).toHaveAttribute("aria-hidden", "true");
      expect(content).toBeTruthy();
      expect(artwork?.contains(content)).toBe(false);
      for (const svg of artwork?.querySelectorAll("svg") ?? []) {
        expect(svg).toHaveAttribute("focusable", "false");
      }
    }
    expect(container.querySelectorAll(".astronaut-scene")).toHaveLength(1);
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<App />);
    const results = await axe.run(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });

    expect(results.violations).toEqual([]);
  });
});
