"use client";

import { TerminalCommand, CommandContext, HistoryEntry } from "../types";

export const ROUTES: Record<string, string> = {
  home: "/",
  team: "/team",
  projects: "/projects",
  events: "/events",
  resources: "/resources",
  join: "/join",
};

export const COMMANDS: Record<string, TerminalCommand> = {
  help: {
    name: "help",
    description: "list available commands",
    execute: () => [
      {
        type: "system",
        text: [
          "┌─ SOCS Terminal Commands ─────────────────────────────────────────┐",
          "│                                                                  │",
          "│  Navigation                                                      │",
          "│    cd <page>           navigate to a page                        │",
          "│    ls                  list all pages                            │",
          "│    pwd                 print current path                        │",
          "│                                                                  │",
          "│  Theme Customization                                             │",
          "│    theme               show current theme                        │",
          "│    theme primary <c>   set primary accent color                  │",
          "│    theme secondary <c> set secondary color                       │",
          "│    theme bg <c>        set background color                      │",
          "│    theme font <name>   set site font                             │",
          "│    theme fonts         list available fonts                      │",
          "│    theme reset         revert to defaults                        │",
          "│                                                                  │",
          "│  Misc                                                            │",
          "│    whoami              who are you?                              │",
          "│    clear               clear terminal                            │",
          "│    exit / quit         close terminal                            │",
          "│                                                                  │",
          "└──────────────────────────────────────────────────────────────────┘",
        ].join("\n"),
      },
    ],
  },
  ls: {
    name: "ls",
    description: "list all pages",
    execute: (_, { pathname }) => [
      {
        type: "system",
        text: Object.entries(ROUTES)
          .map(
            ([name, route]) =>
              `  ${route === pathname ? "▸ " : "  "}${name.padEnd(12)} ${route}`
          )
          .join("\n"),
      },
    ],
  },
  pwd: {
    name: "pwd",
    description: "print current path",
    execute: (_, { pathname }) => [{ type: "system", text: pathname }],
  },
  whoami: {
    name: "whoami",
    description: "who are you?",
    execute: () => [{ type: "system", text: "guest@socs-network" }],
  },
  clear: {
    name: "clear",
    description: "clear terminal",
    execute: (_, { setHistory }) => {
      setHistory(() => []);
      return [];
    },
  },
  cd: {
    name: "cd",
    description: "navigate to a page",
    execute: (args, { router, pathname }) => {
      const arg = args[0]?.toLowerCase().replace(/^\//, "").replace(/\/$/, "");
      
      if (!arg || arg === "home") {
        if (pathname === "/") return [{ type: "system", text: "already at root" }];
        setTimeout(() => router.push("/"), 150);
        return [{ type: "system", text: "returning to home..." }];
      }

      const route = ROUTES[arg];
      if (route) {
        if (route === pathname) {
          return [{ type: "system", text: `already at /${arg}` }];
        }
        setTimeout(() => router.push(route), 150);
        return [{ type: "system", text: `navigating to /${arg}...` }];
      }
      return [
        { type: "error", text: `cd: no such directory: ${arg}` },
        { type: "system", text: `available: ${Object.keys(ROUTES).join(", ")}` },
      ];
    },
  },
  theme: {
    name: "theme",
    description: "customize site appearance",
    execute: (args, { themeContext }) => {
      const { theme, setThemePrimary, setThemeSecondary, setThemeBackground, setThemeFont, resetTheme, FONT_PRESETS } = themeContext;
      const subCmd = args[0]?.toLowerCase() || "status";
      const subArgs = args.slice(1);
      const out: HistoryEntry[] = [];

      switch (subCmd) {
        case "set-primary":
        case "primary": {
          const color = subArgs.join(" ");
          if (!color) {
            out.push({ type: "error", text: "usage: theme primary <color>" }, { type: "system", text: "example: theme primary #ff0040" });
            break;
          }
          const err = setThemePrimary(color);
          if (err) out.push({ type: "error", text: err });
          else out.push({ type: "system", text: `✓ primary color → ${color}` }, { type: "system", text: "accent color updated across the site." });
          break;
        }
        case "set-secondary":
        case "secondary": {
          const color = subArgs.join(" ");
          if (!color) {
            out.push({ type: "error", text: "usage: theme secondary <color>" });
            break;
          }
          const err = setThemeSecondary(color);
          if (err) out.push({ type: "error", text: err });
          else out.push({ type: "system", text: `✓ secondary color → ${color}` });
          break;
        }
        case "set-bg":
        case "bg":
        case "background": {
          const color = subArgs.join(" ");
          if (!color) {
            out.push({ type: "error", text: "usage: theme bg <color>" });
            break;
          }
          const err = setThemeBackground(color);
          if (err) out.push({ type: "error", text: err });
          else out.push({ type: "system", text: `✓ background color → ${color}` });
          break;
        }
        case "set-font":
        case "font": {
          const fontKey = subArgs[0];
          if (!fontKey) {
            out.push({ type: "error", text: "usage: theme font <name>" }, { type: "system", text: `available: ${Object.keys(FONT_PRESETS).join(", ")}` });
            break;
          }
          const err = setThemeFont(fontKey);
          if (err) out.push({ type: "error", text: err });
          else out.push({ type: "system", text: `✓ font → ${FONT_PRESETS[fontKey.toLowerCase()]?.label ?? fontKey}` });
          break;
        }
        case "list-fonts":
        case "fonts": {
           const lines = [
            "┌─ Available Fonts ───────────────────────────┐",
            ...Object.entries(FONT_PRESETS as Record<string, { label: string; cssVar: string }>).map(
              ([key, { label }]) =>
                `│  ${key.padEnd(12)} ${label.padEnd(26)} │`
            ),
            "└─────────────────────────────────────────────┘"
          ];
          out.push({ type: "system", text: lines.join("\n") });
          break;
        }
        case "status": {
          const entry = Object.entries(FONT_PRESETS as Record<string, { label: string; cssVar: string }>).find(
            ([, v]) => v.cssVar === theme.font
          );
          const fontLabel = entry ? entry[1].label : theme.font;
          out.push({
            type: "system",
            text: [
              "┌─ Current Theme ─────────────────────────────┐",
              `│  primary    ${theme.primary.padEnd(32)} │`,
              `│  secondary  ${theme.secondary.padEnd(32)} │`,
              `│  background ${theme.background.padEnd(32)} │`,
              `│  font       ${fontLabel.slice(0, 32).padEnd(32)} │`,
              "└─────────────────────────────────────────────┘",
            ].join("\n"),
          });
          break;
        }
        case "reset": {
          resetTheme();
          out.push({ type: "system", text: "✓ theme reset to defaults." });
          break;
        }
        default:
          out.push({ type: "error", text: `theme: unknown sub-command: ${subCmd}` });
      }
      return out;
    },
  },
  exit: {
    name: "exit",
    description: "close terminal",
    execute: (_, { setIsOpen }) => {
      setTimeout(() => setIsOpen(false), 200);
      return [{ type: "system", text: "terminal closed." }];
    },
  },
  quit: {
    name: "quit",
    description: "close terminal",
    execute: (_, ctx) => COMMANDS.exit.execute(_, ctx),
  },
  protocol: {
    name: "protocol",
    description: "security protocols",
    execute: (args) => {
      const action = args[0]?.toLowerCase();
      const flag = args[1]?.toLowerCase();
      if (action === "enable" && (flag === "--deepweb" || flag === "deepweb")) {
        window.dispatchEvent(new Event("deepweb-engage"));
        return [
          { type: "system", text: "INITIATING DEEP WEB KERNEL OVERRIDE..." },
          { type: "system", text: "WARNING: DARK NETWORK ENGAGED." },
        ];
      } else if (action === "disable" && (flag === "--deepweb" || flag === "deepweb")) {
        window.dispatchEvent(new Event("deepweb-disengage"));
        return [{ type: "system", text: "TERMINATING DARK NETWORK..." }];
      }
      return [{ type: "error", text: "Unknown protocol signature." }];
    },
  },
  ransomware: {
    name: "ransomware",
    description: "execute payload",
    execute: () => {
      window.dispatchEvent(new Event("ransomware-engage"));
      return [
        { type: "error", text: "EXECUTING RANSOMWARE PAYLOAD..." },
        { type: "error", text: "YOUR FILES ARE NOW ENCRYPTED." },
      ];
    },
  },
  execute: {
    name: "execute",
    description: "run command",
    execute: (args, ctx) => {
      if (args[0]?.toLowerCase() === "ransomware") return COMMANDS.ransomware.execute(args, ctx);
      return [{ type: "error", text: "command execution failed." }];
    },
  },
  sudo: {
    name: "sudo",
    description: "admin privileges",
    execute: (args) => {
      const sub = args.join(" ");
      if (sub === "restore --force") {
        window.dispatchEvent(new Event("ransomware-disengage"));
        return [{ type: "system", text: "SYS_RESTORE: MALWARE TERMINATED." }];
      }
      return [{ type: "error", text: "admin privileges revoked." }];
    },
  },
};
