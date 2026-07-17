import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const variant = process.argv[2] ?? "portfolio";
const baseUrl = process.env.PORTFOLIO_PREVIEW_URL ?? "http://127.0.0.1:5173/";
const output = path.resolve("test-results", "handoff", variant);
const chapters = ["home", "work", "project-kyber", "tremor-track", "about", "contact"];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
});

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.mouse.move(Math.round(viewport.width * 0.76), Math.round(viewport.height * 0.25));
    await page.waitForTimeout(900);

    for (const chapter of chapters) {
      await page.evaluate(({ id, mobile }) => {
        const section = document.getElementById(id);
        if (!section) throw new Error(`Missing #${id}`);
        const top = section.getBoundingClientRect().top + window.scrollY;
        const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0;
        const destination = mobile
          ? top - headerHeight - 8
          : top + section.offsetHeight / 2 - window.innerHeight / 2;
        window.scrollTo({ top: Math.max(0, destination), behavior: "instant" });
      }, { id: chapter, mobile: viewport.name === "mobile" });
      // Let the demand-rendered astronaut complete its eased chapter journey
      // before recording the settled composition.
      await page.waitForTimeout(900);
      await page.screenshot({ path: path.join(output, `${viewport.name}-${chapter}.png`) });
    }

    await page.close();
  }
} finally {
  await browser.close();
}

console.log(`Captured ${chapters.length * viewports.length} previews in ${output}`);
