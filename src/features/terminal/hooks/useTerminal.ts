"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/core/context/ThemeContext";
import { useAudio } from "@/core/context/AudioContext";
import { HistoryEntry, TerminalState } from "../types";
import { COMMANDS, ROUTES } from "../commands/registry";

const MOTD = [
  "SOCS Terminal v2.0.0 — Society of Cyber Security",
  'Type "help" for available commands.',
  "",
];

const TERMINAL_TOP_OFFSET = 116;

export function useTerminal() {
  const router = useRouter();
  const pathname = usePathname();
  const themeContext = useTheme();
  const { playType } = useAudio();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(
    MOTD.map((t) => ({ type: "system", text: t }))
  );
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdHistoryIdx, setCmdHistoryIdx] = useState(-1);
  const [pos, setPos] = useState({ x: 20, y: TERMINAL_TOP_OFFSET });
  const [size, setSize] = useState({ w: 560, h: 360 });

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (!isOpen) return;

    setPos((prev) => ({
      ...prev,
      y: Math.max(prev.y, TERMINAL_TOP_OFFSET),
    }));
  }, [isOpen]);

  // Listen for navbar event
  useEffect(() => {
    const handle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-terminal", handle);
    return () => window.removeEventListener("toggle-terminal", handle);
  }, []);

  // Ctrl+` toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "`" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const currentDir = useCallback(() => {
    const entry = Object.entries(ROUTES).find(([, v]) => v === pathname);
    return entry ? entry[0] : pathname.replace("/", "") || "home";
  }, [pathname]);

  const processCommand = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      const userCommandEntry: HistoryEntry = {
        type: "input",
        text: `socs@${currentDir()} ~$ ${trimmed}`,
      };

      setHistory((prev) => [...prev, userCommandEntry]);

      const parts = trimmed.split(/\s+/);
      const cmdName = parts[0].toLowerCase();
      const args = parts.slice(1);

      const command = COMMANDS[cmdName];
      if (command) {
        const results = await command.execute(args, {
          router,
          pathname,
          themeContext,
          audio: { playType },
          setIsOpen,
          setHistory,
        });
        if (results.length > 0) {
          setHistory((prev) => [...prev, ...results]);
        }
      } else {
        setHistory((prev) => [
          ...prev,
          { type: "error", text: `command not found: ${cmdName}` },
          { type: "system", text: 'type "help" for available commands.' },
        ]);
      }
    },
    [currentDir, pathname, router, themeContext, playType]
  );

  return {
    state: { isOpen, isMinimized, history, input, cmdHistory, cmdHistoryIdx, pos, size },
    actions: { setIsOpen, setIsMinimized, setHistory, setInput, setCmdHistory, setCmdHistoryIdx, setPos, setSize, processCommand, playType },
    refs: { inputRef, scrollRef },
    currentDir: currentDir(),
  };
}
