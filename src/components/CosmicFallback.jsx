import { useId } from "react";
import styles from "./scene/fallback.module.css";

const stars = [
  [12, 24, 0.24],
  [18, 73, 0.15],
  [28, 15, 0.18],
  [35, 84, 0.2],
  [46, 27, 0.12],
  [57, 79, 0.16],
  [70, 16, 0.2],
  [79, 68, 0.14],
  [90, 31, 0.19],
  [94, 82, 0.12],
];

export default function CosmicFallback() {
  const gradientId = useId().replaceAll(":", "");
  const coreGradientId = `${gradientId}-core`;
  const trailGradientId = `${gradientId}-trail`;

  return (
    <div
      className={`cosmic-fallback ${styles.fallback}`}
      data-testid="cosmic-fallback"
      aria-hidden="true"
    >
      <svg
        className={styles.art}
        viewBox="0 0 100 100"
        role="presentation"
        focusable="false"
      >
        <defs>
          <radialGradient id={coreGradientId} cx="44%" cy="40%" r="58%">
            <stop offset="0%" stopColor="#F3EFE7" stopOpacity="0.98" />
            <stop offset="25%" stopColor="#F26A3D" stopOpacity="0.42" />
            <stop offset="66%" stopColor="#3BA39A" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#05070B" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={trailGradientId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#F26A3D" stopOpacity="0" />
            <stop offset="42%" stopColor="#F26A3D" stopOpacity="0.64" />
            <stop offset="100%" stopColor="#3BA39A" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        <g className={styles.stars}>
          {stars.map(([x, y, radius]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={radius} />
          ))}
        </g>

        <g className={styles.orbits} fill="none">
          <ellipse cx="55" cy="49" rx="27" ry="10" transform="rotate(-12 55 49)" />
          <ellipse cx="55" cy="49" rx="37" ry="16" transform="rotate(18 55 49)" />
          <ellipse cx="55" cy="49" rx="45" ry="21" transform="rotate(-4 55 49)" />
        </g>

        <path
          className={styles.trail}
          d="M 4 78 C 21 70 28 38 48 46 S 72 61 97 28"
          fill="none"
          stroke={`url(#${trailGradientId})`}
        />
        <circle cx="55" cy="49" r="16" fill={`url(#${coreGradientId})`} />
        <circle className={styles.core} cx="55" cy="49" r="3.1" />
        <circle className={styles.halo} cx="55" cy="49" r="7.4" fill="none" />

        <g className={styles.astronaut} transform="translate(71 27) rotate(13)">
          <rect x="-4.5" y="6" width="9" height="12" rx="3.6" />
          <circle cx="0" cy="2" r="5.5" />
          <path d="M -3.7 11 L -9 16 M 3.7 11 L 9 15 M -2.8 17 L -5.7 26 M 2.8 17 L 6.4 26" />
          <path className={styles.visor} d="M -3.7 1 Q 0 -2 3.7 1 L 2.9 4.8 Q 0 6.5 -2.9 4.8 Z" />
        </g>
      </svg>
    </div>
  );
}
