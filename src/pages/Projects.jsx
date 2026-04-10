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

    const makeCurve = (pts) => new THREE.CatmullRomCurve3(pts, false);

    const tube1Variants = [
      makeCurve([
      new THREE.Vector3(-20,  4,   6),
      new THREE.Vector3(-10, -3,   2),
      new THREE.Vector3( -13,  6,  -2),
      new THREE.Vector3( 10, -4,   4),
      new THREE.Vector3( 20,  3,   6),
      new THREE.Vector3( 12,  6,  -6),
      new THREE.Vector3(  0, -5,  -8),
      new THREE.Vector3(-12,  6,  -6),
      ]),
      makeCurve([
        new THREE.Vector3(-20,  2,   5),
        new THREE.Vector3(-10, -6,   3),
        new THREE.Vector3(  0,  3,   6),
        new THREE.Vector3( 10, -1,   3),
        new THREE.Vector3( 20,  6,   5),
        new THREE.Vector3( 10,  2,  -5),
        new THREE.Vector3(  0, -2,  -6),
        new THREE.Vector3(-14,  4,  -7),
      ]),
      makeCurve([
        new THREE.Vector3(-20,  6,   4),
        new THREE.Vector3( -8,  0,   5),
        new THREE.Vector3(  0, -3,   4),
        new THREE.Vector3(  8,  3,   5),
        new THREE.Vector3( 20,  1,   4),
        new THREE.Vector3( 14,  8,  -4),
        new THREE.Vector3(  0, -7,  -6),
        new THREE.Vector3(-10,  8,  -5),
      ]),
    ];
    
    const tube2Variants = [
      makeCurve([
        new THREE.Vector3(-15, -6,   5),
        new THREE.Vector3(  5,  2,   1),
        new THREE.Vector3( 18,  6,  -1),
        new THREE.Vector3(  8, -2,  -4),
        new THREE.Vector3( -8,  4,  -7),
        new THREE.Vector3(-18, -1,  -3),
        new THREE.Vector3( -5, -5,   3),
        new THREE.Vector3( 15,  1,  -6),
      ]),
      makeCurve([
        new THREE.Vector3(-15, -2,   4),
        new THREE.Vector3(  5,  5,   2),
        new THREE.Vector3( 18,  2,  -2),
        new THREE.Vector3(  8,  2,  -3),
        new THREE.Vector3( -8,  7,  -6),
        new THREE.Vector3(-18,  3,  -4),
        new THREE.Vector3( -5, -1,   4),
        new THREE.Vector3( 15,  4,  -5),
      ]),
      makeCurve([
        new THREE.Vector3(-15, -9,   5),
        new THREE.Vector3(  5, -1,   1),
        new THREE.Vector3( 18,  9,   0),
        new THREE.Vector3(  8, -5,  -5),
        new THREE.Vector3( -8,  1,  -8),
        new THREE.Vector3(-18, -4,  -2),
        new THREE.Vector3( -5, -8,   2),
        new THREE.Vector3( 15, -2,  -7),
      ]),
    ];
    
    const tube3Variants = [
      makeCurve([
        new THREE.Vector3(  8,  8,  -7),
        new THREE.Vector3(  2,  3,   0),
        new THREE.Vector3( -5,  6,   3),
        new THREE.Vector3(-14,  1,   5),
        new THREE.Vector3(-10, -4,   2),
        new THREE.Vector3(  0, -6,  -3),
        new THREE.Vector3( 10, -3,  -6),
      ]),
      makeCurve([
        new THREE.Vector3(  8,  5,  -5),
        new THREE.Vector3(  2,  6,   2),
        new THREE.Vector3( -5,  3,   5),
        new THREE.Vector3(-14,  4,   4),
        new THREE.Vector3(-10, -1,   4),
        new THREE.Vector3(  0, -3,  -1),
        new THREE.Vector3( 10,  0,  -4),
      ]),
      makeCurve([
        new THREE.Vector3(  2,  2,  -7),
        new THREE.Vector3( -4, -4,   0),
        new THREE.Vector3(-11, -2,   3),
        new THREE.Vector3(-18, -8,   5),
        new THREE.Vector3(-14, -13,  2),
        new THREE.Vector3( -4, -15, -3),
        new THREE.Vector3(  6, -12, -6),
      ]),
    ];
    

    const createTube = (color, variants, count, tubeRadius, switchEveryMs) => {
      const curve = variants[0];

      const positions = new Float32Array(count * 3);
      const progress = new Float32Array(count);
      const speeds = new Float32Array(count);
      const radialOffsets = new Float32Array(count * 2);
      const colors = new Float32Array(count * 3);
      const drifts = new Float32Array(count * 3);
      const baseColor = new THREE.Color(color);

      for (let i = 0; i < count; i++) {
        progress[i] = Math.random();
        speeds[i] = 0.0001 + Math.random() * 0.0003;

        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * tubeRadius;
        radialOffsets[i * 2]     = Math.cos(angle) * r;
        radialOffsets[i * 2 + 1] = Math.sin(angle) * r;

        drifts[i * 3]     = (Math.random() - 0.5) * 0.001;
        drifts[i * 3 + 1] = (Math.random() - 0.5) * 0.001;
        drifts[i * 3 + 2] = (Math.random() - 0.5) * 0.0005;

        const point = curve.getPoint(progress[i]);
        positions[i * 3]     = point.x + radialOffsets[i * 2];
        positions[i * 3 + 1] = point.y + radialOffsets[i * 2 + 1];
        positions[i * 3 + 2] = point.z;

        colors[i * 3]     = baseColor.r;
        colors[i * 3 + 1] = baseColor.g;
        colors[i * 3 + 2] = baseColor.b;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.06,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true,
        map: sprite,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      });

      const points = new THREE.Points(geo, mat);
      scene.add(points);

      return {
        points, progress, speeds, radialOffsets, baseColor, drifts,
        variants,
        currentIndex: 0,
        currentCurve: variants[0],
        nextCurve: null,
        lerpT: 0,
        isLerping: false,
        switchEveryMs,
        firstSwitch: true,
        lastSwitch: Date.now(),
      };
    };

    const tubes = [
      createTube(0x00d4ff, tube1Variants, 12000, 0.85, 20000),
      createTube(0x00c896, tube2Variants, 10000, 0.95, 28000),
      createTube(0x00aaff, tube3Variants,  8000, 0.70, 30000),
    ];

    const zFar   = -8;
    const zClose =  6;
    const zRange = zClose - zFar;

    let animating = true;

    const animate = () => {
      if (!animating) return;
      requestAnimationFrame(animate);

      const now = Date.now();

      tubes.forEach((tube) => {
        const { points, progress, speeds, radialOffsets, baseColor, drifts } = tube;
        const pos = points.geometry.attributes.position;
        const col = points.geometry.attributes.color;

        // check if it's time to switch curves
        const switchDelay = tube.firstSwitch ? 2000 : tube.switchEveryMs;
          if (!tube.isLerping && now - tube.lastSwitch > switchDelay) {
            tube.firstSwitch = false;
            const nextIndex = (tube.currentIndex + 1 + Math.floor(Math.random() * (tube.variants.length - 1))) % tube.variants.length;
            tube.nextCurve = tube.variants[nextIndex];
            tube.currentIndex = nextIndex;
            tube.isLerping = true;
            tube.lerpT = 0;
            tube.lastSwitch = now;
        }

        // advance lerp
        if (tube.isLerping) {
          tube.lerpT += 0.0005;
          if (tube.lerpT >= 1) {
            tube.lerpT = 1;
            tube.currentCurve = tube.nextCurve;
            tube.nextCurve = null;
            tube.isLerping = false;
          }
        }

        for (let i = 0; i < pos.count; i++) {
          progress[i] += speeds[i];

          if (progress[i] > 1) {
            progress[i] = 0;
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * 0.85;
            radialOffsets[i * 2]     = Math.cos(angle) * r;
            radialOffsets[i * 2 + 1] = Math.sin(angle) * r;
            const startPoint = tube.currentCurve.getPoint(0);
            pos.setXYZ(
              i,
              startPoint.x + radialOffsets[i * 2],
              startPoint.y + radialOffsets[i * 2 + 1],
              startPoint.z
            );
            continue;
          }

          // get target position — lerp between curves if switching
          let px, py, pz;
          if (tube.isLerping && tube.nextCurve) {
            const pA = tube.currentCurve.getPoint(progress[i]);
            const pB = tube.nextCurve.getPoint(progress[i]);
            px = pA.x + (pB.x - pA.x) * tube.lerpT + radialOffsets[i * 2];
            py = pA.y + (pB.y - pA.y) * tube.lerpT + radialOffsets[i * 2 + 1];
            pz = pA.z + (pB.z - pA.z) * tube.lerpT;
          } else {
            const point = tube.currentCurve.getPoint(progress[i]);
            px = point.x + radialOffsets[i * 2];
            py = point.y + radialOffsets[i * 2 + 1];
            pz = point.z;
          }

          const currentX = pos.getX(i);
          const currentY = pos.getY(i);
          const currentZ = pos.getZ(i);

          pos.setXYZ(
            i,
            currentX + drifts[i * 3]     + (px - currentX) * 0.08,
            currentY + drifts[i * 3 + 1] + (py - currentY) * 0.08,
            currentZ + drifts[i * 3 + 2] + (pz - currentZ) * 0.08,
          );

          const t = Math.max(0, Math.min(1, (pz - zFar) / zRange));
          const depthFade = 0.35 + t * t * 0.65;
          const edgeFade = Math.sin(progress[i] * Math.PI);
          const smoothEdge = 0.4 + edgeFade * 0.6;
          const fade = depthFade * smoothEdge;

          col.setXYZ(
            i,
            baseColor.r * fade,
            baseColor.g * fade,
            baseColor.b * fade
          );
        }

        pos.needsUpdate = true;
        col.needsUpdate = true;
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