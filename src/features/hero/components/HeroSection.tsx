"use client";

import React, { useEffect, useRef } from "react";
import { NeonButton } from "@/shared/components/ui/NeonButton";
import gsap from "gsap";
import { GlitchText } from "@/shared/components/ui/GlitchText";
import { ScrambleText } from "@/shared/components/ui/ScrambleText";
import dynamic from "next/dynamic";

const Globe3D = dynamic(
  () => import("@/features/visualizations/components/Globe3D").then(m => ({ default: m.Globe3D })),
  {
    ssr: false, 
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#030608] border border-primary/20">
        <span className="text-[10px] text-primary/40 font-mono tracking-widest animate-pulse">BOOTING GLOBAL_INTERFACE...</span>
      </div>
    )
  }
);

export function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(headingRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 1, ease: "power4.out" }
    );

    tl.fromTo(subtextRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    );

    tl.fromTo(ctaRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.4"
    );

    tl.fromTo(mapRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=0.8"
    );

    return () => { tl.kill(); };
  }, []);

  return (
    <section className="relative pt-8 md:pt-12 pb-12 min-h-[85vh] flex flex-col justify-start overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20 -z-20" />
      <div className="absolute inset-0 motherboard-lines opacity-10 -z-20" />

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center z-10 w-full mt-2 md:mt-10">
        <div className="text-left w-full min-w-0 order-2 lg:order-1 flex flex-col justify-center md:mt-1">
          <div className="mb-5 inline-flex items-center gap-3 px-3 py-1 bg-primary/10 border border-primary/20 text-[10px] md:text-[11px] text-primary tracking-[0.4em] md:tracking-[0.55em] font-jetbrains uppercase w-fit">
            <span className="w-2 h-2 bg-primary animate-pulse" />
            <span>Society of Cyber Security</span>
          </div>

          <h1 ref={headingRef} className="text-4xl sm:text-5xl md:text-6xl xl:text-[5rem] font-bold font-grotesk text-white mb-5 tracking-tighter leading-[1] break-words">
            <GlitchText text="THE CYBER" as="span" className="block text-gray-400" intensity="low" />
            <GlitchText text="ARCHITECTS" as="span" className="text-primary text-glow" intensity="low" />
          </h1>

          <p ref={subtextRef} className="max-w-lg text-gray-300 font-jetbrains text-sm md:text-base mb-8 leading-relaxed opacity-0">
            <ScrambleText text="Uniting elite researchers, ethical hackers, and security engineers. Learn. Break. Secure. Repeat." delay={1000} />
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 opacity-0">
            <NeonButton href="/contact" variant="primary" className="px-8 py-3.5 font-bold text-sm md:text-base">
              Join Us
            </NeonButton>
            <NeonButton href="/projects" variant="outline" className="px-8 py-3.5 text-sm md:text-base">
              View Projects
            </NeonButton>
          </div>
        </div>

        <div ref={mapRef} className="order-1 lg:order-2 w-full h-[320px] sm:h-[450px] lg:h-[500px] xl:h-[650px] relative flex items-center justify-center opacity-0 mb-8 lg:mb-0">
          <div className="w-full h-full">
            <Globe3D />
          </div>
        </div>
      </div>
    </section>
  );
}
