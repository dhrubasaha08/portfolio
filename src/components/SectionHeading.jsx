/**
 * @param {{eyebrow: string, title: string, description?: string, id: string}} props
 */
const SectionHeading = ({ eyebrow, title, description, id }) => (
  <div className="section-heading">
    <p className="eyebrow">{eyebrow}</p>
    <h2 id={id}>{title}</h2>
    {description && <p>{description}</p>}
  </div>
);

export default SectionHeading;
