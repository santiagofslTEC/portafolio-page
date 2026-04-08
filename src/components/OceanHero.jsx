import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./OceanHero.css";

gsap.registerPlugin(ScrollTrigger);

const OceanHero = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    // text reveal on load
    gsap.fromTo(titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
    );
    gsap.fromTo(subtitleRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.7 }
    );
    gsap.fromTo(scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power3.out", delay: 1.2 }
    );


    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="ocean-container">
      <video
        ref={videoRef}
        className="ocean-video"
        src="/ocean1.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="ocean-content">
        <h1 ref={titleRef} className="ocean-title">
          Santiago <span className="ocean-accent">Fernández</span>
        </h1>
        <p ref={subtitleRef} className="ocean-subtitle">
          Software developer — building clean, performant digital experiences
        </p>
        <div ref={scrollRef} className="scroll-indicator">
          <span>scroll to dive</span>
          <div className="scroll-line" />
        </div>
      </div>
    </div>
  );
};

export default OceanHero;