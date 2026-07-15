import { useEffect, useRef, useState } from "react";
import SceneBoundary from "./components/SceneBoundary";
import SiteNav from "./components/SiteNav";
import {
  about,
  astronautCredit,
  caseStudies,
  contactLinks,
  experienceEntries,
  hero,
  impactCaseStudy,
  navItems,
  practiceStatements,
} from "./data/content";

/** @param {number} value @param {number} min @param {number} max */
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** @param {{link: import("./data/types.js").EvidenceLink | import("./data/types.js").ContactLink}} props */
function TextLink({ link }) {
  const text = "value" in link ? link.value : link.label;
  return (
    <a
      className="text-link"
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noreferrer" : undefined}
      aria-label={link.external ? `${text} (opens in a new tab)` : undefined}
    >
      {text} <span aria-hidden="true">↗</span>
    </a>
  );
}

/** @param {{study: import("./data/types.js").CaseStudy}} props */
function ProjectStory({ study }) {
  const isPrivate = study.visibility === "private-rnd";
  return (
    <section
      id={study.id}
      className={`project-story project-story-${study.id}`}
      aria-labelledby={`${study.id}-heading`}
    >
      <div className="project-scenery" aria-hidden="true">
        {isPrivate ? (
          <>
            <span className="kyber-sun" />
            <span className="kyber-horizon" />
            <strong>K</strong>
          </>
        ) : (
          <>
            <span className="tremor-moon">
              <i />
              <i />
              <i />
            </span>
            <span className="tremor-path" />
          </>
        )}
      </div>
      <div className="project-copy">
        <p className="plain-label">{study.status}</p>
        <h2 id={`${study.id}-heading`}>{study.title}</h2>
        <p className="project-intro">{study.summary}</p>
        <div className="project-notes">
          <p>{study.contribution}</p>
          <p>{study.outcome}</p>
        </div>
        {study.evidence.length > 0 ? (
          <div className="project-links" aria-label={`${study.title} links`}>
            {study.evidence.map((link) => <TextLink key={link.href} link={link} />)}
          </div>
        ) : (
          <p className="private-project-note">Private research. No public link.</p>
        )}
      </div>
    </section>
  );
}

function App() {
  const heroRef = useRef(/** @type {HTMLElement | null} */ (null));
  const pointerFrame = useRef(/** @type {number | null} */ (null));
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [viewportTier, setViewportTier] = useState(
    /** @type {"mobile" | "tablet" | "desktop"} */ ("desktop"),
  );
  const [sceneVisible, setSceneVisible] = useState(true);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const section = heroRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight);
      setScrollProgress(clamp(-rect.top / range, 0, 1));
      setSceneVisible(rect.bottom > 0 && rect.top < window.innerHeight);
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
      if (pointerFrame.current !== null) cancelAnimationFrame(pointerFrame.current);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  /** @param {import("react").PointerEvent<HTMLElement>} event */
  const handlePointerMove = (event) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const next = {
      x: clamp(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -1, 1),
      y: clamp(-((event.clientY / Math.max(1, window.innerHeight)) * 2 - 1), -1, 1),
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
          className="hero"
          ref={heroRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => {
            if (pointerFrame.current !== null) cancelAnimationFrame(pointerFrame.current);
            setPointer({ x: 0, y: 0 });
          }}
          aria-labelledby="hero-heading"
        >
          <div className="hero-sticky">
            <SceneBoundary
              scrollProgress={scrollProgress}
              pointer={pointer}
              viewportTier={viewportTier}
              visible={sceneVisible}
            />
            <div className="hero-copy">
              <p className="hero-eyebrow">{hero.eyebrow}</p>
              <h1 id="hero-heading">{hero.headline}</h1>
              <p className="hero-summary">{hero.summary}</p>
              <div className="hero-links">
                <a href={hero.primaryAction.href}>{hero.primaryAction.label}</a>
                <a href={hero.secondaryAction.href}>{hero.secondaryAction.label}</a>
              </div>
            </div>
            <p className="hero-scroll-note" aria-hidden="true">Scroll to cross the landscape</p>
          </div>
        </section>

        <section id="work" className="impact" aria-labelledby="impact-heading">
          <div className="impact-heading">
            <p className="plain-label">Current work</p>
            <h2 id="impact-heading">{impactCaseStudy.title}</h2>
          </div>
          <div className="impact-body">
            <p>{impactCaseStudy.opening}</p>
            <p>{impactCaseStudy.approach}</p>
          </div>
          <div className="impact-result" aria-label={impactCaseStudy.metric.label}>
            <span>{impactCaseStudy.metric.before}</span>
            <i aria-hidden="true">→</i>
            <span>{impactCaseStudy.metric.after}</span>
          </div>
          <div className="impact-footnotes">
            <p>{impactCaseStudy.outcome}</p>
            <p>{impactCaseStudy.confidentialityNote}</p>
          </div>
        </section>

        <section id="practice" className="practice" aria-labelledby="practice-heading">
          <div className="practice-heading">
            <p className="plain-label">What I build now</p>
            <h2 id="practice-heading">Software for work that needs to hold together.</h2>
          </div>
          <div className="practice-statements">
            {practiceStatements.map((statement) => (
              <article key={statement.id}>
                <h3>{statement.title}</h3>
                <p>{statement.body}</p>
              </article>
            ))}
          </div>
        </section>

        {caseStudies.map((study) => <ProjectStory key={study.id} study={study} />)}

        <section id="experience" className="experience" aria-labelledby="experience-heading">
          <div className="experience-heading">
            <p className="plain-label">Experience</p>
            <h2 id="experience-heading">Learning the system, then making it better.</h2>
          </div>
          <div className="experience-list">
            {experienceEntries.map((entry) => (
              <article key={entry.id}>
                <div className="experience-title">
                  <p>{entry.current ? "Current" : entry.period}</p>
                  <h3>{entry.role}</h3>
                  {entry.organization ? <span>{entry.organization}</span> : null}
                  <span>{entry.location}</span>
                </div>
                <div className="experience-description">
                  <p>{entry.summary}</p>
                  <ul>
                    {entry.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="about" aria-labelledby="about-heading">
          <div className="about-copy">
            <p className="plain-label">About</p>
            <h2 id="about-heading">{about.title}</h2>
            {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <aside className="photography" aria-labelledby="photography-heading">
            <span className="photography-sun" aria-hidden="true" />
            <p className="plain-label">Photography</p>
            <h3 id="photography-heading">{about.photography.title}</h3>
            <p>{about.photography.body}</p>
          </aside>
        </section>

        <section id="contact" className="contact" aria-labelledby="contact-heading">
          <p className="plain-label">Contact</p>
          <h2 id="contact-heading">Have a difficult workflow worth untangling?</h2>
          <p>Tell me what is slow, fragile, or still being held together by hand.</p>
          <div className="contact-links">
            {contactLinks.map((link) => <TextLink key={link.href} link={link} />)}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Dhruba Saha</p>
        <p className="model-credit">
          Astronaut: <a href={astronautCredit.sourceHref} target="_blank" rel="noreferrer">{astronautCredit.title}</a> by {astronautCredit.creator}, <a href={astronautCredit.licenseHref} target="_blank" rel="noreferrer">{astronautCredit.licenseLabel}</a>.
        </p>
        <a href="#home">Back to top ↑</a>
      </footer>
    </>
  );
}

export default App;
