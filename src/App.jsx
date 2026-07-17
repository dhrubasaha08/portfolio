import SceneBoundary from "./components/SceneBoundary";
import ChapterArtwork from "./components/ChapterArtwork";
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
import { useChapterMotion } from "./hooks/useChapterMotion";
import { portfolioVariant } from "./config/variant";

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

/**
 * @param {{
 *   study: import("./data/types.js").CaseStudy,
 *   chapterRef: (node: HTMLElement | null) => void
 * }} props
 */
function ProjectStory({ study, chapterRef }) {
  return (
    <section
      id={study.id}
      ref={chapterRef}
      data-chapter={study.id}
      className={`chapter project-story project-story-${study.id}`}
      aria-labelledby={`${study.id}-heading`}
    >
      <ChapterArtwork chapter={/** @type {import('./data/types.js').ChapterId} */ (study.id)} />
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
  const {
    activeChapter,
    motionRef,
    pointerRef,
    registerChapter,
    viewportTier,
    visible,
    motionRootRef,
  } = useChapterMotion();

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteNav items={navItems} />

      <div className="global-scene-layer" aria-hidden="true">
        <SceneBoundary
          activeChapter={activeChapter}
          presence={portfolioVariant.astronautPresence}
          motionRef={motionRef}
          pointerRef={pointerRef}
          viewportTier={viewportTier}
          visible={visible}
        />
      </div>

      <main
        id="main-content"
        ref={motionRootRef}
        tabIndex={-1}
        data-portfolio-variant={portfolioVariant.id}
        data-astronaut-presence={portfolioVariant.astronautPresence}
      >
        <section
          id="home"
          ref={registerChapter("home")}
          data-chapter="home"
          className="chapter hero"
          aria-labelledby="hero-heading"
        >
          <div className="hero-sticky">
            <ChapterArtwork chapter="home" />
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

        <section
          id="work"
          ref={registerChapter("work")}
          data-chapter="work"
          className="chapter impact"
          aria-labelledby="impact-heading"
        >
          <ChapterArtwork chapter="work" />
          <div className="impact-heading">
            <p className="plain-label">Current work</p>
            <h2 id="impact-heading">{impactCaseStudy.title}</h2>
          </div>
          <div className="impact-body">
            <p>{impactCaseStudy.opening}</p>
            <p>{impactCaseStudy.approach}</p>
          </div>
          <div className="impact-result" aria-label={impactCaseStudy.metric.label}>
            <span className="impact-before">{impactCaseStudy.metric.before}</span>
            <i aria-hidden="true">→</i>
            <span className="impact-after">{impactCaseStudy.metric.after}</span>
          </div>
          <div className="impact-footnotes">
            <p>{impactCaseStudy.outcome}</p>
            <p>{impactCaseStudy.confidentialityNote}</p>
          </div>
        </section>

        <section
          id="practice"
          ref={registerChapter("practice")}
          data-chapter="practice"
          className="chapter practice"
          aria-labelledby="practice-heading"
        >
          <ChapterArtwork chapter="practice" />
          <div className="practice-heading">
            <p className="plain-label">What I build now</p>
            <h2 id="practice-heading">Software for work that needs to hold together.</h2>
          </div>
          <div className="practice-statements">
            {practiceStatements.map((statement, index) => (
              <article
                key={statement.id}
                style={/** @type {import("react").CSSProperties} */ ({ "--statement-index": index })}
              >
                <h3>{statement.title}</h3>
                <p>{statement.body}</p>
              </article>
            ))}
          </div>
        </section>

        {caseStudies.map((study) => (
          <ProjectStory
            key={study.id}
            study={study}
            chapterRef={registerChapter(/** @type {import("./data/types.js").ChapterId} */ (study.id))}
          />
        ))}

        <section
          id="experience"
          ref={registerChapter("experience")}
          data-chapter="experience"
          className="chapter experience"
          aria-labelledby="experience-heading"
        >
          <ChapterArtwork chapter="experience" />
          <div className="experience-heading">
            <p className="plain-label">Experience</p>
            <h2 id="experience-heading">Learning the system, then making it better.</h2>
          </div>
          <div className="experience-list">
            {experienceEntries.map((entry, index) => (
              <article
                key={entry.id}
                data-experience-id={entry.id}
                style={/** @type {import("react").CSSProperties} */ ({ "--experience-index": index })}
              >
                <div className="experience-title">
                  <p>{entry.current ? entry.location : entry.period}</p>
                  <h3>{entry.role}{entry.current ? " · Current" : ""}</h3>
                  {entry.organization ? <span>{entry.organization}</span> : null}
                  {!entry.current ? <span>{entry.location}</span> : null}
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

        <section
          id="about"
          ref={registerChapter("about")}
          data-chapter="about"
          className="chapter about"
          aria-labelledby="about-heading"
        >
          <ChapterArtwork chapter="about" />
          <div className="about-copy">
            <p className="plain-label">About</p>
            <h2 id="about-heading">{about.title}</h2>
            {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <aside className="photography" aria-labelledby="photography-heading">
            <p className="plain-label">Photography</p>
            <h3 id="photography-heading">{about.photography.title}</h3>
            <p>{about.photography.body}</p>
          </aside>
        </section>

        <section
          id="contact"
          ref={registerChapter("contact")}
          data-chapter="contact"
          className="chapter contact"
          aria-labelledby="contact-heading"
        >
          <ChapterArtwork chapter="contact" />
          <div className="contact-copy">
            <p className="plain-label">Contact</p>
            <h2 id="contact-heading">Have a difficult workflow worth untangling?</h2>
            <p>Tell me what is slow, fragile, or still being held together by hand.</p>
            <div className="contact-links">
              {contactLinks.map((link) => <TextLink key={link.href} link={link} />)}
            </div>
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
