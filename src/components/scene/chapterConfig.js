/** @typedef {'hero' | 'impact' | 'practice' | 'kyber' | 'tremor' | 'experience' | 'about' | 'contact'} ChapterId */

/** @type {Readonly<Record<string, ChapterId>>} */
const aliases = Object.freeze({
  home: "hero",
  hero: "hero",
  work: "impact",
  impact: "impact",
  "current-work": "impact",
  "current-systems": "impact",
  practice: "practice",
  capabilities: "practice",
  "what-i-build": "practice",
  "project-kyber": "kyber",
  kyber: "kyber",
  "tremor-track": "tremor",
  tremor: "tremor",
  experience: "experience",
  about: "about",
  "about-photography": "about",
  contact: "contact",
});

/**
 * Preserve public chapter ids at the DOM boundary while using a compact set of
 * scene ids internally.
 *
 * @param {string | null | undefined} value
 * @returns {ChapterId}
 */
export function normalizeChapter(value) {
  if (!value) return "hero";
  return aliases[value] ?? "hero";
}

export const chapterPalette = Object.freeze({
  ink: "#0A0D14",
  midnight: "#101A2E",
  cream: "#F2E8D5",
  orange: "#D6683C",
  sky: "#6FA8C8",
  moss: "#6E7F55",
});
