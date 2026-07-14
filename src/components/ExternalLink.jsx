/**
 * @param {{href: string, label: string, className?: string}} props
 */
const ExternalLink = ({ href, label, className = "text-link" }) => (
  <a className={className} href={href} target="_blank" rel="noreferrer noopener">
    <span>{label}</span>
    <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
      <path d="M5 3h8v8M13 3 4 12" />
    </svg>
  </a>
);

export default ExternalLink;
