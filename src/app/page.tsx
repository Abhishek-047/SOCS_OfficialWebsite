"use client";

import { PageWrapper } from "@/shared/components/layout/PageWrapper";
import { HeroSection } from "@/features/hero/components/HeroSection";
import { AboutSection } from "@/features/about/components/AboutSection";
import { StatsSection } from "@/features/stats/components/StatsSection";
import { FeaturedProjects } from "@/features/projects/components/FeaturedProjects";
import { EventsPreview } from "@/features/events/components/EventsPreview";
import { HomeTeamPreview } from "@/features/team/components/HomeTeamPreview";

export default function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      <div className="space-y-24 pb-20">
        <AboutSection />
        <StatsSection />
        <FeaturedProjects />
        <EventsPreview />
        <HomeTeamPreview />
      </div>
    </PageWrapper>
  );
}
