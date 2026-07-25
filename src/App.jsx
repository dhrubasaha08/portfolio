import { useMemo } from "react";
import AstronautScene from "./components/AstronautScene";
import SpaceArtwork from "./components/SpaceArtwork";
import {
  about,
  astronautCredit,
  contactLinks,
  currentRole,
  hero,
  navItems,
  researchProject,
  tremorTrack,
  workflowCaseStudy,
} from "./data/content";
import { useSpaceJourney } from "./hooks/useSpaceJourney";

const sectionIds = [
  "hero",
  currentRole.id,
  workflowCaseStudy.id,
  researchProject.id,
  tremorTrack.id,
  "about",
  "contact",
];

const compactNavItems = [
  { label: "Home", href: "#hero" },
  { label: "Work", href: `#${currentRole.id}` },
  { label: "Projects", href: `#${researchProject.id}` },
  { label: "Contact", href: "#contact" },
];

function idFromHref(href) {
  return href.startsWith("#") ? href.slice(1) : href;
}

function isActiveDestination(href, activeSection) {
  const destination = idFromHref(href);
  if (destination === activeSection) return true;
  if (destination === currentRole.id && activeSection === workflowCaseStudy.id) return true;
  if (destination === researchProject.id && activeSection === tremorTrack.id) return true;
  return false;
}

/**
 * @param {{item: import("./data/types.js").EvidenceLink}} props
 */
function EvidenceLink({ item }) {
  return (
    <a
      className="project-link"
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      aria-label={item.external ? `${item.label} — opens in a new tab` : item.label}
    >
      {item.label} {item.external ? "↗" : ""}
    </a>
  );
}

function App() {
  const {
    rootRef,
    motionRef,
    pointerRef,
    activeSection,
    viewportTier,
    documentVisible,
    motionMode,
  } = useSpaceJourney(sectionIds);

  const stackLine = useMemo(() => currentRole.stack.join(" · "), []);

  return (
    <div ref={rootRef} className="site-shell" data-motion-mode={motionMode}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <SpaceArtwork activeSection={activeSection} />

      <div className="astronaut-layer" aria-hidden="true">
        <AstronautScene
          activeSection={activeSection}
          motionRef={motionRef}
          pointerRef={pointerRef}
          viewportTier={viewportTier}
          visible={documentVisible}
        />
      </div>

      <header className="site-header">
        <a className="wordmark" href="#hero" aria-label="Dhruba Saha — back to the beginning">
          Dhruba Saha
        </a>
      </header>

      <nav className="desktop-rail" aria-label="Primary">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                className="rail-link"
                href={item.href}
                aria-current={
                  isActiveDestination(item.href, activeSection) ? "location" : undefined
                }
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="mobile-nav" aria-label="Mobile">
        {compactNavItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            aria-current={
              isActiveDestination(item.href, activeSection) ? "location" : undefined
            }
          >
            {item.label}
          </a>
        ))}
      </nav>

      <main
        id="main-content"
        className="portfolio-main"
        tabIndex={-1}
        data-active-section={activeSection}
      >
        <section id="hero" className="chapter hero" data-journey-section="hero">
          <div className="chapter-inner hero-content">
            <p className="hero-meta">{hero.identityLine}</p>
            <h1 className="hero-title">{hero.title}</h1>
            <p className="hero-intro">{hero.introduction}</p>
            <div className="text-links" aria-label="Hero links">
              <a className="text-link" href={hero.primaryAction.href}>
                {hero.primaryAction.label}
              </a>
              <a className="text-link" href={hero.secondaryAction.href}>
                {hero.secondaryAction.label}
              </a>
            </div>
          </div>
          <p className="scroll-note" aria-hidden="true">
            Scroll through the work
          </p>
        </section>

        <section
          id={currentRole.id}
          className="chapter current"
          data-journey-section={currentRole.id}
          data-current-role
        >
          <div className="chapter-inner current-layout">
            <div>
              <p className="section-kicker">Current role</p>
              <h2 className="chapter-title">Software that has to work after the demo.</h2>
              <p className="role-label">
                {currentRole.label}
                <br />
                <span className="role-location">{currentRole.location}</span>
              </p>
            </div>

            <div className="role-narrative">
              <p className="role-summary">{currentRole.summary}</p>
              <ul className="role-responsibilities">
                {currentRole.responsibilities.map((responsibility) => (
                  <li key={responsibility}>{responsibility}</li>
                ))}
              </ul>
              <p className="stack-line" aria-label={`Current technology stack: ${stackLine}`}>
                {stackLine}
              </p>
            </div>
          </div>
        </section>

        <section
          id={workflowCaseStudy.id}
          className="chapter workflow"
          data-journey-section={workflowCaseStudy.id}
        >
          <div className="chapter-inner">
            <div className="workflow-heading">
              <div>
                <p className="section-kicker">{workflowCaseStudy.status}</p>
                <h2 className="chapter-title">{workflowCaseStudy.title}</h2>
              </div>
              <p className="workflow-intro">{workflowCaseStudy.problem}</p>
            </div>

            <div
              className="metric-line"
              aria-label={workflowCaseStudy.metric.accessibleLabel}
              role="img"
            >
              <span className="metric-value" aria-hidden="true">
                {workflowCaseStudy.metric.before}
              </span>
              <span className="metric-arrow" aria-hidden="true">
                →
              </span>
              <span className="metric-value" aria-hidden="true">
                {workflowCaseStudy.metric.after}
              </span>
            </div>

            <div className="case-study-grid">
              <div className="case-block">
                <h3>My contribution</h3>
                <p>{workflowCaseStudy.contribution}</p>
              </div>
              <div className="case-block">
                <h3>Outcome</h3>
                <p>{workflowCaseStudy.outcome}</p>
              </div>
              <div className="case-block">
                <h3>Decision boundary</h3>
                <p>{workflowCaseStudy.reviewBoundary}</p>
              </div>
              <div className="case-block">
                <h3>Why it is dependable</h3>
                <p>
                  Retrieval narrows the context, structured output makes the result predictable,
                  and validation keeps a person responsible for the final decision.
                </p>
              </div>
            </div>

            <ol className="system-path" aria-label="Workflow architecture">
              {workflowCaseStudy.architecture.map((step) => (
                <li key={step.id}>
                  <strong>{step.label}</strong>
                  <span>{step.description}</span>
                </li>
              ))}
            </ol>

            <p className="confidentiality">{workflowCaseStudy.confidentialityNote}</p>
          </div>
        </section>

        <section
          id={researchProject.id}
          className="chapter research"
          data-journey-section={researchProject.id}
          data-project-status={researchProject.status}
        >
          <div className="chapter-inner">
            <div className="research-copy">
              <p className="section-kicker">Research direction</p>
              <h2 className="chapter-title">{researchProject.title}</h2>
              <span className="project-status">{researchProject.status}</span>
              <p>{researchProject.thesis}</p>
              <p className="research-boundary">{researchProject.boundary}</p>
            </div>
          </div>
        </section>

        <section
          id={tremorTrack.id}
          className="chapter project-story"
          data-journey-section={tremorTrack.id}
          data-project-status={tremorTrack.status}
        >
          <div className="chapter-inner project-layout">
            <figure className="project-media">
              <img
                src="/images/tremor-track.png"
                alt="Tremor Track interactive lunar seismic visualization"
                width="1440"
                height="720"
                loading="lazy"
                decoding="async"
              />
            </figure>

            <div className="project-copy">
              <p className="section-kicker">Earlier software work</p>
              <h2 className="chapter-title">{tremorTrack.title}</h2>
              <span className="project-status">{tremorTrack.status}</span>
              <p>{tremorTrack.summary}</p>
              <p>{tremorTrack.contribution}</p>
              <p>{tremorTrack.outcome}</p>
              <div className="project-links" aria-label="Tremor Track evidence">
                {tremorTrack.evidence.map((item) => (
                  <EvidenceLink key={item.href} item={item} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="chapter about" data-journey-section="about">
          <div className="chapter-inner about-layout">
            <div>
              <p className="section-kicker">About</p>
              <h2 className="chapter-title">{about.title}</h2>
            </div>
            <div className="about-copy">
              <p>{about.body}</p>
              <aside className="photo-note" aria-labelledby="photography-title">
                <h3 id="photography-title">{about.photography.title}</h3>
                <p>{about.photography.body}</p>
              </aside>
            </div>
          </div>
        </section>

        <section id="contact" className="chapter contact" data-journey-section="contact">
          <div className="chapter-inner">
            <p className="section-kicker">Contact</p>
            <h2 className="chapter-title">Let’s talk about useful software.</h2>
            <p className="contact-intro">
              If you are working on backend systems, automation, internal tools, or a difficult
              operational problem, I would be glad to hear about it.
            </p>
            <div className="contact-links">
              {contactLinks.map((item) => (
                <a
                  key={item.href}
                  className="contact-link"
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  aria-label={
                    item.external
                      ? `${item.label}: ${item.value} — opens in a new tab`
                      : `${item.label}: ${item.value}`
                  }
                >
                  {item.value} {item.external ? "↗" : ""}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>© {new Date().getFullYear()} Dhruba Saha</p>
          <p>
            Astronaut:{" "}
            <a href={astronautCredit.sourceHref} target="_blank" rel="noreferrer">
              {astronautCredit.title} by {astronautCredit.creator}
            </a>{" "}
            ·{" "}
            <a href={astronautCredit.licenseHref} target="_blank" rel="noreferrer">
              {astronautCredit.licenseLabel}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
