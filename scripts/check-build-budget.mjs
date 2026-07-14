import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const DIST_DIRECTORY = path.resolve("dist");
const MAX_FILE_BYTES = 300 * 1024;
const MAX_TOTAL_BYTES = 1024 * 1024;
const FORBIDDEN_EXTENSIONS = new Set([".glb", ".gltf", ".mp4"]);

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

/** @type {string[]} */
let files = [];

try {
  files = await walk(DIST_DIRECTORY);
} catch (error) {
  console.error("Build budget check requires an existing dist directory.");
  console.error(error);
  process.exitCode = 1;
  files = [];
}

if (files.length > 0) {
  const assets = await Promise.all(
    files.map(async (file) => ({
      bytes: (await stat(file)).size,
      extension: path.extname(file).toLowerCase(),
      file,
      relativePath: path.relative(DIST_DIRECTORY, file),
    })),
  );
  const totalBytes = assets.reduce((sum, asset) => sum + asset.bytes, 0);
  const oversized = assets.filter((asset) => asset.bytes > MAX_FILE_BYTES);
  const forbidden = assets.filter((asset) =>
    FORBIDDEN_EXTENSIONS.has(asset.extension),
  );

  console.log(
    `Build assets: ${assets.length} files, ${formatKiB(totalBytes)} total.`,
  );

  for (const asset of [...assets].sort((a, b) => b.bytes - a.bytes)) {
    console.log(`- ${asset.relativePath}: ${formatKiB(asset.bytes)}`);
  }

  if (totalBytes > MAX_TOTAL_BYTES) {
    console.error(
      `Total build size exceeds ${formatKiB(MAX_TOTAL_BYTES)}: ${formatKiB(totalBytes)}.`,
    );
  }

  for (const asset of oversized) {
    console.error(
      `${asset.relativePath} exceeds the ${formatKiB(MAX_FILE_BYTES)} per-file limit.`,
    );
  }

  for (const asset of forbidden) {
    console.error(`${asset.relativePath} uses forbidden ${asset.extension} media.`);
  }

  if (totalBytes > MAX_TOTAL_BYTES || oversized.length > 0 || forbidden.length > 0) {
    process.exitCode = 1;
  }
}
