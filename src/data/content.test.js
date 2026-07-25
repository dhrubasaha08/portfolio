import { describe, expect, it } from "vitest";

import {
  contactLinks,
  currentRole,
  deliveryPhases,
  hero,
  identity,
  projects,
  researchProject,
  tremorTrack,
  workstreams,
  workflowCaseStudy,
} from "./content.js";

describe("approved public-content contract", () => {
  it("keeps the current software positioning and approved workflow outcome", () => {
    expect(identity).toEqual({
      name: "Dhruba Saha",
      role: "Software Engineer · Applied AI & Automation",
      location: "Germany",
    });
    expect(hero.introduction).toBe(
      "I build backend systems, automation, and internal tools—and use AI where it genuinely improves the work.",
    );
    expect(currentRole.label).toBe(
      "Software Engineer · Applied AI & Automation · Current",
    );
    expect(workflowCaseStudy.metric.before).toBe("≈8 hours");
    expect(workflowCaseStudy.metric.after).toBe("≈5 minutes");
    expect(workflowCaseStudy.reviewBoundary).toMatch(
      /Expert review remains mandatory/i,
    );
    expect(workflowCaseStudy.architecture.map((step) => step.label)).toEqual([
      "Source material",
      "Retrieval / context",
      "Structured output",
      "Orchestration",
      "Validation",
      "Expert decision",
    ]);
  });

  it("keeps Project Kyber private and Tremor Track evidence public", () => {
    expect(projects).toEqual([researchProject, tremorTrack]);
    expect(researchProject.status).toBe("Private active R&D");
    expect(researchProject.visibility).toBe("private");
    expect(researchProject.evidence).toEqual([]);

    expect(tremorTrack.status).toBe("Earlier team hackathon project");
    expect(tremorTrack.evidence.map((link) => link.href)).toEqual([
      "https://github.com/dhrubasaha08/tremortrack",
      "https://tremortrack.dhrubasaha.co.in/",
      "https://www.spaceappschallenge.org/2023/find-a-team/tremor-track/?tab=project",
    ]);
  });

  it("keeps the current workstreams and delivery method in approved order", () => {
    expect(workstreams.map((item) => item.id)).toEqual([
      "backend",
      "automation",
      "internal-tools",
      "applied-ai",
    ]);
    expect(deliveryPhases.map((item) => item.id)).toEqual([
      "discover",
      "define",
      "build",
      "validate",
      "maintain",
    ]);
    expect(workflowCaseStudy.rationale).toMatch(
      /Retrieval selects relevant context.*Structured output.*Orchestration.*Validation/s,
    );
  });

  it("exposes only the approved direct contact links", () => {
    expect(contactLinks.map((link) => link.href)).toEqual([
      "mailto:contact@dhrubasaha.co.in",
      "https://github.com/dhrubasaha08",
    ]);
  });

  it("does not reintroduce retired career projects or unapproved destinations", () => {
    const publicContent = JSON.stringify({
      contactLinks,
      currentRole,
      hero,
      identity,
      projects,
      deliveryPhases,
      workstreams,
      workflowCaseStudy,
    });

    expect(publicContent).not.toMatch(
      /Arduino|DHT11|TFminiS|SimpleUltrasonic|Zephyr|\bIoT\b|embedded systems?|electronics?|electrical|\bsensors?\b|\bhardware\b|Microsoft Planner|TensorFlow/i,
    );
    expect(publicContent).not.toMatch(
      /getform\.io|dropbox\.com|linkedin\.com|react-vertical-timeline/i,
    );
  });
});
