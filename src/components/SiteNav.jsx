import { useEffect, useState } from "react";

export default function SiteNav({ items }) {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.href.replace("#", "")))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -55%", threshold: [0.01, 0.2, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <header className="site-header">
      <a className="brand-mark" href="#home" aria-label="DS — Dhruba Saha, home">
        <span>DS</span>
        <small>AI / SOFTWARE</small>
      </a>
      <nav className="site-nav" aria-label="Primary navigation">
        {items.map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            className={active === item.href.replace("#", "") ? "is-active" : ""}
            aria-current={active === item.href.replace("#", "") ? "location" : undefined}
          >
            <span className="nav-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="nav-label">{item.label}</span>
          </a>
        ))}
      </nav>
    </header>
  );
}
