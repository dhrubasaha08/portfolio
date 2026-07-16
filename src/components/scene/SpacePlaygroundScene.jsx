import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { PlaygroundWorld, RenderDriver } from "./PlaygroundWorld";
import { normalizeChapter } from "./chapterConfig";
import styles from "./scene.module.css";

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

/**
 * @template T
 * @typedef {{current: T}} MutableRef
 */

/**
 * One transparent WebGL layer persists across the entire document. Chapter
 * changes swap only the small procedural diorama inside this same context.
 *
 * @param {{
 *   activeChapter?: string,
 *   motionRef: MutableRef<ChapterMotionState>,
 *   pointerRef: MutableRef<ScenePointer>,
 *   viewportTier?: 'mobile' | 'tablet' | 'desktop',
 *   visible?: boolean
 * }} props
 */
export function SpacePlaygroundScene({
  activeChapter = "home",
  motionRef,
  pointerRef,
  viewportTier = "desktop",
  visible = true,
}) {
  const rootRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const animationEnabledRef = useRef(visible);
  const [ready, setReady] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    typeof document === "undefined" || document.visibilityState !== "hidden",
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(document.visibilityState !== "hidden");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const shouldAnimate = visible && isDocumentVisible;
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
      data-diorama={normalizeChapter(activeChapter)}
    >
      <Canvas
        className={styles.canvas}
        aria-hidden="true"
        dpr={[1, maxDpr]}
        frameloop="demand"
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
        onCreated={({ gl, invalidate }) => {
          gl.setClearColor("#0A0D14", 0);
          setReady(true);
          invalidate();
        }}
      >
        <RenderDriver
          enabled={shouldAnimate}
          viewportTier={viewportTier}
          motionRef={motionRef}
          pointerRef={pointerRef}
        />
        <PlaygroundWorld
          activeChapter={activeChapter}
          motionRef={motionRef}
          pointerRef={pointerRef}
          viewportTier={viewportTier}
          animationEnabledRef={animationEnabledRef}
        />
      </Canvas>
    </div>
  );
}

export default SpacePlaygroundScene;
