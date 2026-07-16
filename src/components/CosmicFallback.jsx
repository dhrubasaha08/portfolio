import { normalizeChapter } from "./scene/chapterConfig";
import styles from "./scene/fallback.module.css";

const heroLayers = Object.freeze([
  { className: styles.stars, src: "/parallax/1Stars.svg" },
  { className: styles.planets, src: "/parallax/2Planets.svg" },
  { className: styles.sun, src: "/parallax/6Sun.svg" },
  { className: styles.farMountain, src: "/parallax/3Mountain.svg" },
  { className: styles.nearMountain, src: "/parallax/4Mountain.svg" },
  { className: styles.crater, src: "/parallax/5Crater.svg" },
]);

function WorkSilhouette() {
  return (
    <div className={`${styles.silhouette} ${styles.work}`}>
      <span className={styles.paperOne} />
      <span className={styles.paperTwo} />
      <span className={styles.clock} />
      <span className={styles.seal} />
    </div>
  );
}
function PracticeSilhouette() {
  return (
    <div className={`${styles.silhouette} ${styles.practice}`}>
      <span className={styles.pipe} />
      <span className={styles.wheel} />
      <span className={styles.toolbox} />
      <span className={styles.prism} />
    </div>
  );
}

function KyberSilhouette() {
  return (
    <div className={`${styles.silhouette} ${styles.kyber}`}>
      <span className={styles.frameOne} />
      <span className={styles.monolith} />
      <span className={styles.frameTwo} />
    </div>
  );
}

function TremorSilhouette() {
  return (
    <div className={`${styles.silhouette} ${styles.tremor}`}>
      <span className={styles.moon} />
      <span className={styles.orbit} />
      <span className={styles.marker} />
    </div>
  );
}

function ExperienceSilhouette() {
  return (
    <div className={`${styles.silhouette} ${styles.experience}`}>
      <span className={styles.pylonOne} />
      <span className={styles.route} />
      <span className={styles.pylonTwo} />
    </div>
  );
}

function AboutSilhouette() {
  return (
    <div className={`${styles.silhouette} ${styles.about}`}>
      <span className={styles.camera} />
      <span className={styles.lens} />
      <span className={styles.shutter} />
    </div>
  );
}

function ContactSilhouette() {
  return (
    <div className={`${styles.silhouette} ${styles.contact}`}>
      <span className={styles.plane} />
      <span className={styles.beacon} />
      <span className={styles.signal} />
    </div>
  );
}

const silhouettes = {
  impact: WorkSilhouette,
  practice: PracticeSilhouette,
  kyber: KyberSilhouette,
  tremor: TremorSilhouette,
  experience: ExperienceSilhouette,
  about: AboutSilhouette,
  contact: ContactSilhouette,
};

/**
 * The illustrated hero and chapter silhouettes are the complete no-WebGL
 * poster. They also remain faintly underneath the transparent canvas so async
 * loading and context loss never create an empty viewport.
 *
 * @param {{
 *   activeChapter?: string,
 *   motionAllowed?: boolean,
 *   motionRef?: {current: unknown},
 *   pointerRef?: {current: unknown}
 * }} props
 */
export default function CosmicFallback({ activeChapter = "home", motionAllowed = false }) {
  const chapter = normalizeChapter(activeChapter);
  const Silhouette = silhouettes[chapter];

  return (
    <div
      className={styles.fallback}
      data-testid="cosmic-fallback"
      data-motion={motionAllowed ? "interactive" : "static"}
      data-fallback-chapter={chapter}
      aria-hidden="true"
    >
      <div className={styles.skywash} />
      {chapter === "hero"
        ? heroLayers.map((layer) => (
            <img
              key={layer.src}
              className={`${styles.layer} ${layer.className}`}
              src={layer.src}
              alt=""
              draggable="false"
            />
          ))
        : Silhouette
          ? <Silhouette />
          : null}
      <div className={styles.paperGrain} />
      <div className={styles.vignette} />
    </div>
  );
}
