const ObservatoryGraphic = () => (
  <div className="observatory" aria-label="Sensor-to-semantics system path">
    <div className="observatory__chrome" aria-hidden="true">
      <span /><span /><span />
      <p>SYS.OBS / 01</p>
      <strong><i /> SIGNAL ONLINE</strong>
    </div>

    <svg className="observatory__diagram" viewBox="0 0 680 500" aria-hidden="true">
      <defs>
        <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" />
        </pattern>
        <radialGradient id="semanticGlow">
          <stop offset="0" stopColor="#a78bfa" stopOpacity=".7" />
          <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect className="observatory__grid" width="680" height="500" fill="url(#grid)" />

      <g className="observatory__paths">
        <path d="M94 143 C185 143 176 247 274 247" />
        <path d="M94 250 H274" />
        <path d="M94 357 C185 357 176 253 274 253" />
        <path d="M344 250 C430 250 431 168 520 168" />
        <path d="M344 250 C430 250 431 332 520 332" />
        <path d="M566 168 V332" />
      </g>

      <g className="observatory__sensors">
        <circle cx="76" cy="143" r="17" />
        <circle cx="76" cy="250" r="17" />
        <circle cx="76" cy="357" r="17" />
        <path d="M42 143H60M42 250H60M42 357H60" />
      </g>

      <g className="observatory__processor">
        <rect x="274" y="202" width="90" height="96" rx="14" />
        <path d="M296 228h46M296 250h46M296 272h28" />
        <circle cx="343" cy="272" r="4" />
      </g>

      <g className="observatory__semantics">
        <circle cx="566" cy="250" r="96" fill="url(#semanticGlow)" />
        <circle cx="566" cy="168" r="25" />
        <circle cx="566" cy="250" r="34" />
        <circle cx="566" cy="332" r="25" />
        <path d="m551 250 11 11 23-27" />
      </g>

      <g className="observatory__signals">
        <circle cx="155" cy="250" r="5" />
        <circle cx="421" cy="225" r="5" />
        <circle cx="469" cy="303" r="5" />
      </g>
    </svg>

    <ol className="observatory__legend">
      <li><span>01</span> Sensor inputs</li>
      <li><span>02</span> Orchestration</li>
      <li><span>03</span> Semantic output</li>
    </ol>
  </div>
);

export default ObservatoryGraphic;
