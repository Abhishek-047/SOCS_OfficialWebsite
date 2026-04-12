import React from "react";
import Link from "next/link";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/shared/components/ui/Icons";
import { MessageSquare } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/20 bg-background/80 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-4 mb-6 group">
              <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden border border-primary/20 bg-black/40 p-1 group-hover:border-primary transition-colors duration-300"
                style={{ clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}>
                <img src="/assets/logo.png" alt="SOCS Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-jetbrains text-2xl font-black text-white tracking-[0.1em] group-hover:text-primary transition-colors duration-200">
                  SOCS
                </span>
                <span className="text-[8px] text-primary/40 tracking-[0.5em] font-mono">ENCRYPTED_SOCIETY</span>
              </div>
            </Link>
            <p className="text-gray-400 font-jetbrains text-sm max-w-md mb-8 leading-relaxed">
              Society of Cyber Security. Uniting the elite, pushing boundaries, and securing the network. Join us and upgrade your payload.
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://github.com/Society-of-Cyber-Security" target="_blank" rel="noopener noreferrer" className="p-2.5 border border-gray-800 bg-white/5 rounded hover:border-primary hover:text-primary text-gray-400 transition-all">
                <GithubIcon className="w-5 h-5" />
              </a>
              <a href="https://discord.gg/2DbssC8t" target="_blank" rel="noopener noreferrer" className="p-2.5 border border-gray-800 bg-white/5 rounded hover:border-primary hover:text-primary text-gray-400 transition-all">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/socs_ru/" target="_blank" rel="noopener noreferrer" className="p-2.5 border border-gray-800 bg-white/5 rounded hover:border-primary hover:text-primary text-gray-400 transition-all" title="Instagram">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/society-of-cyber-security/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="p-2.5 border border-gray-800 bg-white/5 rounded hover:border-primary hover:text-primary text-gray-400 transition-all">
                <LinkedinIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-jetbrains text-white font-bold mb-4 flex items-center">
              <span className="text-primary mr-2">/</span> Navigate
            </h3>
            <ul className="space-y-2 font-jetbrains text-sm">
              <li><Link href="/team" className="text-gray-400 hover:text-primary transition-colors">Team</Link></li>
              <li><Link href="/projects" className="text-gray-400 hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-primary transition-colors">Events</Link></li>
              <li><Link href="/resources" className="text-gray-400 hover:text-primary transition-colors">Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-jetbrains text-white font-bold mb-4 flex items-center">
              <span className="text-primary mr-2">/</span> System
            </h3>
            <p className="text-primary/60 font-jetbrains text-xs mb-2">
              &gt; STATUS: ONLINE <span className="inline-block w-2 h-2 rounded-full bg-primary ml-1 shadow-[0_0_5px_#C8FF00]"></span>
            </p>
            <p className="text-primary/60 font-jetbrains text-xs mb-2">
              &gt; VERSION: 2.0.4
            </p>
            <p className="text-gray-500 font-jetbrains text-xs mt-8">
              &gt; connection terminated.
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center font-jetbrains text-xs text-gray-500">
          <p>© {currentYear} Society of Cyber Security. All rights reserved.</p>
          <div className="mt-2 md:mt-0 flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-1 font-mono uppercase tracking-widest text-[10px]">
            <span>FRONTEND BY <Link href="/team/abhishek" className="text-primary hover:text-white transition-colors">ABHISHEK</Link></span>
            <span className="text-gray-800 hidden md:inline">|</span>
            <span>BACKEND BY <Link href="/team/abhishek" className="text-primary hover:text-white transition-colors">ABHISHEK</Link></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
