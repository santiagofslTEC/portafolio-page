import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./OceanHero.css";

gsap.registerPlugin(ScrollTrigger);

const OceanHero = ({ onDive }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollRef = useRef(null);
  const waveRef = useRef(null);

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

    // wave wipe from right to left
    gsap.fromTo(waveRef.current,
      { x: "100vw" },
      {
        x: "-10vw",
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=800",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onLeave: () => {
            onDive();
          }
        }
      }
    );

    // fade out text as wave approaches
    gsap.to([titleRef.current, subtitleRef.current, scrollRef.current], {
      opacity: 0,
      y: -30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300",
        scrub: 1,
      }
    });

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

      <div ref={waveRef} className="wave-wipe">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M80,0 C40,150 0,200 0,450 C0,700 40,750 80,900 L1440,900 L1440,0 Z"
            fill="#041e33"
          />
          <path
            d="M100,0 C60,150 20,200 20,450 C20,700 60,750 100,900 L1440,900 L1440,0 Z"
            fill="#0a3d6b"
            opacity="0.5"
          />
        </svg>
      </div>

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