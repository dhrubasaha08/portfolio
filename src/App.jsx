import { useEffect, useRef, useState } from "react";
import SceneBoundary from "./components/SceneBoundary";
import SiteNav from "./components/SiteNav";
import {
  about,
  astronautCredit,
  capabilityGroups,
  caseStudies,
  contact,
  experienceEntries,
  hero,
  impactCaseStudy,
  navItems,
} from "./data/content";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * @param {{link: import("./data/types.js").EvidenceLink | import("./data/types.js").ContactLink, className?: string}} props
 */
function ExternalLink({ link, className = "evidence-link" }) {
  return (
    <a
      className={className}
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noreferrer" : undefined}
    >
      <span>{"value" in link ? link.value : link.label}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function MoonVisual() {
  return (
    <div className="moon-visual" aria-hidden="true">
      <span className="moon-orbit moon-orbit-one" />
      <span className="moon-orbit moon-orbit-two" />
      <div className="moon-sphere">
        <span className="moon-crater crater-one" />
        <span className="moon-crater crater-two" />
        <span className="moon-crater crater-three" />
        <span className="moon-event event-one" />
        <span className="moon-event event-two" />
        <span className="moon-event event-three" />
      </div>
    </div>
  );
}

function KyberVisual() {
  return (
    <div className="kyber-visual" aria-hidden="true">
      <span className="kyber-glow" />
      <span className="kyber-ring kyber-ring-one" />
      <span className="kyber-ring kyber-ring-two" />
      <span className="kyber-ring kyber-ring-three" />
      <span className="kyber-moon" />
    </div>
  );
}

/** @param {{study: import("./data/types.js").CaseStudy}} props */
function ProjectStory({ study }) {
  return (
    <article className="project-story">
      <div className="project-visual">
        {study.id === "project-kyber" ? <KyberVisual /> : <MoonVisual />}
      </div>
      <div className="project-copy">
        <p className="project-status">{study.status}</p>
        <h3>{study.title}</h3>
        <p className="project-summary">{study.summary}</p>
        <dl className="project-details">
          <div>
            <dt>Contribution</dt>
            <dd>{study.contribution}</dd>
          </div>
          <div>
            <dt>Outcome</dt>
            <dd>{study.outcome}</dd>
          </div>
        </dl>
        {study.evidence.length ? (
          <div className="evidence-links" aria-label={`${study.title} links`}>
            {study.evidence.map((link) => (
              <ExternalLink key={link.href} link={link} />
            ))}
          </div>
        ) : (
          <p className="private-note">Private research. No public link.</p>
        )}
      </div>
    </article>
  );
}

function App() {
  const immersiveRef = useRef(/** @type {HTMLElement | null} */ (null));
  const pointerFrame = useRef(/** @type {number | null} */ (null));
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [viewportTier, setViewportTier] = useState("desktop");
  const [immersiveVisible, setImmersiveVisible] = useState(true);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const section = immersiveRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight);
      setScrollProgress(clamp(-rect.top / range, 0, 1));
      setImmersiveVisible(rect.bottom > 0 && rect.top < window.innerHeight);
      setViewportTier(
        window.innerWidth < 768 ? "mobile" : window.innerWidth < 1100 ? "tablet" : "desktop",
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const handlePointerMove = (event) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const next = {
      x: clamp(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -1, 1),
      y: clamp(-(((event.clientY - bounds.top) / window.innerHeight) * 2 - 1), -1, 1),
    };
    if (pointerFrame.current !== null) cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = requestAnimationFrame(() => setPointer(next));
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteNav items={navItems} />

      <main id="main-content" tabIndex={-1}>
        <section
          id="home"
          className="immersive"
          ref={immersiveRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setPointer({ x: 0, y: 0 })}
          aria-labelledby="hero-heading"
        >
          <div className="cosmic-viewport">
            <SceneBoundary
              scrollProgress={scrollProgress}
              pointer={pointer}
              viewportTier={viewportTier}
              visible={immersiveVisible}
            />
            <div className="scene-vignette" aria-hidden="true" />
          </div>

          <div className="immersive-copy">
            <div className="hero-panel">
              <div className="hero-copy">
                <p className="hero-eyebrow">{hero.eyebrow}</p>
                <h1 id="hero-heading">{hero.headline}</h1>
                <p className="hero-summary">{hero.summary}</p>
                <div className="hero-actions">
                  <a className="button button-primary" href={hero.primaryAction.href}>
                    {hero.primaryAction.label}<span aria-hidden="true">↓</span>
                  </a>
                  <a className="button button-quiet" href={hero.secondaryAction.href}>
                    {hero.secondaryAction.label}<span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>

            <section id="impact" className="impact-story" aria-labelledby="impact-heading">
              <div className="impact-copy">
                <p className="section-kicker">Current impact</p>
                <h2 id="impact-heading">{impactCaseStudy.title}</h2>
                <p>{impactCaseStudy.summary}</p>
                <p>{impactCaseStudy.outcome}</p>
                <p className="confidentiality-note">{impactCaseStudy.confidentialityNote}</p>
              </div>
              <div className="impact-metric" aria-label={impactCaseStudy.metric.label}>
                <div>
                  <span>Before</span>
                  <strong>{impactCaseStudy.metric.before}</strong>
                </div>
                <span className="metric-arrow" aria-hidden="true">→</span>
                <div>
                  <span>After</span>
                  <strong>{impactCaseStudy.metric.after}</strong>
                </div>
                <p>Expert review stays in the loop.</p>
              </div>
            </section>
          </div>
        </section>

        <section id="work" className="content-section work-section" aria-labelledby="work-heading">
          <div className="section-heading">
            <p className="section-kicker">Selected work</p>
            <h2 id="work-heading">Selected work, without the hype.</h2>
            <p>One active research direction and one earlier public software project, described at their actual stage.</p>
          </div>
          <div className="project-list">
            {caseStudies.map((study) => <ProjectStory key={study.id} study={study} />)}
          </div>
        </section>

        <section id="practice" className="content-section practice-section" aria-labelledby="practice-heading">
          <div className="section-heading">
            <p className="section-kicker">Practice</p>
            <h2 id="practice-heading">A software practice built around useful systems.</h2>
            <p>Applied AI sits inside a broader engineering practice—not above it.</p>
          </div>
          <div className="practice-list">
            {capabilityGroups.map((group) => (
              <article key={group.id} className="practice-row">
                <h3>{group.title}</h3>
                <div>
                  <p>{group.description}</p>
                  <p className="practice-tools">{group.skills.join(" · ")}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="content-section experience-section" aria-labelledby="experience-heading">
          <div className="section-heading">
            <p className="section-kicker">Experience</p>
            <h2 id="experience-heading">Experience shaped by delivery.</h2>
          </div>
          <div className="experience-list">
            {experienceEntries.map((entry) => (
              <article key={entry.id} className={entry.current ? "experience-row is-current" : "experience-row"}>
                <div className="experience-title">
                  <p>{entry.current ? "Current role" : entry.period}</p>
                  <h3>{entry.role}</h3>
                  {entry.organization ? <span>{entry.organization}</span> : null}
                  <span>{entry.location}</span>
                </div>
                <div className="experience-body">
                  <p>{entry.summary}</p>
                  <ul>
                    {entry.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="content-section about-section" aria-labelledby="about-heading">
          <div className="about-copy">
            <p className="section-kicker">About</p>
            <h2 id="about-heading">{about.title}</h2>
            {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <aside className="photography-note" aria-labelledby="photography-heading">
            <div className="photography-orbit" aria-hidden="true"><span /><span /><span /></div>
            <p className="section-kicker">Photography</p>
            <h3 id="photography-heading">{about.photography.title}</h3>
            <p>{about.photography.body}</p>
          </aside>
        </section>

        <section id="contact" className="contact-section" aria-labelledby="contact-heading">
          <div className="contact-copy">
            <p className="section-kicker">Contact</p>
            <h2 id="contact-heading">{contact.title}</h2>
            <p>{contact.body}</p>
            <div className="contact-links">
              {contact.links.map((link) => (
                <ExternalLink key={link.href} link={link} className="contact-link" />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Dhruba Saha</p>
        <p>
          Astronaut: <a href={astronautCredit.source.href} target="_blank" rel="noreferrer">{astronautCredit.title}</a> by {astronautCredit.creator}, {astronautCredit.license}.
        </p>
        <a href="#home">Back to top ↑</a>
      </footer>
    </>
  );
}

export default App;
