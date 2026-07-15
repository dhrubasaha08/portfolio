import { Color } from "three";

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/**
 * A sparse, deterministic field of dust keeps the astronaut dimensional while
 * leaving the hand-drawn SVG stars as the dominant visual texture.
 *
 * @param {string} viewportTier
 * @returns {{positions: Float32Array, colors: Float32Array}}
 */
export function createCelestialDust(viewportTier) {
  const count = viewportTier === "mobile" ? 65 : viewportTier === "tablet" ? 100 : 135;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const random = seededRandom(0xd6683c);
  const palette = [new Color("#F2E8D5"), new Color("#6FA8C8"), new Color("#D6683C")];

  for (let index = 0; index < count; index += 1) {
    const positionIndex = index * 3;
    const radius = 2.4 + random() * 8.2;
    const angle = random() * Math.PI * 2;
    const color = palette[Math.floor(random() * palette.length)];

    positions[positionIndex] = Math.cos(angle) * radius;
    positions[positionIndex + 1] = (random() - 0.5) * 7.8;
    positions[positionIndex + 2] = Math.sin(angle) * 2.6 - 1.2;
    colors[positionIndex] = color.r;
    colors[positionIndex + 1] = color.g;
    colors[positionIndex + 2] = color.b;
  }

  return { positions, colors };
}

/**
 * Low-poly celestial pebbles echo the crater artwork without adding another
 * downloaded model or a polished interface motif.
 *
 * @returns {readonly {
 *   position: [number, number, number],
 *   rotation: [number, number, number],
 *   scale: number
 * }[]}
 */
export function createPebbleTransforms() {
  return Object.freeze([
    { position: [-3.7, 1.6, -0.7], rotation: [0.4, 0.7, -0.2], scale: 0.72 },
    { position: [3.25, -1.85, -0.2], rotation: [-0.2, 1.1, 0.6], scale: 0.55 },
    { position: [-2.6, -2.45, -1.1], rotation: [0.8, -0.4, 0.3], scale: 0.38 },
    { position: [4.35, 2.15, -1.4], rotation: [0.25, 0.2, -0.7], scale: 0.44 },
    { position: [0.55, 2.75, -2.2], rotation: [-0.5, 0.9, 0.1], scale: 0.28 },
  ]);
}
