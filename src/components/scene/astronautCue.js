import { MathUtils } from "three";
import { normalizeChapter } from "./chapterConfig";

/** @typedef {import('../../data/types.js').AstronautPresence} AstronautPresence */

/**
 * Single source of truth for the astronaut boundary and rendered model.
 * @param {AstronautPresence} presence
 * @param {string} activeChapter
 * @param {number} progress
 */
export function getAstronautCue(presence, activeChapter, progress) {
  const chapter = normalizeChapter(activeChapter);
  const safeProgress = MathUtils.clamp(Number(progress) || 0, 0, 1);
  if (chapter === "hero") return { visible: true, phase: safeProgress, kind: "hero" };
  if (presence === "hero") return { visible: false, phase: 0, kind: "hidden" };
  if (presence === "journey") return { visible: true, phase: safeProgress, kind: "journey" };
  const cameoStart = chapter === "impact" || chapter === "kyber" || chapter === "about" ? 0.8 : 2;
  const phase = MathUtils.clamp((safeProgress - cameoStart) / Math.max(0.01, 1 - cameoStart), 0, 1);
  return { visible: safeProgress >= cameoStart, phase, kind: safeProgress >= cameoStart ? "cameo" : "hidden" };
}

