import { useEffect, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import { Navbar, Hero, Education, Project, Experience, Contact } from "./components";

const App = () => {
  const wrapperRef = useRef(null);

  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <Navbar />
        <div className="wrapper" ref={wrapperRef}>
          <div id="hero" className="z-10">
            <Hero scrollContainer={wrapperRef} />
          </div>
          <div id="education" className='relative z-30 bg-primary'>
            <Education />
          </div>
          <div id="project" className="relative z-30 bg-primary">
            <Project />
          </div>
          <div id="experience" className="relative z-30 bg-primary">
            <Experience />
          </div>
          <div id="contact" className="relative z-30 bg-primary">
            <Contact />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
