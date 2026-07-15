import { useEffect, useState } from "react";

/** @param {{items: readonly import("../data/types.js").NavItem[]}} props */
export default function SiteNav({ items }) {
  const [active, setActive] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((section) => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-24% 0px -58%", threshold: [0.01, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, window.scrollY / range)));
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand-mark" href="#home" aria-label="Dhruba Saha, home">
          <span className="brand-full">Dhruba Saha</span>
          <span className="brand-short" aria-hidden="true">DS</span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          {items.map((item) => {
            const isActive = active === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                className={isActive ? "is-active" : ""}
                aria-label={item.label}
                aria-current={isActive ? "location" : undefined}
              >
                <span className="nav-label-desktop">{item.label}</span>
                <span className="nav-label-mobile">{item.mobileLabel ?? item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
      <span className="site-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    </header>
  );
}
