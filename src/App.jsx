import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import OceanHero from "./components/OceanHero";
import Projects from "./pages/Projects";

function App() {
  const [dived, setDived] = useState(false);

  return (
    <div className="app">
      <Navbar />
      {!dived ? (
        <OceanHero onDive={() => setDived(true)} />
      ) : (
        <Projects />
      )}
    </div>
  );
}

export default App;