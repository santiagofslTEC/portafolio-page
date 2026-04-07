import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import AboutMe from "./pages/AboutMe.jsx";
import Projects from "./pages/Projects.jsx";
import ContactMe from "./pages/ContactMe.jsx";
import { BrowserRouter, Route, Routes } from "react-router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/App" element={<App />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/AboutMe" element={<AboutMe />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/ContactMe" element={<ContactMe />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
