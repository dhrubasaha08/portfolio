import { Color, Float32BufferAttribute, Vector3 } from "three";

/**
 * Deterministic procedural geometry keeps the scene stable between renders
 * without adding another binary asset.
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
 * @returns {Float32Array}
 */
export function createStarPositions(viewportTier) {
  const count = viewportTier === "mobile" ? 190 : viewportTier === "tablet" ? 320 : 480;
  const positions = new Float32Array(count * 3);
  const random = seededRandom(0xf3efe7);

  for (let index = 0; index < count; index += 1) {
    const radius = 9 + random() * 18;
    const azimuth = random() * Math.PI * 2;
    const elevation = Math.asin(random() * 2 - 1);
    const positionIndex = index * 3;

    positions[positionIndex] = radius * Math.cos(elevation) * Math.cos(azimuth);
    positions[positionIndex + 1] = radius * Math.sin(elevation);
    positions[positionIndex + 2] = radius * Math.cos(elevation) * Math.sin(azimuth) - 5;
  }

  return positions;
}

/**
 * Sparse dust is concentrated around the celestial core. It reads as a soft
 * atmosphere instead of a set of connected data nodes.
 *
 * @param {string} viewportTier
 * @returns {Float32Array}
 */
export function createDustPositions(viewportTier) {
  const count = viewportTier === "mobile" ? 90 : viewportTier === "tablet" ? 150 : 220;
  const positions = new Float32Array(count * 3);
  const random = seededRandom(0x3ba39a);

  for (let index = 0; index < count; index += 1) {
    const radius = 1.4 + Math.pow(random(), 1.5) * 5.8;
    const angle = random() * Math.PI * 2;
    const inclination = (random() - 0.5) * 0.78;
    const positionIndex = index * 3;

    positions[positionIndex] = Math.cos(angle) * radius;
    positions[positionIndex + 1] = Math.sin(angle) * radius * 0.32 + inclination;
    positions[positionIndex + 2] = (random() - 0.5) * 2.4 - radius * 0.06;
  }

  return positions;
}

/**
 * Packs several restrained elliptical curves into one line-segment geometry,
 * keeping orbit rendering to one draw call.
 *
 * @returns {{position: Float32BufferAttribute, color: Float32BufferAttribute}}
 */
export function createOrbitAttributes() {
  const positions = [];
  const colors = [];
  const palettes = ["#F3EFE7", "#F26A3D", "#3BA39A"];
  const orbits = [
    { radiusX: 2.25, radiusY: 0.78, rotation: -0.28, depth: 0.32 },
    { radiusX: 3.45, radiusY: 1.1, rotation: 0.38, depth: -0.16 },
    { radiusX: 4.8, radiusY: 1.5, rotation: -0.08, depth: -0.7 },
  ];
  const segments = 96;

  orbits.forEach((orbit, orbitIndex) => {
    const color = new Color(palettes[orbitIndex]);
    const faded = color.clone().multiplyScalar(0.42);

    for (let index = 0; index < segments; index += 1) {
      const fromAngle = (index / segments) * Math.PI * 2;
      const toAngle = ((index + 1) / segments) * Math.PI * 2;
      const addPoint = (angle) => {
        const x = Math.cos(angle) * orbit.radiusX;
        const y = Math.sin(angle) * orbit.radiusY;
        const cos = Math.cos(orbit.rotation);
        const sin = Math.sin(orbit.rotation);
        positions.push(x * cos - y * sin, x * sin + y * cos, orbit.depth + Math.sin(angle) * 0.22);
      };

      addPoint(fromAngle);
      addPoint(toAngle);
      const segmentColor = index % 3 === 0 ? color : faded;
      colors.push(
        segmentColor.r,
        segmentColor.g,
        segmentColor.b,
        segmentColor.r,
        segmentColor.g,
        segmentColor.b,
      );
    }
  });

  return {
    position: new Float32BufferAttribute(positions, 3),
    color: new Float32BufferAttribute(colors, 3),
  };
}

/**
 * @returns {Vector3[]}
 */
export function createTrailRoute() {
  return [
    new Vector3(-6.4, -2.2, -1.6),
    new Vector3(-4.1, -0.6, -0.8),
    new Vector3(-1.9, 0.68, 0.2),
    new Vector3(0.2, 0.18, 0.62),
    new Vector3(2.65, -0.46, 0.05),
    new Vector3(5.6, 1.28, -1.35),
  ];
}
