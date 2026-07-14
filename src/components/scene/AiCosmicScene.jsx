import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { CosmicWorld } from "./CosmicWorld";
import { resolveStageIndex } from "./sceneData";
import styles from "./scene.module.css";

/**
 * @typedef {{x?: number, y?: number}} ScenePointer
 *
 * @typedef {object} AiCosmicSceneProps
 * @property {string | number} [activeStage]
 * @property {number} [scrollProgress]
 * @property {ScenePointer} [pointer]
 * @property {'mobile' | 'tablet' | 'desktop'} [viewportTier]
 * @property {boolean} [motionAllowed]
 * @property {boolean} [visible]
 * @property {number | [number, number]} [dpr]
 * @property {() => void} [onReady]
 * @property {() => void} [onContextLost]
 * @property {string} [className]
 */

/**
 * Decorative WebGL layer for the opening narrative. All readable content and
 * stage controls intentionally live in the caller's semantic DOM.
 *
 * @param {AiCosmicSceneProps} props
 */
export function AiCosmicScene({
  activeStage = "orchestrate",
  scrollProgress = 0,
  pointer = { x: 0, y: 0 },
  viewportTier = "desktop",
  motionAllowed = true,
  visible = true,
  dpr,
  onReady,
  onContextLost,
  className = "",
}) {
  const rootRef = useRef(null);
  const scrollProgressRef = useRef(scrollProgress);
  const pointerRef = useRef(pointer);
  const onReadyRef = useRef(onReady);
  const onContextLostRef = useRef(onContextLost);
  const animationEnabledRef = useRef(motionAllowed && visible);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    typeof document === "undefined" || document.visibilityState !== "hidden",
  );
  const activeIndex = resolveStageIndex(activeStage);

  useEffect(() => {
    scrollProgressRef.current = Number.isFinite(scrollProgress)
      ? Math.max(0, Math.min(1, scrollProgress))
      : 0;
    pointerRef.current = pointer;
  }, [pointer, scrollProgress]);

  useEffect(() => {
    onReadyRef.current = onReady;
    onContextLostRef.current = onContextLost;
  }, [onContextLost, onReady]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { rootMargin: "12%", threshold: 0.01 },
    );
    observer.observe(root);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const handleVisibilityChange = () => {
      setIsDocumentVisible(document.visibilityState !== "hidden");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const shouldAnimate = motionAllowed && visible && isIntersecting && isDocumentVisible;

  useEffect(() => {
    animationEnabledRef.current = shouldAnimate;
  }, [shouldAnimate]);

  const maxDpr = viewportTier === "mobile" ? 1.25 : 1.5;
  const rootClassName = `${styles.scene} ${className}`.trim();

  return (
    <div
      ref={rootRef}
      className={rootClassName}
      aria-hidden="true"
      data-renderer="webgl"
      data-scene-active-stage={String(activeStage)}
    >
      <Canvas
        className={styles.canvas}
        aria-hidden="true"
        dpr={dpr ?? [1, maxDpr]}
        frameloop={shouldAnimate ? "always" : "demand"}
        camera={{
          fov: viewportTier === "mobile" ? 55 : 48,
          near: 0.1,
          far: 60,
          position: [0, 0.25, viewportTier === "mobile" ? 15.4 : 12.2],
        }}
        gl={{
          alpha: false,
          antialias: false,
          depth: true,
          stencil: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#030712", 1);
        }}
      >
        <CosmicWorld
          activeIndex={activeIndex}
          scrollProgressRef={scrollProgressRef}
          pointerRef={pointerRef}
          viewportTier={viewportTier}
          animationEnabledRef={animationEnabledRef}
          onReadyRef={onReadyRef}
          onContextLostRef={onContextLostRef}
        />
      </Canvas>
    </div>
  );
}

export default AiCosmicScene;
