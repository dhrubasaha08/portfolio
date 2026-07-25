import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const VIEWPORTS = [
  { height: 740, width: 320 },
  { height: 844, width: 390 },
  { height: 1024, width: 768 },
  { height: 768, width: 1024 },
  { height: 900, width: 1440 },
];

const CHAPTER_IDS = [
  "hero",
  "role",
  "what-i-build",
  "workflow",
  "how-i-work",
  "project-kyber",
  "tremor-track",
  "about",
  "contact",
];

test("renders the approved identity, work, projects, and evidence", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Dhruba Saha" }),
  ).toBeVisible();
  const body = page.locator("body");
  await expect(body).toContainText(
    "Software Engineer · Applied AI & Automation · Germany",
  );
  await expect(body).toContainText(
    "I build backend systems, automation, and internal tools—and use AI where it genuinely improves the work.",
  );
  await expect(body).toContainText(
    "Software Engineer · Applied AI & Automation · Current",
  );
  await expect(body).toContainText(/≈\s*8 hours/i);
  await expect(body).toContainText(/≈\s*5 minutes/i);
  await expect(body).toContainText(/expert review remains mandatory/i);
  await expect(page.getByText("Private active R&D")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tremor Track" })).toBeVisible();

  for (const href of [
    "https://github.com/dhrubasaha08/tremortrack",
    "https://tremortrack.dhrubasaha.co.in/",
    "https://www.spaceappschallenge.org/2023/find-a-team/tremor-track/?tab=project",
    "mailto:contact@dhrubasaha.co.in",
    "https://github.com/dhrubasaha08",
  ]) {
    await expect(page.locator(`a[href="${href}"]`).first()).toHaveAccessibleName(
      /\S+/,
    );
  }
});

test("gives every chapter authored 2D motion without moving semantic content", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");

  await expect(page.locator("[data-journey-section]")).toHaveCount(CHAPTER_IDS.length);
  await expect(page.locator("[data-chapter-artwork]")).toHaveCount(CHAPTER_IDS.length);

  const readings = await page.evaluate(async (chapterIds) => {
    const result = [];
    const maximumScroll =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;

    for (const id of chapterIds) {
      const section = document.getElementById(id);
      if (!section) throw new Error(`Missing chapter ${id}`);

      const artwork = section.querySelector(`[data-chapter-artwork="${id}"]`);
      const content = section.querySelector("[data-content-layer]");
      if (!(artwork instanceof HTMLElement) || !(content instanceof HTMLElement)) {
        throw new Error(`Chapter ${id} is missing its artwork or content layer`);
      }

      const firstTarget = Math.min(
        maximumScroll,
        section.offsetTop + section.offsetHeight * 0.12,
      );
      const secondTarget = Math.min(
        maximumScroll,
        firstTarget + Math.min(320, section.offsetHeight * 0.2),
      );
      window.scrollTo({ top: firstTarget, behavior: "instant" });
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      const before = Number.parseFloat(
        section.style.getPropertyValue("--chapter-progress"),
      );
      window.scrollTo({ top: secondTarget, behavior: "instant" });
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      const after = Number.parseFloat(
        section.style.getPropertyValue("--chapter-progress"),
      );

      result.push({
        after,
        artworkHidden: artwork.getAttribute("aria-hidden"),
        before,
        contentTransform: getComputedStyle(content).transform,
        id,
        pointerEvents: getComputedStyle(artwork).pointerEvents,
      });
    }

    return result;
  }, CHAPTER_IDS);

  expect(readings.map((reading) => reading.id)).toEqual(CHAPTER_IDS);
  for (const reading of readings) {
    expect(reading.artworkHidden).toBe("true");
    expect(reading.pointerEvents).toBe("none");
    expect(reading.contentTransform).toBe("none");
    expect(reading.after).toBeGreaterThan(reading.before);
  }
});

test("provides semantic landmarks, focusable navigation, and clean axe results", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("navigation", { name: /primary/i })).toBeVisible();
  await expect(page.getByRole("main")).toHaveAttribute("id", "main-content");
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await expect(page.getByRole("link", { name: /skip to content/i })).toHaveAttribute(
    "href",
    "#main-content",
  );

  const firstNavigationLink = page
    .getByRole("navigation", { name: /primary/i })
    .getByRole("link")
    .first();
  await firstNavigationLink.focus();
  await expect(firstNavigationLink).toBeFocused();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("makes no remote font, avatar, media, or scenery requests", async ({ page }) => {
  /** @type {string[]} */
  const remoteRequests = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.hostname !== "127.0.0.1"
    ) {
      remoteRequests.push(request.url());
    }
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(remoteRequests).toEqual([]);
});

test("loads the textured astronaut without application errors", async ({ page }) => {
  /** @type {string[]} */
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await page.mouse.move(300, 300);
  await expect(page.locator(".astronaut-scene")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 15_000 },
  );

  expect(errors).toEqual([]);
});

test("keeps approved content available with reduced motion", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Dhruba Saha" }),
  ).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".site-shell")).toHaveAttribute(
    "data-motion-mode",
    "reduced",
  );
  await context.close();
});

test("keeps approved content available without initializing WebGL in save-data mode", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true },
    });
  });
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Dhruba Saha" }),
  ).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".site-shell")).toHaveAttribute(
    "data-motion-mode",
    "save-data",
  );
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
  await expect(page.locator(".site-shell")).toHaveAttribute(
    "style",
    /--space-global-progress:\s*0\.0000/,
  );
});

test("keeps the complete static composition when WebGL is unsupported", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      value(type, ...args) {
        if (String(type).startsWith("webgl")) return null;
        return Reflect.apply(originalGetContext, this, [type, ...args]);
      },
    });
  });
  await page.goto("/");

  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".site-shell")).toHaveAttribute(
    "data-scene-mode",
    "unsupported",
  );
  await expect(page.getByRole("heading", { level: 1, name: "Dhruba Saha" })).toBeVisible();
});

test("falls back cleanly after a WebGL context loss", async ({ page }) => {
  await page.goto("/");
  await page.mouse.move(300, 300);
  const canvas = page.locator(".astronaut-scene canvas");
  await expect(canvas).toHaveCount(1, { timeout: 15_000 });
  await expect(page.locator(".astronaut-scene")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 15_000 },
  );

  await canvas.evaluate((node) => {
    node.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
  });

  await expect(canvas).toHaveCount(0);
  await expect(page.locator(".site-shell")).toHaveAttribute(
    "data-scene-mode",
    "context-lost",
  );
  await expect(page.getByRole("main")).toBeVisible();
});

test("keeps the astronaut layer decorative and touch scrolling available", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { height: 844, width: 390 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await page.touchscreen.tap(190, 420);

  const canvas = page.locator(".astronaut-scene canvas");
  await expect(canvas).toHaveCount(1, { timeout: 15_000 });
  await expect(canvas).toHaveCSS("pointer-events", "none");
  await expect(canvas).toHaveCSS("touch-action", "pan-y");
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await context.close();
});

for (const viewport of VIEWPORTS) {
  test(`uses native scrolling without horizontal overflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const layout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      clippedContent: Array.from(
        document.querySelectorAll(
          "[data-content-layer] h1, [data-content-layer] h2, [data-content-layer] h3, [data-content-layer] p, [data-content-layer] li, [data-content-layer] a",
        ),
      )
        .filter((node) => {
          const rect = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return (
            rect.width > 0 &&
            rect.height > 0 &&
            style.visibility !== "hidden" &&
            (rect.left < -1 || rect.right > document.documentElement.clientWidth + 1)
          );
        })
        .slice(0, 5)
        .map((node) => node.textContent?.trim().slice(0, 80)),
      scrollHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
    expect(layout.clippedContent).toEqual([]);
    expect(layout.scrollHeight).toBeGreaterThan(viewport.height);

    await page.evaluate(() => window.scrollTo({ top: 700, behavior: "instant" }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });
}
