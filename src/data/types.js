/**
 * @typedef {Object} EvidenceLink
 * @property {string} label
 * @property {string} href
 * @property {"repository" | "live-demo" | "project-page" | "source" | "license" | "profile" | "email"} kind
 * @property {boolean} external
 */

/**
 * @typedef {Object} CaseStudy
 * @property {string} id
 * @property {string} title
 * @property {string} status
 * @property {"private-rnd" | "public"} visibility
 * @property {string} summary
 * @property {string} contribution
 * @property {string} outcome
 * @property {readonly EvidenceLink[]} evidence
 */

/**
 * @typedef {Object} ExperienceEntry
 * @property {string} id
 * @property {string} role
 * @property {string=} organization
 * @property {string=} period
 * @property {string} location
 * @property {string} summary
 * @property {readonly string[]} highlights
 * @property {boolean} current
 */

/**
 * @typedef {Object} PracticeStatement
 * @property {string} id
 * @property {string} title
 * @property {string} body
 */

/**
 * @typedef {Object} NavItem
 * @property {string} label
 * @property {string=} mobileLabel
 * @property {string} href
 */

/**
 * @typedef {Object} ContactLink
 * @property {string} label
 * @property {string} value
 * @property {string} href
 * @property {"email" | "profile"} kind
 * @property {boolean} external
 */

/**
 * The ordered document chapters that participate in the shared 2D and 3D
 * motion system.
 *
 * @typedef {"home" | "work" | "practice" | "project-kyber" | "tremor-track" | "experience" | "about" | "contact"} ChapterId
 */

/**
 * @typedef {"interactive" | "reduced" | "save-data" | "unsupported" | "failed" | "static"} MotionMode
 */

/**
 * Mutable pointer input shared with the decorative scene without triggering
 * React renders on every pointer event.
 *
 * @typedef {Object} ScenePointer
 * @property {number} x Normalized viewport x position from -1 to 1.
 * @property {number} y Normalized viewport y position from -1 to 1.
 * @property {number} impulse Decaying tap/pointer impulse from 0 to 1.
 */

/**
 * Mutable chapter state shared with the decorative scene. All progress values
 * are normalized from 0 to 1.
 *
 * @typedef {Object} ChapterMotionState
 * @property {ChapterId} activeChapter
 * @property {ChapterId} previousChapter
 * @property {number} progress
 * @property {number} enter
 * @property {number} exit
 * @property {number} transitionProgress
 * @property {number} globalProgress
 */

export {};
