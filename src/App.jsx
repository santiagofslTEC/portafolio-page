import { useRef, useCallback } from "react";
import { useNavigate, Routes, Route } from "react-router";
import "./App.css";
import Navbar from "./components/Navbar";
import OceanHero from "./components/OceanHero";
import Projects from "./pages/Projects";
import AboutMe from "./pages/AboutMe";
import ContactMe from "./pages/ContactMe";

function HomeWrapper() {
  const navigate = useNavigate();
  const projectsSlideRef = useRef(null);
  const handleDive = useCallback(() => navigate("/Projects"), [navigate]);

  return (
    <div style={{ position: "relative" }}>
      {/* Projects sits off-screen right, slides in with the wave */}
      <div
        ref={projectsSlideRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          transform: "translateX(100vw)",
          zIndex: 5,
          overflow: "hidden",
        }}
      >
        <Projects />
      </div>
      <OceanHero
        onDive={handleDive}
        projectsRef={projectsSlideRef}
      />
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeWrapper />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/AboutMe" element={<AboutMe />} />
        <Route path="/ContactMe" element={<ContactMe />} />
      </Routes>
    </div>
  );
}

export default App;
