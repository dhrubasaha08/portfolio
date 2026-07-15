import styles from "./scene/fallback.module.css";

const layers = Object.freeze([
  { className: styles.stars, src: "/parallax/1Stars.svg" },
  { className: styles.planets, src: "/parallax/2Planets.svg" },
  { className: styles.sun, src: "/parallax/6Sun.svg" },
  { className: styles.farMountain, src: "/parallax/3Mountain.svg" },
  { className: styles.nearMountain, src: "/parallax/4Mountain.svg" },
  { className: styles.crater, src: "/parallax/5Crater.svg" },
]);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

/**
 * The original illustrated layers double as the no-WebGL poster and remain
 * visible below the transparent astronaut canvas during interactive use.
 *
 * @param {{
 *   scrollProgress?: number,
 *   pointer?: {x?: number, y?: number},
 *   motionAllowed?: boolean
 * }} props
 */
export default function CosmicFallback({
  scrollProgress = 0,
  pointer = { x: 0, y: 0 },
  motionAllowed = false,
}) {
  const progress = clamp(scrollProgress, 0, 1);
  const pointerX = clamp(pointer?.x, -1, 1);
  const pointerY = clamp(pointer?.y, -1, 1);
  const motion = motionAllowed ? 1 : 0;

  const style = /** @type {import("react").CSSProperties} */ ({
    "--stars-x": `${pointerX * 5 * motion}px`,
    "--stars-y": `${(-progress * 18 + pointerY * 3) * motion}px`,
    "--planets-x": `${pointerX * 9 * motion}px`,
    "--planets-y": `${(-progress * 28 + pointerY * 5) * motion}px`,
    "--sun-x": `${pointerX * 7 * motion}px`,
    "--sun-y": `${(-progress * 34 + pointerY * 4) * motion}px`,
    "--far-x": `${pointerX * 4 * motion}px`,
    "--far-y": `${progress * 11 * motion}px`,
    "--near-x": `${pointerX * 2 * motion}px`,
    "--near-y": `${progress * 21 * motion}px`,
    "--crater-x": `${pointerX * 1.2 * motion}px`,
    "--crater-y": `${progress * 30 * motion}px`,
  });

  return (
    <div
      className={styles.fallback}
      data-testid="cosmic-fallback"
      data-motion={motionAllowed ? "interactive" : "static"}
      style={style}
      aria-hidden="true"
    >
      <div className={styles.skywash} />
      {layers.map((layer) => (
        <img
          key={layer.src}
          className={`${styles.layer} ${layer.className}`}
          src={layer.src}
          alt=""
          draggable="false"
        />
      ))}
      <div className={styles.paperGrain} />
      <div className={styles.vignette} />
    </div>
  );
}
