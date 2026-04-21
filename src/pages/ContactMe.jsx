import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import "./ContactMe.css";

const ContactMe = () => {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const overlayRef = useRef(null);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleOnchange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setStatus("empty-fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regular expression that cheks for mail to be in the corrert format aka "something@something.something"
    if (!emailRegex.test(form.email)) {
      setStatus("invalid-email");
      return;
    }
    setStatus("sending");

    try {
      const data = await fetch("/api/server", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      if (data.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

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
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color,
        size: 0.03,
        transparent: true,
        opacity: 0.55,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      return { points, offsets, speedMult, angleOffset };
    };

    const streams = [
      createStream(0x00d4ff, 300, 0.7, 0),
      createStream(0x00aaff, 200, 0.5, Math.PI / 4),
      createStream(0x40e0ff, 180, 1.0, -Math.PI / 5),
      createStream(0x7af0ff, 130, 0.4, Math.PI / 3),
      createStream(0x0088cc, 100, 0.8, -Math.PI / 6),
    ];

    let t = 0;
    let animating = true;

    const animate = () => {
      if (!animating) return;
      requestAnimationFrame(animate);
      t += 0.006;

      streams.forEach(({ points, offsets, speedMult, angleOffset }) => {
        const pos = points.geometry.attributes.position;
        const count = pos.count;

        for (let i = 0; i < count; i++) {
          const offset = offsets[i];
          const newX = pos.getX(i) + Math.cos(angleOffset) * speedMult * 0.009;
          const newY =
            pos.getY(i) +
            Math.sin(t * speedMult + offset) * 0.008 +
            Math.sin(angleOffset) * speedMult * 0.005;
          const newZ = pos.getZ(i) + Math.cos(t * 0.3 + offset) * 0.003;

          pos.setXYZ(i, newX, newY, newZ);

          if (pos.getX(i) > 12) pos.setX(i, -12);
          if (pos.getX(i) < -12) pos.setX(i, 12);
          if (pos.getY(i) > 7) pos.setY(i, -7);
          if (pos.getY(i) < -7) pos.setY(i, 7);
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
    <div className="contactme-container">
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
      <canvas ref={canvasRef} className="contactme-canvas" />

      <div ref={contentRef} className="contactme-content">
        <p className="depth-label">— depth: 40m —</p>
        <h2 className="contactme-title">Contact Me</h2>
        <p className="contactme-sub">Send a message into the deep</p>

        <div className="contact-card">
          <div className="field-group">
            <label className="field-label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="field-input"
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleOnchange}
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="field-input"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleOnchange}
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              className="field-input field-textarea"
              name="message"
              placeholder="What's on your mind?"
              rows={5}
              value={form.message}
              onChange={handleOnchange}
            />
          </div>

          <button
            className="send-btn"
            onClick={handleSendEmail}
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && (
            <p
              style={{
                color: "#00d4ff",
                fontSize: "13px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginTop: "8px",
              }}
            >
              Message sent — I'll be in touch.
            </p>
          )}
          {status === "empty" && (
            <p
              style={{
                color: "#ff6b6b",
                fontSize: "13px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginTop: "8px",
              }}
            >
              Please fill in all fields.
            </p>
          )}
          {status === "invalid" && (
            <p
              style={{
                color: "#ff6b6b",
                fontSize: "13px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginTop: "8px",
              }}
            >
              Invalid email address.
            </p>
          )}
          {status === "error" && (
            <p
              style={{
                color: "#ff6b6b",
                fontSize: "13px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginTop: "8px",
              }}
            >
              Something went wrong. Try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMe;
