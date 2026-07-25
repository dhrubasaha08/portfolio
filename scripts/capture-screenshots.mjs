import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const previewUrl = process.env.PREVIEW_URL ?? "http://127.0.0.1:4173/";
const outputDirectory = join(process.cwd(), "artifacts", "screenshots");
const chapters = [
  "hero",
  "role",
  "workflow",
  "project-kyber",
  "tremor-track",
  "contact",
];
const viewports = [
  { height: 900, label: "desktop", width: 1440 },
  { height: 844, label: "mobile", width: 390 },
];

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { height: viewport.height, width: viewport.width },
    });
    await page.goto(previewUrl, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    await page
      .locator(".astronaut-scene[data-ready='true']")
      .waitFor({ timeout: 15_000 });

    for (const chapter of chapters) {
      await page.evaluate((chapterId) => {
        const section = document.getElementById(chapterId);
        if (!section) throw new Error(`Missing chapter: ${chapterId}`);
        window.scrollTo({ behavior: "instant", top: section.offsetTop });
      }, chapter);
      await page.waitForTimeout(450);
      await page.screenshot({
        animations: "allow",
        path: join(outputDirectory, `${viewport.label}-${chapter}.png`),
      });
    }

    await page.close();
  }
} finally {
  await browser.close();
}

console.log(`Saved portfolio screenshots to ${outputDirectory}`);
