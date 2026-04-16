"use client";

import React, { useState } from "react";
import { PageWrapper } from "@/shared/components/layout/PageWrapper";
import { teamMembers } from "@/core/config/team";
import { Search, Activity, Globe, LayoutGrid, Network } from "lucide-react";

import { GlitchText } from "@/shared/components/ui/GlitchText";
import { NetworkGraph } from "@/features/visualizations/components/NetworkGraph";
import { EncryptedText } from "@/shared/components/ui/EncryptedText";
import { HoneypotLink } from "@/shared/components/ui/HoneypotLink";
import { AddEntityModal } from "@/shared/components/modals/AddEntityModal";
import { CollectiveCard } from "@/features/team/components/CollectiveCard";

export default function TeamPage() {
  const [viewMode, setViewMode] = useState<"GRID_VIEW" | "NETWORK_VIEW">("GRID_VIEW");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const filteredMembers = teamMembers;

  return (
    <PageWrapper className="pt-24 pb-32">
      <AddEntityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        entityType="NODE" 
      />


      <div className="max-w-7xl mx-auto px-4 z-10 relative">
        {/* Header Section */}
        <div className="mb-10 md:mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div className="w-full">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-grotesk text-white tracking-tighter mb-4 break-words leading-tight flex flex-wrap items-center gap-x-4">
              <GlitchText text="THE" as="span" intensity="high" />
              <GlitchText text="SENTINELS" as="span" intensity="high" />
            </h1>
            <div className="space-y-1">
              <div className="flex items-center gap-3 text-[10px] text-primary/40 font-jetbrains tracking-[0.3em] uppercase">
                <Activity className="w-3 h-3" />
                <EncryptedText>SOCS_COLLECTIVE_DIRECTORY</EncryptedText>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-primary/60 font-jetbrains tracking-[0.3em] uppercase">
                <Globe className="w-3 h-3 text-primary animate-pulse" />
                <span><EncryptedText>NODE_NETWORK_DIRECTORY_v3.0.4</EncryptedText></span>
              </div>
            </div>
            
            <div className="mt-6">
                <HoneypotLink label="ACCESS_DATABANK_NODE" />
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col gap-4 items-start lg:items-end mt-8 md:mt-0">
            <div className="relative w-full lg:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                 type="text" 
                 placeholder="FILTER_BY_OPERATOR_ID_OR_SPECIALITY..." 
                 className="w-full bg-black/40 border border-white/10 rounded-sm px-12 py-3 text-xs font-jetbrains text-white outline-none focus:border-primary/40 focus:bg-primary/5 transition-all placeholder:text-gray-700 uppercase"
              />
            </div>
            

            <div className="flex w-full lg:w-auto mt-2 lg:mt-0 gap-3">
              <div className="flex gap-1 border border-white/10 p-1 bg-black/40 rounded-sm">
                <button
                  onClick={() => setViewMode("GRID_VIEW")}
                  title="Grid View"
                  className={`flex-1 lg:flex-none p-2 flex justify-center items-center rounded-sm transition-colors ${viewMode === "GRID_VIEW" ? "bg-primary/20 text-primary" : "text-gray-500 hover:text-white"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("NETWORK_VIEW")}
                  title="Network Relational Graph View"
                  className={`flex-1 lg:flex-none p-2 flex justify-center items-center rounded-sm transition-colors ${viewMode === "NETWORK_VIEW" ? "bg-primary/20 text-primary" : "text-gray-500 hover:text-white"}`}
                >
                  <Network className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-primary hover:bg-primary hover:text-black transition-all duration-300 group"
                style={{ clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
              >
                <span className="group-hover:rotate-90 transition-transform">+</span>
                <span>ADD_NODE</span>
              </button>
            </div>
          </div>
        </div>

        {/* Directory Presentation */}
        {viewMode === "GRID_VIEW" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member, i) => (
              <CollectiveCard key={member.slug} member={member} delay={i} />
            ))}
          </div>
        ) : (
          <div className="w-full h-[650px] border border-white/10 bg-[#030508]/80 rounded-sm relative overflow-hidden">
             <div className="absolute top-4 left-4 z-10 hidden md:block">
               <div className="text-[10px] text-primary/60 font-mono tracking-widest uppercase mb-2">GRAPH_LEGEND</div>
               <div className="flex flex-col gap-2 text-[9px] font-jetbrains text-gray-400">
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#ff0040]"></div> SOCS MAINFRAME</div>
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#ff2d55]"></div> CORE / ADMIN</div>
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#ff6b00]"></div> LEAD</div>
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary/80"></div> MEMBER</div>
               </div>
             </div>
             <NetworkGraph />
          </div>
        )}

        {/* Floating Footer Detail */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[8px] text-gray-700 font-mono tracking-widest uppercase text-center md:text-left">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <span className="text-primary/40 leading-none">● {filteredMembers.length} ACTIVE OPERATORS</span>
            <span className="leading-none">SYST_LOG: DIRECTORY_LOAD_OK</span>
          </div>
          <div className="leading-none text-center md:text-right">
            © 2024 SOCS // ENCRYPTED_ACCESS_ONLY
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
