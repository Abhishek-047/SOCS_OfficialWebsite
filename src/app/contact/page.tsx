"use client";

import React, { useState } from "react";
import { PageWrapper } from "@/shared/components/layout/PageWrapper";
import { GlitchText } from "@/shared/components/ui/GlitchText";
import { NeonButton } from "@/shared/components/ui/NeonButton";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/shared/components/ui/Icons";
import { Mail, Shield, Terminal, Globe, Send, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "JOIN_CLUB",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "JOIN_CLUB", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    }, 2000);
  };

  return (
    <PageWrapper className="md:pt-44 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 text-primary/60 font-mono text-[10px] tracking-[0.5em] uppercase mb-4">
            <span className="w-2 h-2 bg-primary animate-pulse" />
            CONTACT_US
          </div>
          <h1 className="text-4xl md:text-7xl font-bold font-grotesk text-white tracking-tighter mb-4">
            <GlitchText text="GET IN" as="span" /> <br />
            <span className="text-primary text-glow"><GlitchText text="TOUCH" as="span" /></span>
          </h1>
          <p className="max-w-2xl text-gray-400 font-jetbrains text-sm leading-relaxed uppercase tracking-wider">
            Ready to secure the network or build something elite? 
            Send us a message and we'll get back to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 xl:gap-24">
          
          {/* ── LEFT: Contact Form ── */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-gray-500 tracking-[0.3em] uppercase">NAME</label>
                  <div className="relative group">
                    <input 
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your name"
                      className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-4 text-white font-mono text-sm outline-none focus:border-primary/40 focus:bg-primary/5 transition-all placeholder:text-gray-800"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-500 group-focus-within:w-full" />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-gray-500 tracking-[0.3em] uppercase">EMAIL</label>
                  <div className="relative group">
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-4 text-white font-mono text-sm outline-none focus:border-primary/40 focus:bg-primary/5 transition-all placeholder:text-gray-800"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-500 group-focus-within:w-full" />
                  </div>
                </div>
              </div>

              {/* Subject Select */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-gray-500 tracking-[0.3em] uppercase">SUBJECT</label>
                <div className="relative">
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-4 text-white font-mono text-sm outline-none focus:border-primary/40 focus:bg-primary/5 transition-all appearance-none cursor-pointer"
                  >
                    <option value="JOIN_CLUB">JOIN THE CLUB</option>
                    <option value="COLLABORATION">COLLABORATION / BUSINESS</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40">▼</div>
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-gray-500 tracking-[0.3em] uppercase">MESSAGE</label>
                <div className="relative group">
                  <textarea 
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us what's on your mind..."
                    className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-4 text-white font-mono text-sm outline-none focus:border-primary/40 focus:bg-primary/5 transition-all placeholder:text-gray-800 resize-none"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-500 group-focus-within:w-full" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <NeonButton 
                  type="submit" 
                  disabled={status !== "idle"}
                  variant="primary" 
                  className="w-full sm:w-auto px-12 py-4 font-black tracking-[0.3em] uppercase text-xs"
                >
                  {status === "idle" ? "SEND MESSAGE" : status === "submitting" ? "SENDING..." : "SENT SUCCESS"}
                </NeonButton>
                
                {status === "success" && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-primary font-mono text-[10px] tracking-widest"
                  >
                    ✓ PACKET_SENT_SUCCESSFULLY
                  </motion.span>
                )}
              </div>
            </form>

            <div className="absolute -top-10 -left-10 w-24 md:w-40 h-24 md:h-40 border border-primary/5 -z-10 animate-pulse" />
          </motion.div>

          {/* ── RIGHT: Contact Info ── */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            {/* Direct Channels */}
            <div className="space-y-8">
              <h3 className="text-white font-grotesk font-bold text-xl tracking-tighter uppercase flex items-center gap-3">
                <span className="w-1 h-6 bg-primary" />
                DIRECT_CHANNELS
              </h3>
              
              <div className="space-y-6">
                <ContactInfoItem 
                  icon={<Mail className="w-5 h-5" />}
                  label="COMMS_UPLINK"
                  value="socs.club@rishihood.edu.in"
                  link="mailto:socs.club@rishihood.edu.in"
                />
                <ContactInfoItem 
                  icon={<MessageSquare className="w-5 h-5" />}
                  label="SECURE_CHAT"
                  value="discord.gg/2DbssC8t"
                  link="https://discord.gg/2DbssC8t"
                />
                <ContactInfoItem 
                  icon={<Globe className="w-5 h-5" />}
                  label="HQ_NODE"
                  value="CYBERSPACE_01 // REMOTE_FIRST"
                  link="#"
                />
              </div>
            </div>

            {/* Social Matrix */}
            <div className="space-y-8 pt-8 border-t border-white/5">
              <h3 className="text-white font-grotesk font-bold text-xl tracking-tighter uppercase flex items-center gap-3">
                <span className="w-1 h-6 bg-primary" />
                SOCIAL_MATRIX
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <SocialLink icon={<GithubIcon className="w-5 h-5" />} label="GITHUB" href="https://github.com/Society-of-Cyber-Security" />
                <SocialLink icon={<InstagramIcon className="w-5 h-5" />} label="INSTAGRAM" href="https://www.instagram.com/socs_ru/" />
                <SocialLink icon={<LinkedinIcon className="w-5 h-5" />} label="LINKEDIN" href="https://www.linkedin.com/company/society-of-cyber-security/posts/?feedView=all" />
              </div>
            </div>

            {/* System Status readout */}
            <div className="p-6 bg-primary/5 border border-primary/10 rounded-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono text-primary tracking-widest uppercase">SYSTEM_STATUS</span>
                    <span className="flex items-center gap-1.5 text-[8px] font-mono text-primary/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        ACTIVE
                    </span>
                </div>
                <div className="space-y-2 font-mono text-[9px] text-gray-500 uppercase leading-relaxed">
                    <p>&gt; Uptime: 99.99%</p>
                    <p>&gt; Encrytion: AES-256-GCM</p>
                    <p>&gt; Server: Node_771 // Region: Asia</p>
                    <p>&gt; Ready for incoming packets...</p>
                </div>
            </div>
          </motion.div>

        </div>
      </div>
    </PageWrapper>
  );
}

function ContactInfoItem({ icon, label, value, link }: { icon: React.ReactNode, label: string, value: string, link: string }) {
  return (
    <a href={link} className="flex items-start gap-4 p-4 border border-white/5 bg-black/20 hover:border-primary/30 hover:bg-primary/5 transition-all group rounded-sm">
      <div className="p-2 border border-white/10 group-hover:border-primary/20 text-gray-400 group-hover:text-primary transition-colors">
        {icon}
      </div>
      <div>
        <div className="text-[9px] font-mono text-gray-600 tracking-widest uppercase mb-1">{label}</div>
        <div className="text-white font-mono text-sm tracking-tight">{value}</div>
      </div>
    </a>
  );
}

function SocialLink({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <a href={href} className="flex flex-col items-center gap-2 p-4 border border-white/5 bg-black/20 hover:border-primary/30 hover:bg-primary/5 transition-all min-w-[100px] group rounded-sm">
      <div className="text-gray-400 group-hover:text-primary transition-colors">
        {icon}
      </div>
      <span className="text-[8px] font-mono text-gray-600 group-hover:text-primary/60 tracking-[0.2em]">{label}</span>
    </a>
  );
}
