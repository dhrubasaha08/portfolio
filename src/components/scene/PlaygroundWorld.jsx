import {
  AnimationMixer,
  Box3,
  MathUtils,
  Object3D,
  Vector3,
} from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useEffect, useMemo, useRef, useState } from "react";
import astronautUrl from "../../assets/3d/spaceman.glb?url";
import { createCelestialDust, createPebbleTransforms } from "./geometry";

/** @typedef {{x?: number, y?: number}} ScenePointer */

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
 *   pointerRef: MutableRef<ScenePointer>,
 *   scrollProgressRef: MutableRef<number>,
 *   viewportTier: string,
 *   animationEnabledRef: MutableRef<boolean>
 * }} props
 */
function Astronaut({ pointerRef, scrollProgressRef, viewportTier, animationEnabledRef }) {
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
    const progress = MathUtils.clamp(scrollProgressRef.current, 0, 1);
    const pointer = pointerRef.current;
    const pointerX = MathUtils.clamp(Number(pointer?.x) || 0, -1, 1);
    const pointerY = MathUtils.clamp(Number(pointer?.y) || 0, -1, 1);
    const mobile = viewportTier === "mobile";
    const tablet = viewportTier === "tablet";
    const eased = progress * progress * (3 - 2 * progress);
    const float = animationEnabledRef.current
      ? Math.sin(state.clock.elapsedTime * 0.66) * (mobile ? 0.08 : 0.12)
      : 0;
    const targetX = mobile
      ? MathUtils.lerp(1.25, -0.72, eased)
      : MathUtils.lerp(tablet ? 2.0 : 2.55, -1.35, eased) + Math.sin(progress * Math.PI * 2) * 0.2;
    const targetY = mobile
      ? MathUtils.lerp(-1.05, 0.32, eased) + Math.sin(progress * Math.PI * 2) * 0.22
      : MathUtils.lerp(-0.35, 0.58, eased) + Math.sin(progress * Math.PI * 2.4) * 0.34;

    if (animationEnabledRef.current) mixer.update(safeDelta);

    group.position.x = MathUtils.damp(group.position.x, targetX, 4.2, safeDelta);
    group.position.y = MathUtils.damp(group.position.y, targetY + float, 4.2, safeDelta);
    group.position.z = MathUtils.damp(
      group.position.z,
      0.35 + Math.sin(progress * Math.PI) * 0.46,
      4,
      safeDelta,
    );
    group.rotation.y = MathUtils.damp(
      group.rotation.y,
      2.18 + pointerX * 0.14 + progress * 0.16,
      3.7,
      safeDelta,
    );
    group.rotation.x = MathUtils.damp(
      group.rotation.x,
      pointerY * 0.07 - progress * 0.05,
      3.7,
      safeDelta,
    );
    group.rotation.z = MathUtils.damp(
      group.rotation.z,
      -0.08 + pointerX * 0.035 + Math.sin(progress * Math.PI * 1.4) * 0.05,
      3.4,
      safeDelta,
    );
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
        opacity={0.52}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

/** @param {{animationEnabledRef: MutableRef<boolean>}} props */
function FloatingPebbles({ animationEnabledRef }) {
  const meshRef = useRef(/** @type {import("three").InstancedMesh | null} */ (null));
  const transforms = useMemo(() => createPebbleTransforms(), []);
  const helper = useMemo(() => new Object3D(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    transforms.forEach((transform, index) => {
      helper.position.set(transform.position[0], transform.position[1], transform.position[2]);
      helper.rotation.set(transform.rotation[0], transform.rotation[1], transform.rotation[2]);
      helper.scale.setScalar(transform.scale);
      helper.updateMatrix();
      mesh.setMatrixAt(index, helper.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [helper, transforms]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh || !animationEnabledRef.current) return;
    mesh.rotation.y = Math.sin(state.clock.elapsedTime * 0.09) * 0.04;
    mesh.rotation.z = Math.sin(state.clock.elapsedTime * 0.13) * 0.025;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, transforms.length]} frustumCulled={false}>
      <dodecahedronGeometry args={[0.16, 0]} />
      <meshStandardMaterial color="#6E7F55" roughness={0.92} metalness={0.02} />
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
 * @param {{
 *   scrollProgressRef: MutableRef<number>,
 *   pointerRef: MutableRef<ScenePointer>,
 *   viewportTier: string,
 *   animationEnabledRef: MutableRef<boolean>
 * }} props
 */
export function PlaygroundWorld({
  scrollProgressRef,
  pointerRef,
  viewportTier,
  animationEnabledRef,
}) {
  return (
    <>
      <ambientLight intensity={0.7} color="#F2E8D5" />
      <directionalLight position={[-4, 6, 8]} intensity={2.1} color="#F2E8D5" />
      <pointLight position={[4, 1, 5]} intensity={2.4} color="#D6683C" />
      <pointLight position={[-4, -2, 3]} intensity={1.2} color="#6FA8C8" />

      <CelestialDust viewportTier={viewportTier} animationEnabledRef={animationEnabledRef} />
      <FloatingPebbles animationEnabledRef={animationEnabledRef} />
      <Astronaut
        pointerRef={pointerRef}
        scrollProgressRef={scrollProgressRef}
        viewportTier={viewportTier}
        animationEnabledRef={animationEnabledRef}
      />
      <ContextLossListener />
    </>
  );
}
