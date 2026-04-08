import "./App.css";
import Navbar from "./components/Navbar";
import OceanHero from "./components/OceanHero";
import Projects from "./pages/Projects";

function App() {
  return (
    <div className="app">
      <Navbar />
      <OceanHero />
      <Projects />
    </div>
  );
}

export default App;