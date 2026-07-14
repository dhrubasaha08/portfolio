import { useEffect, useRef, useState } from "react";
import CosmicFallback from "./components/CosmicFallback";
import SceneBoundary from "./components/SceneBoundary";
import SiteNav from "./components/SiteNav";
import {
  about,
  astronautCredit,
  capabilityGroups,
  caseStudies,
  contact,
  currentScope,
  experienceEntries,
  hero,
  impactCaseStudy,
  navItems,
  sceneStages,
} from "./data/content";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function ExternalLink({ link, className = "evidence-link" }) {
  const isExternal = link.external ?? link.href.startsWith("http");
  return (
    <a
      className={className}
      href={link.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
    >
      <span>{link.label ?? link.value}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function MoonVisual() {
  return (
    <div className="moon-visual" aria-hidden="true">
      <div className="moon-orbit moon-orbit-one" />
      <div className="moon-orbit moon-orbit-two" />
      <div className="moon-sphere">
        <span className="moon-crater crater-one" />
        <span className="moon-crater crater-two" />
        <span className="moon-crater crater-three" />
        <span className="moon-event event-one" />
        <span className="moon-event event-two" />
        <span className="moon-event event-three" />
      </div>
      <span className="moon-coordinate">LUNAR EVENT MAP</span>
    </div>
  );
}

function KyberVisual() {
  return (
    <div className="kyber-visual" aria-hidden="true">
      <div className="kyber-core">
        <span>LOCAL</span>
        <strong>KYBER</strong>
        <small>CONTROL PLANE / R&D</small>
      </div>
      <span className="kyber-ring ring-one" />
      <span className="kyber-ring ring-two" />
      <span className="kyber-ring ring-three" />
      <span className="kyber-node node-one">CONTEXT</span>
      <span className="kyber-node node-two">GOVERN</span>
      <span className="kyber-node node-three">ROUTE</span>
    </div>
  );
}

function ProjectPanel({ study, index }) {
  return (
    <article className={`project-panel accent-${study.accent}`}>
      <div className="project-visual">{study.id === "project-kyber" ? <KyberVisual /> : <MoonVisual />}</div>
      <div className="project-copy">
        <div className="project-meta">
          <span>{study.eyebrow}</span>
          <span className="status-label">{study.status}</span>
        </div>
        <h3>{study.title}</h3>
        <p className="project-summary">{study.summary}</p>
        <dl className="project-details">
          <div>
            <dt>My contribution</dt>
            <dd>{study.contribution}</dd>
          </div>
          <div>
            <dt>Current outcome</dt>
            <dd>{study.outcome}</dd>
          </div>
        </dl>
        {study.evidence.length ? (
          <div className="evidence-links" aria-label={`${study.title} evidence links`}>
            {study.evidence.map((link) => (
              <ExternalLink key={link.href} link={link} />
            ))}
          </div>
        ) : (
          <p className="private-note">No public repository or product link.</p>
        )}
      </div>
      <span className="project-number" aria-hidden="true">{String(index + 2).padStart(2, "0")}</span>
    </article>
  );
}

function App() {
  const immersiveRef = useRef(/** @type {HTMLElement | null} */ (null));
  const stageRefs = useRef(/** @type {(HTMLElement | null)[]} */ ([]));
  const pointerFrame = useRef(/** @type {number | null} */ (null));
  const [activeStage, setActiveStage] = useState(0);
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
      setViewportTier(window.innerWidth < 768 ? "mobile" : window.innerWidth < 1100 ? "tablet" : "desktop");
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const target = /** @type {HTMLElement} */ (visible.target);
          setActiveStage(Number(target.dataset.stageIndex));
        }
      },
      { rootMargin: "-30% 0px -40%", threshold: [0.15, 0.4, 0.7] },
    );
    stageRefs.current.forEach((stage) => {
      if (stage) observer.observe(stage);
    });
    return () => observer.disconnect();
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

  const selectStage = (index) => {
    setActiveStage(index);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stageRefs.current[index]?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
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
              activeStage={activeStage}
              scrollProgress={scrollProgress}
              pointer={pointer}
              viewportTier={viewportTier}
              visible={immersiveVisible}
            />
            <div className="scene-vignette" aria-hidden="true" />
            <div className="scene-readout" aria-hidden="true">
              <span>ORBITAL WORKSPACE</span>
              <span>DE / GERMANY</span>
            </div>
            <div className="stage-dock" role="group" aria-label="AI workflow stages">
              {sceneStages.map((stage, index) => (
                <button
                  key={stage.id}
                  type="button"
                  className={activeStage === index ? `is-active accent-${stage.accent}` : ""}
                  aria-label={stage.label}
                  aria-pressed={activeStage === index}
                  onClick={() => selectStage(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          <div className="immersive-copy">
            <div className="hero-panel">
              <div className="hero-copy">
                <p className="eyebrow hero-eyebrow"><span className="live-dot" />{hero.eyebrow}</p>
                <h1 id="hero-heading">
                  <span>I build applied AI systems</span>
                  <span>that turn manual work into</span>
                  <span className="headline-accent">dependable software.</span>
                </h1>
                <p className="hero-summary">{hero.summary}</p>
                <div className="hero-actions">
                  <a className="button button-primary" href={hero.primaryAction.href}>{hero.primaryAction.label}<span aria-hidden="true">↓</span></a>
                  <a className="button button-quiet" href={hero.secondaryAction.href}>{hero.secondaryAction.label}<span aria-hidden="true">↗</span></a>
                </div>
              </div>
              <div className="hero-scroll-cue" aria-hidden="true">
                <span>SCROLL TO TRAVERSE</span>
                <i />
              </div>
            </div>

            <section id="impact" className="impact-story" aria-labelledby="impact-heading">
              <article className="impact-overview">
                <div className="impact-copy">
                  <p className="eyebrow">{impactCaseStudy.eyebrow}</p>
                  <h2 id="impact-heading">{impactCaseStudy.title}</h2>
                  <p>{impactCaseStudy.summary}</p>
                  <p className="confidentiality-note">{impactCaseStudy.confidentialityNote}</p>
                </div>
                <div className="metric-orbit" aria-label={impactCaseStudy.metric.label}>
                  <span className="metric-before"><small>BEFORE</small>{impactCaseStudy.metric.before}</span>
                  <span className="metric-line" aria-hidden="true"><i /></span>
                  <span className="metric-after"><small>AI-ASSISTED</small>{impactCaseStudy.metric.after}</span>
                </div>
              </article>

              <div className="stage-narrative" aria-label="How the workflow operates">
                {sceneStages.map((stage, index) => (
                  <article
                    key={stage.id}
                    ref={(node) => { stageRefs.current[index] = node; }}
                    data-stage-index={index}
                    className={`stage-panel accent-${stage.accent} ${activeStage === index ? "is-active" : ""}`}
                  >
                    <p className="stage-label"><span>{String(index + 1).padStart(2, "0")}</span>{stage.label}</p>
                    <h3>{stage.title}</h3>
                    <p>{stage.description}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section id="now" className="content-section now-section" aria-labelledby="now-heading">
          <div className="section-heading">
            <p className="eyebrow">Current engineering scope</p>
            <h2 id="now-heading">What I build now.</h2>
            <p>Production-oriented software at the point where models, backend systems, and operational workflows meet.</p>
          </div>
          <div className="scope-list">
            {currentScope.map((item) => (
              <article key={item.id} className={`scope-row accent-${item.accent}`}>
                <p>{item.label}</p>
                <h3>{item.title}</h3>
                <span>{item.description}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="content-section work-section" aria-labelledby="work-heading">
          <div className="section-heading section-heading-wide">
            <p className="eyebrow">Selected software work</p>
            <h2 id="work-heading">Current research and earlier proof.</h2>
            <p>The workflow above is the first case study. These two projects add an active research direction and a public interactive software example.</p>
          </div>
          <div className="project-list">
            {caseStudies.slice(1).map((study, index) => (
              <ProjectPanel key={study.id} study={study} index={index} />
            ))}
          </div>
        </section>

        <section id="experience" className="content-section experience-section" aria-labelledby="experience-heading">
          <div className="section-heading">
            <p className="eyebrow">Experience</p>
            <h2 id="experience-heading">Building where ambiguity meets delivery.</h2>
          </div>
          <div className="experience-list">
            {experienceEntries.map((entry, index) => (
              <article key={entry.id} className={entry.current ? "experience-row is-current" : "experience-row"}>
                <div className="experience-marker"><span>{String(index + 1).padStart(2, "0")}</span><i /></div>
                <div className="experience-title">
                  <p>{entry.current ? "CURRENT ROLE" : entry.period}</p>
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

        <section id="capabilities" className="content-section capability-section" aria-labelledby="capabilities-heading">
          <div className="section-heading">
            <p className="eyebrow">Capabilities</p>
            <h2 id="capabilities-heading">Systems, not isolated model calls.</h2>
          </div>
          <div className="capability-orbit">
            <div className="capability-center" aria-hidden="true"><CosmicFallback /></div>
            <div className="capability-list">
              {capabilityGroups.map((group, index) => (
                <article key={group.id} className={`capability-row accent-${group.accent}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{group.title}</h3>
                    <p>{group.description}</p>
                    <ul aria-label={`${group.title} skills`}>
                      {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="content-section about-section" aria-labelledby="about-heading">
          <div className="about-copy">
            <p className="eyebrow">{about.eyebrow}</p>
            <h2 id="about-heading">{about.title}</h2>
            {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <aside className="photography-note" aria-labelledby="photography-heading">
            <span className="constellation" aria-hidden="true"><i /><i /><i /><i /></span>
            <p className="eyebrow">Personal aperture</p>
            <h3 id="photography-heading">{about.photography.title}</h3>
            <p>{about.photography.body}</p>
          </aside>
        </section>

        <section id="contact" className="contact-section" aria-labelledby="contact-heading">
          <div className="contact-orbit" aria-hidden="true"><span /><span /><span /></div>
          <div className="contact-copy">
            <p className="eyebrow">{contact.eyebrow}</p>
            <h2 id="contact-heading">{contact.title}</h2>
            <p>{contact.body}</p>
            <div className="contact-links">
              {contact.links.map((link) => <ExternalLink key={link.href} link={link} className="contact-link" />)}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Dhruba Saha</p>
        <p>
          Astronaut: <a href={astronautCredit.source.href} target="_blank" rel="noreferrer">{astronautCredit.title}</a> by {astronautCredit.creator}, {astronautCredit.license}.
        </p>
        <a href="#home">Back to orbit ↑</a>
      </footer>
    </>
  );
}

export default App;
