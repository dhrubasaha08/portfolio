import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("custom-domain metadata", () => {
  it("keeps Pages, robots, and sitemap on the approved canonical origin", () => {
    expect(readFileSync("public/CNAME", "utf8").trim()).toBe(
      "dhrubasaha.co.in",
    );

    const robots = readFileSync("public/robots.txt", "utf8");
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain(
      "Sitemap: https://dhrubasaha.co.in/sitemap.xml",
    );

    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    expect(sitemap).toContain("<loc>https://dhrubasaha.co.in/</loc>");
  });

  it("publishes canonical, descriptive, and restrictive document metadata", () => {
    const indexHtml = readFileSync("index.html", "utf8");

    expect(indexHtml).toMatch(
      /<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/dhrubasaha\.co\.in\/["']/i,
    );
    expect(indexHtml).toMatch(
      /<meta[^>]+name=["']description["'][^>]+content=["'][^"']{40,}["']/i,
    );
    expect(indexHtml).toMatch(
      /<meta[^>]+http-equiv=["']Content-Security-Policy["']/i,
    );
    expect(indexHtml).toMatch(/<meta[^>]+property=["']og:title["']/i);
    expect(indexHtml).not.toMatch(
      /fonts\.(?:googleapis|gstatic)\.com|use\.typekit\.net/i,
    );
  });
});
