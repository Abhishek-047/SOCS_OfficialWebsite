"use client";

import { motion } from "framer-motion";
import { teamMembers } from "@/core/config/team";
import { SectionHeader } from "@/shared/components/ui/SectionHeader";
import { CollectiveCard } from "./CollectiveCard";

export function HomeTeamPreview() {
  const previewMembers = teamMembers
    .filter((member) => ["abhishek", "adrash", "utkarsh"].includes(member.id))
    .map((member) => {
      if (member.id === "abhishek") {
        return { ...member, role: "Frontend Dev." };
      }

      if (member.id === "adrash") {
        return { ...member, role: "Full Stack Dev." };
      }

      if (member.id === "utkarsh") {
        return { ...member, role: "Full Stack Dev." };
      }

      return member;
    });
  const loopMembers = [...previewMembers, ...previewMembers];

  return (
    <section className="py-20 border-t border-primary/10">
      <div className="mb-8">
        <SectionHeader
          title="Team"
          subtitle="Credits to the developers who helped build the SOCS website."
          className="mb-0"
        />
      </div>

      <div className="relative mt-12 overflow-hidden">
        <motion.div
          className="flex w-max gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {loopMembers.map((member, index) => (
            <div key={`${member.slug}-${index}`} className="w-[280px] md:w-[320px] xl:w-[340px] shrink-0">
              <CollectiveCard
                member={member}
                delay={index % previewMembers.length}
                variant="credits"
              />
            </div>
          ))}
        </motion.div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#050508] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#050508] to-transparent" />
      </div>
    </section>
  );
}
