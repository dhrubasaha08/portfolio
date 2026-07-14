import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const VIEWPORTS = [
  { height: 740, width: 320 },
  { height: 844, width: 390 },
  { height: 1024, width: 768 },
  { height: 768, width: 1024 },
  { height: 900, width: 1440 },
];

test("renders the approved narrative and evidence links", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /I build applied AI systems that turn manual work into dependable software/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/Germany/i).first()).toBeVisible();
  await expect(
    page.getByText("Software Engineer · Applied AI & Automation · Current"),
  ).toBeVisible();

  const orderedHeadings = await page
    .locator("h2, h3")
    .allTextContents();
  const positions = [
    "AI-assisted workflow automation",
    "Project Kyber",
    "Tremor Track",
  ].map((heading) =>
    orderedHeadings.findIndex((candidate) => candidate.includes(heading)),
  );
  expect(positions.every((position) => position >= 0)).toBeTruthy();
  expect(positions).toEqual([...positions].sort((a, b) => a - b));

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

test("uses landmarks, keyboard-operable stages, and visible focus", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toHaveAttribute("id", "main-content");
  await expect(page.getByRole("contentinfo")).toBeVisible();

  const retrieve = page.getByRole("button", { name: /^Retrieve$/i });
  await retrieve.focus();
  await expect(retrieve).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(retrieve).toHaveAttribute("aria-pressed", "true");

  const outlineStyle = await retrieve.evaluate((element) => {
    const style = getComputedStyle(element);
    return `${style.outlineStyle} ${style.outlineWidth} ${style.boxShadow}`;
  });
  expect(outlineStyle).not.toMatch(/^none 0px none$/);
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
  });

  test("recovers to static content after WebGL context loss", async ({ page }) => {
    await page.goto("/");
    const scene = page.locator("[data-scene-mode]");
    const mode = await scene.getAttribute("data-scene-mode");
    test.skip(mode !== "interactive", "WebGL2 is unavailable in this browser environment.");

    await scene.locator("canvas").dispatchEvent("webglcontextlost");
    await expect(scene).toHaveAttribute("data-scene-mode", "failed");
    await expect(page.getByRole("main")).toBeVisible();
  });
});
