import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import styles from "./scene/boundary.module.css";

const LazyAstronautScene = lazy(() => import("./scene/SpacePlaygroundScene"));

/** @typedef {import('../data/types.js').MotionMode} MotionMode */
/** @typedef {import('../data/types.js').ChapterMotionState} ChapterMotionState */
/** @typedef {import('../data/types.js').ArtworkPointer} ArtworkPointer */
/** @typedef {import('../data/types.js').AstronautPresence} AstronautPresence */
/** @template T @typedef {{current: T}} MutableRef */

function canUseWebGl2() {
  if (typeof document === "undefined") return false;
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true }));
  } catch {
    return false;
  }
}

/** @returns {MotionMode} */
function getSceneMode() {
  if (typeof window === "undefined") return "static";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";
  const connection = /** @type {Navigator & {connection?: {saveData?: boolean}}} */ (navigator).connection;
  if (connection?.saveData) return "save-data";
  return canUseWebGl2() ? "interactive" : "unsupported";
}

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Lazy progressive boundary for the attributed astronaut. Every chapter's
 * complete illustration lives in semantic section-adjacent DOM, so the site
 * never depends on WebGL for meaning or visual continuity.
 *
 * @param {{
 *   activeChapter?: string,
 *   presence?: AstronautPresence,
 *   motionRef: MutableRef<ChapterMotionState>,
 *   pointerRef: MutableRef<ArtworkPointer>,
 *   viewportTier?: 'mobile' | 'tablet' | 'desktop',
 *   visible?: boolean
 * }} props
 */
export default function SceneBoundary({
  activeChapter = "home",
  presence = "journey",
  motionRef,
  pointerRef,
  viewportTier = "desktop",
  visible = true,
}) {
  const rootRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const [mode, setMode] = useState(/** @type {MotionMode} */ ("static"));
  const [activated, setActivated] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMode = () => {
      setMode(getSceneMode());
      setActivated(false);
      setFailed(false);
    };
    updateMode();
    media.addEventListener?.("change", updateMode);
    return () => media.removeEventListener?.("change", updateMode);
  }, []);

  useEffect(() => {
    if (mode !== "interactive") return undefined;
    const activate = () => setActivated(true);
    window.addEventListener("pointermove", activate, { once: true, passive: true });
    window.addEventListener("pointerdown", activate, { once: true, passive: true });
    window.addEventListener("touchstart", activate, { once: true, passive: true });
    window.addEventListener("wheel", activate, { once: true, passive: true });
    window.addEventListener("scroll", activate, { once: true, passive: true });
    window.addEventListener("keydown", activate, { once: true });
    return () => {
      window.removeEventListener("pointermove", activate);
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("touchstart", activate);
      window.removeEventListener("wheel", activate);
      window.removeEventListener("scroll", activate);
      window.removeEventListener("keydown", activate);
    };
  }, [mode]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const handleContextLoss = () => setFailed(true);
    root.addEventListener("playgroundscenelost", handleContextLoss);
    return () => root.removeEventListener("playgroundscenelost", handleContextLoss);
  }, []);

  const heroOnlyOutsideHero = presence === "hero" && activeChapter !== "home";
  const interactive = mode === "interactive" && activated && !failed && !heroOnlyOutsideHero;
  const renderedMode = /** @type {MotionMode} */ (
    failed ? "failed" : mode === "interactive" && !activated ? "deferred" : mode
  );

  return (
    <div
      ref={rootRef}
      className={styles.boundary}
      data-scene-mode={renderedMode}
      data-scene-subject="astronaut-only"
      data-astronaut-presence={presence}
      data-scene-chapter={activeChapter}
      aria-hidden="true"
    >
      {interactive ? (
        <SceneErrorBoundary onFailure={() => setFailed(true)}>
          <Suspense fallback={null}>
            <LazyAstronautScene
              activeChapter={activeChapter}
              presence={presence}
              motionRef={motionRef}
              pointerRef={pointerRef}
              viewportTier={viewportTier}
              visible={visible}
            />
          </Suspense>
        </SceneErrorBoundary>
      ) : null}
    </div>
  );
}
