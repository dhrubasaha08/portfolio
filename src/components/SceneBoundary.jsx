import { Component, lazy, Suspense, useEffect, useMemo, useState } from "react";
import CosmicFallback from "./CosmicFallback";

const LazyAiCosmicScene = lazy(() => import("./scene/AiCosmicScene"));

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
  if (navigator.connection?.saveData) return "save-data";
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

export default function SceneBoundary({ activeStage, scrollProgress, pointer, viewportTier, visible }) {
  const [mode, setMode] = useState("static");
  const [activated, setActivated] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMode = () => {
      setMode(getSceneMode());
      setActivated(false);
      setReady(false);
      setFailed(false);
    };

    updateMode();
    media.addEventListener?.("change", updateMode);
    return () => media.removeEventListener?.("change", updateMode);
  }, []);

  useEffect(() => {
    if (mode !== "interactive") return undefined;

    if (window.innerWidth >= 768) {
      const timer = window.setTimeout(() => setActivated(true), 500);
      return () => window.clearTimeout(timer);
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
  }, [mode]);

  const motionAllowed = mode === "interactive" && activated && !failed;
  const dpr = useMemo(
    () => /** @type {[number, number]} */ (viewportTier === "mobile" ? [1, 1.25] : [1, 1.5]),
    [viewportTier],
  );

  return (
    <div
      className={`scene-boundary ${ready ? "is-ready" : ""}`}
      data-scene-mode={failed ? "failed" : mode === "interactive" && !activated ? "deferred" : mode}
    >
      <CosmicFallback />
      {motionAllowed ? (
        <div className="scene-canvas" aria-hidden="true">
          <SceneErrorBoundary onFailure={() => setFailed(true)}>
            <Suspense fallback={null}>
              <LazyAiCosmicScene
                activeStage={activeStage}
                scrollProgress={scrollProgress}
                pointer={pointer}
                viewportTier={viewportTier}
                motionAllowed={motionAllowed}
                visible={visible}
                dpr={dpr}
                onReady={() => setReady(true)}
                onContextLost={() => setFailed(true)}
              />
            </Suspense>
          </SceneErrorBoundary>
        </div>
      ) : null}
    </div>
  );
}
