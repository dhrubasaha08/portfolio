/** @param {{type: string}} props */
const ProjectVisual = ({ type }) => {
  if (type === "sensor") {
    return (
      <div className="project-visual project-visual--sensor" aria-hidden="true">
        <div className="sensor-chip"><span>DHT</span><strong>11</strong><i /><i /><i /><i /></div>
        <svg viewBox="0 0 240 90"><path d="M0 60h28l12-28 17 49 20-66 19 45h20l12-20 16 30 20-48 18 38h58" /></svg>
      </div>
    );
  }

  if (type === "moon") {
    return (
      <div className="project-visual project-visual--moon" aria-hidden="true">
        <div className="orbit"><i /><i /><i /></div>
        <div className="moon"><span /><span /><span /><span /></div>
        <div className="seismic-line"><i /><i /><i /><i /><i /></div>
      </div>
    );
  }

  if (type === "interface") {
    return (
      <div className="project-visual project-visual--interface" aria-hidden="true">
        <div className="ui-window">
          <div className="ui-window__bar"><i /><i /><i /></div>
          <strong>TOUCH / UI</strong>
          <div className="ui-slider"><span /></div>
          <div className="ui-row"><i /><i /><i /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-visual project-visual--research" aria-hidden="true">
      <div className="research-core">K</div>
      <i className="research-node research-node--one" />
      <i className="research-node research-node--two" />
      <i className="research-node research-node--three" />
      <span className="research-orbit" />
    </div>
  );
};

export default ProjectVisual;
