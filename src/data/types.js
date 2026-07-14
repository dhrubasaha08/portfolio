/**
 * @typedef {"cyan" | "violet" | "amber"} Accent
 */

/**
 * @typedef {Object} EvidenceLink
 * @property {string} label
 * @property {string} href
 * @property {"repository" | "live-demo" | "project-page" | "source" | "profile" | "email"} kind
 * @property {boolean} external
 */

/**
 * @typedef {Object} SceneStage
 * @property {string} id
 * @property {string} label
 * @property {string} title
 * @property {string} description
 * @property {Accent} accent
 * @property {readonly [number, number, number]} cameraTarget
 * @property {readonly [number, number, number]} nodeTarget
 */

/**
 * @typedef {Object} CaseStudy
 * @property {string} id
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} status
 * @property {"sanitized" | "private-rnd" | "public"} visibility
 * @property {string} summary
 * @property {string} contribution
 * @property {string} outcome
 * @property {Accent} accent
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
 * @typedef {Object} CapabilityGroup
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {readonly string[]} skills
 * @property {Accent} accent
 */

/**
 * @typedef {Object} NavItem
 * @property {string} label
 * @property {string} href
 */

/**
 * @typedef {Object} CurrentScopeItem
 * @property {string} id
 * @property {string} label
 * @property {string} title
 * @property {string} description
 * @property {Accent} accent
 */

/**
 * @typedef {Object} ContactLink
 * @property {string} label
 * @property {string} value
 * @property {string} href
 * @property {"email" | "profile"} kind
 */

export {};
