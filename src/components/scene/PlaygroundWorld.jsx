import { AnimationMixer, Box3, MathUtils, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useEffect, useMemo, useRef, useState } from "react";
import astronautUrl from "../../assets/3d/spaceman.glb?url";
import { normalizeChapter } from "./chapterConfig";
import { getAstronautCue } from "./astronautCue";

/** @typedef {import('../../data/types.js').ArtworkPointer} ArtworkPointer */
/** @typedef {import('../../data/types.js').ChapterMotionState} ChapterMotionState */
/** @typedef {import('../../data/types.js').AstronautPresence} AstronautPresence */
/** @template T @typedef {{current: T}} MutableRef */

const clamp01 = (value) => MathUtils.clamp(Number(value) || 0, 0, 1);

const journeyPositions = Object.freeze({
  impact: [4.6, -2.7, -1, 0.06],
  practice: [-3.7, 1.4, -1, 0.16],
  kyber: [3.75, 1.55, -1, 0.16],
  tremor: [-3.7, -0.65, -1, 0.16],
  experience: [3.7, 1.65, -1, 0.14],
  about: [3.75, -1.45, -1, 0.1],
  contact: [3.7, 0.45, -1, 0.15],
});

function useAstronautAsset() {
  const [asset, setAsset] = useState(/** @type {import('three/examples/jsm/loaders/GLTFLoader.js').GLTF | null} */ (null));
  const [error, setError] = useState(/** @type {Error | null} */ (null));
  useEffect(() => {
    let active = true;
    new GLTFLoader().load(
      astronautUrl,
      (gltf) => { if (active) setAsset(gltf); },
      undefined,
      (loadError) => { if (active) setError(loadError instanceof Error ? loadError : new Error("Astronaut failed to load")); },
    );
    return () => { active = false; };
  }, []);
  if (error) throw error;
  return asset;
}

/** @param {{activeChapter: string, presence: AstronautPresence, pointerRef: MutableRef<ArtworkPointer>, motionRef: MutableRef<ChapterMotionState>, viewportTier: string, animationEnabledRef: MutableRef<boolean>}} props */
function Astronaut({ activeChapter, presence, pointerRef, motionRef, viewportTier, animationEnabledRef }) {
  const groupRef = useRef(/** @type {import('three').Group | null} */ (null));
  const gltf = useAstronautAsset();
  const model = useMemo(() => (gltf ? cloneSkeleton(gltf.scene) : null), [gltf]);
  const mixer = useMemo(() => (model ? new AnimationMixer(model) : null), [model]);

  const normalizedScale = useMemo(() => {
    if (!model) return 1;
    const size = new Box3().setFromObject(model).getSize(new Vector3());
    const targetHeight = viewportTier === "mobile" ? 2.25 : viewportTier === "tablet" ? 2.5 : 2.72;
    return targetHeight / Math.max(size.y, 0.001);
  }, [model, viewportTier]);

  useEffect(() => {
    if (!gltf || !model || !mixer) return undefined;
    const idleClip = gltf.animations.find((clip) => clip.name.toLowerCase() === "idle") ?? gltf.animations[0];
    if (idleClip) mixer.clipAction(idleClip).reset().fadeIn(0.25).play();
    model.traverse((object) => {
      const mesh = /** @type {import('three').Mesh} */ (object);
      if (mesh.isMesh) { mesh.castShadow = false; mesh.receiveShadow = false; }
    });
    return () => { mixer.stopAllAction(); mixer.uncacheRoot(model); };
  }, [gltf, mixer, model]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group || !mixer) return;
    const safeDelta = Math.min(delta, 0.05);
    const motion = motionRef.current;
    const chapter = normalizeChapter(motion.activeChapter ?? activeChapter);
    const progress = clamp01(motion.progress);
    const cue = getAstronautCue(presence, motion.activeChapter ?? activeChapter, progress);
    group.visible = cue.visible;
    if (!cue.visible) return;
    if (animationEnabledRef.current) mixer.update(safeDelta);

    const mobile = viewportTier === "mobile";
    const tablet = viewportTier === "tablet";
    const pointerX = MathUtils.clamp(Number(pointerRef.current.x) || 0, -1, 1);
    const pointerY = MathUtils.clamp(Number(pointerRef.current.y) || 0, -1, 1);
    const impulse = MathUtils.clamp(Number(pointerRef.current.impulse) || 0, 0, 1);
    const eased = progress * progress * (3 - 2 * progress);
    const float = animationEnabledRef.current ? Math.sin(state.clock.elapsedTime * 0.66) * (mobile ? 0.07 : 0.11) : 0;

    let targetX;
    let targetY;
    let targetZ;
    let scaleFactor;
    if (cue.kind === "hero") {
      targetX = mobile
        ? MathUtils.lerp(1.75, 1.05, eased)
        : MathUtils.lerp(tablet ? 2.6 : 3.15, 1.8, eased);
      targetY = mobile
        ? MathUtils.lerp(-1.25, -0.15, eased)
        : MathUtils.lerp(-0.75, 0.55, eased);
      targetZ = 0.35 + Math.sin(progress * Math.PI) * 0.42;
      scaleFactor = 0.9;
    } else if (cue.kind === "journey") {
      const position = journeyPositions[chapter] ?? [2.6, 0, -0.8, 0.55];
      targetX = (mobile ? position[0] * 0.72 : position[0]) + Math.sin(progress * Math.PI) * 0.32;
      targetY = (mobile ? position[1] * 0.62 : position[1]) + Math.sin(progress * Math.PI * 2) * 0.22;
      targetZ = position[2];
      scaleFactor = position[3] * (mobile ? 0.78 : 1);
    } else {
      const envelope = Math.sin(cue.phase * Math.PI);
      targetX = MathUtils.lerp(mobile ? 2.2 : 4.25, mobile ? -2.2 : -4.25, cue.phase);
      targetY = (mobile ? 1.5 : 2.05) - Math.sin(cue.phase * Math.PI) * 0.65;
      targetZ = -1;
      scaleFactor = (mobile ? 0.26 : 0.32) * envelope;
    }

    group.position.x = MathUtils.damp(group.position.x, targetX + pointerX * 0.08, 4.2, safeDelta);
    group.position.y = MathUtils.damp(group.position.y, targetY + float, 4.2, safeDelta);
    group.position.z = MathUtils.damp(group.position.z, targetZ, 4, safeDelta);
    group.rotation.y = MathUtils.damp(group.rotation.y, 2.18 + pointerX * 0.14 + progress * 0.12 + impulse * 0.06, 3.7, safeDelta);
    group.rotation.x = MathUtils.damp(group.rotation.x, pointerY * 0.07 - progress * 0.04, 3.7, safeDelta);
    group.rotation.z = MathUtils.damp(group.rotation.z, -0.08 + Math.sin(progress * Math.PI * 1.4) * 0.06, 3.4, safeDelta);
    // Scale settles faster than position so anchor jumps never let the hero-sized
    // astronaut briefly cover chapter copy.
    group.scale.setScalar(MathUtils.damp(group.scale.x, normalizedScale * scaleFactor, 12, safeDelta));
  });

  if (!model) return null;
  return <group ref={groupRef} position={[2.5, -0.3, 0.35]} rotation={[0, 2.18, -0.08]} scale={0.001}><primitive object={model} /></group>;
}

function ContextLossListener() {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLoss = (event) => { event.preventDefault(); canvas.dispatchEvent(new CustomEvent("playgroundscenelost", { bubbles: true })); };
    canvas.addEventListener("webglcontextlost", handleContextLoss, false);
    return () => canvas.removeEventListener("webglcontextlost", handleContextLoss, false);
  }, [gl]);
  return null;
}

/** @param {{enabled: boolean, viewportTier: string, motionRef: MutableRef<ChapterMotionState>, pointerRef: MutableRef<ArtworkPointer>}} props */
export function RenderDriver({ enabled, viewportTier, motionRef, pointerRef }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    if (!enabled) { invalidate(); return undefined; }
    let frame = 0;
    let previous = 0;
    let lastActivity = performance.now();
    let previousMotion = "";
    let previousPointer = "";
    const render = (time) => {
      const motion = motionRef.current;
      const pointer = pointerRef.current;
      const motionKey = `${motion.activeChapter}:${Number(motion.progress).toFixed(4)}:${Number(motion.transitionProgress).toFixed(4)}`;
      const pointerKey = `${Number(pointer.x).toFixed(3)}:${Number(pointer.y).toFixed(3)}:${Number(pointer.impulse).toFixed(3)}`;
      if (motionKey !== previousMotion || pointerKey !== previousPointer) { previousMotion = motionKey; previousPointer = pointerKey; lastActivity = time; }
      const active = time - lastActivity < 720;
      const rate = active ? (viewportTier === "mobile" ? 30 : 45) : (viewportTier === "mobile" ? 6 : 10);
      if (time - previous >= 1000 / rate) { previous = time; invalidate(); }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [enabled, invalidate, motionRef, pointerRef, viewportTier]);
  return null;
}

/** @param {{activeChapter: string, presence: AstronautPresence, motionRef: MutableRef<ChapterMotionState>, pointerRef: MutableRef<ArtworkPointer>, viewportTier: string, animationEnabledRef: MutableRef<boolean>}} props */
export function PlaygroundWorld({ activeChapter, presence, motionRef, pointerRef, viewportTier, animationEnabledRef }) {
  return <><ambientLight intensity={0.38} color="#F2E8D5" /><hemisphereLight color="#F2E8D5" groundColor="#0A0D14" intensity={0.78} /><directionalLight position={[-4, 6, 8]} intensity={2.4} color="#F7EEDC" /><directionalLight position={[4, -1, 6]} intensity={0.64} color="#6FA8C8" /><pointLight position={[4, 1, 5]} intensity={1.8} color="#D6683C" /><Astronaut activeChapter={activeChapter} presence={presence} pointerRef={pointerRef} motionRef={motionRef} viewportTier={viewportTier} animationEnabledRef={animationEnabledRef} /><ContextLossListener /></>;
}
