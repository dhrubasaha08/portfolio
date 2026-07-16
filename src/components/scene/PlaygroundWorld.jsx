import { AnimationMixer, Box3, MathUtils, Object3D, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useEffect, useMemo, useRef, useState } from "react";
import astronautUrl from "../../assets/3d/spaceman.glb?url";
import { ChapterDioramas } from "./ChapterDioramas";
import { normalizeChapter } from "./chapterConfig";
import { createCelestialDust, createPebbleTransforms } from "./geometry";

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

const clamp01 = (value) => MathUtils.clamp(Number(value) || 0, 0, 1);

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
        if (active) {
          setError(loadError instanceof Error ? loadError : new Error("Astronaut failed to load"));
        }
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
 *   activeChapter: string,
 *   pointerRef: MutableRef<ScenePointer>,
 *   motionRef: MutableRef<ChapterMotionState>,
 *   viewportTier: string,
 *   animationEnabledRef: MutableRef<boolean>
 * }} props
 */
function Astronaut({ activeChapter, pointerRef, motionRef, viewportTier, animationEnabledRef }) {
  const groupRef = useRef(/** @type {import("three").Group | null} */ (null));
  const gltf = useAstronautAsset();
  const model = useMemo(() => (gltf ? cloneSkeleton(gltf.scene) : null), [gltf]);
  const mixer = useMemo(() => (model ? new AnimationMixer(model) : null), [model]);

  const normalizedScale = useMemo(() => {
    if (!model) return 1;
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const targetHeight = viewportTier === "mobile" ? 2.35 : viewportTier === "tablet" ? 2.55 : 2.75;
    return targetHeight / Math.max(size.y, 0.001);
  }, [model, viewportTier]);

  useEffect(() => {
    if (!gltf || !model || !mixer) return undefined;
    const idleClip =
      gltf.animations.find((clip) => clip.name.toLowerCase() === "idle") ?? gltf.animations[0];

    if (idleClip) mixer.clipAction(idleClip).reset().fadeIn(0.25).play();

    model.traverse((object) => {
      const mesh = /** @type {import("three").Mesh} */ (object);
      if (!mesh.isMesh) return;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    });

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(model);
    };
  }, [gltf, mixer, model]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group || !mixer) return;

    const safeDelta = Math.min(delta, 0.05);
    const motion = motionRef.current;
    const chapter = normalizeChapter(motion.activeChapter ?? activeChapter);
    const progress = clamp01(motion.progress);
    const pointer = pointerRef.current;
    const pointerX = MathUtils.clamp(Number(pointer?.x) || 0, -1, 1);
    const pointerY = MathUtils.clamp(Number(pointer?.y) || 0, -1, 1);
    const impulse = MathUtils.clamp(Number(pointer?.impulse) || 0, 0, 1);
    const mobile = viewportTier === "mobile";
    const tablet = viewportTier === "tablet";
    const hero = chapter === "hero";
    const cameo = !hero && progress > 0.76;
    const eased = progress * progress * (3 - 2 * progress);
    const cameoEdge = MathUtils.clamp((progress - 0.76) / 0.24, 0, 1);
    const float = animationEnabledRef.current
      ? Math.sin(state.clock.elapsedTime * 0.66) * (mobile ? 0.08 : 0.12)
      : 0;

    group.visible = hero || cameo;
    if (!group.visible) return;
    if (animationEnabledRef.current) mixer.update(safeDelta);

    const heroX = mobile
      ? MathUtils.lerp(1.25, -0.72, eased)
      : MathUtils.lerp(tablet ? 2.0 : 2.55, -1.35, eased) + Math.sin(progress * Math.PI * 2) * 0.2;
    const heroY = mobile
      ? MathUtils.lerp(-1.05, 0.32, eased) + Math.sin(progress * Math.PI * 2) * 0.22
      : MathUtils.lerp(-0.35, 0.58, eased) + Math.sin(progress * Math.PI * 2.4) * 0.34;
    const direction = -1;
    const cameoX = (mobile ? 2.2 : 4.2) * direction + (1 - cameoEdge) * direction * 0.8;
    const cameoY = mobile ? 2.25 : 2.5;
    const targetScale = normalizedScale * (hero ? 1 : 0.36 * Math.max(0.3, cameoEdge));

    group.position.x = MathUtils.damp(
      group.position.x,
      (hero ? heroX : cameoX) + pointerX * (hero ? 0.08 : 0.04),
      4.2,
      safeDelta,
    );
    group.position.y = MathUtils.damp(
      group.position.y,
      (hero ? heroY : cameoY) + float,
      4.2,
      safeDelta,
    );
    group.position.z = MathUtils.damp(
      group.position.z,
      hero ? 0.35 + Math.sin(progress * Math.PI) * 0.46 : -1.25,
      4,
      safeDelta,
    );
    group.rotation.y = MathUtils.damp(
      group.rotation.y,
      2.18 + pointerX * 0.14 + (hero ? progress * 0.16 : direction * 0.3) + impulse * 0.08,
      3.7,
      safeDelta,
    );
    group.rotation.x = MathUtils.damp(
      group.rotation.x,
      pointerY * 0.07 - (hero ? progress * 0.05 : 0.08),
      3.7,
      safeDelta,
    );
    group.rotation.z = MathUtils.damp(
      group.rotation.z,
      -0.08 + pointerX * 0.035 + Math.sin(progress * Math.PI * 1.4) * 0.05,
      3.4,
      safeDelta,
    );
    group.scale.setScalar(MathUtils.damp(group.scale.x, targetScale, 5, safeDelta));
  });

  if (!model) return null;

  const initialX = viewportTier === "mobile" ? 1.25 : viewportTier === "tablet" ? 2 : 2.55;
  const initialY = viewportTier === "mobile" ? -1.05 : -0.35;

  return (
    <group
      ref={groupRef}
      position={[initialX, initialY, 0.35]}
      rotation={[0, 2.18, -0.08]}
      scale={normalizedScale}
    >
      <primitive object={model} />
    </group>
  );
}
/** @param {{viewportTier: string, animationEnabledRef: MutableRef<boolean>}} props */
function CelestialDust({ viewportTier, animationEnabledRef }) {
  const pointsRef = useRef(/** @type {import("three").Points | null} */ (null));
  const geometry = useMemo(() => createCelestialDust(viewportTier), [viewportTier]);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points || !animationEnabledRef.current) return;
    const safeDelta = Math.min(delta, 0.05);
    points.rotation.y += safeDelta * 0.004;
    points.position.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.035;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geometry.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[geometry.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={viewportTier === "mobile" ? 0.047 : 0.038}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

/**
 * @param {{
 *   activeChapter: string,
 *   motionRef: MutableRef<ChapterMotionState>,
 *   animationEnabledRef: MutableRef<boolean>
 * }} props
 */
function FloatingPebbles({ activeChapter, motionRef, animationEnabledRef }) {
  const meshRef = useRef(/** @type {import("three").InstancedMesh | null} */ (null));
  const transforms = useMemo(() => createPebbleTransforms(), []);
  const helper = useMemo(() => new Object3D(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    transforms.forEach((transform, index) => {
      helper.position.set(transform.position[0], transform.position[1], transform.position[2]);
      helper.rotation.set(transform.rotation[0], transform.rotation[1], transform.rotation[2]);
      helper.scale.set(transform.scale * 1.24, transform.scale * 0.72, transform.scale);
      helper.updateMatrix();
      mesh.setMatrixAt(index, helper.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [helper, transforms]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.visible = normalizeChapter(motionRef.current.activeChapter ?? activeChapter) === "hero";
    if (!mesh.visible || !animationEnabledRef.current) return;
    mesh.rotation.y = Math.sin(state.clock.elapsedTime * 0.09) * 0.04;
    mesh.rotation.z = Math.sin(state.clock.elapsedTime * 0.13) * 0.025;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, transforms.length]} frustumCulled={false}>
      <sphereGeometry args={[0.16, 18, 12]} />
      <meshPhysicalMaterial
        color="#6E7F55"
        roughness={0.74}
        metalness={0.02}
        clearcoat={0.06}
        clearcoatRoughness={0.72}
      />
    </instancedMesh>
  );
}

function ContextLossListener() {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLoss = (event) => {
      event.preventDefault();
      canvas.dispatchEvent(new CustomEvent("playgroundscenelost", { bubbles: true }));
    };

    canvas.addEventListener("webglcontextlost", handleContextLoss, false);
    return () => canvas.removeEventListener("webglcontextlost", handleContextLoss, false);
  }, [gl]);

  return null;
}

/**
 * A demand-loop driver keeps one canvas alive across the document while
 * allowing hidden tabs to consume no animation frames. Scroll and pointer
 * changes temporarily raise the cadence; an untouched scene settles into a
 * restrained idle rhythm instead of continuously occupying the main thread.
 *
 * @param {{
 *   enabled: boolean,
 *   viewportTier: string,
 *   motionRef: MutableRef<ChapterMotionState>,
 *   pointerRef: MutableRef<ScenePointer>
 * }} props
 */
export function RenderDriver({ enabled, viewportTier, motionRef, pointerRef }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!enabled) {
      invalidate();
      return undefined;
    }

    let frame = 0;
    let previous = 0;
    let lastActivity = performance.now();
    let previousMotion = "";
    let previousPointer = "";
    const render = (time) => {
      const motion = motionRef.current;
      const pointer = pointerRef.current;
      const motionKey = `${motion.activeChapter ?? ""}:${Number(motion.progress ?? 0).toFixed(4)}:${Number(motion.transitionProgress ?? 0).toFixed(4)}`;
      const pointerKey = `${Number(pointer.x ?? 0).toFixed(3)}:${Number(pointer.y ?? 0).toFixed(3)}:${Number(pointer.impulse ?? 0).toFixed(3)}`;
      if (motionKey !== previousMotion || pointerKey !== previousPointer) {
        previousMotion = motionKey;
        previousPointer = pointerKey;
        lastActivity = time;
      }

      const engaged = time - lastActivity < 720;
      const activeRate = viewportTier === "mobile" ? 30 : 45;
      const idleRate = viewportTier === "mobile" ? 6 : 10;
      const minimumFrameTime = 1000 / (engaged ? activeRate : idleRate);
      if (time - previous >= minimumFrameTime) {
        previous = time;
        invalidate();
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [enabled, invalidate, motionRef, pointerRef, viewportTier]);

  return null;
}

/**
 * @param {{
 *   activeChapter: string,
 *   motionRef: MutableRef<ChapterMotionState>,
 *   pointerRef: MutableRef<ScenePointer>,
 *   viewportTier: string,
 *   animationEnabledRef: MutableRef<boolean>
 * }} props
 */
export function PlaygroundWorld({
  activeChapter,
  motionRef,
  pointerRef,
  viewportTier,
  animationEnabledRef,
}) {
  return (
    <>
      <ambientLight intensity={0.34} color="#F2E8D5" />
      <hemisphereLight color="#F2E8D5" groundColor="#0A0D14" intensity={0.74} />
      <directionalLight position={[-4, 6, 8]} intensity={2.4} color="#F7EEDC" />
      <directionalLight position={[4, -1, 6]} intensity={0.62} color="#6FA8C8" />
      <pointLight position={[4, 1, 5]} intensity={1.85} color="#D6683C" />
      <pointLight position={[-4, -2, 3]} intensity={0.9} color="#6FA8C8" />

      <CelestialDust viewportTier={viewportTier} animationEnabledRef={animationEnabledRef} />
      <FloatingPebbles
        activeChapter={activeChapter}
        motionRef={motionRef}
        animationEnabledRef={animationEnabledRef}
      />
      <ChapterDioramas
        activeChapter={activeChapter}
        motionRef={motionRef}
        pointerRef={pointerRef}
        viewportTier={viewportTier}
      />
      <Astronaut
        activeChapter={activeChapter}
        pointerRef={pointerRef}
        motionRef={motionRef}
        viewportTier={viewportTier}
        animationEnabledRef={animationEnabledRef}
      />
      <ContextLossListener />
    </>
  );
}
