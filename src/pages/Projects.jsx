import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import "./Projects.css";

const Projects = () => {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    // --- Tube-like particle streams ---
    const createStream = (color, count, speedMult, angleOffset) => {
      const positions = new Float32Array(count * 3);
      const offsets = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        offsets[i] = Math.random() * Math.PI * 2;
        positions[i * 3]     = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color,
        size: 0.035,
        transparent: true,
        opacity: 0.75,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      return { points, offsets, speedMult, angleOffset, mat };
    };

    const streams = [
      createStream(0x00d4ff, 400, 1.0,   0),
      createStream(0x00aaff, 300, 0.7,   Math.PI / 4),
      createStream(0x40e0ff, 250, 1.3,  -Math.PI / 5),
      createStream(0x7af0ff, 200, 0.5,   Math.PI / 3),
      createStream(0x0088cc, 150, 0.9,  -Math.PI / 6),
    ];

    let t = 0;
    let animating = true;

    const animate = () => {
      if (!animating) return;
      requestAnimationFrame(animate);
      t += 0.008;

      streams.forEach(({ points, offsets, speedMult, angleOffset }) => {
        const pos = points.geometry.attributes.position;
        const count = pos.count;

        for (let i = 0; i < count; i++) {
          const offset = offsets[i];
          const x = pos.getX(i);
          const y = pos.getY(i);

          // tube-like curving motion
          const newX = x + Math.cos(angleOffset) * speedMult * 0.012;
          const newY = y + Math.sin(t * speedMult + offset) * 0.01
                         + Math.sin(angleOffset) * speedMult * 0.008;
          const newZ = pos.getZ(i) + Math.cos(t * 0.3 + offset) * 0.003;

          pos.setXYZ(i, newX, newY, newZ);

          // wrap around screen
          if (pos.getX(i) > 12)  pos.setX(i, -12);
          if (pos.getX(i) < -12) pos.setX(i,  12);
          if (pos.getY(i) > 7)   pos.setY(i,  -7);
          if (pos.getY(i) < -7)  pos.setY(i,   7);
        }
        pos.needsUpdate = true;
      });

      renderer.render(scene, camera);
    };
    animate();

    // fade out the dark overlay left by the wave
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });

    // fade in content
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.5 }
    );

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      animating = false;
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="projects-container">
      <div ref={overlayRef} style={{ position: "fixed", inset: 0, background: "#041e33", zIndex: 100, pointerEvents: "none" }} />
      <canvas ref={canvasRef} className="projects-canvas" />

      <div ref={contentRef} className="projects-content">
        <p className="depth-label">— depth: 15m —</p>
        <h2 className="projects-title">Projects</h2>
        <p className="projects-sub">These are things I've built</p>

        <div className="projects-grid">
          {/* placeholder cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="project-card">
              <div className="project-card-top">
                <span className="project-number">0{i}</span>
              </div>
              <h3 className="project-name">Project Name</h3>
              <p className="project-desc">
                A short description of what this project does and the tech stack used.
              </p>
              <div className="project-tags">
                <span className="tag">React</span>
                <span className="tag">Node.js</span>
                <span className="tag">Three.js</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;