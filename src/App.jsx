import {
  ExternalLink,
  Header,
  ObservatoryGraphic,
  ProjectVisual,
  SectionHeading,
} from "./components";
import { portfolio } from "./data/portfolio";

const App = () => {
  const {
    site,
    nav,
    impact,
    projects,
    experience,
    capabilities,
    supportingOss,
    about,
    contact,
  } = portfolio;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <Header site={site} nav={nav} />

      <main id="main-content" tabIndex={-1}>
        <section className="hero section-shell" id="top" aria-labelledby="hero-title">
          <div className="hero__copy">
            <p className="eyebrow">{site.eyebrow}</p>
            <h1 id="hero-title">{site.headline}</h1>
            <p className="hero__summary">{site.summary}</p>

            <div className="hero__actions" aria-label="Primary links">
              <a className="button button--primary" href="#work">
                Explore selected work
              </a>
              <ExternalLink className="button button--secondary" href={site.github} label="GitHub profile" />
            </div>

            <dl className="hero__facts" aria-label="Professional overview">
              <div>
                <dt>Based in</dt>
                <dd>{site.location}</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>AI systems · automation</dd>
              </div>
              <div>
                <dt>Foundation</dt>
                <dd>Open source · embedded</dd>
              </div>
            </dl>
          </div>

          <ObservatoryGraphic />
        </section>

        <section className="section section--impact" id="impact" aria-labelledby="impact-title">
          <div className="section-shell">
            <SectionHeading eyebrow={impact.eyebrow} title={impact.title} id="impact-title" description={impact.summary} />

            <div className="impact-grid">
              <article className="impact-metric" aria-label={impact.metric.label}>
                <p className="impact-metric__label">Measured workflow result</p>
                <div className="impact-metric__values">
                  <span>{impact.metric.before}</span>
                  <span className="impact-metric__arrow" aria-hidden="true">→</span>
                  <strong>{impact.metric.after}</strong>
                </div>
                <p>{impact.metric.label}</p>
              </article>

              <article className="impact-system">
                <p className="panel-label">System path</p>
                <ol className="system-path">
                  {impact.system.map((step, index) => (
                    <li key={step}>
                      <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </article>

              <article className="impact-outcome">
                <p className="panel-label">Engineering outcome</p>
                <p>{impact.outcome}</p>
                <p className="impact-note">{impact.note}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="work" aria-labelledby="work-title">
          <div className="section-shell">
            <SectionHeading
              eyebrow="Public work"
              title="Evidence over spectacle."
              id="work-title"
              description="Selected systems with clear status, public evidence, and honest boundaries around team and private work."
            />

            <div className="project-list">
              {projects.map((project, index) => (
                <article className="project" key={project.id} data-visibility={project.visibility}>
                  <div className="project__visual-column">
                    <p className="project__index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</p>
                    <ProjectVisual type={project.visual} />
                  </div>

                  <div className="project__content">
                    <div className="project__meta">
                      <span>{project.eyebrow}</span>
                      <span className="status-badge">{project.status}</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p className="project__summary">{project.summary}</p>

                    <ul className="project__details">
                      {project.details.map((detail) => <li key={detail}>{detail}</li>)}
                    </ul>

                    <ul className="tag-list" aria-label={`${project.title} technologies`}>
                      {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                    </ul>

                    {project.links.length > 0 ? (
                      <div className="project__links" aria-label={`${project.title} evidence links`}>
                        {project.links.map((link) => (
                          <ExternalLink key={link.href} href={link.href} label={link.label} />
                        ))}
                      </div>
                    ) : (
                      <p className="project__private-note">Research thesis only; implementation remains private.</p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <aside className="oss-rail" aria-labelledby="more-oss-title">
              <div>
                <p className="eyebrow">Supporting open source</p>
                <h3 id="more-oss-title">Smaller libraries, accurately labeled.</h3>
              </div>
              <div className="oss-rail__items">
                {supportingOss.map((project) => (
                  <article key={project.name}>
                    <div>
                      <h4>{project.name}</h4>
                      <span>{project.status}</span>
                    </div>
                    <p>{project.description}</p>
                    <ExternalLink href={project.href} label="Repository" />
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="section section--tinted" id="experience" aria-labelledby="experience-title">
          <div className="section-shell">
            <SectionHeading
              eyebrow="Experience"
              title="A systems path, from sensors to semantics."
              id="experience-title"
              description="The surface area changed; the habit of translating ambiguous problems into working systems did not."
            />

            <ol className="timeline">
              {experience.map((item) => (
                <li key={`${item.period}-${item.role}`}>
                  <div className="timeline__marker" aria-hidden="true" />
                  <p className="timeline__period">{item.period}</p>
                  <article>
                    <p className="timeline__organization">{item.organization}</p>
                    <h3>{item.role}</h3>
                    <p>{item.summary}</p>
                    {item.highlights.length > 0 && (
                      <ul>
                        {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                      </ul>
                    )}
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section" id="capabilities" aria-labelledby="capabilities-title">
          <div className="section-shell">
            <SectionHeading
              eyebrow="Capabilities"
              title="Grouped by application, not badge count."
              id="capabilities-title"
              description="Tools matter when they help a system become clearer, more reliable, or easier to operate."
            />

            <div className="capability-grid">
              {capabilities.map((capability, index) => (
                <article key={capability.title}>
                  <span className="capability-grid__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                  <ul>
                    {capability.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--about" id="about" aria-labelledby="about-title">
          <div className="section-shell about-grid">
            <div>
              <SectionHeading eyebrow={about.eyebrow} title={about.title} id="about-title" />
              <div className="about-copy">
                {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>

            <aside className="photography-card" aria-labelledby="photography-title">
              <div className="photography-card__viewfinder" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <div className="photography-card__moon" />
              </div>
              <p className="panel-label">Outside software</p>
              <h3 id="photography-title">Wildlife, nature, and astrophotography</h3>
              <p>{about.photography.body}</p>
            </aside>
          </div>
        </section>

        <section className="section section--contact" id="contact" aria-labelledby="contact-title">
          <div className="section-shell contact-panel">
            <div>
              <p className="eyebrow">{contact.eyebrow}</p>
              <h2 id="contact-title">{contact.title}</h2>
              <p>{contact.body}</p>
            </div>
            <div className="contact-panel__actions">
              <a className="button button--primary" href={`mailto:${contact.email}`}>Email Dhruba</a>
              <ExternalLink className="button button--secondary" href={contact.github} label="View GitHub" />
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="section-shell footer-inner">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <p>Designed as a lightweight systems observatory.</p>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
};

export default App;
