import { Color, Float32BufferAttribute, Vector3 } from "three";
import { SCENE_STAGE_LAYOUT } from "./sceneData";

const MOBILE_NODE_COUNT = 48;
const TABLET_NODE_COUNT = 72;
const DESKTOP_NODE_COUNT = 112;

/**
 * Small deterministic generator so the scene does not visually jump between
 * renders and does not need a serialized geometry asset.
 *
 * @param {number} seed
 * @returns {() => number}
 */
function seededRandom(seed) {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/**
 * @param {string} viewportTier
 * @returns {number}
 */
function getNodeCount(viewportTier) {
  if (viewportTier === "mobile") return MOBILE_NODE_COUNT;
  if (viewportTier === "tablet") return TABLET_NODE_COUNT;
  return DESKTOP_NODE_COUNT;
}

/**
 * @typedef {object} NodeCloud
 * @property {Float32Array} positions
 * @property {Float32Array} scales
 * @property {Uint8Array} stageIndices
 * @property {number} count
 */

/**
 * @param {string} viewportTier
 * @returns {NodeCloud}
 */
export function createNodeCloud(viewportTier) {
  const count = getNodeCount(viewportTier);
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const stageIndices = new Uint8Array(count);
  const random = seededRandom(0x46d7e8);

  for (let index = 0; index < count; index += 1) {
    const stageIndex = index % SCENE_STAGE_LAYOUT.length;
    const stage = SCENE_STAGE_LAYOUT[stageIndex];
    const angle = random() * Math.PI * 2;
    const radius = 0.52 + random() * 1.18;
    const verticalBias = (random() - 0.5) * 1.2;
    const positionIndex = index * 3;

    positions[positionIndex] = stage.position[0] + Math.cos(angle) * radius;
    positions[positionIndex + 1] =
      stage.position[1] + Math.sin(angle) * radius * 0.72 + verticalBias * 0.25;
    positions[positionIndex + 2] = stage.position[2] + (random() - 0.5) * 1.8;
    scales[index] = 0.055 + random() * 0.095;
    stageIndices[index] = stageIndex;
  }

  return { positions, scales, stageIndices, count };
}

/**
 * @param {NodeCloud} cloud
 * @returns {{position: Float32BufferAttribute, color: Float32BufferAttribute}}
 */
export function createEdgeAttributes(cloud) {
  /** @type {number[]} */
  const positions = [];
  /** @type {number[]} */
  const colors = [];
  const muted = new Color("#17324A");

  for (let index = 0; index < cloud.count; index += 1) {
    const positionIndex = index * 3;
    const stage = SCENE_STAGE_LAYOUT[cloud.stageIndices[index]];
    const color = new Color(stage.accent).lerp(muted, 0.65);

    positions.push(
      cloud.positions[positionIndex],
      cloud.positions[positionIndex + 1],
      cloud.positions[positionIndex + 2],
      ...stage.position,
    );
    colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
  }

  for (let index = 0; index < SCENE_STAGE_LAYOUT.length - 1; index += 1) {
    const current = SCENE_STAGE_LAYOUT[index];
    const next = SCENE_STAGE_LAYOUT[index + 1];
    const currentColor = new Color(current.accent).lerp(muted, 0.28);
    const nextColor = new Color(next.accent).lerp(muted, 0.28);

    positions.push(...current.position, ...next.position);
    colors.push(
      currentColor.r,
      currentColor.g,
      currentColor.b,
      nextColor.r,
      nextColor.g,
      nextColor.b,
    );
  }

  return {
    position: new Float32BufferAttribute(positions, 3),
    color: new Float32BufferAttribute(colors, 3),
  };
}

/**
 * @param {string} viewportTier
 * @returns {Float32Array}
 */
export function createStarPositions(viewportTier) {
  const count = viewportTier === "mobile" ? 260 : viewportTier === "tablet" ? 420 : 650;
  const positions = new Float32Array(count * 3);
  const random = seededRandom(0xa78bfa);

  for (let index = 0; index < count; index += 1) {
    const radius = 9 + random() * 17;
    const azimuth = random() * Math.PI * 2;
    const elevation = Math.asin(random() * 2 - 1);
    const positionIndex = index * 3;

    positions[positionIndex] = radius * Math.cos(elevation) * Math.cos(azimuth);
    positions[positionIndex + 1] = radius * Math.sin(elevation);
    positions[positionIndex + 2] = radius * Math.cos(elevation) * Math.sin(azimuth) - 4;
  }

  return positions;
}

/**
 * @returns {Vector3[]}
 */
export function createSignalRoute() {
  return SCENE_STAGE_LAYOUT.map((stage) => new Vector3(...stage.position));
}
