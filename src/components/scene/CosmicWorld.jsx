import {
  AdditiveBlending,
  AnimationMixer,
  Box3,
  CatmullRomCurve3,
  Color,
  DynamicDrawUsage,
  MathUtils,
  Object3D,
  Vector3,
} from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import astronautUrl from "../../assets/3d/spaceman.glb?url";
import {
  createEdgeAttributes,
  createNodeCloud,
  createSignalRoute,
  createStarPositions,
} from "./geometry";
import { SCENE_STAGE_LAYOUT } from "./sceneData";

const SIGNAL_COUNT = 30;

/** @typedef {{x?: number, y?: number}} ScenePointer */

/**
 * @template T
 * @typedef {{current: T}} MutableRef
 */

/**
 * @param {{
 *   activeIndex: number,
 *   scrollProgressRef: MutableRef<number>,
 *   pointerRef: MutableRef<ScenePointer>,
 *   viewportTier: string,
 *   animationEnabledRef: MutableRef<boolean>
 * }} props
 */
function CameraRig({
  activeIndex,
  scrollProgressRef,
  pointerRef,
  viewportTier,
  animationEnabledRef,
}) {
  const sceneCamera = useThree((state) => state.camera);
  const cameraRef = useRef(
    /** @type {import("three").PerspectiveCamera} */ (sceneCamera),
  );
  const target = useMemo(() => new Vector3(), []);
  const desiredPosition = useMemo(() => new Vector3(), []);
  const lookAtTarget = useMemo(() => new Vector3(), []);
  const desiredLookAt = useMemo(() => new Vector3(), []);
  const upperTarget = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    const camera = cameraRef.current;
    const safeDelta = Math.min(delta, 0.05);
    const progress = MathUtils.clamp(scrollProgressRef.current, 0, 1);
    const pointer = pointerRef.current;
    const pointerX = MathUtils.clamp(Number(pointer?.x) || 0, -1, 1);
    const pointerY = MathUtils.clamp(Number(pointer?.y) || 0, -1, 1);
    const mobile = viewportTier === "mobile";
    const motionScale = animationEnabledRef.current ? 1 : 0;
    const scrollStage = progress * (SCENE_STAGE_LAYOUT.length - 1);
    const scrollLower = Math.floor(scrollStage);
    const scrollUpper = Math.min(SCENE_STAGE_LAYOUT.length - 1, scrollLower + 1);
    const scrollMix = scrollStage - scrollLower;
    const lowerPosition = SCENE_STAGE_LAYOUT[scrollLower].position;
    const upperPosition = SCENE_STAGE_LAYOUT[scrollUpper].position;

    desiredLookAt
      .set(...lowerPosition)
      .lerp(upperTarget.set(...upperPosition), scrollMix)
      .multiplyScalar(mobile ? 0.08 : 0.14);

    const activePosition = SCENE_STAGE_LAYOUT[activeIndex].position;
    target
      .set(...activePosition)
      .multiplyScalar(mobile ? 0.035 : 0.07)
      .add(desiredLookAt);

    const baseZ = mobile ? 15.4 : viewportTier === "tablet" ? 13.7 : 12.2;
    desiredPosition.set(
      (progress - 0.5) * (mobile ? 0.45 : 1.1) + pointerX * 0.5 * motionScale,
      0.25 + pointerY * 0.34 * motionScale - progress * 0.16,
      baseZ - progress * (mobile ? 0.55 : 1.35),
    );

    camera.position.x = MathUtils.damp(camera.position.x, desiredPosition.x, 4.2, safeDelta);
    camera.position.y = MathUtils.damp(camera.position.y, desiredPosition.y, 4.2, safeDelta);
    camera.position.z = MathUtils.damp(camera.position.z, desiredPosition.z, 4.2, safeDelta);
    lookAtTarget.lerp(target, 1 - Math.exp(-4.8 * safeDelta));
    camera.lookAt(lookAtTarget);
  });

  return null;
}

/**
 * @param {{viewportTier: string, animationEnabledRef: MutableRef<boolean>}} props
 */
function StarField({ viewportTier, animationEnabledRef }) {
  const pointsRef = useRef(
    /** @type {import("three").Points | null} */ (null),
  );
  const positions = useMemo(() => createStarPositions(viewportTier), [viewportTier]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !animationEnabledRef.current) return;
    pointsRef.current.rotation.y += Math.min(delta, 0.05) * 0.006;
    pointsRef.current.rotation.x += Math.min(delta, 0.05) * 0.0015;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#93A4B7"
        size={viewportTier === "mobile" ? 0.042 : 0.034}
        sizeAttenuation
        transparent
        opacity={0.66}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

/**
 * @param {{activeIndex: number, viewportTier: string}} props
 */
function SemanticGraph({ activeIndex, viewportTier }) {
  const instancesRef = useRef(
    /** @type {import("three").InstancedMesh | null} */ (null),
  );
  const cloud = useMemo(() => createNodeCloud(viewportTier), [viewportTier]);
  const edges = useMemo(() => createEdgeAttributes(cloud), [cloud]);
  const helper = useMemo(() => new Object3D(), []);
  const activeColor = useMemo(() => new Color(), []);
  const mutedColor = useMemo(() => new Color("#18344B"), []);

  useLayoutEffect(() => {
    const instances = instancesRef.current;
    if (!instances) return;

    instances.instanceMatrix.setUsage(DynamicDrawUsage);

    for (let index = 0; index < cloud.count; index += 1) {
      const positionIndex = index * 3;
      const isActive = cloud.stageIndices[index] === activeIndex;
      const stage = SCENE_STAGE_LAYOUT[cloud.stageIndices[index]];
      const scale = cloud.scales[index] * (isActive ? 1.65 : 1);

      helper.position.set(
        cloud.positions[positionIndex],
        cloud.positions[positionIndex + 1],
        cloud.positions[positionIndex + 2],
      );
      helper.scale.setScalar(scale);
      helper.updateMatrix();
      instances.setMatrixAt(index, helper.matrix);
      activeColor.set(stage.accent).lerp(mutedColor, isActive ? 0.08 : 0.72);
      instances.setColorAt(index, activeColor);
    }

    instances.instanceMatrix.needsUpdate = true;
    if (instances.instanceColor) instances.instanceColor.needsUpdate = true;
  }, [activeColor, activeIndex, cloud, helper, mutedColor]);

  return (
    <group>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <primitive attach="attributes-position" object={edges.position} />
          <primitive attach="attributes-color" object={edges.color} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.34}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      <instancedMesh ref={instancesRef} args={[undefined, undefined, cloud.count]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          vertexColors
          transparent
          opacity={0.92}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}

/**
 * @param {{
 *   activeIndex: number,
 *   animationEnabledRef: MutableRef<boolean>
 * }} props
 */
function SemanticCore({ activeIndex, animationEnabledRef }) {
  const coreRef = useRef(
    /** @type {import("three").Mesh<import("three").BufferGeometry, import("three").MeshBasicMaterial> | null} */ (null),
  );
  const ringRef = useRef(
    /** @type {import("three").Mesh | null} */ (null),
  );
  const targetColor = useMemo(() => new Color(), []);

  useFrame((state, delta) => {
    const core = coreRef.current;
    const ring = ringRef.current;
    if (!core || !ring) return;

    const safeDelta = Math.min(delta, 0.05);
    const color = SCENE_STAGE_LAYOUT[activeIndex].accent;
    targetColor.set(color);
    core.material.color.lerp(targetColor, 1 - Math.exp(-5 * safeDelta));

    if (!animationEnabledRef.current) return;

    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.35) * 0.055;
    core.scale.setScalar(pulse);
    core.rotation.x += safeDelta * 0.09;
    core.rotation.y += safeDelta * 0.13;
    ring.rotation.z -= safeDelta * 0.11;
    ring.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.18 + 0.8;
  });

  return (
    <group position={[0, 0, 0.55]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.72, 2]} />
        <meshBasicMaterial
          color={SCENE_STAGE_LAYOUT[activeIndex].accent}
          transparent
          opacity={0.38}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={1.18}>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshBasicMaterial
          color="#46D7E8"
          wireframe
          transparent
          opacity={0.58}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[0.8, 0.18, 0]}>
        <torusGeometry args={[1.12, 0.012, 6, 80]} />
        <meshBasicMaterial
          color="#A78BFA"
          transparent
          opacity={0.78}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/**
 * @param {{
 *   animationEnabledRef: MutableRef<boolean>,
 *   viewportTier: string
 * }} props
 */
function SignalFlow({ animationEnabledRef, viewportTier }) {
  const pointsRef = useRef(
    /** @type {import("three").Points | null} */ (null),
  );
  const route = useMemo(
    () => new CatmullRomCurve3(createSignalRoute(), false, "catmullrom", 0.34),
    [],
  );
  const positions = useMemo(() => new Float32Array(SIGNAL_COUNT * 3), []);
  const temp = useMemo(() => new Vector3(), []);
  const elapsedRef = useRef(0);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    if (animationEnabledRef.current) elapsedRef.current += Math.min(delta, 0.05);

    const positionAttribute = /** @type {import("three").BufferAttribute} */ (
      points.geometry.attributes.position
    );
    for (let index = 0; index < SIGNAL_COUNT; index += 1) {
      const offset = index / SIGNAL_COUNT;
      const progress = (offset + elapsedRef.current * 0.085) % 1;
      route.getPointAt(progress, temp);
      const shimmer = Math.sin(progress * Math.PI * 10 + index) * 0.035;
      positionAttribute.setXYZ(index, temp.x, temp.y + shimmer, temp.z + shimmer);
    }
    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#F5B942"
        size={viewportTier === "mobile" ? 0.075 : 0.065}
        sizeAttenuation
        transparent
        opacity={0.94}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
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
function Astronaut({
  pointerRef,
  scrollProgressRef,
  viewportTier,
  animationEnabledRef,
}) {
  const groupRef = useRef(
    /** @type {import("three").Group | null} */ (null),
  );
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
      gltf.animations.find((clip) => clip.name.toLowerCase() === "idle") ??
      gltf.animations[0];

    if (idleClip) {
      const action = mixer.clipAction(idleClip);
      action.reset().fadeIn(0.25).play();
    }

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

    const targetRotationY = 2.18 + pointerX * 0.2 + progress * 0.18;
    const targetRotationX = pointerY * 0.08 - progress * 0.08;
    group.rotation.y = MathUtils.damp(group.rotation.y, targetRotationY, 3.8, safeDelta);
    group.rotation.x = MathUtils.damp(group.rotation.x, targetRotationX, 3.8, safeDelta);

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

/**
 * @param {{onReadyRef: MutableRef<(() => void) | undefined>}} props
 */
function ReadySignal({ onReadyRef }) {
  const didSignalRef = useRef(false);

  useFrame(() => {
    if (didSignalRef.current) return;
    didSignalRef.current = true;
    onReadyRef.current?.();
  });

  return null;
}

/**
 * @param {{onContextLostRef: MutableRef<(() => void) | undefined>}} props
 */
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
 *   activeIndex: number,
 *   scrollProgressRef: MutableRef<number>,
 *   pointerRef: MutableRef<ScenePointer>,
 *   viewportTier: string,
 *   animationEnabledRef: MutableRef<boolean>,
 *   onReadyRef: MutableRef<(() => void) | undefined>,
 *   onContextLostRef: MutableRef<(() => void) | undefined>
 * }} props
 */
export function CosmicWorld({
  activeIndex,
  scrollProgressRef,
  pointerRef,
  viewportTier,
  animationEnabledRef,
  onReadyRef,
  onContextLostRef,
}) {
  return (
    <>
      <color attach="background" args={["#030712"]} />
      <fog attach="fog" args={["#030712", 13, 30]} />
      <ambientLight intensity={0.72} color="#93A4B7" />
      <directionalLight position={[-4, 5, 7]} intensity={2.1} color="#EAF2F8" />
      <pointLight position={[1.5, 2, 4]} intensity={3.6} color="#A78BFA" />
      <pointLight position={[5, -2, 3]} intensity={2.4} color="#46D7E8" />

      <CameraRig
        activeIndex={activeIndex}
        scrollProgressRef={scrollProgressRef}
        pointerRef={pointerRef}
        viewportTier={viewportTier}
        animationEnabledRef={animationEnabledRef}
      />
      <StarField viewportTier={viewportTier} animationEnabledRef={animationEnabledRef} />
      <SemanticGraph activeIndex={activeIndex} viewportTier={viewportTier} />
      <SemanticCore activeIndex={activeIndex} animationEnabledRef={animationEnabledRef} />
      <SignalFlow animationEnabledRef={animationEnabledRef} viewportTier={viewportTier} />

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
