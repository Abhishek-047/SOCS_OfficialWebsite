"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { NeonButton } from "@/shared/components/ui/NeonButton";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  links: { name: string; href: string }[];
  pathname: string;
}

export function MobileMenu({ isOpen, setIsOpen, links, pathname }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="fixed inset-y-0 right-0 w-full max-w-sm bg-background/95 backdrop-blur-xl border-l border-primary/30 z-[2000000] flex flex-col pt-24 px-6 lg:hidden"
        >
          <div className="flex-1 flex flex-col space-y-6">
            <div className="text-primary font-jetbrains text-sm mb-4 border-b border-primary/20 pb-2">
              &gt; SELECT MENU_ITEM:
            </div>
            
            {links.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block font-turret text-2xl font-black py-4 uppercase border-b border-primary/5 ${
                      isActive ? "text-primary bg-primary/5 px-4" : "text-gray-500 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              );
            })}
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: links.length * 0.1 }}
              className="pt-8"
            >
               <NeonButton 
                 href="/login" 
                 className="w-full justify-start"
                 onClick={() => setIsOpen(false)}
               >
                 &gt; EXECUTE LOGIN_ACCESS
               </NeonButton>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
