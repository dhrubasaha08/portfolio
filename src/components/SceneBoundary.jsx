import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import CosmicFallback from "./CosmicFallback";
import { normalizeChapter } from "./scene/chapterConfig";
import styles from "./scene/boundary.module.css";

const LazySpacePlaygroundScene = lazy(() => import("./scene/SpacePlaygroundScene"));

/** @typedef {'static' | 'interactive' | 'reduced' | 'save-data' | 'unsupported' | 'failed' | 'deferred'} MotionMode */
/** @typedef {{x?: number, y?: number, impulse?: number}} ScenePointer */
/**
 * @typedef {{
 *   activeChapter?: string,
 *   previousChapter?: string | null,
 *   progress?: number,
 *   enter?: number,
 *   exit?: number,
 *   transitionProgress?: number,
 *   globalProgress?: number
 * }} ChapterMotionState
 */
/** @template T @typedef {{current: T}} MutableRef */

function canUseWebGl2() {
  if (typeof document === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }));
  } catch {
    return false;
  }
}

/** @returns {MotionMode} */
function getSceneMode() {
  if (typeof window === "undefined") return "static";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";
  const connection = /** @type {Navigator & {connection?: {saveData?: boolean}}} */ (navigator)
    .connection;
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
    if (this.state.failed) return null;
    return this.props.children;
  }
}

/**
 * Progressive wrapper for the one decorative, fixed scene. The DOM owns all
 * meaning and controls; this layer receives only chapter motion refs and never
 * intercepts pointer or touch input.
 *
 * Legacy scrollProgress/pointer values remain accepted so a delayed parent
 * integration still degrades to the hero poster instead of breaking.
 *
 * @param {{
 *   activeChapter?: string,
 *   motionRef?: MutableRef<ChapterMotionState>,
 *   pointerRef?: MutableRef<ScenePointer>,
 *   viewportTier?: 'mobile' | 'tablet' | 'desktop',
 *   visible?: boolean,
 *   scrollProgress?: number,
 *   pointer?: ScenePointer
 * }} props
 */
export default function SceneBoundary({
  activeChapter = "home",
  motionRef = {
    current: {
      activeChapter: "home",
      previousChapter: null,
      progress: 0,
      enter: 0,
      exit: 0,
      transitionProgress: 1,
      globalProgress: 0,
    },
  },
  pointerRef = { current: { x: 0, y: 0, impulse: 0 } },
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

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let frame = 0;
    let previousValue = "";
    const syncCameoState = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, Number(motionRef.current.progress) || 0));
      const home = normalizeChapter(activeChapter) === "hero";
      const cameo = home || progress < 0.28 || progress > 0.72;
      const nextValue = cameo ? "true" : "false";
      if (nextValue !== previousValue) {
        root.dataset.astronautCameo = nextValue;
        previousValue = nextValue;
      }
    };

    const scheduleSync = () => {
      if (frame) return;
      frame = requestAnimationFrame(syncCameoState);
    };

    scheduleSync();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
    };
  }, [activeChapter, motionRef]);

  const interactive = mode === "interactive" && activated && !failed;
  const renderedMode = /** @type {MotionMode} */ (
    failed ? "failed" : mode === "interactive" && !activated ? "deferred" : mode
  );
  const normalized = normalizeChapter(activeChapter);
  const initialCameo = normalized === "hero";

  return (
    <div
      ref={rootRef}
      className={styles.boundary}
      data-scene-mode={renderedMode}
      data-scene-chapter={activeChapter}
      data-diorama={normalized}
      data-astronaut-cameo={initialCameo ? "true" : "false"}
      aria-hidden="true"
    >
      <CosmicFallback
        activeChapter={activeChapter}
        motionAllowed={interactive}
      />
      {interactive ? (
        <SceneErrorBoundary onFailure={() => setFailed(true)}>
          <Suspense fallback={null}>
            <LazySpacePlaygroundScene
              activeChapter={activeChapter}
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
