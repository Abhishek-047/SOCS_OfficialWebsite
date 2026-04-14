"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NeonButton } from "@/shared/components/ui/NeonButton";
import { MobileMenu } from "./MobileMenu";
import { X, Menu } from "lucide-react";

const TICKER_ITEMS = [
  { text: "# CTF Season 2025 registrations open — join now", href: "/events" },
  { text: "# Zero-day discovered in OpenSSL — patch immediately", href: "/resources" },
  { text: "# SOCS Workshop: Reverse Engineering 101 — this Saturday", href: "/events" },
  { text: "# New malware strain targeting Indian universities detected", href: "/resources" },
  { text: "# Bug Bounty Program launched — report vulnerabilities, earn rewards", href: "/projects" },
  { text: "# Capture The Flag results: Team NullPtr wins Round 5", href: "/events" },
  { text: "# Ethical hacking bootcamp — limited seats available", href: "/events" },
  { text: "# Critical CVE-2025-0x1337 patched — update your systems", href: "/resources" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home",      href: "/",          code: "01" },
    { name: "Team",      href: "/team",       code: "02" },
    { name: "Projects",  href: "/projects",   code: "03" },
    { name: "Events",    href: "/events",     code: "04" },
    { name: "Resources", href: "/resources",  code: "05" },
    { name: "Gallery",   href: "/gallery",    code: "06" },
    { name: "Contact",   href: "/contact",    code: "07" },
  ];

  // Duplicate items for seamless loop
  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      {/* ── Standard Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[3000000] transition-all duration-300 min-h-[64px] flex flex-col shadow-2xl ${
          scrolled || pathname !== "/"
            ? "bg-[#050508] backdrop-blur-md border-b border-primary/30"
            : "bg-transparent border-b border-transparent"
        }`}
      >
          <div className="w-full flex items-center justify-between gap-2 px-3 sm:px-4 md:px-12 py-3.5 md:py-4">
            {/* ── Left: Logo ── */}
            <div className="flex items-center shrink-0">
              <Link href="/" className="flex items-center gap-2 md:gap-4 group scale-85 sm:scale-90 md:scale-100 origin-left">
                <div className="relative">
                  <span className="font-turret text-xl md:text-2xl font-black text-white tracking-[0.05em] transition-all duration-300 group-hover:text-primary">
                    SOCS
                  </span>
                  <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300 shadow-[0_0_10px_rgba(200,255,0,0.8)]" />
                </div>
                <div className="relative flex items-center">
                  <div className="w-[2px] md:w-[3px] h-5 md:h-6 bg-primary shadow-[0_0_15px_rgba(200,255,0,0.6)]" />
                  <div className="ml-1.5 md:ml-2 w-1 md:w-1.5 h-1 md:h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(200,255,0,0.8)]" />
                </div>
              </Link>
            </div>

            {/* ── Center: Nav Links (Desktop) ── */}
            <div className="hidden lg:flex items-center gap-0 flex-1 justify-center px-4">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-4 xl:px-6 py-2 text-[14px] xl:text-[15px] font-black font-turret tracking-[0.1em] uppercase transition-all duration-300 group ${
                      isActive ? "text-primary" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-glow"
                        className="absolute inset-x-0 bottom-0 top-0 z-0 bg-primary/5 border-l border-r border-primary/20"
                      />
                    )}
                    <span className="relative z-10 flex items-center transition-all duration-300 group-hover:text-primary">
                      <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mr-1 text-primary font-mono text-xs">[</span>
                      {link.name}
                      <span className="opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ml-1 text-primary font-mono text-xs">]</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* ── Right: Actions ── */}
            <div className="flex items-center justify-end gap-2 md:gap-4 shrink-0 min-w-0">
              <div className="flex sm:hidden items-center">
                <NeonButton
                  href="/join"
                  variant="outline"
                  className="text-[8px] px-2.5 py-2 font-black tracking-[0.14em] border min-w-[72px]"
                >
                  JOIN
                </NeonButton>
              </div>

              <div className="hidden sm:flex items-center">
                <NeonButton href="/login" variant="outline" className="text-[11px] md:text-[13px] px-4 md:px-6 py-2 md:py-2.5 font-black tracking-[0.15em] md:tracking-[0.2em] border-2">
                  LOGIN
                </NeonButton>
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex lg:hidden text-primary hover:text-white transition-all p-2.5 items-center justify-center border-2 border-primary/20 rounded-sm bg-primary/5 active:bg-primary/20 relative z-[3000002]"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

        {/* ── Hacker Ticker Bar ── */}
        <div className="w-full bg-[#050508] border-b border-primary/10 backdrop-blur-sm overflow-hidden flex items-center h-7">
          {/* Label */}
          <div className="flex items-center gap-2 px-4 shrink-0 border-r border-primary/20 h-full bg-primary/5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(255,0,0,0.8)]" />
            <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-primary uppercase whitespace-nowrap">THREAT_FEED</span>
          </div>

          {/* Scrolling content */}
          <div className="relative flex-1 overflow-hidden">
            <motion.div
              className="flex items-center gap-0 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {tickerContent.map((item, i) => (
                <Link 
                  key={i} 
                  href={item.href} 
                  className="inline-flex items-center shrink-0 whitespace-nowrap cursor-none"
                >
                  <span className="text-[11px] font-mono text-primary/70 px-6 tracking-wide hover:text-white transition-colors duration-200">
                    {item.text}
                  </span>
                  <span className="text-primary/20 text-xs select-none">|</span>
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Right fade */}
          <div className="absolute right-0 top-0 h-7 w-16 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
        </div>
      </nav>

      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} links={links} pathname={pathname} />
    </>
  );
}
