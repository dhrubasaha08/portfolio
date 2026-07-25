import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { useEffect, useRef } from "react";
import { AstronautWorld } from "./AstronautWorld.jsx";

/** @typedef {"mobile" | "tablet" | "desktop"} ViewportTier */

/**
 * @template T
 * @typedef {{current: T}} MutableRef
 */

/**
 * @param {{
 *   motionRef: MutableRef<import("../../hooks/useSpaceJourney.js").SpaceJourneyMotion>,
 *   pointerRef: MutableRef<import("../../hooks/useSpaceJourney.js").JourneyPointer>,
 *   activeSection: string,
 *   viewportTier: ViewportTier,
 *   visible: boolean,
 *   onReady: () => void,
 *   onContextLost: () => void
 * }} props
 */
export default function AstronautCanvas({
  motionRef,
  pointerRef,
  activeSection,
  viewportTier,
  visible,
  onReady,
  onContextLost,
}) {
  const animationEnabledRef = useRef(visible);

  useEffect(() => {
    animationEnabledRef.current = visible;
  }, [visible]);

  const maxDpr = viewportTier === "mobile" ? 1.25 : 1.5;

  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, maxDpr]}
      frameloop={visible ? "always" : "demand"}
      camera={{
        fov: viewportTier === "mobile" ? 52 : viewportTier === "tablet" ? 47 : 43,
        near: 0.1,
        far: 30,
        position: [0, 0.1, viewportTier === "mobile" ? 9.4 : 8.4],
      }}
      gl={{
        alpha: true,
        antialias: viewportTier !== "mobile",
        depth: true,
        stencil: false,
        powerPreference: "high-performance",
        premultipliedAlpha: true,
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = SRGBColorSpace;
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.88;
        gl.setClearColor("#010717", 0);
      }}
    >
      <AstronautWorld
        motionRef={motionRef}
        pointerRef={pointerRef}
        activeSection={activeSection}
        viewportTier={viewportTier}
        animationEnabledRef={animationEnabledRef}
        onReady={onReady}
        onContextLost={onContextLost}
      />
    </Canvas>
  );
}
