/**
 * @param {{
 *   site: {name: string, initials: string},
 *   nav: {label: string, href: string}[]
 * }} props
 */
const Header = ({ site, nav }) => (
  <header className="site-header">
    <div className="site-header__inner">
      <a className="brand" href="#top" aria-label={`${site.name}, home`}>
        <span className="brand__mark" aria-hidden="true">{site.initials}</span>
        <span className="brand__name">{site.name}</span>
      </a>

      <nav aria-label="Primary navigation">
        <ul>
          {nav.map((item) => (
            <li key={item.href}><a href={item.href}>{item.label}</a></li>
          ))}
        </ul>
      </nav>
    </div>
  </header>
);

export default Header;
