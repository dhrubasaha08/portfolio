/**
 * @typedef {Object} EvidenceLink
 * @property {string} label
 * @property {string} href
 * @property {"repository" | "live-demo" | "project-page" | "source" | "license" | "profile" | "email"} kind
 * @property {boolean} external
 */

/**
 * @typedef {Object} NavItem
 * @property {string} label
 * @property {string} href
 */

/**
 * @typedef {Object} CurrentRole
 * @property {string} id
 * @property {string} label
 * @property {string} location
 * @property {string} summary
 * @property {readonly string[]} responsibilities
 * @property {readonly string[]} stack
 */

/**
 * @typedef {Object} Workstream
 * @property {"backend" | "automation" | "internal-tools" | "applied-ai"} id
 * @property {string} title
 * @property {string} description
 */

/**
 * @typedef {Object} DeliveryPhase
 * @property {"discover" | "define" | "build" | "validate" | "maintain"} id
 * @property {string} title
 * @property {string} description
 */

/**
 * @typedef {Object} WorkflowStep
 * @property {string} id
 * @property {string} label
 * @property {string} description
 */

/**
 * @typedef {Object} WorkflowMetric
 * @property {string} before
 * @property {string} after
 * @property {string} accessibleLabel
 */

/**
 * @typedef {Object} WorkflowCaseStudy
 * @property {string} id
 * @property {string} title
 * @property {string} status
 * @property {string} problem
 * @property {string} contribution
 * @property {WorkflowMetric} metric
 * @property {readonly WorkflowStep[]} architecture
 * @property {string} rationale
 * @property {string} outcome
 * @property {string} reviewBoundary
 * @property {string} confidentialityNote
 */

/**
 * @typedef {Object} ResearchProject
 * @property {string} id
 * @property {string} title
 * @property {"Private active R&D"} status
 * @property {"private"} visibility
 * @property {string} thesis
 * @property {string} boundary
 * @property {readonly EvidenceLink[]} evidence
 */

/**
 * @typedef {Object} PublicProject
 * @property {string} id
 * @property {string} title
 * @property {string} status
 * @property {"public"} visibility
 * @property {string} summary
 * @property {string} contribution
 * @property {string} outcome
 * @property {readonly EvidenceLink[]} evidence
 */

/**
 * @typedef {Object} AboutContent
 * @property {string} title
 * @property {string} body
 * @property {{ title: string, body: string }} photography
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
 * @typedef {Object} AstronautCredit
 * @property {string} title
 * @property {string} creator
 * @property {string} sourceHref
 * @property {string} licenseLabel
 * @property {string} licenseHref
 */

export {};
