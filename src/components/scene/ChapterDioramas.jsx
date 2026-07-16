import { MathUtils, Shape, Vector3, CatmullRomCurve3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { chapterPalette, normalizeChapter } from "./chapterConfig";
import { RoundedGeometry, StudioSurface } from "./ScenePrimitives";

/**
 * @template T
 * @typedef {{current: T}} MutableRef
 */

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

/** @typedef {{x?: number, y?: number, impulse?: number}} ScenePointer */
/** @typedef {{x: number, y: number, scale: number, travel?: number}} DioramaLayout */

const clamp01 = (value) => MathUtils.clamp(Number(value) || 0, 0, 1);

/** @type {Readonly<Record<string, DioramaLayout>>} */
const desktopLayouts = Object.freeze({
  impact: { x: 3.05, y: -2.45, scale: 0.62 },
  practice: { x: 2.85, y: -2.25, scale: 0.72 },
  kyber: { x: -3.2, y: -0.25, scale: 0.82 },
  tremor: { x: -3.25, y: -0.2, scale: 0.82 },
  experience: { x: 3.5, y: -2.6, scale: 0.55 },
  about: { x: 3.5, y: -2.7, scale: 0.58 },
  contact: { x: 3.25, y: -0.62, scale: 0.82 },
});

/** @type {Readonly<Record<string, DioramaLayout>>} */
const mobileLayouts = Object.freeze({
  impact: { x: 1.25, y: -2.35, scale: 0.44, travel: 6 },
  practice: { x: 1.15, y: -2.4, scale: 0.42, travel: 8 },
  kyber: { x: 0, y: 3, scale: 0.55, travel: 10 },
  tremor: { x: 0, y: 3, scale: 0.58, travel: 10 },
  experience: { x: 1.35, y: -2.35, scale: 0.42, travel: 7 },
  about: { x: 0.35, y: -3.5, scale: 0.4, travel: 8 },
  contact: { x: 1.2, y: -2, scale: 0.45, travel: 5 },
});

/**
 * Keep the chapter objects in the illustrated margins instead of under body
 * copy. The compositions deliberately differ because every chapter uses a
 * different editorial layout.
 *
 * @param {import('./chapterConfig').ChapterId} chapter
 * @param {boolean} mobile
 */
function getDioramaLayout(chapter, mobile) {
  const layouts = mobile ? mobileLayouts : desktopLayouts;
  return layouts[chapter] ?? { x: mobile ? 1.1 : 3.2, y: mobile ? -2.3 : -1.7, scale: mobile ? 0.44 : 0.72 };
}

/** @param {{motionRef: MutableRef<ChapterMotionState>}} props */
function WorkDiorama({ motionRef }) {
  const feedRef = useRef(/** @type {import('three').Group | null} */ (null));
  const clockRef = useRef(/** @type {import('three').Mesh | null} */ (null));
  const sealRef = useRef(/** @type {import('three').Group | null} */ (null));

  useFrame((state) => {
    const progress = clamp01(motionRef.current.progress);
    const time = state.clock.elapsedTime;
    if (feedRef.current) feedRef.current.position.x = ((time * 0.34 + progress * 1.8) % 2.4) - 1.2;
    if (clockRef.current) clockRef.current.rotation.z = -time * 0.18 - progress * Math.PI * 1.6;
    if (sealRef.current) {
      const pulse = 1 + Math.sin(time * 1.25) * 0.035;
      sealRef.current.scale.setScalar(pulse);
      sealRef.current.rotation.z = Math.sin(time * 0.34) * 0.06;
    }
  });

  return (
    <group position={[0, 0.05, 0]} rotation={[-0.08, -0.2, 0.02]}>
      <group ref={feedRef} position={[-0.8, 0, 0]}>
        {[-0.62, 0, 0.62].map((offset, index) => (
          <mesh key={offset} position={[offset, (index - 1) * 0.08, index * -0.08]} rotation={[0.04, 0, -0.04]}>
            <RoundedGeometry size={[0.78, 0.055, 1.02]} radius={0.025} segments={5} />
            <StudioSurface
              color={index === 1 ? chapterPalette.cream : "#D9CEBB"}
              roughness={0.76}
              clearcoat={0.04}
            />
          </mesh>
        ))}
      </group>
      <mesh ref={clockRef} position={[0.18, 0.35, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.14, 64]} />
        <StudioSurface color={chapterPalette.sky} roughness={0.42} clearcoat={0.3} />
      </mesh>
      <mesh position={[0.18, 0.35, 0.47]}>
        <RoundedGeometry size={[0.055, 0.42, 0.055]} radius={0.026} segments={4} />
        <StudioSurface color={chapterPalette.ink} roughness={0.34} />
      </mesh>
      <mesh position={[0.32, 0.49, 0.48]} rotation={[0, 0, -0.72]}>
        <RoundedGeometry size={[0.045, 0.28, 0.045]} radius={0.021} segments={4} />
        <StudioSurface color={chapterPalette.ink} roughness={0.34} />
      </mesh>
      <group ref={sealRef} position={[1.42, -0.15, 0.24]}>
        <mesh>
          <torusGeometry args={[0.46, 0.12, 16, 64]} />
          <StudioSurface color={chapterPalette.orange} roughness={0.4} clearcoat={0.28} />
        </mesh>
        <mesh position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.08, 64]} />
          <StudioSurface color={chapterPalette.cream} roughness={0.68} clearcoat={0.08} />
        </mesh>
        <mesh position={[-0.1, -0.04, 0.09]} rotation={[0, 0, -0.72]}>
          <RoundedGeometry size={[0.09, 0.28, 0.075]} radius={0.035} segments={4} />
          <StudioSurface color={chapterPalette.moss} roughness={0.42} />
        </mesh>
        <mesh position={[0.11, -0.01, 0.09]} rotation={[0, 0, 0.78]}>
          <RoundedGeometry size={[0.09, 0.44, 0.075]} radius={0.035} segments={4} />
          <StudioSurface color={chapterPalette.moss} roughness={0.42} />
        </mesh>
      </group>
    </group>
  );
}

/** @param {{motionRef: MutableRef<ChapterMotionState>, viewportTier: string}} props */
function PracticeDiorama({ motionRef, viewportTier }) {
  const groupRef = useRef(/** @type {import('three').Group | null} */ (null));
  const wheelRef = useRef(/** @type {import('three').Group | null} */ (null));
  const prismRef = useRef(/** @type {import('three').Mesh | null} */ (null));

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const progress = clamp01(motionRef.current.progress);
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(time * 0.18) * 0.08;
    if (wheelRef.current) wheelRef.current.rotation.z = time * 0.28 + progress * Math.PI;
    if (prismRef.current) {
      prismRef.current.rotation.x = time * 0.16;
      prismRef.current.rotation.y = time * 0.22;
    }
  });

  const compact = viewportTier === "mobile";
  const spacing = compact ? 1.02 : 1.18;

  return (
    <group ref={groupRef} position={[0, 0.05, 0]} scale={compact ? 0.88 : 1}>
      <group position={[-spacing * 1.5, 0.1, 0]} rotation={[0.1, 0.15, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.17, 0.17, 1.15, 32]} />
          <StudioSurface color={chapterPalette.sky} roughness={0.42} clearcoat={0.26} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.76, 32]} />
          <StudioSurface color={chapterPalette.sky} roughness={0.42} clearcoat={0.26} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.27, 32, 20]} />
          <StudioSurface color={chapterPalette.orange} roughness={0.36} clearcoat={0.32} />
        </mesh>
      </group>

      <group ref={wheelRef} position={[-spacing * 0.5, 0.08, 0.05]}>
        <mesh>
          <torusGeometry args={[0.45, 0.13, 16, 64]} />
          <StudioSurface color={chapterPalette.orange} roughness={0.38} clearcoat={0.3} />
        </mesh>
        {[0, Math.PI / 2].map((rotation) => (
          <mesh key={rotation} rotation={[0, 0, rotation]}>
            <RoundedGeometry size={[0.12, 0.84, 0.12]} radius={0.055} segments={4} />
            <StudioSurface color={chapterPalette.cream} roughness={0.62} clearcoat={0.1} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.18, 28, 18]} />
          <StudioSurface color={chapterPalette.ink} roughness={0.32} clearcoat={0.24} />
        </mesh>
      </group>

      <group position={[spacing * 0.52, 0.02, 0]} rotation={[0.03, -0.08, -0.02]}>
        <mesh>
          <RoundedGeometry size={[0.88, 0.62, 0.58]} radius={0.12} segments={5} />
          <StudioSurface color={chapterPalette.moss} roughness={0.5} clearcoat={0.18} />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <torusGeometry args={[0.25, 0.07, 12, 48, Math.PI]} />
          <StudioSurface color={chapterPalette.cream} roughness={0.56} />
        </mesh>
        <mesh position={[0, 0.02, 0.32]}>
          <RoundedGeometry size={[0.28, 0.12, 0.06]} radius={0.045} segments={4} />
          <StudioSurface color={chapterPalette.orange} roughness={0.4} clearcoat={0.22} />
        </mesh>
      </group>

      <group position={[spacing * 1.5, 0.08, 0]}>
        <mesh ref={prismRef} scale={[0.78, 1, 0.78]}>
          <sphereGeometry args={[0.52, 36, 24]} />
          <StudioSurface
            color={chapterPalette.sky}
            emissive={chapterPalette.sky}
            emissiveIntensity={0.08}
            roughness={0.28}
            metalness={0.08}
            clearcoat={0.46}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[0.65, 0.045, 12, 64]} />
          <StudioSurface color={chapterPalette.cream} roughness={0.52} clearcoat={0.14} />
        </mesh>
      </group>
    </group>
  );
}

/** @param {{motionRef: MutableRef<ChapterMotionState>}} props */
function KyberDiorama({ motionRef }) {
  const monolithRef = useRef(/** @type {import('three').Group | null} */ (null));
  const framesRef = useRef(/** @type {import('three').Group | null} */ (null));

  useFrame((state) => {
    const progress = clamp01(motionRef.current.progress);
    if (monolithRef.current) {
      monolithRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.34) * 0.1;
      monolithRef.current.rotation.y = -0.18 + progress * 0.28;
    }
    if (framesRef.current) framesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.06;
  });

  return (
    <group rotation={[-0.08, 0, 0]}>
      <group ref={framesRef}>
        {[-0.86, 0.86].map((x, index) => (
          <group key={x} position={[x, 0, -0.12 - index * 0.16]} rotation={[0, index ? -0.1 : 0.1, 0]}>
            <mesh position={[0, 0.94, 0]}>
              <RoundedGeometry size={[0.12, 0.12, 0.38]} radius={0.05} segments={4} />
              <StudioSurface color={chapterPalette.orange} roughness={0.4} clearcoat={0.28} />
            </mesh>
            <mesh position={[0, -0.94, 0]}>
              <RoundedGeometry size={[0.12, 0.12, 0.38]} radius={0.05} segments={4} />
              <StudioSurface color={chapterPalette.orange} roughness={0.4} clearcoat={0.28} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <RoundedGeometry size={[0.12, 2, 0.38]} radius={0.055} segments={4} />
              <StudioSurface color={chapterPalette.orange} roughness={0.4} clearcoat={0.28} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 1.02, -0.18]}>
          <RoundedGeometry size={[1.84, 0.12, 0.38]} radius={0.055} segments={4} />
          <StudioSurface color={chapterPalette.orange} roughness={0.4} clearcoat={0.28} />
        </mesh>
        <mesh position={[0, -1.02, -0.18]}>
          <RoundedGeometry size={[1.84, 0.12, 0.38]} radius={0.055} segments={4} />
          <StudioSurface color={chapterPalette.orange} roughness={0.4} clearcoat={0.28} />
        </mesh>
      </group>
      <group ref={monolithRef} rotation={[0.04, -0.18, -0.03]}>
        <mesh>
          <RoundedGeometry size={[0.86, 1.78, 0.56]} radius={0.12} segments={6} />
          <StudioSurface color="#202739" roughness={0.32} metalness={0.08} clearcoat={0.34} />
        </mesh>
        <mesh position={[0, 0.18, 0.3]}>
          <RoundedGeometry size={[0.16, 0.78, 0.035]} radius={0.016} segments={4} />
          <StudioSurface
            color={chapterPalette.sky}
            emissive={chapterPalette.sky}
            emissiveIntensity={0.18}
            roughness={0.3}
            clearcoat={0.38}
          />
        </mesh>
      </group>
    </group>
  );
}

/** @param {{motionRef: MutableRef<ChapterMotionState>}} props */
function TremorDiorama({ motionRef }) {
  const moonRef = useRef(/** @type {import('three').Group | null} */ (null));
  const orbitRef = useRef(/** @type {import('three').Group | null} */ (null));

  useFrame((state) => {
    const progress = clamp01(motionRef.current.progress);
    if (moonRef.current) moonRef.current.rotation.y = state.clock.elapsedTime * 0.09 + progress * 0.55;
    if (orbitRef.current) orbitRef.current.rotation.z = state.clock.elapsedTime * 0.18 + progress * Math.PI;
  });

  return (
    <group position={[0, 0.02, 0]}>
      <group ref={moonRef}>
        <mesh>
          <sphereGeometry args={[1.22, 48, 32]} />
          <StudioSurface color="#B7AD9B" roughness={0.8} clearcoat={0.03} />
        </mesh>
        {[
          [0.52, 0.54, 1.02, 0.2, -0.44, 0.42],
          [-0.58, 0.28, 1.04, 0.25, -0.24, -0.48],
          [0.08, -0.62, 1.1, 0.18, 0.52, 0.07],
          [0.78, -0.28, 0.84, 0.13, 0.23, 0.7],
        ].map(([x, y, z, scale, rotationX, rotationY]) => (
          <group
            key={`${x}-${y}`}
            position={[x, y, z]}
            rotation={[rotationX, rotationY, 0]}
            scale={scale}
          >
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.66, 0.7, 0.05, 32]} />
              <StudioSurface color="#777064" roughness={0.9} clearcoat={0} />
            </mesh>
            <mesh position={[0, 0, 0.045]}>
              <torusGeometry args={[0.72, 0.13, 12, 48]} />
              <StudioSurface color="#A69C89" roughness={0.82} clearcoat={0.02} />
            </mesh>
          </group>
        ))}
      </group>
      <group ref={orbitRef} rotation={[0.48, 0.12, 0]}>
        <mesh>
          <torusGeometry args={[1.72, 0.025, 12, 72]} />
          <StudioSurface
            color={chapterPalette.sky}
            emissive={chapterPalette.sky}
            emissiveIntensity={0.2}
            roughness={0.34}
            clearcoat={0.28}
          />
        </mesh>
        <mesh position={[1.72, 0, 0]}>
          <sphereGeometry args={[0.15, 28, 18]} />
          <StudioSurface
            color={chapterPalette.orange}
            emissive={chapterPalette.orange}
            emissiveIntensity={0.3}
            roughness={0.3}
            clearcoat={0.34}
          />
        </mesh>
      </group>
    </group>
  );
}

/** @param {{motionRef: MutableRef<ChapterMotionState>}} props */
function ExperienceDiorama({ motionRef }) {
  const trailRef = useRef(/** @type {import('three').Mesh | null} */ (null));
  const route = useMemo(
    () => new CatmullRomCurve3([
      new Vector3(-1.4, -0.82, 0),
      new Vector3(-0.65, -0.05, 0.08),
      new Vector3(0.35, -0.36, 0.06),
      new Vector3(1.4, 0.58, 0),
    ]),
    [],
  );

  useFrame((state) => {
    const progress = clamp01(motionRef.current.progress);
    if (trailRef.current) {
      trailRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.26) * 0.025 + progress * 0.03;
    }
  });

  return (
    <group rotation={[-0.04, -0.12, 0]}>
      {[
        [-1.35, -0.5, chapterPalette.moss],
        [1.32, 0.5, chapterPalette.orange],
      ].map(([x, y, color], index) => (
        <group key={String(x)} position={[Number(x), Number(y), 0]}>
          <mesh position={[0, 0.25, 0]}>
            <RoundedGeometry size={[0.42, 1.48, 0.4]} radius={0.17} segments={6} />
            <StudioSurface color={String(color)} roughness={0.46} clearcoat={0.24} />
          </mesh>
          <mesh
            position={[0, 1.04, 0]}
            rotation={[0, 0, index ? -0.12 : 0.12]}
            scale={[1, 1.22, 1]}
          >
            <sphereGeometry args={[0.33, 32, 20]} />
            <StudioSurface color={chapterPalette.cream} roughness={0.5} clearcoat={0.16} />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.34, 0.48, 0.2, 32]} />
            <StudioSurface color={chapterPalette.ink} roughness={0.38} clearcoat={0.22} />
          </mesh>
          <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.24, 0.035, 10, 40]} />
            <StudioSurface color={chapterPalette.sky} roughness={0.34} clearcoat={0.3} />
          </mesh>
        </group>
      ))}
      <mesh ref={trailRef}>
        <tubeGeometry args={[route, 64, 0.035, 10, false]} />
        <StudioSurface
          color={chapterPalette.sky}
          emissive={chapterPalette.sky}
          emissiveIntensity={0.25}
          roughness={0.3}
          clearcoat={0.3}
        />
      </mesh>
    </group>
  );
}

/** @param {{motionRef: MutableRef<ChapterMotionState>}} props */
function AboutDiorama({ motionRef }) {
  const cameraRef = useRef(/** @type {import('three').Group | null} */ (null));
  const lensRef = useRef(/** @type {import('three').Group | null} */ (null));

  useFrame((state) => {
    const progress = clamp01(motionRef.current.progress);
    if (cameraRef.current) {
      cameraRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.56) * 0.08;
      cameraRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.045 + progress * 0.04;
    }
    if (lensRef.current) lensRef.current.rotation.z = -state.clock.elapsedTime * 0.22;
  });

  return (
    <group ref={cameraRef} rotation={[0.08, -0.3, -0.03]}>
      <mesh>
        <RoundedGeometry size={[2.25, 1.34, 0.75]} radius={0.18} segments={6} />
        <StudioSurface color={chapterPalette.moss} roughness={0.46} clearcoat={0.22} />
      </mesh>
      <mesh position={[-0.62, 0.82, -0.05]}>
        <RoundedGeometry size={[0.72, 0.35, 0.5]} radius={0.11} segments={5} />
        <StudioSurface color={chapterPalette.orange} roughness={0.38} clearcoat={0.3} />
      </mesh>
      <group ref={lensRef} position={[0.42, -0.04, 0.58]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.62, 0.72, 0.64, 48]} />
          <StudioSurface color={chapterPalette.ink} roughness={0.28} metalness={0.09} clearcoat={0.38} />
        </mesh>
        <mesh position={[0, 0, 0.36]}>
          <torusGeometry args={[0.43, 0.1, 16, 64]} />
          <StudioSurface color={chapterPalette.cream} roughness={0.48} clearcoat={0.18} />
        </mesh>
        <mesh position={[0, 0, 0.39]}>
          <circleGeometry args={[0.34, 48]} />
          <StudioSurface color={chapterPalette.sky} roughness={0.18} metalness={0.12} clearcoat={0.52} />
        </mesh>
      </group>
      <mesh position={[-0.75, 0.12, 0.42]}>
        <sphereGeometry args={[0.17, 28, 18]} />
        <StudioSurface color={chapterPalette.cream} roughness={0.44} clearcoat={0.24} />
      </mesh>
    </group>
  );
}

function createPaperPlaneShape() {
  const shape = new Shape();
  shape.moveTo(-1.25, -0.45);
  shape.lineTo(1.35, 0);
  shape.lineTo(-1.25, 0.52);
  shape.lineTo(-0.52, 0.02);
  shape.closePath();
  return shape;
}

/** @param {{motionRef: MutableRef<ChapterMotionState>}} props */
function ContactDiorama({ motionRef }) {
  const planeRef = useRef(/** @type {import('three').Group | null} */ (null));
  const beaconRef = useRef(/** @type {import('three').Group | null} */ (null));
  const shape = useMemo(() => createPaperPlaneShape(), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const progress = clamp01(motionRef.current.progress);
    if (planeRef.current) {
      planeRef.current.position.x = Math.sin(time * 0.38) * 0.22 + (progress - 0.5) * 0.4;
      planeRef.current.position.y = Math.cos(time * 0.5) * 0.08;
      planeRef.current.rotation.z = -0.12 + Math.sin(time * 0.3) * 0.05;
    }
    if (beaconRef.current) {
      const pulse = 0.96 + Math.sin(time * 1.2) * 0.05;
      beaconRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <group ref={planeRef} position={[-0.45, 0.2, 0.08]} rotation={[0.2, -0.18, -0.12]}>
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                depth: 0.08,
                bevelEnabled: true,
                bevelSegments: 4,
                bevelSize: 0.035,
                bevelThickness: 0.025,
                steps: 1,
              },
            ]}
          />
          <StudioSurface color={chapterPalette.cream} roughness={0.54} clearcoat={0.12} />
        </mesh>
        <mesh position={[-0.32, 0.02, 0.09]} rotation={[0, 0, -0.35]}>
          <RoundedGeometry size={[1.02, 0.035, 0.035]} radius={0.016} segments={4} />
          <StudioSurface color={chapterPalette.orange} roughness={0.36} clearcoat={0.3} />
        </mesh>
      </group>
      <group ref={beaconRef} position={[1.35, -0.62, -0.1]}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.42, 0.9, 32]} />
          <StudioSurface color={chapterPalette.moss} roughness={0.48} clearcoat={0.2} />
        </mesh>
        <mesh position={[0, 0.69, 0]}>
          <sphereGeometry args={[0.26, 32, 20]} />
          <StudioSurface
            color={chapterPalette.orange}
            emissive={chapterPalette.orange}
            emissiveIntensity={0.5}
            roughness={0.28}
            clearcoat={0.42}
          />
        </mesh>
        <mesh position={[0, 0.69, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.52, 0.035, 12, 64]} />
          <StudioSurface
            color={chapterPalette.sky}
            emissive={chapterPalette.sky}
            emissiveIntensity={0.3}
            roughness={0.32}
            clearcoat={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}

/** @param {{chapter: import('./chapterConfig').ChapterId, motionRef: MutableRef<ChapterMotionState>, viewportTier: string}} props */
function Diorama({ chapter, motionRef, viewportTier }) {
  if (chapter === "impact") return <WorkDiorama motionRef={motionRef} />;
  if (chapter === "practice") return <PracticeDiorama motionRef={motionRef} viewportTier={viewportTier} />;
  if (chapter === "kyber") return <KyberDiorama motionRef={motionRef} />;
  if (chapter === "tremor") return <TremorDiorama motionRef={motionRef} />;
  if (chapter === "experience") return <ExperienceDiorama motionRef={motionRef} />;
  if (chapter === "about") return <AboutDiorama motionRef={motionRef} />;
  if (chapter === "contact") return <ContactDiorama motionRef={motionRef} />;
  return null;
}

/**
 * @param {{
 *   chapter: import('./chapterConfig').ChapterId,
 *   transitionRole: 'active' | 'previous',
 *   motionRef: MutableRef<ChapterMotionState>,
 *   pointerRef: MutableRef<ScenePointer>,
 *   viewportTier: string
 * }} props
 */
function DioramaLayer({ chapter, transitionRole, motionRef, pointerRef, viewportTier }) {
  const groupRef = useRef(/** @type {import('three').Group | null} */ (null));
  const mobile = viewportTier === "mobile";
  const layout = getDioramaLayout(chapter, mobile);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // The incoming chapter's normalized enter phase is the useful cross-scene
    // hand-off. transitionProgress describes that chapter's later exit window.
    const transition = clamp01(motionRef.current.enter ?? 1);
    const progress = clamp01(motionRef.current.progress);
    const pointer = pointerRef.current;
    const pointerX = MathUtils.clamp(Number(pointer?.x) || 0, -1, 1);
    const pointerY = MathUtils.clamp(Number(pointer?.y) || 0, -1, 1);
    const impulse = MathUtils.clamp(Number(pointer?.impulse) || 0, 0, 1);
    const active = transitionRole === "active";
    const reveal = active ? transition : 1 - transition;
    const baseX = layout.x;
    const entryX = active ? 1.05 * (1 - reveal) : -1.05 * (1 - reveal);
    const targetScale = layout.scale * (0.84 + reveal * 0.16);
    const safeDelta = Math.min(delta, 0.05);

    group.visible = reveal > 0.025;
    group.position.x = MathUtils.damp(group.position.x, baseX + entryX + pointerX * 0.1, 5, safeDelta);
    const chapterTravel = mobile ? (layout.travel ?? 0) * (progress - 0.5) : 0;
    group.position.y = MathUtils.damp(
      group.position.y,
      layout.y + chapterTravel - pointerY * 0.07,
      5,
      safeDelta,
    );
    group.rotation.x = MathUtils.damp(group.rotation.x, pointerY * 0.035, 4.5, safeDelta);
    group.rotation.y = MathUtils.damp(group.rotation.y, pointerX * 0.045 + impulse * 0.055, 4.5, safeDelta);
    group.scale.setScalar(MathUtils.damp(group.scale.x, targetScale, 5.5, safeDelta));
  });

  return (
    <group ref={groupRef} position={[layout.x, layout.y, 0]} scale={layout.scale}>
      <Diorama chapter={chapter} motionRef={motionRef} viewportTier={viewportTier} />
    </group>
  );
}

/**
 * Only the active diorama and its outgoing neighbour are mounted. That keeps
 * the persistent canvas expressive without paying for the entire page at once.
 *
 * @param {{
 *   activeChapter: string,
 *   motionRef: MutableRef<ChapterMotionState>,
 *   pointerRef: MutableRef<ScenePointer>,
 *   viewportTier: string
 * }} props
 */
export function ChapterDioramas({ activeChapter, motionRef, pointerRef, viewportTier }) {
  const active = normalizeChapter(activeChapter);
  const lastActiveRef = useRef(active);
  const [previous, setPrevious] = useState(/** @type {import('./chapterConfig').ChapterId | null} */ (null));

  useEffect(() => {
    if (lastActiveRef.current === active) return undefined;
    const outgoing = lastActiveRef.current;
    lastActiveRef.current = active;
    const frame = requestAnimationFrame(() => setPrevious(outgoing));
    return () => cancelAnimationFrame(frame);
  }, [active]);

  return (
    <>
      {previous !== null && previous !== active && previous !== "hero" ? (
        <DioramaLayer
          key={`previous-${previous}`}
          chapter={previous}
          transitionRole="previous"
          motionRef={motionRef}
          pointerRef={pointerRef}
          viewportTier={viewportTier}
        />
      ) : null}
      {active !== "hero" ? (
        <DioramaLayer
          key={`active-${active}`}
          chapter={active}
          transitionRole="active"
          motionRef={motionRef}
          pointerRef={pointerRef}
          viewportTier={viewportTier}
        />
      ) : null}
    </>
  );
}
