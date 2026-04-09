import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import "./AboutMe.css";

const SKILLS = ["React","React native", "JavaScript", "Python", "CSS", "Git", "Node.js", "three.js", "GSAP",];
const INTERESTS = ["Surfing", "Tennis", "Software Development", "Open Source"];

const AboutMe = () => {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 5;

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
        size: 0.03,
        transparent: true,
        opacity: 0.6,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      return { points, offsets, speedMult, angleOffset };
    };

    const streams = [
      createStream(0x00d4ff, 350, 0.8,  0),
      createStream(0x00aaff, 250, 0.6,  Math.PI / 4),
      createStream(0x40e0ff, 200, 1.1, -Math.PI / 5),
      createStream(0x7af0ff, 150, 0.4,  Math.PI / 3),
      createStream(0x0088cc, 120, 0.7, -Math.PI / 6),
    ];

    let t = 0;
    let animating = true;

    const animate = () => {
      if (!animating) return;
      requestAnimationFrame(animate);
      t += 0.007;

      streams.forEach(({ points, offsets, speedMult, angleOffset }) => {
        const pos = points.geometry.attributes.position;
        const count = pos.count;

        for (let i = 0; i < count; i++) {
          const offset = offsets[i];
          const newX = pos.getX(i) + Math.cos(angleOffset) * speedMult * 0.01;
          const newY =
            pos.getY(i) +
            Math.sin(t * speedMult + offset) * 0.009 +
            Math.sin(angleOffset) * speedMult * 0.006;
          const newZ = pos.getZ(i) + Math.cos(t * 0.3 + offset) * 0.003;

          pos.setXYZ(i, newX, newY, newZ);

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

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.4 }
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
    <div className="aboutme-container">
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          background: "#041e33",
          zIndex: 100,
          pointerEvents: "none",
        }}
      />
      <canvas ref={canvasRef} className="aboutme-canvas" />

      <div ref={contentRef} className="aboutme-content">
        <p className="depth-label">— depth: 20m —</p>
        <h2 className="aboutme-title">About Me</h2>
        <p className="aboutme-sub">The person behind the code</p>

        <div className="aboutme-inner">
          <div className="bio-card">
            <p className="bio-text">
              Hey, I'm Santiago — a computer science student at Tecnológico de Monterrey
              passionate about building things that live on the internet. When I'm not writing
              code, you'll find me chasing waves in the ocean or trading groundstrokes on
              the tennis court. I believe great software, like a perfect wave, is all about
              timing, flow, and knowing when to commit.
            </p>
          </div>

          <div className="section-block">
            <h3 className="section-heading">
              <span className="section-marker">//</span> Skills
            </h3>
            <div className="tag-group">
              {SKILLS.map((skill) => (
                <span key={skill} className="tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="section-block">
            <h3 className="section-heading">
              <span className="section-marker">//</span> Interests
            </h3>
            <div className="tag-group">
              {INTERESTS.map((interest) => (
                <span key={interest} className="tag">{interest}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
