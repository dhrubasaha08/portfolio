import axe from "axe-core";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

const approvedEvidence = [
  "https://github.com/dhrubasaha08/tremortrack",
  "https://tremortrack.dhrubasaha.co.in/",
  "https://www.spaceappschallenge.org/2023/find-a-team/tremor-track/?tab=project",
];

describe("content-rich space portfolio", () => {
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

  it("keeps the approved project order, metric, and evidence", () => {
    const { container } = render(<App />);

    const workflow = container.querySelector("#workflow");
    const kyber = container.querySelector("#project-kyber");
    const tremor = container.querySelector("#tremor-track");
    if (
      !(workflow instanceof HTMLElement) ||
      !(kyber instanceof HTMLElement) ||
      !(tremor instanceof HTMLElement)
    ) {
      throw new Error("Expected workflow, Kyber, and Tremor Track sections.");
    }

    expect(
      workflow.compareDocumentPosition(kyber) & Node.DOCUMENT_POSITION_FOLLOWING,
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

  it("keeps the canvas decorative and the semantic document complete without WebGL", () => {
    const { container } = render(<App />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /skip to content/i })).toHaveAttribute(
      "href",
      "#main-content",
    );
    expect(container.querySelectorAll("[data-testid='space-artwork']")).toHaveLength(1);
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
