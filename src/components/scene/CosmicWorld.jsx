import {
  AdditiveBlending,
  AnimationMixer,
  Box3,
  CatmullRomCurve3,
  MathUtils,
  Vector3,
} from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import { Suspense, useEffect, useMemo, useRef } from "react";
import astronautUrl from "../../assets/3d/spaceman.glb?url";
import {
  createDustPositions,
  createOrbitAttributes,
  createStarPositions,
  createTrailRoute,
} from "./geometry";
import { resolveCameraSegment } from "./sceneData";

/** @typedef {{x?: number, y?: number}} ScenePointer */

/**
 * @template T
 * @typedef {{current: T}} MutableRef
 */

/**
 * @param {{
 *   scrollProgressRef: MutableRef<number>,
 *   pointerRef: MutableRef<ScenePointer>,
 *   viewportTier: string,
 *   animationEnabledRef: MutableRef<boolean>
 * }} props
 */
function CameraRig({ scrollProgressRef, pointerRef, viewportTier, animationEnabledRef }) {
  const sceneCamera = useThree((state) => state.camera);
  const cameraRef = useRef(/** @type {import("three").PerspectiveCamera} */ (sceneCamera));
  const desiredPositionRef = useRef(new Vector3());
  const upperPositionRef = useRef(new Vector3());
  const desiredTargetRef = useRef(new Vector3());
  const upperTargetRef = useRef(new Vector3());
  const lookAtTargetRef = useRef(new Vector3());

  useFrame((_, delta) => {
    const camera = cameraRef.current;
    const desiredPosition = desiredPositionRef.current;
    const upperPosition = upperPositionRef.current;
    const desiredTarget = desiredTargetRef.current;
    const upperTarget = upperTargetRef.current;
    const lookAtTarget = lookAtTargetRef.current;
    const safeDelta = Math.min(delta, 0.05);
    const progress = MathUtils.clamp(scrollProgressRef.current, 0, 1);
    const { lower, upper, mix } = resolveCameraSegment(progress);
    const pointer = pointerRef.current;
    const pointerX = MathUtils.clamp(Number(pointer?.x) || 0, -1, 1);
    const pointerY = MathUtils.clamp(Number(pointer?.y) || 0, -1, 1);
    const motionScale = animationEnabledRef.current ? 1 : 0;
    const mobile = viewportTier === "mobile";

    desiredPosition
      .set(...lower.position)
      .lerp(upperPosition.set(...upper.position), mix);
    desiredTarget
      .set(...lower.target)
      .lerp(upperTarget.set(...upper.target), mix);

    if (mobile) {
      desiredPosition.x *= 0.42;
      desiredPosition.y += 0.45;
      desiredPosition.z += 2.95;
      desiredTarget.x *= 0.55;
      desiredTarget.y += 0.32;
    } else if (viewportTier === "tablet") {
      desiredPosition.x *= 0.72;
      desiredPosition.z += 1.3;
    }

    desiredPosition.x += pointerX * (mobile ? 0.2 : 0.5) * motionScale;
    desiredPosition.y += pointerY * (mobile ? 0.16 : 0.32) * motionScale;
    desiredTarget.x += pointerX * 0.12 * motionScale;
    desiredTarget.y += pointerY * 0.08 * motionScale;

    camera.position.x = MathUtils.damp(camera.position.x, desiredPosition.x, 4.2, safeDelta);
    camera.position.y = MathUtils.damp(camera.position.y, desiredPosition.y, 4.2, safeDelta);
    camera.position.z = MathUtils.damp(camera.position.z, desiredPosition.z, 4.2, safeDelta);
    lookAtTarget.lerp(desiredTarget, 1 - Math.exp(-4.6 * safeDelta));
    camera.lookAt(lookAtTarget);
    camera.rotation.z = MathUtils.damp(
      camera.rotation.z,
      MathUtils.lerp(lower.roll, upper.roll, mix),
      3.5,
      safeDelta,
    );
  });

  return null;
}

/**
 * @param {{viewportTier: string, animationEnabledRef: MutableRef<boolean>}} props
 */
function StarField({ viewportTier, animationEnabledRef }) {
  const pointsRef = useRef(/** @type {import("three").Points | null} */ (null));
  const positions = useMemo(() => createStarPositions(viewportTier), [viewportTier]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !animationEnabledRef.current) return;
    const safeDelta = Math.min(delta, 0.05);
    pointsRef.current.rotation.y += safeDelta * 0.0035;
    pointsRef.current.rotation.x += safeDelta * 0.0008;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#F3EFE7"
        size={viewportTier === "mobile" ? 0.038 : 0.03}
        sizeAttenuation
        transparent
        opacity={0.54}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

/**
 * @param {{viewportTier: string, animationEnabledRef: MutableRef<boolean>}} props
 */
function DustField({ viewportTier, animationEnabledRef }) {
  const dustRef = useRef(/** @type {import("three").Points | null} */ (null));
  const positions = useMemo(() => createDustPositions(viewportTier), [viewportTier]);

  useFrame((state, delta) => {
    const dust = dustRef.current;
    if (!dust || !animationEnabledRef.current) return;
    const safeDelta = Math.min(delta, 0.05);
    dust.rotation.z -= safeDelta * 0.012;
    dust.position.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.035;
  });

  return (
    <points ref={dustRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#3BA39A"
        size={viewportTier === "mobile" ? 0.052 : 0.043}
        sizeAttenuation
        transparent
        opacity={0.28}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

/**
 * @param {{animationEnabledRef: MutableRef<boolean>}} props
 */
function CelestialOrbits({ animationEnabledRef }) {
  const groupRef = useRef(/** @type {import("three").Group | null} */ (null));
  const attributes = useMemo(() => createOrbitAttributes(), []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group || !animationEnabledRef.current) return;
    const safeDelta = Math.min(delta, 0.05);
    group.rotation.y += safeDelta * 0.008;
    group.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.025;
  });

  return (
    <group ref={groupRef} position={[0.2, 0.08, 0.18]} rotation={[0.12, -0.1, 0]}>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <primitive attach="attributes-position" object={attributes.position} />
          <primitive attach="attributes-color" object={attributes.color} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.24}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );
}

/**
 * @param {{animationEnabledRef: MutableRef<boolean>}} props
 */
function LuminousCore({ animationEnabledRef }) {
  const groupRef = useRef(/** @type {import("three").Group | null} */ (null));
  const coreRef = useRef(/** @type {import("three").Mesh | null} */ (null));
  const innerRingRef = useRef(/** @type {import("three").Mesh | null} */ (null));
  const outerRingRef = useRef(/** @type {import("three").Mesh | null} */ (null));

  useFrame((state, delta) => {
    const group = groupRef.current;
    const core = coreRef.current;
    const innerRing = innerRingRef.current;
    const outerRing = outerRingRef.current;
    if (!group || !core || !innerRing || !outerRing || !animationEnabledRef.current) return;

    const safeDelta = Math.min(delta, 0.05);
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.62) * 0.032;
    core.scale.setScalar(pulse);
    innerRing.rotation.z += safeDelta * 0.035;
    outerRing.rotation.z -= safeDelta * 0.018;
    group.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.055;
  });

  return (
    <group ref={groupRef} position={[0.2, 0.08, 0.42]} rotation={[0.2, -0.08, 0]}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.46, 24, 16]} />
        <meshBasicMaterial color="#F3EFE7" transparent opacity={0.88} toneMapped={false} />
      </mesh>
      <mesh scale={1.55}>
        <sphereGeometry args={[0.46, 20, 12]} />
        <meshBasicMaterial
          color="#F26A3D"
          transparent
          opacity={0.1}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={innerRingRef} rotation={[0.92, 0.16, -0.2]}>
        <torusGeometry args={[1.15, 0.009, 5, 88]} />
        <meshBasicMaterial
          color="#F26A3D"
          transparent
          opacity={0.48}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={outerRingRef} rotation={[1.18, -0.34, 0.5]}>
        <torusGeometry args={[1.82, 0.006, 4, 96]} />
        <meshBasicMaterial
          color="#3BA39A"
          transparent
          opacity={0.3}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/**
 * @param {{animationEnabledRef: MutableRef<boolean>}} props
 */
function LightTrail({ animationEnabledRef }) {
  const lineRef = useRef(/** @type {import("three").LineSegments | null} */ (null));
  const curve = useMemo(
    () => new CatmullRomCurve3(createTrailRoute(), false, "catmullrom", 0.42),
    [],
  );
  const positions = useMemo(() => {
    const points = curve.getPoints(144);
    const values = new Float32Array((points.length - 1) * 6);
    for (let index = 0; index < points.length - 1; index += 1) {
      points[index].toArray(values, index * 6);
      points[index + 1].toArray(values, index * 6 + 3);
    }
    return values;
  }, [curve]);

  useFrame((state) => {
    const line = lineRef.current;
    if (!line || !animationEnabledRef.current) return;
    line.position.y = Math.sin(state.clock.elapsedTime * 0.16) * 0.045;
    line.rotation.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.012;
  });

  return (
    <lineSegments ref={lineRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color="#F26A3D"
        transparent
        opacity={0.24}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  );
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
  const gltf = useLoader(GLTFLoader, astronautUrl);
  const model = useMemo(() => cloneSkeleton(gltf.scene), [gltf.scene]);
  const mixer = useMemo(() => new AnimationMixer(model), [model]);
  const initialY = viewportTier === "mobile" ? 2.35 : -1.15;
  const normalizedScale = useMemo(() => {
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const targetHeight = viewportTier === "mobile" ? 0.55 : 0.95;
    return targetHeight / Math.max(size.y, 0.001);
  }, [model, viewportTier]);

  useEffect(() => {
    const idleClip =
      gltf.animations.find((clip) => clip.name.toLowerCase() === "idle") ?? gltf.animations[0];

    if (idleClip) mixer.clipAction(idleClip).reset().fadeIn(0.25).play();

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(model);
    };
  }, [gltf.animations, mixer, model]);

  useEffect(() => {
    model.traverse((object) => {
      const mesh = /** @type {import("three").Mesh} */ (object);
      if (!mesh.isMesh) return;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    });
  }, [model]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const safeDelta = Math.min(delta, 0.05);
    const pointer = pointerRef.current;
    const pointerX = MathUtils.clamp(Number(pointer?.x) || 0, -1, 1);
    const pointerY = MathUtils.clamp(Number(pointer?.y) || 0, -1, 1);
    const progress = MathUtils.clamp(scrollProgressRef.current, 0, 1);

    if (animationEnabledRef.current) mixer.update(safeDelta);

    group.rotation.y = MathUtils.damp(
      group.rotation.y,
      2.18 + pointerX * 0.2 + progress * 0.18,
      3.8,
      safeDelta,
    );
    group.rotation.x = MathUtils.damp(
      group.rotation.x,
      pointerY * 0.08 - progress * 0.08,
      3.8,
      safeDelta,
    );

    const float = animationEnabledRef.current
      ? Math.sin(state.clock.elapsedTime * 0.72) * 0.12
      : 0;
    group.position.y = MathUtils.damp(group.position.y, initialY + float, 4, safeDelta);
    group.position.x = MathUtils.damp(
      group.position.x,
      viewportTier === "mobile" ? 1.7 : 3.75 - progress * 0.5,
      4,
      safeDelta,
    );
  });

  return (
    <group
      ref={groupRef}
      position={[viewportTier === "mobile" ? 1.7 : 3.75, initialY, 1.25]}
      scale={normalizedScale}
      rotation={[0, 2.18, 0]}
    >
      <primitive object={model} />
    </group>
  );
}

/** @param {{onReadyRef: MutableRef<(() => void) | undefined>}} props */
function ReadySignal({ onReadyRef }) {
  const didSignalRef = useRef(false);

  useFrame(() => {
    if (didSignalRef.current) return;
    didSignalRef.current = true;
    onReadyRef.current?.();
  });

  return null;
}

/** @param {{onContextLostRef: MutableRef<(() => void) | undefined>}} props */
function ContextLossListener({ onContextLostRef }) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLoss = (event) => {
      event.preventDefault();
      onContextLostRef.current?.();
    };

    canvas.addEventListener("webglcontextlost", handleContextLoss, false);
    return () => canvas.removeEventListener("webglcontextlost", handleContextLoss, false);
  }, [gl, onContextLostRef]);

  return null;
}

/**
 * @param {{
 *   scrollProgressRef: MutableRef<number>,
 *   pointerRef: MutableRef<ScenePointer>,
 *   viewportTier: string,
 *   animationEnabledRef: MutableRef<boolean>,
 *   onReadyRef: MutableRef<(() => void) | undefined>,
 *   onContextLostRef: MutableRef<(() => void) | undefined>
 * }} props
 */
export function CosmicWorld({
  scrollProgressRef,
  pointerRef,
  viewportTier,
  animationEnabledRef,
  onReadyRef,
  onContextLostRef,
}) {
  return (
    <>
      <color attach="background" args={["#05070B"]} />
      <fog attach="fog" args={["#05070B", 13, 30]} />
      <ambientLight intensity={0.58} color="#9DA4AD" />
      <directionalLight position={[-4, 5, 7]} intensity={2.25} color="#F3EFE7" />
      <pointLight position={[0.6, 1.4, 4]} intensity={3.15} color="#F26A3D" />
      <pointLight position={[5, -2, 3]} intensity={1.7} color="#3BA39A" />

      <CameraRig
        scrollProgressRef={scrollProgressRef}
        pointerRef={pointerRef}
        viewportTier={viewportTier}
        animationEnabledRef={animationEnabledRef}
      />
      <StarField viewportTier={viewportTier} animationEnabledRef={animationEnabledRef} />
      <DustField viewportTier={viewportTier} animationEnabledRef={animationEnabledRef} />
      <CelestialOrbits animationEnabledRef={animationEnabledRef} />
      <LuminousCore animationEnabledRef={animationEnabledRef} />
      <LightTrail animationEnabledRef={animationEnabledRef} />

      <Suspense fallback={null}>
        <Astronaut
          pointerRef={pointerRef}
          scrollProgressRef={scrollProgressRef}
          viewportTier={viewportTier}
          animationEnabledRef={animationEnabledRef}
        />
      </Suspense>

      <ReadySignal onReadyRef={onReadyRef} />
      <ContextLossListener onContextLostRef={onContextLostRef} />
    </>
  );
}
