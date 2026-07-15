/**
 * Five private waypoints preserve the original scroll choreography without
 * exposing workflow stages to the interface. Positions and look targets are
 * interpolated continuously by the camera rig.
 *
 * @typedef {object} CameraKeyframe
 * @property {[number, number, number]} position
 * @property {[number, number, number]} target
 * @property {number} roll
 */

/** @type {readonly CameraKeyframe[]} */
export const CAMERA_KEYFRAMES = Object.freeze([
  {
    position: [-0.65, 0.48, 12.4],
    target: [0.1, 0.1, 0.25],
    roll: -0.012,
  },
  {
    position: [0.15, 0.12, 11.75],
    target: [-0.5, 0.35, 0.1],
    roll: 0.008,
  },
  {
    position: [0.58, -0.18, 10.95],
    target: [0.05, 0.12, 0.35],
    roll: 0.018,
  },
  {
    position: [-0.12, 0.38, 10.35],
    target: [0.75, -0.12, 0.1],
    roll: -0.01,
  },
  {
    position: [-0.55, -0.05, 9.75],
    target: [0.1, -0.2, -0.15],
    roll: -0.022,
  },
]);

/**
 * @param {number} progress
 * @returns {{lower: CameraKeyframe, upper: CameraKeyframe, mix: number}}
 */
export function resolveCameraSegment(progress) {
  const normalized = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const scaled = normalized * (CAMERA_KEYFRAMES.length - 1);
  const lowerIndex = Math.floor(scaled);
  const upperIndex = Math.min(CAMERA_KEYFRAMES.length - 1, lowerIndex + 1);
  const linearMix = scaled - lowerIndex;
  const mix = linearMix * linearMix * (3 - 2 * linearMix);

  return {
    lower: CAMERA_KEYFRAMES[lowerIndex],
    upper: CAMERA_KEYFRAMES[upperIndex],
    mix,
  };
}
