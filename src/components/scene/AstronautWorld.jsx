import {
  AnimationMixer,
  Box3,
  MathUtils,
  Vector3,
} from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useEffect, useMemo, useRef, useState } from "react";
import astronautUrl from "../../assets/3d/spaceman.glb?url";

/** @typedef {"mobile" | "tablet" | "desktop"} ViewportTier */

/**
 * @template T
 * @typedef {{current: T}} MutableRef
 */

function useAstronautAsset() {
  const [asset, setAsset] = useState(
    /** @type {import("three/examples/jsm/loaders/GLTFLoader.js").GLTF | null} */ (null),
  );
  const [error, setError] = useState(/** @type {Error | null} */ (null));

  useEffect(() => {
    let active = true;
    const loader = new GLTFLoader();

    loader.load(
      astronautUrl,
      (gltf) => {
        if (active) setAsset(gltf);
      },
      undefined,
      (loadError) => {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError
            : new Error("The astronaut model could not be loaded."),
        );
      },
    );

    return () => {
      active = false;
    };
  }, []);

  if (error) throw error;
  return asset;
}

/**
 * @param {{
 *   motionRef: MutableRef<import("../../hooks/useSpaceJourney.js").SpaceJourneyMotion>,
 *   pointerRef: MutableRef<import("../../hooks/useSpaceJourney.js").JourneyPointer>,
 *   activeSection: string,
 *   viewportTier: ViewportTier,
 *   animationEnabledRef: MutableRef<boolean>,
 *   onReady: () => void
 * }} props
 */
function Astronaut({
  motionRef,
  pointerRef,
  activeSection,
  viewportTier,
  animationEnabledRef,
  onReady,
}) {
  const groupRef = useRef(/** @type {import("three").Group | null} */ (null));
  const asset = useAstronautAsset();
  const model = useMemo(() => (asset ? cloneSkeleton(asset.scene) : null), [asset]);
  const mixer = useMemo(() => (model ? new AnimationMixer(model) : null), [model]);

  const normalizedScale = useMemo(() => {
    if (!model) return 1;
    const size = new Box3().setFromObject(model).getSize(new Vector3());
    // The rig's animated limbs extend well beyond its bind-pose bounds. These
    // deliberately conservative targets keep the complete floating pose in
    // frame instead of normalizing the suit into a screen-filling silhouette.
    const targetHeight =
      viewportTier === "mobile" ? 0.32 : viewportTier === "tablet" ? 0.42 : 0.52;
    return targetHeight / Math.max(size.y, 0.001);
  }, [model, viewportTier]);

  useEffect(() => {
    if (!asset || !model || !mixer) return undefined;
    model.traverse((object) => {
      const mesh = /** @type {import("three").Mesh} */ (object);
      if (!mesh.isMesh) return;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    });
    const idleClip =
      asset.animations.find((clip) => clip.name.toLowerCase().includes("idle")) ??
      asset.animations[0];
    const action = idleClip ? mixer.clipAction(idleClip).reset().fadeIn(0.25).play() : null;
    onReady();

    return () => {
      action?.fadeOut(0.1);
      mixer.stopAllAction();
      mixer.uncacheRoot(model);
    };
  }, [asset, mixer, model, onReady]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group || !mixer) return;

    const safeDelta = Math.min(delta, 0.05);
    const motion = motionRef.current;
    const pointer = pointerRef.current;
    const sectionProgress = MathUtils.clamp(motion.sectionProgress, 0, 1);
    const globalProgress = MathUtils.clamp(motion.globalProgress, 0, 1);
    const mobile = viewportTier === "mobile";
    const tablet = viewportTier === "tablet";
    const heroSection = activeSection === "hero";
    const sectionIndex = Math.max(0, motion.activeIndex);
    const side = sectionIndex % 2 === 0 ? 1 : -1;
    const transitionLift = Math.sin(sectionProgress * Math.PI);
    const denseSection =
      activeSection.includes("role") ||
      activeSection.includes("workflow") ||
      activeSection === "what-i-build" ||
      activeSection === "how-i-work" ||
      activeSection === "tremor-track" ||
      activeSection === "about";
    const baseX = heroSection
      ? mobile
        ? 1.35
        : tablet
          ? 2.55
          : 3.65
      : mobile
        ? 1.1
        : tablet
          ? 2.45
          : 3.35;
    const targetX =
      side * baseX +
      Math.sin(globalProgress * Math.PI * 4) * (mobile ? 0.16 : 0.28);
    const targetY = heroSection
      ? (mobile ? -2.2 : -1.4) + transitionLift * 0.14
      : MathUtils.lerp(-0.64, 0.62, sectionProgress) +
        transitionLift * (mobile ? 0.18 : 0.34);
    const targetZ = denseSection ? -1.45 : -0.28 + transitionLift * 0.24;
    const float = animationEnabledRef.current
      ? Math.sin(state.clock.elapsedTime * 0.62) * (mobile ? 0.06 : 0.1)
      : 0;
    const pointerX = MathUtils.clamp(pointer.x, -1, 1);
    const pointerY = MathUtils.clamp(pointer.y, -1, 1);
    const targetOpacity = heroSection
      ? 1
      : denseSection
        ? 0.72 + Math.max(1 - motion.enterProgress, motion.exitProgress) * 0.08
        : activeSection.includes("kyber")
          ? 0.82
          : 0.86;

    if (animationEnabledRef.current) mixer.update(safeDelta);

    group.position.x = MathUtils.damp(group.position.x, targetX, 3.4, safeDelta);
    group.position.y = MathUtils.damp(
      group.position.y,
      targetY + float,
      3.4,
      safeDelta,
    );
    group.position.z = MathUtils.damp(group.position.z, targetZ, 3.2, safeDelta);
    group.rotation.x = MathUtils.damp(
      group.rotation.x,
      pointerY * 0.07 - transitionLift * 0.04,
      3.5,
      safeDelta,
    );
    group.rotation.y = MathUtils.damp(
      group.rotation.y,
      2.16 + pointerX * 0.14 + side * 0.08,
      3.5,
      safeDelta,
    );
    group.rotation.z = MathUtils.damp(
      group.rotation.z,
      side * -0.07 + pointerX * 0.035,
      3.2,
      safeDelta,
    );
    const targetScale = normalizedScale * targetOpacity;
    group.scale.x = MathUtils.damp(group.scale.x, targetScale, 3.5, safeDelta);
    group.scale.y = MathUtils.damp(group.scale.y, targetScale, 3.5, safeDelta);
    group.scale.z = MathUtils.damp(group.scale.z, targetScale, 3.5, safeDelta);
  });

  if (!model) return null;

  const initialX =
    viewportTier === "mobile" ? 1.35 : viewportTier === "tablet" ? 2.55 : 3.65;
  const initialY = viewportTier === "mobile" ? -2.2 : -1.4;

  return (
    <group
      ref={groupRef}
      position={[initialX, initialY, -0.18]}
      rotation={[0, 2.16, -0.07]}
      scale={normalizedScale}
    >
      <primitive object={model} dispose={null} />
    </group>
  );
}

/**
 * @param {{onContextLost: () => void}} props
 */
function ContextLossListener({ onContextLost }) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    /** @param {Event} event */
    const handleContextLoss = (event) => {
      event.preventDefault();
      onContextLost();
    };

    canvas.addEventListener("webglcontextlost", handleContextLoss, false);
    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLoss, false);
    };
  }, [gl, onContextLost]);

  return null;
}

/**
 * @param {{
 *   motionRef: MutableRef<import("../../hooks/useSpaceJourney.js").SpaceJourneyMotion>,
 *   pointerRef: MutableRef<import("../../hooks/useSpaceJourney.js").JourneyPointer>,
 *   activeSection: string,
 *   viewportTier: ViewportTier,
 *   animationEnabledRef: MutableRef<boolean>,
 *   onReady: () => void,
 *   onContextLost: () => void
 * }} props
 */
export function AstronautWorld({
  motionRef,
  pointerRef,
  activeSection,
  viewportTier,
  animationEnabledRef,
  onReady,
  onContextLost,
}) {
  return (
    <>
      <ambientLight intensity={0.55} color="#F0EFEB" />
      <directionalLight position={[-4, 6, 7]} intensity={1.35} color="#F0EFEB" />
      <pointLight position={[4, 1, 5]} intensity={1.1} color="#E26F3B" />
      <pointLight position={[-4, -2, 3]} intensity={0.75} color="#1689C8" />
      <Astronaut
        motionRef={motionRef}
        pointerRef={pointerRef}
        activeSection={activeSection}
        viewportTier={viewportTier}
        animationEnabledRef={animationEnabledRef}
        onReady={onReady}
      />
      <ContextLossListener onContextLost={onContextLost} />
    </>
  );
}
