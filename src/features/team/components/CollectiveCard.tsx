"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Globe, Terminal, User, Zap } from "lucide-react";
import { TeamMember } from "@/core/config/team";
import { GlitchText } from "@/shared/components/ui/GlitchText";

const CLEARANCE_MAP = {
  core: { label: "ADMIN", color: "bg-red-500", text: "text-red-500" },
  lead: { label: "SENIOR", color: "bg-yellow-500", text: "text-yellow-500" },
  member: { label: "MEMBER", color: "bg-blue-500", text: "text-blue-500" },
} as const;

export function CollectiveCard({
  member,
  delay = 0,
  variant = "directory",
}: {
  member: TeamMember;
  delay?: number;
  variant?: "directory" | "credits";
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: delay * 0.05,
        ease: "power2.out",
      }
    );
  }, [delay]);

  const clearance = CLEARANCE_MAP[member.tier];
  const hexId = `#0X${(member.name.length * 153).toString(16).toUpperCase()}${member.name
    .charCodeAt(0)
    .toString(16)
    .toUpperCase()}`;
  const isCreditsCard = variant === "credits";

  return (
    <Link href={`/team/${member.slug}`} className="block h-full group">
      <div
        ref={cardRef}
        className="dashboard-card p-6 rounded-sm border-b-2 border-b-white/5 group-hover:border-b-primary/50 transition-all opacity-0 h-full min-h-[260px] flex flex-col cursor-pointer bg-black/40 backdrop-blur-sm"
      >
        <div className={`mb-6 ${isCreditsCard ? "flex justify-center" : "flex justify-between items-start"}`}>
          <div className="relative">
            <div
              className={`bg-gradient-to-br from-gray-800 to-black border border-white/10 rounded-sm flex items-center justify-center overflow-hidden ${
                isCreditsCard ? "w-24 h-24" : "w-16 h-16"
              }`}
            >
              <User
                className={`text-gray-600 group-hover:text-primary/40 transition-colors ${
                  isCreditsCard ? "w-12 h-12" : "w-8 h-8"
                }`}
              />
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {!isCreditsCard && (
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 ${clearance.color} rounded-sm shadow-[0_0_8px_rgba(255,255,255,0.2)]`}
              />
            )}
          </div>

          {!isCreditsCard && (
            <div className="text-right">
              <div className={`text-[9px] font-bold tracking-widest ${clearance.text} uppercase mb-1`}>
                CLEARANCE: {clearance.label}
              </div>
              <div className="text-[10px] text-gray-500 font-mono tracking-tighter">ID: {hexId}</div>
            </div>
          )}
        </div>

        <div className={`flex-grow ${isCreditsCard ? "text-center" : ""}`}>
          <h3 className="text-white font-bold font-grotesk text-xl tracking-tight mb-1 uppercase group-hover:text-primary transition-colors">
            <GlitchText text={member.name.replace(" ", "_")} />
          </h3>
          <p
            className={`text-[10px] text-primary/60 font-jetbrains tracking-widest uppercase mb-4 ${
              isCreditsCard ? "justify-center" : ""
            }`}
          >
            {member.role.replace(" ", "_")}
          </p>
        </div>

        {isCreditsCard ? (
          <div className="mt-auto pt-4 border-t border-white/5">
            <div className="text-[8px] text-primary/40 font-mono uppercase tracking-[0.25em]">
              SOCS_WEBSITE_CREDITS
            </div>
          </div>
        ) : (
          <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
            <div className="flex gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
              <Globe className="w-3 h-3 text-gray-500" />
              <Terminal className="w-3 h-3 text-gray-500" />
              <Zap className="w-3 h-3 text-gray-500" />
            </div>
            <div className="text-[8px] text-gray-700 font-mono uppercase tracking-tighter group-hover:text-primary/40 transition-colors">
              NODE_ACCESS_GRANTED
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
