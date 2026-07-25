import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./astronaut-scene.module.css";

const LazyAstronautCanvas = lazy(() => import("./scene/AstronautCanvas.jsx"));

/** @typedef {"mobile" | "tablet" | "desktop"} ViewportTier */
/** @typedef {"static" | "interactive" | "reduced" | "save-data" | "unsupported" | "context-lost" | "error"} SceneMode */

/**
 * @template T
 * @typedef {{current: T}} MutableRef
 */

/**
 * @typedef {object} AstronautSceneProps
 * @property {MutableRef<import("../hooks/useSpaceJourney.js").SpaceJourneyMotion>} motionRef
 * @property {MutableRef<import("../hooks/useSpaceJourney.js").JourneyPointer>} pointerRef
 * @property {string} activeSection
 * @property {ViewportTier} viewportTier
 * @property {boolean} visible
 */

/**
 * @typedef {object} SceneErrorBoundaryProps
 * @property {import("react").ReactNode} children
 * @property {() => void} onFailure
 */

/** @returns {boolean} */
function supportsWebGl() {
  if (typeof document === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    return Boolean(context);
  } catch {
    return false;
  }
}

/** @returns {SceneMode} */
function readSceneMode() {
  if (typeof window === "undefined") return "static";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";

  const connection =
    /** @type {Navigator & {connection?: {saveData?: boolean}}} */ (navigator).connection;
  if (connection?.saveData) return "save-data";
  return supportsWebGl() ? "interactive" : "unsupported";
}

class SceneErrorBoundary extends Component {
  /** @param {SceneErrorBoundaryProps} props */
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
 * A single lazy, decorative WebGL layer. Static SVG scenery remains owned by
 * the page, so opting out of WebGL never removes readable content or artwork.
 *
 * @param {AstronautSceneProps} props
 */
export default function AstronautScene({
  motionRef,
  pointerRef,
  activeSection,
  viewportTier,
  visible,
}) {
  const [mode, setMode] = useState(/** @type {SceneMode} */ ("static"));
  const [activated, setActivated] = useState(false);
  const [ready, setReady] = useState(false);
  const sceneRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection =
      /** @type {Navigator & {connection?: EventTarget & {saveData?: boolean}}} */ (navigator)
        .connection;
    const updateMode = () => {
      setMode(readSceneMode());
      setActivated(false);
      setReady(false);
    };

    updateMode();
    reducedMotion.addEventListener?.("change", updateMode);
    connection?.addEventListener?.("change", updateMode);

    return () => {
      reducedMotion.removeEventListener?.("change", updateMode);
      connection?.removeEventListener?.("change", updateMode);
    };
  }, []);

  useEffect(() => {
    if (mode !== "interactive" || !visible) return undefined;

    const activate = () => setActivated(true);
    const passiveOnce = /** @type {AddEventListenerOptions} */ ({
      once: true,
      passive: true,
    });

    window.addEventListener("pointermove", activate, passiveOnce);
    window.addEventListener("scroll", activate, passiveOnce);
    window.addEventListener("touchstart", activate, passiveOnce);
    window.addEventListener("keydown", activate, { once: true });

    if (window.scrollY > 16) activate();

    return () => {
      window.removeEventListener("pointermove", activate);
      window.removeEventListener("scroll", activate);
      window.removeEventListener("touchstart", activate);
      window.removeEventListener("keydown", activate);
    };
  }, [mode, visible]);

  const renderedMode =
    mode === "interactive" && !activated ? "static" : mode;
  const shouldRenderCanvas = mode === "interactive" && activated;

  useEffect(() => {
    const shell = sceneRef.current?.closest(".site-shell");
    if (!(shell instanceof HTMLElement)) return undefined;
    shell.dataset.sceneMode = renderedMode;

    return () => {
      if (shell.dataset.sceneMode === renderedMode) {
        delete shell.dataset.sceneMode;
      }
    };
  }, [renderedMode]);

  const handleReady = useCallback(() => {
    setReady(true);
  }, []);
  const handleFailure = useCallback(() => {
    setReady(false);
    setActivated(false);
    setMode("error");
  }, []);
  const handleContextLoss = useCallback(() => {
    setReady(false);
    setActivated(false);
    setMode("context-lost");
  }, []);

  return (
    <div
      ref={sceneRef}
      className={`${styles.scene} astronaut-scene`}
      aria-hidden="true"
      data-active-section={activeSection}
      data-ready={ready ? "true" : "false"}
      data-scene-mode={renderedMode}
    >
      <div className={styles.staticFallback} data-scene-fallback="" />
      {shouldRenderCanvas ? (
        <div className={styles.canvasMount}>
          <SceneErrorBoundary onFailure={handleFailure}>
            <Suspense fallback={null}>
              <LazyAstronautCanvas
                motionRef={motionRef}
                pointerRef={pointerRef}
                activeSection={activeSection}
                viewportTier={viewportTier}
                visible={visible}
                onReady={handleReady}
                onContextLost={handleContextLoss}
              />
            </Suspense>
          </SceneErrorBoundary>
        </div>
      ) : null}
    </div>
  );
}
