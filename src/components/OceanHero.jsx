import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./OceanHero.css";

gsap.registerPlugin(ScrollTrigger);

const OceanHero = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // --- Scene & Camera ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d1b2e, 0.08);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 2.5, 6);
    camera.lookAt(0, 0, 0);

    // --- Ocean wave plane ---
    const waveGeometry = new THREE.PlaneGeometry(40, 40, 80, 80);
    const waveMaterial = new THREE.MeshBasicMaterial({
      color: 0x1a3a5c,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    wave.rotation.x = -Math.PI / 2.5;
    scene.add(wave);

    // --- Surfboard ---
    const boardGroup = new THREE.Group();

    const boardGeo = new THREE.CapsuleGeometry(0.18, 1.4, 8, 16);
    const boardMat = new THREE.MeshBasicMaterial({ color: 0xf0ead6 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.rotation.z = Math.PI / 2;
    boardGroup.add(board);

    // fin
    const finGeo = new THREE.ConeGeometry(0.08, 0.25, 8);
    const finMat = new THREE.MeshBasicMaterial({ color: 0x3d6b8f });
    const fin = new THREE.Mesh(finGeo, finMat);
    fin.position.set(0, -0.18, 0.05);
    fin.rotation.z = Math.PI;
    boardGroup.add(fin);

    boardGroup.position.set(0, 0.4, 0);
    scene.add(boardGroup);

    // --- Particles (sea spray) ---
    const particleCount = 300;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x7a9ab5,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Wave animation ---
    const clock = new THREE.Clock();
    const wavePositions = waveGeometry.attributes.position;

    const animate = () => {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // animate wave vertices
      for (let i = 0; i < wavePositions.count; i++) {
        const x = wavePositions.getX(i);
        const y = wavePositions.getY(i);
        wavePositions.setZ(i, Math.sin(x * 0.5 + t) * 0.4 + Math.cos(y * 0.4 + t * 0.8) * 0.3);
      }
      wavePositions.needsUpdate = true;

      // bob the surfboard
      boardGroup.position.y = 0.4 + Math.sin(t * 1.2) * 0.12;
      boardGroup.rotation.z = Math.sin(t * 0.8) * 0.06;

      // rotate particles slowly
      particles.rotation.y = t * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    // --- GSAP text reveal on load ---
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(titleRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 })
      .fromTo(subtitleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.5")
      .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.2");

    // --- GSAP ScrollTrigger camera zoom ---
    gsap.to(camera.position, {
      z: -2,
      y: -1,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
    });

    // fade out hero content on scroll
    gsap.to([titleRef.current, subtitleRef.current, scrollRef.current], {
      opacity: 0,
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "30% top",
        scrub: 1,
      },
    });

    // --- Resize ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="ocean-container">
      <canvas ref={canvasRef} className="ocean-canvas" />
      <div className="ocean-content">
        <h1 ref={titleRef} className="ocean-title">
          Santiago <span className="ocean-accent">Fernández</span>
        </h1>
        <p ref={subtitleRef} className="ocean-subtitle">
          Software developer — building clean, performant digital experiences
        </p>
        <div ref={scrollRef} className="scroll-indicator">
          <span>scroll</span>
          <div className="scroll-line" />
        </div>
      </div>
    </div>
  );
};

export default OceanHero;