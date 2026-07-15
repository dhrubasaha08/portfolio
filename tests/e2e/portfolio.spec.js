import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const VIEWPORTS = [
  { height: 740, width: 320 },
  { height: 844, width: 390 },
  { height: 1024, width: 768 },
  { height: 768, width: 1024 },
  { height: 900, width: 1440 },
];

const PAGE_SECTION_IDS = [
  "home",
  "impact",
  "work",
  "practice",
  "experience",
  "about",
  "contact",
];

test("renders the approved software-first narrative and evidence links", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "I turn complex workflows into dependable software.",
    }),
  ).toBeVisible();
  await expect(page.getByText(/Germany/i).first()).toBeVisible();
  await expect(
    page.getByText("Software Engineer · Applied AI & Automation · Current"),
  ).toBeVisible();
  await expect(page.getByText(/backend systems/i).first()).toBeVisible();
  await expect(page.getByText(/workflow automation/i).first()).toBeVisible();
  await expect(page.getByText(/internal tools/i).first()).toBeVisible();
  await expect(
    page.getByText(/Applied AI is one part of that practice.not the whole story/i),
  ).toBeVisible();

  const sectionOrder = await page.evaluate((ids) => {
    const sections = ids.map((id) => {
      const section = document.getElementById(id);
      if (!section) throw new Error(`Missing #${id} section`);
      return section;
    });
    return sections
      .sort((left, right) => {
        if (left === right) return 0;
        return left.compareDocumentPosition(right) & Node.DOCUMENT_POSITION_FOLLOWING
          ? -1
          : 1;
      })
      .map((section) => section.id);
  }, PAGE_SECTION_IDS);
  expect(sectionOrder).toEqual(PAGE_SECTION_IDS);

  const orderedHeadings = await page.locator("h2, h3").allTextContents();
  const positions = [
    "A faster path from source material to expert-ready output.",
    "Project Kyber",
    "Tremor Track",
  ].map((heading) =>
    orderedHeadings.findIndex((candidate) => candidate.includes(heading)),
  );
  expect(positions.every((position) => position >= 0)).toBeTruthy();
  expect(positions).toEqual([...positions].sort((a, b) => a - b));

  await expect(page.getByText(/Private active R&D/i)).toBeVisible();
  await expect(page.getByText(/team hackathon project/i)).toBeVisible();
  await expect(page.getByText(/approximately five minutes/i).last()).toBeVisible();
  await expect(page.getByText(/Expert review remains/i)).toBeVisible();

  await expect(
    page.locator('a[href="https://github.com/dhrubasaha08/tremortrack"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('a[href="https://tremortrack.dhrubasaha.co.in/"]'),
  ).toHaveCount(1);
  await expect(
    page.locator(
      'a[href="https://www.spaceappschallenge.org/2023/find-a-team/tremor-track/?tab=project"]',
    ),
  ).toHaveCount(1);
});

test("uses a quiet, unnumbered, keyboard-accessible navigation", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toHaveAttribute("id", "main-content");
  await expect(page.getByRole("contentinfo")).toBeVisible();

  await expect(page.locator(".site-header")).toHaveCSS("position", "fixed");
  const navigation = page.getByRole("navigation", { name: /primary/i });
  await expect(navigation).toBeVisible();
  for (const [label, href] of [
    ["Work", "#work"],
    ["Experience", "#experience"],
    ["About", "#about"],
    ["Contact", "#contact"],
  ]) {
    await expect(navigation.getByRole("link", { name: label })).toHaveAttribute(
      "href",
      href,
    );
  }
  await expect(navigation).not.toContainText(/\b0[1-9]\b/);
  await expect(page.locator(".site-progress")).toHaveCount(1);
  await expect(page.locator(".site-progress")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(
    page.locator(
      ".nav-index, .stage-dock, .stage-narrative, .stage-panel, .project-number, .status-label, .scene-readout, [aria-label='AI workflow stages']",
    ),
  ).toHaveCount(0);
  await expect(page.getByText(/ORBITAL WORKSPACE|SCROLL TO TRAVERSE/i)).toHaveCount(
    0,
  );

  for (const label of [
    "Ingest",
    "Retrieve",
    "Orchestrate",
    "Validate",
    "Deliver",
  ]) {
    await expect(page.getByRole("button", { name: label })).toHaveCount(0);
  }

  const workLink = navigation.getByRole("link", { name: "Work" });
  await workLink.focus();
  await expect(workLink).toBeFocused();
  const outlineStyle = await workLink.evaluate((element) => {
    const style = getComputedStyle(element);
    return `${style.outlineStyle} ${style.outlineWidth} ${style.boxShadow}`;
  });
  expect(outlineStyle).not.toMatch(/^none 0px none$/);

  const projectStatusStyle = await page.locator(".project-status").first().evaluate(
    (element) => {
      const style = getComputedStyle(element);
      return {
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        borderStyle: style.borderTopStyle,
      };
    },
  );
  expect(projectStatusStyle).toEqual({
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderRadius: "0px",
    borderStyle: "none",
  });
});

test("keeps the compact mobile navigation visible without a menu control", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");

  await expect(page.locator(".brand-short")).toBeVisible();
  await expect(page.locator(".nav-label-mobile", { hasText: "Career" })).toBeVisible();
  await expect(page.getByRole("button", { name: /menu|navigation/i })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: /primary/i })).toBeVisible();
});

test("has no retired career or confidential copy in rendered content", async ({
  page,
}) => {
  await page.goto("/");
  const renderedText = await page.locator("body").innerText();
  const renderedMarkup = await page.locator("body").innerHTML();

  expect(renderedText).not.toMatch(
    /Arduino|DHT11|TFminiS|SimpleUltrasonic|Zephyr|\bIoT\b|embedded systems?|electronics?|electrical|\bsensors?\b|\bhardware\b|Microsoft Planner|TensorFlow/i,
  );
  expect(renderedText).not.toMatch(
    /salary|compensation|visa|immigration|passport|residence.?permit|medical|mental health|health information|insurance|customer data|customer count|conversion rate|financial projection|proprietary prompt/i,
  );
  expect(renderedMarkup).not.toMatch(/getform\.io|dropbox\.com|linkedin\.com/i);
});

test("has no detectable browser accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

for (const viewport of VIEWPORTS) {
  test(`has native scrolling and no horizontal overflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    expect(dimensions.scrollHeight).toBeGreaterThan(viewport.height);

    await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });
}

test.describe("progressive 3D fallbacks", () => {
  test("uses the reduced-motion presentation when requested", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("[data-scene-mode]")).toHaveAttribute(
      "data-scene-mode",
      "reduced",
    );
    await context.close();
  });

  test("does not initialize WebGL in save-data mode", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "connection", {
        configurable: true,
        value: { saveData: true },
      });
    });
    await page.goto("/");
    await expect(page.locator("[data-scene-mode]")).toHaveAttribute(
      "data-scene-mode",
      "save-data",
    );
  });

  test("keeps content available without WebGL", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
        configurable: true,
        value: () => null,
      });
    });
    await page.goto("/");
    await expect(page.locator("[data-scene-mode]")).toHaveAttribute(
      "data-scene-mode",
      "unsupported",
    );
    await expect(page.getByRole("main")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "I turn complex workflows into dependable software.",
      }),
    ).toBeVisible();
  });

  test("recovers to static content after WebGL context loss", async ({ page }) => {
    await page.goto("/");
    const scene = page.locator("[data-scene-mode]");
    await expect
      .poll(() => scene.getAttribute("data-scene-mode"), { timeout: 10_000 })
      .toMatch(/interactive|unsupported|failed/);
    const mode = await scene.getAttribute("data-scene-mode");
    test.skip(mode !== "interactive", "WebGL2 is unavailable in this browser environment.");

    await scene.locator("canvas").dispatchEvent("webglcontextlost");
    await expect(scene).toHaveAttribute("data-scene-mode", "failed");
    await expect(page.getByRole("main")).toBeVisible();
  });
});
