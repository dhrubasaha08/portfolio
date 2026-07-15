import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const VIEWPORTS = [
  { height: 740, width: 320 },
  { height: 844, width: 390 },
  { height: 1024, width: 768 },
  { height: 768, width: 1024 },
  { height: 900, width: 1440 },
];

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

test("renders the approved narrative, metric, project order, and evidence", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: HEADLINE })).toBeVisible();
  await expect(page.getByText(HERO_SUMMARY, { exact: true })).toBeVisible();
  await expect(page.getByText(/Software Engineer · Applied AI & Automation/i)).toBeVisible();
  await expect(page.getByText("≈ 8 hours")).toBeVisible();
  await expect(page.getByText("≈ 5 minutes")).toBeVisible();
  await expect(page.getByText(/Expert review remains/i)).toBeVisible();
  await expect(page.getByText("Private active R&D")).toBeVisible();
  await expect(page.getByText("Earlier team hackathon project")).toBeVisible();

  const sectionOrder = await page.evaluate((ids) => {
    const sections = ids.map((id) => {
      const section = document.getElementById(id);
      if (!section) throw new Error(`Missing #${id} section`);
      return section;
    });
    return sections
      .sort((left, right) =>
        left.compareDocumentPosition(right) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      )
      .map((section) => section.id);
  }, PAGE_SECTION_IDS);
  expect(sectionOrder).toEqual(PAGE_SECTION_IDS);

  for (const href of [
    "https://github.com/dhrubasaha08/tremortrack",
    "https://tremortrack.dhrubasaha.co.in/",
    "https://www.spaceappschallenge.org/2023/find-a-team/tremor-track/?tab=project",
  ]) {
    await expect(page.locator(`a[href="${href}"]`)).toHaveCount(1);
  }

  const kyber = page.locator("#project-kyber");
  await expect(kyber.getByRole("link")).toHaveCount(0);
  await expect(page.locator('a[href="mailto:contact@dhrubasaha.co.in"]')).toHaveCount(2);
  await expect(page.locator('a[href="https://github.com/dhrubasaha08"]')).toHaveCount(1);
});

test("uses authored typography and underlined links without AI-product controls", async ({
  page,
}) => {
  const remoteRequests = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.hostname !== "127.0.0.1") remoteRequests.push(request.url());
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const typography = await page.evaluate(() => {
    const heading = document.querySelector("h1");
    if (!heading) throw new Error("Missing portfolio heading.");
    return {
      body: getComputedStyle(document.body).fontFamily,
      heading: getComputedStyle(heading).fontFamily,
    };
  });
  expect(typography.body).toContain("Public Sans");
  expect(typography.heading).toContain("Barlow Condensed");
  expect(remoteRequests).toEqual([]);

  const hero = page.locator("#home");
  const currentWorkLink = hero.getByRole("link", { name: /See current work/i });
  const contactLink = hero.getByRole("link", { name: /Contact me/i });
  await expect(currentWorkLink).toHaveAttribute("href", "#work");
  await expect(contactLink).toHaveAttribute("href", "mailto:contact@dhrubasaha.co.in");
  await expect(currentWorkLink).toHaveCSS("text-decoration-line", /underline/);
  await expect(contactLink).toHaveCSS("text-decoration-line", /underline/);

  await expect(page.locator("button")).toHaveCount(0);
  await expect(
    page.locator(
      '[class*="card"], [class*="pill"], [class*="glass"], [class*="dashboard"], [class*="telemetry"], [class*="stage-dock"], [class*="nav-index"], [class*="project-number"]',
    ),
  ).toHaveCount(0);
  await expect(page.getByText(/ORBITAL WORKSPACE|SCROLL TO TRAVERSE/i)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Ingest|Retrieve|Orchestrate|Validate|Deliver/i })).toHaveCount(0);
});

test("keeps navigation and focus visible on desktop and mobile", async ({ page }) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: /primary/i });
  await expect(navigation).toBeVisible();
  for (const [label, href] of [
    ["Work", "#work"],
    ["Experience", "#experience"],
    ["About", "#about"],
    ["Contact", "#contact"],
  ]) {
    await expect(navigation.getByRole("link", { name: new RegExp(label, "i") }))
      .toHaveAttribute("href", href);
  }
  await expect(navigation).not.toContainText(/\b0[1-9]\b/);
  await expect(page.getByRole("button", { name: /menu|navigation/i })).toHaveCount(0);

  const workLink = navigation.getByRole("link", { name: /^Work$/i });
  await workLink.focus();
  await expect(workLink).toBeFocused();
  const focusTreatment = await workLink.evaluate((element) => {
    const style = getComputedStyle(element);
    return `${style.outlineStyle} ${style.outlineWidth} ${style.boxShadow} ${style.textDecorationLine}`;
  });
  expect(focusTreatment).not.toMatch(/^none 0px none none$/);

  await page.setViewportSize({ height: 844, width: 390 });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link", { name: /Experience.*Career/i })).toBeVisible();
  await expect(navigation).toContainText("Career");
});

test("has semantic landmarks, ordered headings, and no axe violations", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toHaveAttribute("id", "main-content");
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await expect(page.getByRole("link", { name: /skip to content/i })).toHaveAttribute(
    "href",
    "#main-content",
  );

  const levels = await page.locator("h1, h2, h3").evaluateAll((headings) =>
    headings.map((heading) => Number(heading.tagName.slice(1))),
  );
  expect(levels[0]).toBe(1);
  expect(levels.filter((level) => level === 1)).toHaveLength(1);
  for (let index = 1; index < levels.length; index += 1) {
    expect(levels[index] - levels[index - 1]).toBeLessThanOrEqual(1);
  }

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("has no retired career, confidential, or unapproved link copy", async ({ page }) => {
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

for (const viewport of VIEWPORTS) {
  test(`uses native scrolling without overflow or clipped copy at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const layout = await page.evaluate(() => {
      const headingElement = document.querySelector("h1");
      if (!headingElement) throw new Error("Missing portfolio heading.");
      const heading = headingElement.getBoundingClientRect();
      const rootStyle = getComputedStyle(document.documentElement);
      const bodyStyle = getComputedStyle(document.body);
      return {
        bodyOverflowY: bodyStyle.overflowY,
        clientWidth: document.documentElement.clientWidth,
        headingLeft: heading.left,
        headingRight: heading.right,
        rootOverflowY: rootStyle.overflowY,
        scrollHeight: document.documentElement.scrollHeight,
        scrollWidth: document.documentElement.scrollWidth,
      };
    });
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
    expect(layout.scrollHeight).toBeGreaterThan(viewport.height);
    expect(layout.headingLeft).toBeGreaterThanOrEqual(-1);
    expect(layout.headingRight).toBeLessThanOrEqual(viewport.width + 1);
    expect(["auto", "scroll", "visible"]).toContain(layout.rootOverflowY);
    expect(["auto", "scroll", "visible"]).toContain(layout.bodyOverflowY);

    await page.evaluate(() => window.scrollTo({ top: 700, behavior: "instant" }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await expect(page.getByRole("navigation", { name: /primary/i })).toBeVisible();
  });
}

test.describe("progressive scene fallbacks", () => {
  test("uses a static reduced-motion presentation", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("[data-scene-mode]")).toHaveAttribute(
      "data-scene-mode",
      "reduced",
    );
    await expect(page.locator('[data-testid="cosmic-fallback"]')).toHaveAttribute(
      "data-motion",
      "static",
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
    await expect(page.locator('[data-testid="cosmic-fallback"]')).toBeVisible();
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
    await expect(page.getByRole("heading", { level: 1, name: HEADLINE })).toBeVisible();
  });

  test("returns to the static scene after a reported context loss", async ({ page }) => {
    await page.goto("/");
    const scene = page.locator("[data-scene-mode]");
    await scene.dispatchEvent("playgroundscenelost");
    await expect(scene).toHaveAttribute("data-scene-mode", "failed");
    await expect(page.locator('[data-testid="cosmic-fallback"]')).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
  });
});
