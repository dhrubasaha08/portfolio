import { useEffect, useMemo } from "react";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * @param {{
 *   size: [number, number, number],
 *   radius?: number,
 *   segments?: number
 * }} props
 */
export function RoundedGeometry({ size, radius = 0.08, segments = 4 }) {
  const [width, height, depth] = size;
  const geometry = useMemo(
    () => new RoundedBoxGeometry(width, height, depth, segments, radius),
    [depth, height, radius, segments, width],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  return <primitive object={geometry} attach="geometry" />;
}

/**
 * A soft, lightly coated material keeps the procedural objects dimensional
 * without turning the illustrated world into glossy product-render chrome.
 *
 * @param {{
 *   color: string,
 *   emissive?: string,
 *   emissiveIntensity?: number,
 *   roughness?: number,
 *   metalness?: number,
 *   clearcoat?: number
 * }} props
 */
export function StudioSurface({
  color,
  emissive = "#000000",
  emissiveIntensity = 0,
  roughness = 0.58,
  metalness = 0.035,
  clearcoat = 0.16,
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      roughness={roughness}
      metalness={metalness}
      clearcoat={clearcoat}
      clearcoatRoughness={0.52}
    />
  );
}
