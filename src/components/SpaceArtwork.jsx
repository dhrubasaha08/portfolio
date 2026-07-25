const layers = [
  { className: "space-layer space-stars", src: "/parallax/1Stars.svg" },
  { className: "space-layer space-planets", src: "/parallax/2Planets.svg" },
  { className: "space-layer space-sun", src: "/parallax/6Sun.svg" },
  { className: "space-layer space-mountain-back", src: "/parallax/3Mountain.svg" },
  { className: "space-layer space-mountain-front", src: "/parallax/4Mountain.svg" },
  { className: "space-layer space-crater", src: "/parallax/5Crater.svg" },
];

/**
 * The original portfolio artwork is kept as one continuous, decorative world.
 * Scroll state is expressed through CSS custom properties so the illustrations
 * can move without affecting the semantic document.
 *
 * @param {{activeSection: string}} props
 */
export default function SpaceArtwork({ activeSection }) {
  return (
    <div
      className="space-artwork"
      data-active-section={activeSection}
      data-testid="space-artwork"
      aria-hidden="true"
    >
      <div className="space-layer-frame">
        {layers.map((layer) => (
          <img
            key={layer.src}
            className={layer.className}
            src={layer.src}
            alt=""
            decoding="async"
          />
        ))}
      </div>

      <div className="journey-trace journey-trace-one" />
      <div className="journey-trace journey-trace-two" />
      <div className="distant-world distant-world-one" />
      <div className="distant-world distant-world-two" />
      <div className="chapter-horizon" />
    </div>
  );
}
