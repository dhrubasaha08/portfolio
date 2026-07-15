import { gzipSync } from "node:zlib";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const DIST_DIRECTORY = path.resolve("dist");
const CRITICAL_JAVASCRIPT_MAX = 200 * 1024;
const DEFERRED_JAVASCRIPT_RAW_MAX = 900 * 1024;
const DEFERRED_JAVASCRIPT_GZIP_MAX = 250 * 1024;
const ASTRONAUT_MAX = 1.3 * 1024 * 1024;
const LAZY_3D_TRANSFER_MAX = 1.55 * 1024 * 1024;
const FONT_AND_ILLUSTRATION_MAX = 300 * 1024;
const FONT_EXTENSIONS = new Set([".otf", ".ttf", ".woff", ".woff2"]);
const FORBIDDEN_EXTENSIONS = new Set([".bin", ".gltf", ".mp4", ".webm"]);

/**
 * @param {string} directory
 * @returns {Promise<string[]>}
 */
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(entryPath) : [entryPath];
    }),
  );

  return files.flat();
}

/** @param {number} bytes */
function formatKiB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

/** @param {string} value */
function normaliseAssetPath(value) {
  return value.replace(/^\//, "").split("?")[0];
}

/** @type {string[]} */
const failures = [];
let files;

try {
  files = await walk(DIST_DIRECTORY);
} catch (error) {
  console.error("Build budget check requires an existing dist directory.");
  console.error(error);
  process.exit(1);
}

const indexHtml = await readFile(path.join(DIST_DIRECTORY, "index.html"), "utf8");
const moduleScripts = [
  ...indexHtml.matchAll(/<script[^>]*\bsrc=["']([^"']+\.js(?:\?[^"']*)?)["'][^>]*>/gi),
].map((match) => normaliseAssetPath(match[1]));

if (moduleScripts.length !== 1) {
  failures.push(
    `Expected one critical module script in dist/index.html, found ${moduleScripts.length}.`,
  );
}

const mainRelativePath = moduleScripts[0];
const assets = await Promise.all(
  files.map(async (file) => {
    const bytes = (await stat(file)).size;
    const buffer = await readFile(file);
    return {
      bytes,
      extension: path.extname(file).toLowerCase(),
      file,
      gzipBytes: gzipSync(buffer).byteLength,
      relativePath: path.relative(DIST_DIRECTORY, file).replaceAll("\\", "/"),
    };
  }),
);

const mainJavaScript = assets.find(
  (asset) => asset.relativePath === mainRelativePath,
);
const javascript = assets.filter((asset) => asset.extension === ".js");
const deferredJavaScript = javascript.filter(
  (asset) => asset.relativePath !== mainRelativePath,
);
const models = assets.filter((asset) => asset.extension === ".glb");
const forbidden = assets.filter((asset) =>
  FORBIDDEN_EXTENSIONS.has(asset.extension),
);
const fontsAndIllustrations = assets.filter(
  (asset) =>
    FONT_EXTENSIONS.has(asset.extension) ||
    (asset.extension === ".svg" && asset.relativePath.startsWith("parallax/")),
);

if (!mainJavaScript) {
  failures.push(`Could not locate critical JavaScript asset ${mainRelativePath}.`);
} else if (mainJavaScript.bytes > CRITICAL_JAVASCRIPT_MAX) {
  failures.push(
    `${mainJavaScript.relativePath} exceeds the ${formatKiB(CRITICAL_JAVASCRIPT_MAX)} critical JavaScript limit (${formatKiB(mainJavaScript.bytes)}).`,
  );
}

if (deferredJavaScript.length === 0) {
  failures.push(
    "No deferred JavaScript chunk was emitted; the Three/Fiber scene must remain lazy-loaded.",
  );
}

const deferredRawBytes = deferredJavaScript.reduce(
  (sum, asset) => sum + asset.bytes,
  0,
);
const deferredGzipBytes = deferredJavaScript.reduce(
  (sum, asset) => sum + asset.gzipBytes,
  0,
);

if (deferredRawBytes > DEFERRED_JAVASCRIPT_RAW_MAX) {
  failures.push(
    `Deferred JavaScript exceeds the ${formatKiB(DEFERRED_JAVASCRIPT_RAW_MAX)} raw limit (${formatKiB(deferredRawBytes)}).`,
  );
}
if (deferredGzipBytes > DEFERRED_JAVASCRIPT_GZIP_MAX) {
  failures.push(
    `Deferred JavaScript exceeds the ${formatKiB(DEFERRED_JAVASCRIPT_GZIP_MAX)} gzip limit (${formatKiB(deferredGzipBytes)}).`,
  );
}

if (models.length !== 1) {
  failures.push(
    `Expected exactly one GLB astronaut model, found ${models.length}. Additional models are not allowed.`,
  );
} else {
  const [astronaut] = models;
  if (!/spaceman|astronaut/i.test(astronaut.relativePath)) {
    failures.push(
      `The only GLB must be the attributed astronaut model; found ${astronaut.relativePath}.`,
    );
  }
  if (astronaut.bytes > ASTRONAUT_MAX) {
    failures.push(
      `${astronaut.relativePath} exceeds the ${formatKiB(ASTRONAUT_MAX)} astronaut limit (${formatKiB(astronaut.bytes)}).`,
    );
  }
}

for (const asset of forbidden) {
  failures.push(`${asset.relativePath} uses forbidden ${asset.extension} media.`);
}

const lazyTransferBytes =
  deferredGzipBytes + models.reduce((sum, asset) => sum + asset.bytes, 0);
if (lazyTransferBytes > LAZY_3D_TRANSFER_MAX) {
  failures.push(
    `Lazy 3D transfer exceeds ${formatKiB(LAZY_3D_TRANSFER_MAX)} (${formatKiB(lazyTransferBytes)}: gzip JavaScript plus model bytes).`,
  );
}

const fontAndIllustrationBytes = fontsAndIllustrations.reduce(
  (sum, asset) => sum + asset.bytes,
  0,
);
if (fontAndIllustrationBytes > FONT_AND_ILLUSTRATION_MAX) {
  failures.push(
    `Fonts and parallax SVGs exceed ${formatKiB(FONT_AND_ILLUSTRATION_MAX)} (${formatKiB(fontAndIllustrationBytes)}).`,
  );
}

console.log("Production budget report");
for (const asset of javascript) {
  const kind = asset.relativePath === mainRelativePath ? "critical" : "deferred";
  console.log(
    `- ${asset.relativePath}: ${formatKiB(asset.bytes)} raw, ${formatKiB(asset.gzipBytes)} gzip (${kind})`,
  );
}
for (const model of models) {
  console.log(`- ${model.relativePath}: ${formatKiB(model.bytes)} (model)`);
}
console.log(`- deferred JavaScript: ${formatKiB(deferredRawBytes)} raw, ${formatKiB(deferredGzipBytes)} gzip`);
console.log(`- lazy 3D transfer: ${formatKiB(lazyTransferBytes)}`);
console.log(`- fonts and parallax SVGs: ${formatKiB(fontAndIllustrationBytes)}`);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`Budget failure: ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log("All production asset budgets pass.");
}
