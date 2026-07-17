const heroLayers = Object.freeze([
  { className: "art-hero-stars", src: "/parallax/1Stars.svg" },
  { className: "art-hero-planets", src: "/parallax/2Planets.svg" },
  { className: "art-hero-sun", src: "/parallax/6Sun.svg" },
  { className: "art-hero-mountain-far", src: "/parallax/3Mountain.svg" },
  { className: "art-hero-mountain-near", src: "/parallax/4Mountain.svg" },
  { className: "art-hero-crater", src: "/parallax/5Crater.svg" },
]);

function HeroArtwork() {
  return (
    <div className="chapter-artwork chapter-artwork-hero" data-chapter-artwork="home" aria-hidden="true">
      {heroLayers.map((layer) => (
        <img key={layer.src} className={`art-hero-layer ${layer.className}`} src={layer.src} alt="" draggable="false" />
      ))}
      <svg className="art-hero-trails" viewBox="0 0 1200 720" preserveAspectRatio="none">
        <path pathLength="1" d="M-40 540 C240 390 410 690 730 510 S1120 240 1260 340" />
        <path pathLength="1" d="M80 90 C320 230 620 20 900 170 S1170 420 1250 320" />
      </svg>
    </div>
  );
}

function WorkArtwork() {
  return (
    <div className="chapter-artwork chapter-artwork-work" data-chapter-artwork="work" aria-hidden="true">
      <svg viewBox="0 0 720 520">
        <circle className="art-sun-disc" cx="568" cy="116" r="96" />
        <path className="art-process-path" pathLength="1" d="M48 340 C158 202 278 424 394 278 S570 206 670 320" />
        <g className="art-paper art-paper-one"><path d="M70 246 L212 222 L229 318 L87 344 Z" /><path d="M95 273 L180 258 M101 294 L188 278 M108 315 L165 304" /></g>
        <g className="art-paper art-paper-two"><path d="M212 296 L350 268 L372 365 L230 393 Z" /><path d="M239 318 L325 301 M245 340 L331 323 M252 362 L310 350" /></g>
        <g className="art-clock"><circle cx="466" cy="258" r="65" /><path className="art-clock-hour" d="M466 258 L466 216" /><path className="art-clock-minute" d="M466 258 L510 278" /><circle cx="466" cy="258" r="7" /></g>
        <g className="art-review-stamp"><circle cx="610" cy="362" r="58" /><circle cx="610" cy="362" r="47" /><text x="610" y="368" textAnchor="middle">EXPERT REVIEW</text></g>
      </svg>
    </div>
  );
}

function PracticeArtwork() {
  return (
    <div className="chapter-artwork chapter-artwork-practice" data-chapter-artwork="practice" aria-hidden="true">
      <svg viewBox="0 0 760 540">
        <path className="art-landscape-line art-landscape-line-one" d="M-20 420 C130 300 220 470 370 352 S610 274 800 390" />
        <path className="art-landscape-line art-landscape-line-two" d="M-20 470 C170 380 290 510 470 408 S650 360 800 438" />
        <path className="art-pipe" pathLength="1" d="M56 304 H166 V198 H276" />
        <g className="art-wheel" transform="translate(322 202)"><circle r="64" /><circle r="18" /><path d="M0-64V-18 M0 18V64 M-64 0H-18 M18 0H64 M-45-45L-13-13 M13 13L45 45 M45-45L13-13 M-13 13L-45 45" /></g>
        <g className="art-toolbox"><path d="M416 274 H586 V398 H416 Z" /><path d="M457 274 V238 H545 V274 M416 318 H586" /><circle cx="501" cy="337" r="8" /></g>
        <g className="art-prism"><path d="M610 174 L688 304 L532 304 Z" /><path className="art-prism-ray art-prism-ray-in" d="M476 228 L593 246" /><path className="art-prism-ray art-prism-ray-one" d="M663 240 L748 190" /><path className="art-prism-ray art-prism-ray-two" d="M671 254 L754 250" /><path className="art-prism-ray art-prism-ray-three" d="M664 270 L744 315" /></g>
      </svg>
    </div>
  );
}

function KyberArtwork() {
  return (
    <div className="chapter-artwork chapter-artwork-kyber" data-chapter-artwork="project-kyber" aria-hidden="true">
      <svg viewBox="0 0 720 560">
        <circle className="art-kyber-sun" cx="178" cy="136" r="92" />
        <path className="art-kyber-horizon art-kyber-horizon-far" d="M-40 430 C160 310 320 452 470 350 S670 314 780 374" />
        <path className="art-kyber-horizon art-kyber-horizon-near" d="M-40 486 C110 390 302 526 470 420 S672 378 780 452" />
        <g className="art-boundary art-boundary-one"><rect x="204" y="92" width="152" height="362" /></g>
        <g className="art-boundary art-boundary-two"><rect x="390" y="70" width="174" height="402" /></g>
        <path className="art-monolith" d="M314 118 L432 98 L458 444 L334 470 Z" />
        <text className="art-kyber-letter" x="340" y="430">K</text>
      </svg>
    </div>
  );
}

function TremorArtwork() {
  return (
    <div className="chapter-artwork chapter-artwork-tremor" data-chapter-artwork="tremor-track" aria-hidden="true">
      <svg viewBox="0 0 720 560">
        <g className="art-moon" transform="translate(350 270)"><circle r="152" /><circle className="art-crater art-crater-one" cx="-52" cy="-58" r="28" /><circle className="art-crater art-crater-two" cx="62" cy="28" r="42" /><circle className="art-crater art-crater-three" cx="-40" cy="76" r="18" /><path className="art-moon-shadow" d="M0-152 A152 152 0 0 1 0 152 A114 152 0 0 0 0-152Z" /></g>
        <ellipse className="art-orbit" pathLength="1" cx="350" cy="270" rx="286" ry="126" transform="rotate(-14 350 270)" />
        <g className="art-event-marker"><circle cx="602" cy="182" r="14" /><path d="M602 197 L602 236" /></g>
        <path className="art-seismic-line" pathLength="1" d="M70 480 H205 L226 450 L246 510 L272 420 L301 480 H652" />
      </svg>
    </div>
  );
}

function ExperienceArtwork() {
  return (
    <div className="chapter-artwork chapter-artwork-experience" data-chapter-artwork="experience" aria-hidden="true">
      <svg viewBox="0 0 720 620">
        <path className="art-route" pathLength="1" d="M122 528 C132 388 284 428 284 288 S520 258 566 90" />
        <g className="art-wayfinder art-wayfinder-one"><path d="M86 520 L122 410 L158 520 Z" /><circle cx="122" cy="388" r="22" /></g>
        <g className="art-wayfinder art-wayfinder-two"><path d="M524 152 L566 34 L608 152 Z" /><circle cx="566" cy="174" r="22" /></g>
        <circle className="art-route-stop art-route-stop-one" cx="284" cy="300" r="12" /><circle className="art-route-stop art-route-stop-two" cx="474" cy="248" r="9" />
        <path className="art-route-orbit" d="M404 166 C514 126 626 214 578 324 C530 434 348 398 364 284" />
      </svg>
    </div>
  );
}

function AboutArtwork() {
  return (
    <div className="chapter-artwork chapter-artwork-about" data-chapter-artwork="about" aria-hidden="true">
      <svg viewBox="0 0 760 560">
        <circle className="art-photo-sun" cx="614" cy="118" r="94" />
        <path className="art-photo-horizon art-photo-horizon-one" d="M-30 438 C128 326 250 468 396 372 S640 306 790 410" /><path className="art-photo-horizon art-photo-horizon-two" d="M-20 500 C142 412 300 532 468 446 S674 400 800 474" />
        <g className="art-camera"><path d="M158 214 H548 V438 H158 Z" /><path d="M218 214 L256 166 H370 L406 214" /><rect x="184" y="246" width="70" height="34" /><circle cx="400" cy="324" r="104" /><circle cx="400" cy="324" r="72" /><g className="art-shutter" transform="translate(400 324)"><path d="M0-66 L30-20 L8 4 L-38-24 Z" /><path d="M57-33 L32 16 L0 8 L-2-46 Z" /><path d="M57 33 L2 34 L-8 4 L38-24 Z" /><path d="M0 66 L-30 20 L-8-4 L38 24 Z" /><path d="M-57 33 L-32-16 L0-8 L2 46 Z" /><path d="M-57-33 L-2-34 L8-4 L-38 24 Z" /></g></g>
      </svg>
    </div>
  );
}

function ContactArtwork() {
  const stars = [[92, 92], [174, 184], [262, 70], [348, 138], [450, 72], [572, 162], [650, 82], [624, 338]];
  return (
    <div className="chapter-artwork chapter-artwork-contact" data-chapter-artwork="contact" aria-hidden="true">
      <svg viewBox="0 0 720 560">
        {stars.map(([cx, cy], index) => <circle key={`${cx}-${cy}`} className={`art-contact-star art-contact-star-${index + 1}`} cx={cx} cy={cy} r="5" />)}
        <path className="art-contact-horizon" d="M-40 520 C116 366 252 528 416 410 S650 344 780 444 V600 H-40 Z" />
        <path className="art-plane-route" pathLength="1" d="M80 414 C198 290 368 426 520 254 S650 132 700 170" />
        <g className="art-paper-plane"><path d="M486 220 L690 130 L586 312 L556 246 Z" /><path d="M556 246 L690 130 L586 312" /></g>
        <g className="art-beacon"><path d="M122 490 L156 342 L190 490 Z" /><circle cx="156" cy="324" r="12" /><path className="art-beacon-wave art-beacon-wave-one" d="M116 298 A54 54 0 0 1 196 298" /><path className="art-beacon-wave art-beacon-wave-two" d="M92 270 A88 88 0 0 1 220 270" /></g>
      </svg>
    </div>
  );
}

const artworks = Object.freeze({ home: HeroArtwork, work: WorkArtwork, practice: PracticeArtwork, "project-kyber": KyberArtwork, "tremor-track": TremorArtwork, experience: ExperienceArtwork, about: AboutArtwork, contact: ContactArtwork });

/** @param {{chapter: import('../data/types.js').ChapterId}} props */
export default function ChapterArtwork({ chapter }) {
  const Artwork = artworks[chapter];
  return Artwork ? <Artwork /> : null;
}
