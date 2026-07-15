/** @param {{items: readonly import("../data/types.js").NavItem[]}} props */
export default function SiteNav({ items }) {
  return (
    <header className="site-header">
      <a className="site-name" href="#home" aria-label="Dhruba Saha, home (DS)">
        <span className="site-name-full">Dhruba Saha</span>
        <span className="site-name-short" aria-hidden="true">DS</span>
      </a>
      <nav className="site-nav" aria-label="Primary navigation">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            aria-label={item.mobileLabel ? `${item.label} / ${item.mobileLabel}` : item.label}
          >
            <span className="nav-label-full" aria-hidden="true">{item.label}</span>
            <span className="nav-label-short" aria-hidden="true">{item.mobileLabel ?? item.label}</span>
          </a>
        ))}
      </nav>
    </header>
  );
}
