import { Fragment } from "react";

/**
 * @param {{
 *   id: string,
 *   className?: string,
 *   children: import("react").ReactNode,
 * }} props
 */
function ArtworkFrame({ id, className = "", children }) {
  return (
    <div
      className={`chapter-artwork chapter-artwork--${id} ${className}`.trim()}
      data-chapter-artwork={id}
      data-artwork-scene={id}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

const starDots = [
  [105, 96, 4],
  [216, 181, 2],
  [352, 72, 3],
  [487, 158, 2],
  [621, 94, 4],
  [774, 210, 2],
  [920, 85, 3],
  [1086, 146, 2],
  [1234, 74, 4],
  [1422, 182, 2],
  [1540, 102, 3],
];

function InlineStars() {
  return (
    <g className="art-stars art-depth-far">
      {starDots.map(([cx, cy, radius], index) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={radius}
          className={index % 3 === 0 ? "art-star art-star--warm" : "art-star"}
        />
      ))}
    </g>
  );
}

export function HeroArtwork() {
  return (
    <ArtworkFrame id="hero">
      <div className="hero-landscape" data-art-layer="hero-landscape">
        <img className="hero-art-layer hero-stars" src="/parallax/1Stars.svg" alt="" />
        <img className="hero-art-layer hero-planets" src="/parallax/2Planets.svg" alt="" />
        <img className="hero-art-layer hero-sun" src="/parallax/6Sun.svg" alt="" />
        <img
          className="hero-art-layer hero-mountain-back"
          src="/parallax/3Mountain.svg"
          alt=""
        />
        <img
          className="hero-art-layer hero-mountain-front"
          src="/parallax/4Mountain.svg"
          alt=""
        />
        <img className="hero-art-layer hero-crater" src="/parallax/5Crater.svg" alt="" />
      </div>
      <svg className="chapter-svg hero-foreground" viewBox="0 0 1600 900" focusable="false">
        <path
          className="art-route hero-flight-path"
          pathLength="1"
          d="M-80 560 C 310 410, 548 690, 865 448 S 1310 218, 1690 340"
        />
        <circle className="art-orbit-dot hero-flight-dot" cx="865" cy="448" r="7" />
      </svg>
    </ArtworkFrame>
  );
}

export function RoleArtwork() {
  return (
    <ArtworkFrame id="role">
      <svg className="chapter-svg" viewBox="0 0 1600 900" focusable="false">
        <InlineStars />
        <g className="role-planet art-depth-far">
          <circle cx="1330" cy="360" r="258" className="art-planet-shadow" />
          <circle cx="1280" cy="310" r="246" className="art-planet" />
          <path
            className="art-planet-land"
            d="M1081 245c93-83 257-141 391-43 53 39 62 105 33 155-43-66-101-91-172-77-88 18-148 91-252 61z"
          />
          <path
            className="art-planet-line"
            d="M1089 375c136 37 303-2 416-90M1118 448c107 28 255 2 349-69"
          />
        </g>
        <path
          className="art-route role-route"
          pathLength="1"
          d="M-70 726 C 240 652, 386 455, 630 514 C 880 575, 942 760, 1262 650 C 1420 595, 1512 480, 1660 505"
        />
        {[
          [346, 548],
          [630, 514],
          [952, 699],
          [1262, 650],
        ].map(([cx, cy], index) => (
          <g key={cx} className={`role-waypoint role-waypoint--${index + 1}`}>
            <circle cx={cx} cy={cy} r="14" className="art-waypoint-ring" />
            <circle cx={cx} cy={cy} r="5" className="art-waypoint-dot" />
          </g>
        ))}
        <path
          className="role-horizon art-depth-near"
          d="M-40 760 C 230 656 405 749 602 789 C 815 831 1060 666 1275 713 C 1440 749 1520 817 1650 784 L1650 930H-40Z"
        />
      </svg>
    </ArtworkFrame>
  );
}

export function BuildArtwork() {
  const marks = [
    { x: 250, y: 302, kind: "braces" },
    { x: 595, y: 550, kind: "loop" },
    { x: 988, y: 292, kind: "tool" },
    { x: 1332, y: 554, kind: "prism" },
  ];

  return (
    <ArtworkFrame id="what-i-build">
      <svg className="chapter-svg" viewBox="0 0 1600 900" focusable="false">
        <InlineStars />
        <path
          className="art-route build-comet-path"
          pathLength="1"
          d="M-80 418 C 150 188, 348 167, 550 425 S 882 697, 1055 424 S 1375 179, 1680 394"
        />
        <path
          className="build-comet-tail"
          d="M-10 445 C 176 240, 365 215, 536 424"
        />
        {marks.map((mark, index) => (
          <g
            key={mark.kind}
            className={`build-mark build-mark--${index + 1}`}
            transform={`translate(${mark.x} ${mark.y})`}
          >
            <circle r="54" className="build-mark-orbit" />
            {mark.kind === "braces" ? (
              <Fragment>
                <path d="M-10-25L-31 0l21 25M10-25L31 0 10 25" />
                <circle r="6" />
              </Fragment>
            ) : null}
            {mark.kind === "loop" ? (
              <path d="M-28-4c8-28 50-26 56 2 6 29-35 47-52 22-15-21 3-51 30-45" />
            ) : null}
            {mark.kind === "tool" ? (
              <path d="M-31 24l28-29m-5-17c11-9 27-7 36 2l-16 11 2 16 16 2c-7 12-23 18-36 9-11-8-14-25-2-40z" />
            ) : null}
            {mark.kind === "prism" ? (
              <Fragment>
                <path d="M-31 26L0-30l31 56z" />
                <path className="build-prism-ray" d="M0-3h82" />
              </Fragment>
            ) : null}
          </g>
        ))}
        <circle className="build-comet" cx="1055" cy="424" r="11" />
        <path
          className="build-landscape art-depth-near"
          d="M-20 765L145 680l135 74 190-134 210 158 196-96 170 92 190-144 170 135 210-79 105 73v171H-20z"
        />
      </svg>
    </ArtworkFrame>
  );
}

export function WorkflowArtwork() {
  return (
    <ArtworkFrame id="workflow">
      <svg className="chapter-svg" viewBox="0 0 1600 980" focusable="false">
        <InlineStars />
        <path
          className="art-route workflow-arc"
          pathLength="1"
          d="M-80 648 C 285 360, 510 733, 778 508 C 1048 281, 1263 574, 1680 280"
        />
        <g className="workflow-sheets">
          <path className="workflow-sheet workflow-sheet--back" d="M90 485h168l38 42v216H90z" />
          <path className="workflow-sheet workflow-sheet--mid" d="M120 455h168l38 42v216H120z" />
          <path className="workflow-sheet workflow-sheet--front" d="M150 425h168l38 42v216H150z" />
          <path className="workflow-sheet-line" d="M186 517h113M186 552h90M186 587h120" />
        </g>
        <g className="workflow-clock">
          <circle cx="797" cy="496" r="142" className="workflow-clock-face" />
          <circle cx="797" cy="496" r="112" className="workflow-clock-inner" />
          <path className="workflow-clock-hand workflow-clock-hour" d="M797 496l-58-57" />
          <path className="workflow-clock-hand workflow-clock-minute" d="M797 496l79-80" />
          <circle cx="797" cy="496" r="8" className="workflow-clock-pin" />
          <path className="workflow-clock-tick" d="M797 367v20M926 496h-20M797 625v-20M668 496h20" />
        </g>
        <g className="workflow-review">
          <circle cx="1320" cy="388" r="170" className="workflow-review-halo" />
          <circle cx="1320" cy="388" r="120" className="workflow-review-disc" />
          <path className="workflow-review-mark" d="M1261 392l39 39 83-91" />
          <path
            className="workflow-review-rays"
            d="M1320 186v-52M1320 642v-52M1118 388h-52M1574 388h-52M1177 245l-37-37M1463 531l37 37M1463 245l37-37M1177 531l-37 37"
          />
        </g>
        {[
          [420, 575],
          [575, 594],
          [979, 409],
          [1134, 354],
        ].map(([cx, cy], index) => (
          <circle
            key={cx}
            cx={cx}
            cy={cy}
            r={index % 2 === 0 ? 10 : 6}
            className={`workflow-particle workflow-particle--${index + 1}`}
          />
        ))}
        <path
          className="workflow-horizon art-depth-near"
          d="M-40 812c188-92 375-80 536-15 204 83 374 65 540-23 175-93 358-73 624 24v202H-40z"
        />
      </svg>
    </ArtworkFrame>
  );
}

export function MethodArtwork() {
  const stops = [
    [170, 632],
    [455, 493],
    [760, 626],
    [1075, 420],
    [1395, 562],
  ];

  return (
    <ArtworkFrame id="how-i-work">
      <svg className="chapter-svg" viewBox="0 0 1600 900" focusable="false">
        <InlineStars />
        <path
          className="art-route method-route"
          pathLength="1"
          d="M-40 711 C 176 733, 270 512, 455 493 S 635 657, 760 626 S 924 437, 1075 420 S 1268 625, 1640 482"
        />
        {stops.map(([x, y], index) => (
          <g
            key={x}
            className={`method-stop method-stop--${index + 1}`}
            transform={`translate(${x} ${y})`}
          >
            <path className="method-pole" d="M0 0v-108" />
            <path
              className="method-flag"
              d={index % 2 === 0 ? "M0-108h96l-24 28 24 28H0z" : "M0-108h-92l22 28-22 28H0z"}
            />
            <circle r="12" className="art-waypoint-ring" />
            <circle r="4" className="art-waypoint-dot" />
          </g>
        ))}
        <path
          className="method-moon art-depth-far"
          d="M1180 110a147 147 0 1 0 137 198 135 135 0 0 1-137-198z"
        />
        <path
          className="method-landscape method-landscape--back"
          d="M-40 772l193-152 195 105 180-185 191 162 216-149 180 154 190-180 335 218v185H-40z"
        />
        <path
          className="method-landscape method-landscape--front art-depth-near"
          d="M-40 831l254-117 218 86 225-92 220 126 242-108 219 92 302-124v236H-40z"
        />
      </svg>
    </ArtworkFrame>
  );
}

export function KyberArtwork() {
  return (
    <ArtworkFrame id="project-kyber">
      <svg className="chapter-svg" viewBox="0 0 1600 900" focusable="false">
        <InlineStars />
        <circle cx="1185" cy="412" r="262" className="kyber-eclipse-shadow" />
        <circle cx="1141" cy="366" r="250" className="kyber-eclipse" />
        <text x="1020" y="542" className="kyber-letter">
          K
        </text>
        <g className="kyber-boundary kyber-boundary--one">
          <path d="M838 84h520v644H838z" />
          <path d="M883 132h430v548H883z" />
        </g>
        <g className="kyber-boundary kyber-boundary--two">
          <path d="M936 180h520v644H936z" />
          <path d="M981 228h430v548H981z" />
        </g>
        <path
          className="kyber-cut"
          d="M691-30l247 960M1452-30l-147 960"
          pathLength="1"
        />
        <path
          className="kyber-horizon art-depth-near"
          d="M-40 760C300 667 505 839 765 772c307-79 516-77 875 27v131H-40z"
        />
      </svg>
    </ArtworkFrame>
  );
}

export function TremorArtwork() {
  const craters = [
    [1196, 330, 38],
    [1326, 474, 62],
    [1088, 520, 31],
    [1240, 598, 25],
  ];

  return (
    <ArtworkFrame id="tremor-track">
      <svg className="chapter-svg" viewBox="0 0 1600 900" focusable="false">
        <InlineStars />
        <g className="tremor-moon">
          <circle cx="1220" cy="452" r="278" className="tremor-moon-disc" />
          {craters.map(([cx, cy, r]) => (
            <g key={`${cx}-${cy}`} className="tremor-crater">
              <circle cx={cx} cy={cy} r={r} />
              <path d={`M${cx - r * 0.66} ${cy + r * 0.08}c${r * 0.42} ${r * 0.3} ${r * 0.94} ${r * 0.28} ${r * 1.31} 0`} />
            </g>
          ))}
        </g>
        <ellipse
          cx="1220"
          cy="452"
          rx="394"
          ry="172"
          className="art-route tremor-orbit"
          pathLength="1"
          transform="rotate(-17 1220 452)"
        />
        <g className="tremor-event">
          <circle cx="1478" cy="285" r="24" className="tremor-event-ring" />
          <circle cx="1478" cy="285" r="8" className="tremor-event-dot" />
          <path d="M1478 254v-50" className="tremor-event-stem" />
        </g>
        <path
          className="tremor-landscape art-depth-near"
          d="M-40 793c250-77 421-14 582 61 176 81 405 20 558-44 158-66 327-60 540 11v109H-40z"
        />
      </svg>
    </ArtworkFrame>
  );
}

export function AboutArtwork() {
  return (
    <ArtworkFrame id="about">
      <svg className="chapter-svg" viewBox="0 0 1600 900" focusable="false">
        <InlineStars />
        <circle cx="1242" cy="442" r="190" className="about-sun" />
        <g className="about-viewfinder">
          <path d="M860 164h-94v94M1417 164h94v94M860 721h-94v-94M1417 721h94v-94" />
          <circle cx="1138" cy="442" r="238" />
          <circle cx="1138" cy="442" r="150" />
          <path d="M1138 186v512M882 442h512" />
        </g>
        <g className="about-aperture">
          {Array.from({ length: 7 }, (_, index) => (
            <path
              key={index}
              d="M1138 442l48-128c62 23 107 71 126 128z"
              transform={`rotate(${index * (360 / 7)} 1138 442)`}
            />
          ))}
        </g>
        <path
          className="about-star-trail about-star-trail--one"
          d="M-80 249C265 72 522 129 711 319"
          pathLength="1"
        />
        <path
          className="about-star-trail about-star-trail--two"
          d="M-98 332C201 190 481 213 666 396"
          pathLength="1"
        />
        <path
          className="about-landscape art-depth-near"
          d="M-40 760l214-106 175 72 190-149 220 167 214-121 197 127 180-102 290 119v163H-40z"
        />
      </svg>
    </ArtworkFrame>
  );
}

export function ContactArtwork() {
  return (
    <ArtworkFrame id="contact">
      <svg className="chapter-svg" viewBox="0 0 1600 900" focusable="false">
        <InlineStars />
        <path
          className="art-route contact-route"
          pathLength="1"
          d="M-80 330C280 184 435 413 653 348c253-76 350-332 597-171 162 106 187 310 430 228"
        />
        <g className="contact-plane">
          <path d="M0 0l129 44-57 17-25 51-14-39-33-73z" />
          <path d="M33 73l39-12 57-17M33 73L94 40" />
        </g>
        <circle cx="1252" cy="178" r="87" className="contact-beacon" />
        <circle cx="1252" cy="178" r="17" className="contact-beacon-core" />
        <path
          className="contact-horizon contact-horizon--back"
          d="M-40 700c202-83 365-45 553 35 205 87 397 74 574-26 188-106 340-83 553 4v217H-40z"
        />
        <path
          className="contact-horizon contact-horizon--front art-depth-near"
          d="M-40 792c247-78 447 7 646 64 218 63 415-44 589-74 165-28 284 7 445 70v78H-40z"
        />
      </svg>
    </ArtworkFrame>
  );
}

