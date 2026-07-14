const nodePositions = [
  [18, 45],
  [31, 24],
  [51, 16],
  [72, 28],
  [82, 51],
  [68, 72],
  [43, 81],
  [22, 68],
];

export default function CosmicFallback() {
  return (
    <div className="cosmic-fallback" data-testid="cosmic-fallback" aria-hidden="true">
      <svg viewBox="0 0 100 100" role="presentation" focusable="false">
        <defs>
          <radialGradient id="fallback-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eaf2f8" stopOpacity="0.95" />
            <stop offset="28%" stopColor="#a78bfa" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#07111f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fallback-trace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#46d7e8" stopOpacity="0.15" />
            <stop offset="55%" stopColor="#46d7e8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <g className="fallback-orbits" fill="none">
          <ellipse cx="50" cy="50" rx="34" ry="19" transform="rotate(-18 50 50)" />
          <ellipse cx="50" cy="50" rx="42" ry="27" transform="rotate(38 50 50)" />
          <circle cx="50" cy="50" r="30" />
        </g>
        <g className="fallback-traces" fill="none">
          {nodePositions.map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M 50 50 Q ${50 + (y - 50) / 2} ${50 - (x - 50) / 2} ${x} ${y}`} />
          ))}
        </g>
        <circle cx="50" cy="50" r="17" fill="url(#fallback-core)" />
        <circle className="fallback-core-ring" cx="50" cy="50" r="10" fill="none" />
        {nodePositions.map(([x, y], index) => (
          <g key={`${x}-${y}-node`} className={index === 4 ? "fallback-node is-output" : "fallback-node"}>
            <circle cx={x} cy={y} r={index === 4 ? 2.5 : 1.7} />
            <circle cx={x} cy={y} r={index === 4 ? 4.8 : 3.6} fill="none" />
          </g>
        ))}
        <g className="fallback-astronaut" transform="translate(57 38) rotate(11)">
          <rect x="-5" y="6" width="10" height="13" rx="4" />
          <circle cx="0" cy="2" r="6" />
          <path d="M -4 11 L -10 16 M 4 11 L 10 15 M -3 18 L -6 27 M 3 18 L 7 27" />
          <path className="fallback-visor" d="M -4 1 Q 0 -2 4 1 L 3 5 Q 0 7 -3 5 Z" />
        </g>
      </svg>
    </div>
  );
}
