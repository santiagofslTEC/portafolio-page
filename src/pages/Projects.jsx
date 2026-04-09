import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import "./Projects.css";

const Projects = () => {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = 8;

    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext("2d");
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0,   "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.6)");
    grad.addColorStop(1,   "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(spriteCanvas);

    const createTube = (color, curvePoints, count, tubeRadius) => {
      const curve = new THREE.CatmullRomCurve3(curvePoints, true);

      const positions = new Float32Array(count * 3);
      const progress = new Float32Array(count);
      const speeds = new Float32Array(count);
      const radialOffsets = new Float32Array(count * 2);

      for (let i = 0; i < count; i++) {
        progress[i] = Math.random();
        speeds[i] = 0.0008 + Math.random() * 0.0006;

        // random offset within tube radius
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * tubeRadius;
        radialOffsets[i * 2]     = Math.cos(angle) * r;
        radialOffsets[i * 2 + 1] = Math.sin(angle) * r;

        const point = curve.getPoint(progress[i]);
        positions[i * 3]     = point.x + radialOffsets[i * 2];
        positions[i * 3 + 1] = point.y + radialOffsets[i * 2 + 1];
        positions[i * 3 + 2] = point.z;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const mat = new THREE.PointsMaterial({
        color,
        size: 0.06,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
        map: sprite,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geo, mat);
      scene.add(points);
      return { points, curve, progress, speeds, radialOffsets, tubeRadius };
    };

    // ribbon 1 — cyan, sweeps across diagonally
    const curve1Points = [
      new THREE.Vector3(-20,  4,   6),
      new THREE.Vector3(-10, -3,   2),
      new THREE.Vector3(  0,  5,  -2),
      new THREE.Vector3( 10, -4,   4),
      new THREE.Vector3( 20,  3,   6),
      new THREE.Vector3( 12,  6,  -6),
      new THREE.Vector3(  0, -5,  -8),
      new THREE.Vector3(-12,  6,  -6),
    ];
    
    const curve2Points = [
      new THREE.Vector3( 20, -4,   6),
      new THREE.Vector3( 10,  3,   2),
      new THREE.Vector3(  0, -5,  -2),
      new THREE.Vector3(-10,  4,   4),
      new THREE.Vector3(-20, -3,   6),
      new THREE.Vector3(-12, -6,  -6),
      new THREE.Vector3(  0,  5,  -8),
      new THREE.Vector3( 12, -6,  -6),
    ];

    const tubes = [
      createTube(0x00d4ff, curve1Points, 6000, 0.25),
      createTube(0x00c896, curve2Points, 6000, 0.25),
    ];

    let animating = true;

    const animate = () => {
      if (!animating) return;
      requestAnimationFrame(animate);

      tubes.forEach(({ points, curve, progress, speeds, radialOffsets }) => {
        const pos = points.geometry.attributes.position;

        for (let i = 0; i < pos.count; i++) {
          progress[i] += speeds[i];
          if (progress[i] > 1) progress[i] -= 1;

          const point = curve.getPoint(progress[i]);
          pos.setXYZ(
            i,
            point.x + radialOffsets[i * 2],
            point.y + radialOffsets[i * 2 + 1],
            point.z
          );
        }

        pos.needsUpdate = true;
      });

      renderer.render(scene, camera);
    };
    animate();

    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.2 }
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
      sprite.dispose();
    };
  }, []);

  return (
    <div className="projects-container">
      <canvas ref={canvasRef} className="projects-canvas" />
      <div ref={contentRef} className="projects-content">
        <p className="depth-label">— depth: 15m —</p>
        <h2 className="projects-title">Projects</h2>
        <p className="projects-sub">These are things I've built</p>
        <div className="projects-grid">
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