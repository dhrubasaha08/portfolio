import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import CosmicFallback from "./CosmicFallback";
import styles from "./scene/boundary.module.css";

const LazySpacePlaygroundScene = lazy(() => import("./scene/SpacePlaygroundScene"));

function canUseWebGl2() {
  if (typeof document === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }));
  } catch {
    return false;
  }
}

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
 * Progressive wrapper for the decorative space scene. The public scene API is
 * intentionally limited to page progress, pointer position, viewport tier,
 * and visibility; motion and rendering capability are resolved internally.
 *
 * @param {{
 *   scrollProgress?: number,
 *   pointer?: {x?: number, y?: number},
 *   viewportTier?: 'mobile' | 'tablet' | 'desktop',
 *   visible?: boolean
 * }} props
 */
export default function SceneBoundary({
  scrollProgress = 0,
  pointer = { x: 0, y: 0 },
  viewportTier = "desktop",
  visible = true,
}) {
  const rootRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const [mode, setMode] = useState("static");
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

    if (viewportTier !== "mobile") {
      const activate = () => setActivated(true);
      const idleId = window.requestIdleCallback?.(activate, { timeout: 700 });
      const timerId = idleId == null ? window.setTimeout(activate, 450) : undefined;

      return () => {
        if (idleId != null) window.cancelIdleCallback?.(idleId);
        if (timerId != null) window.clearTimeout(timerId);
      };
    }

    const activate = () => setActivated(true);
    window.addEventListener("touchstart", activate, { once: true, passive: true });
    window.addEventListener("wheel", activate, { once: true, passive: true });
    window.addEventListener("keydown", activate, { once: true });

    return () => {
      window.removeEventListener("touchstart", activate);
      window.removeEventListener("wheel", activate);
      window.removeEventListener("keydown", activate);
    };
  }, [mode, viewportTier]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const handleContextLoss = () => setFailed(true);
    root.addEventListener("playgroundscenelost", handleContextLoss);
    return () => root.removeEventListener("playgroundscenelost", handleContextLoss);
  }, []);

  const interactive = mode === "interactive" && activated && !failed;
  const renderedMode = failed ? "failed" : mode === "interactive" && !activated ? "deferred" : mode;

  return (
    <div ref={rootRef} className={styles.boundary} data-scene-mode={renderedMode}>
      <CosmicFallback
        scrollProgress={scrollProgress}
        pointer={pointer}
        motionAllowed={interactive}
      />
      {interactive ? (
        <SceneErrorBoundary onFailure={() => setFailed(true)}>
          <Suspense fallback={null}>
            <LazySpacePlaygroundScene
              scrollProgress={scrollProgress}
              pointer={pointer}
              viewportTier={viewportTier}
              visible={visible}
            />
          </Suspense>
        </SceneErrorBoundary>
      ) : null}
    </div>
  );
}
