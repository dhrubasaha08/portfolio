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
const CHAPTER_IDS = [
  "home",
  "work",
  "practice",
  "project-kyber",
  "tremor-track",
  "experience",
  "about",
  "contact",
];
const DIORAMA_BY_CHAPTER = {
  home: "hero",
  work: "impact",
  practice: "practice",
  "project-kyber": "kyber",
  "tremor-track": "tremor",
  experience: "experience",
  about: "about",
  contact: "contact",
};
const CHAPTER_MOTION_PROPERTIES = [
  "--chapter-progress",
  "--chapter-enter",
  "--chapter-exit",
  "--chapter-transition",
];
const ROOT_MOTION_PROPERTIES = [
  "--global-progress",
  "--pointer-x",
  "--pointer-y",
  "--pointer-impulse",
];

/** @param {import("@playwright/test").Page} page @param {string} selector @param {string} property */
async function readMotionValue(page, selector, property) {
  return page.locator(selector).evaluate(
    (element, name) => Number.parseFloat(getComputedStyle(element).getPropertyValue(name)) || 0,
    property,
  );
}

/** @param {import("@playwright/test").Page} page @param {string} id */
async function centerChapter(page, id) {
  await page.evaluate((chapterId) => {
    const chapter = document.getElementById(chapterId);
    if (!chapter) throw new Error(`Missing #${chapterId}`);
    const top = chapter.getBoundingClientRect().top + window.scrollY;
    const target = top + chapter.offsetHeight / 2 - window.innerHeight / 2;
    window.scrollTo({ top: target, behavior: "instant" });
  }, id);
}

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
  }, CHAPTER_IDS);
  expect(sectionOrder).toEqual(CHAPTER_IDS);

  for (const href of [
    "https://github.com/dhrubasaha08/tremortrack",
    "https://tremortrack.dhrubasaha.co.in/",
    "https://www.spaceappschallenge.org/2023/find-a-team/tremor-track/?tab=project",
  ]) {
    await expect(page.locator(`a[href="${href}"]`)).toHaveCount(1);
  }

  await expect(page.locator("#project-kyber").getByRole("link")).toHaveCount(0);
  await expect(page.locator('a[href="mailto:contact@dhrubasaha.co.in"]')).toHaveCount(2);
  await expect(page.locator('a[href="https://github.com/dhrubasaha08"]')).toHaveCount(1);
});

test("self-hosts Montserrat and avoids AI-product controls", async ({ page }) => {
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
  expect(typography.body).toContain("Montserrat");
  expect(typography.heading).toContain("Montserrat");
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
  await expect(
    page.getByRole("button", { name: /Ingest|Retrieve|Orchestrate|Validate|Deliver/i }),
  ).toHaveCount(0);
});

test("publishes a normalized contract for all eight animated chapters", async ({ page }) => {
  await page.goto("/");

  for (const property of ROOT_MOTION_PROPERTIES) {
    await expect.poll(() => page.locator("main").evaluate(
      (element, name) => getComputedStyle(element).getPropertyValue(name).trim(),
      property,
    )).not.toBe("");
  }

  for (const id of CHAPTER_IDS) {
    const chapter = page.locator(`#${id}[data-chapter="${id}"]`);
    await expect(chapter).toHaveCount(1);
    const values = await chapter.evaluate((element, properties) =>
      properties.map((property) => ({
        property,
        raw: getComputedStyle(element).getPropertyValue(property).trim(),
        value: Number.parseFloat(getComputedStyle(element).getPropertyValue(property)),
      })), CHAPTER_MOTION_PROPERTIES);
    for (const state of values) {
      expect(state.raw, `${state.property} missing on #${id}`).not.toBe("");
      expect(state.value, `${state.property} on #${id}`).toBeGreaterThanOrEqual(0);
      expect(state.value, `${state.property} on #${id}`).toBeLessThanOrEqual(1);
    }
  }
});

test("uses one persistent canvas whose diorama follows native chapter scrolling", async ({
  page,
}) => {
  await page.goto("/");
  const scene = page.locator("[data-scene-chapter]");
  await expect(scene).toHaveCount(1);
  await expect(page.locator(".global-scene-layer")).toHaveAttribute("aria-hidden", "true");
  await expect(scene).toHaveAttribute("data-scene-chapter", "home");
  await expect(scene).toHaveAttribute("data-diorama", /\S+/);
  await expect(scene).toHaveAttribute("data-astronaut-cameo", /\S+/);

  await expect(scene).toHaveAttribute(
    "data-scene-mode",
    /^(deferred|interactive|unsupported)$/,
  );
  const initialMode = await scene.getAttribute("data-scene-mode");
  if (initialMode === "unsupported") {
    await expect(page.locator("canvas")).toHaveCount(0);
  } else {
    await page.mouse.click(20, 120);
    await expect(page.locator("canvas")).toHaveCount(1, { timeout: 10_000 });
  }

  for (const id of CHAPTER_IDS) {
    const before = await readMotionValue(page, `#${id}`, "--chapter-progress");
    await centerChapter(page, id);
    await expect(scene).toHaveAttribute("data-scene-chapter", id);
    await expect.poll(() => readMotionValue(page, `#${id}`, "--chapter-progress"))
      .not.toBe(before);
    await expect(scene).toHaveAttribute("data-diorama", DIORAMA_BY_CHAPTER[id]);
  }

  await centerChapter(page, "work");
  await expect(scene).toHaveAttribute("data-scene-chapter", "work");
  await expect(scene).toHaveAttribute("data-astronaut-cameo", "false");

  await centerChapter(page, "home");
  await expect(scene).toHaveAttribute("data-astronaut-cameo", "true");
  await expect(page.locator("canvas")).toHaveCount(initialMode === "unsupported" ? 0 : 1);
});

test("updates pointer motion gently without making the canvas interactive", async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");
  const scene = page.locator("[data-scene-chapter]");
  await expect(scene).toHaveCount(1);
  const pointerBefore = await readMotionValue(page, "main", "--pointer-x");
  await page.mouse.move(1296, 180);
  await expect.poll(() => readMotionValue(page, "main", "--pointer-x"))
    .not.toBe(pointerBefore);

  await expect(scene).toHaveCSS("pointer-events", "none");
  await expect(scene).toHaveCSS("touch-action", "pan-y");
  if (await page.locator("canvas").count()) {
    await expect(page.locator("canvas")).toHaveCSS("pointer-events", "none");
    await expect(page.locator("canvas")).toHaveCSS("touch-action", "pan-y");
  }
});

test("mobile tap impulses do not capture touch scrolling", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { height: 844, width: 390 },
  });
  const page = await context.newPage();
  await page.goto("/");
  const impulseBefore = await readMotionValue(page, "main", "--pointer-impulse");
  await page.touchscreen.tap(300, 300);
  await expect.poll(() => readMotionValue(page, "main", "--pointer-impulse"))
    .not.toBe(impulseBefore);

  const touchPrevented = await page.evaluate(() => {
    const event = new Event("touchmove", { bubbles: true, cancelable: true });
    document.querySelector("main")?.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(touchPrevented).toBe(false);

  await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await context.close();
});

test("keeps navigation, focus, landmarks, headings, and axe results accessible", async ({
  page,
}) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: /primary/i });
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toHaveAttribute("id", "main-content");
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await expect(page.getByRole("link", { name: /skip to content/i })).toHaveAttribute(
    "href",
    "#main-content",
  );

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
  test(`uses native scrolling without overflow or clipped headings at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const layout = await page.evaluate(() => {
      const rootStyle = getComputedStyle(document.documentElement);
      const bodyStyle = getComputedStyle(document.body);
      return {
        bodyOverflowY: bodyStyle.overflowY,
        clientWidth: document.documentElement.clientWidth,
        rootOverflowY: rootStyle.overflowY,
        scrollHeight: document.documentElement.scrollHeight,
        scrollWidth: document.documentElement.scrollWidth,
      };
    });
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
    expect(layout.scrollHeight).toBeGreaterThan(viewport.height);
    expect(["auto", "scroll", "visible"]).toContain(layout.rootOverflowY);
    expect(["auto", "scroll", "visible"]).toContain(layout.bodyOverflowY);

    for (const id of CHAPTER_IDS) {
      await centerChapter(page, id);
      await expect(page.locator("[data-scene-chapter]")).toHaveAttribute(
        "data-scene-chapter",
        id,
      );
      const headings = await page.locator(`#${id} h1, #${id} h2, #${id} h3`).evaluateAll(
        (elements) => elements.map((heading) => {
          const rect = heading.getBoundingClientRect();
          return { left: rect.left, right: rect.right, text: heading.textContent };
        }),
      );
      for (const heading of headings) {
        expect(heading.left, `${heading.text} clips left at ${viewport.width}px`)
          .toBeGreaterThanOrEqual(-1);
        expect(heading.right, `${heading.text} clips right at ${viewport.width}px`)
          .toBeLessThanOrEqual(viewport.width + 1);
      }
    }

    await page.evaluate(() => window.scrollTo({ top: 700, behavior: "instant" }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await expect(page.getByRole("navigation", { name: /primary/i })).toBeVisible();
  });
}

test.describe("progressive scene fallbacks", () => {
  test("uses a complete static reduced-motion presentation", async ({ browser }) => {
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
    await expect(page.locator("canvas")).toHaveCount(0);
    for (const id of CHAPTER_IDS) await expect(page.locator(`#${id}`)).toBeAttached();
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
    await expect(page.locator("canvas")).toHaveCount(0);
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
    await expect(page.locator('[data-testid="cosmic-fallback"]')).toBeVisible();
  });

  test("returns to the static scene after a reported context loss", async ({ page }) => {
    await page.goto("/");
    const scene = page.locator("[data-scene-mode]");
    await scene.dispatchEvent("playgroundscenelost");
    await expect(scene).toHaveAttribute("data-scene-mode", "failed");
    await expect(page.locator('[data-testid="cosmic-fallback"]')).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.getByRole("main")).toBeVisible();
  });
});
