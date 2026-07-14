/**
 * @typedef {'ingest' | 'retrieve' | 'orchestrate' | 'validate' | 'deliver'} SceneStageId
 *
 * @typedef {object} SceneStageLayout
 * @property {SceneStageId} id
 * @property {string} label
 * @property {string} accent
 * @property {[number, number, number]} position
 */

/** @type {readonly SceneStageLayout[]} */
export const SCENE_STAGE_LAYOUT = Object.freeze([
  {
    id: "ingest",
    label: "Ingest",
    accent: "#F5B942",
    position: [-5.2, -1.25, -1.1],
  },
  {
    id: "retrieve",
    label: "Retrieve",
    accent: "#46D7E8",
    position: [-2.75, 1.45, 0.15],
  },
  {
    id: "orchestrate",
    label: "Orchestrate",
    accent: "#A78BFA",
    position: [0, 0, 0.55],
  },
  {
    id: "validate",
    label: "Validate",
    accent: "#46D7E8",
    position: [2.8, 1.35, -0.05],
  },
  {
    id: "deliver",
    label: "Deliver",
    accent: "#A78BFA",
    position: [5.15, -1.1, -1.05],
  },
]);

export const SCENE_STAGE_IDS = Object.freeze(
  SCENE_STAGE_LAYOUT.map((stage) => stage.id),
);

/**
 * Resolve caller input without making the scene depend on a specific content
 * schema. Unknown values intentionally fall back to the orchestration core.
 *
 * @param {string | number | undefined | null} activeStage
 * @returns {number}
 */
export function resolveStageIndex(activeStage) {
  if (typeof activeStage === "number" && Number.isFinite(activeStage)) {
    return Math.max(0, Math.min(SCENE_STAGE_LAYOUT.length - 1, Math.round(activeStage)));
  }

  const normalized = String(activeStage ?? "").trim().toLowerCase();
  const index = SCENE_STAGE_LAYOUT.findIndex(
    (stage) => stage.id === normalized || stage.label.toLowerCase() === normalized,
  );

  return index >= 0 ? index : 2;
}
