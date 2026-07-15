import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { PlaygroundWorld } from "./PlaygroundWorld";
import styles from "./scene.module.css";

/** @typedef {{x?: number, y?: number}} ScenePointer */

/**
 * Transparent, decorative WebGL layer. The original illustrated SVGs remain
 * underneath it, so delayed loading and renderer failure never leave a hole in
 * the composition.
 *
 * @param {{
 *   scrollProgress?: number,
 *   pointer?: ScenePointer,
 *   viewportTier?: 'mobile' | 'tablet' | 'desktop',
 *   visible?: boolean
 * }} props
 */
export function SpacePlaygroundScene({
  scrollProgress = 0,
  pointer = { x: 0, y: 0 },
  viewportTier = "desktop",
  visible = true,
}) {
  const rootRef = useRef(null);
  const scrollProgressRef = useRef(scrollProgress);
  const pointerRef = useRef(pointer);
  const animationEnabledRef = useRef(visible);
  const [ready, setReady] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    typeof document === "undefined" || document.visibilityState !== "hidden",
  );

  useEffect(() => {
    scrollProgressRef.current = Number.isFinite(scrollProgress)
      ? Math.max(0, Math.min(1, scrollProgress))
      : 0;
    pointerRef.current = pointer;
  }, [pointer, scrollProgress]);

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
    const handleVisibilityChange = () => {
      setIsDocumentVisible(document.visibilityState !== "hidden");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const shouldAnimate = visible && isIntersecting && isDocumentVisible;
  const maxDpr = viewportTier === "mobile" ? 1.25 : 1.5;

  useEffect(() => {
    animationEnabledRef.current = shouldAnimate;
  }, [shouldAnimate]);

  return (
    <div
      ref={rootRef}
      className={`${styles.scene} ${ready ? styles.ready : ""}`}
      aria-hidden="true"
      data-renderer="webgl"
    >
      <Canvas
        className={styles.canvas}
        aria-hidden="true"
        dpr={[1, maxDpr]}
        frameloop={shouldAnimate ? "always" : "never"}
        camera={{
          fov: viewportTier === "mobile" ? 52 : viewportTier === "tablet" ? 47 : 43,
          near: 0.1,
          far: 45,
          position: [0, 0.1, viewportTier === "mobile" ? 9.2 : 8.4],
        }}
        gl={{
          alpha: true,
          antialias: false,
          depth: true,
          stencil: false,
          powerPreference: "high-performance",
          premultipliedAlpha: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0A0D14", 0);
          setReady(true);
        }}
      >
        <PlaygroundWorld
          scrollProgressRef={scrollProgressRef}
          pointerRef={pointerRef}
          viewportTier={viewportTier}
          animationEnabledRef={animationEnabledRef}
        />
      </Canvas>
    </div>
  );
}

export default SpacePlaygroundScene;
