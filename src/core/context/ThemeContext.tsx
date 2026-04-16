"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// ── Types ──────────────────────────────────────────────────────────────────

export interface SiteTheme {
  primary: string;    // e.g. "#C8FF00"
  secondary: string;  // e.g. "#6200EA"
  background: string; // e.g. "#050508"
  font: string;       // CSS var string, e.g. "var(--font-silkscreen)"
}

export const FONT_PRESETS: Record<string, { label: string; cssVar: string }> = {
  wallpoet:   { label: "Wallpoet (default)",  cssVar: "var(--font-wallpoet)" },
  turret:     { label: "Turret Road",          cssVar: "var(--font-turret-road)" },
  silkscreen: { label: "Silkscreen",           cssVar: "var(--font-silkscreen)" },
  grotesk:    { label: "Space Grotesk",        cssVar: "var(--font-space-grotesk)" },
  manrope:    { label: "Manrope",              cssVar: "var(--font-manrope)" },
  inter:      { label: "Inter",                cssVar: "var(--font-inter)" },
};

export const DEFAULT_THEME: SiteTheme = {
  primary:    "#C8FF00",
  secondary:  "#6200EA",
  background: "#050508",
  font:       "var(--font-wallpoet)",
};

// ── Context ────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  theme: SiteTheme;
  setThemePrimary:    (color: string) => string | null;
  setThemeSecondary:  (color: string) => string | null;
  setThemeBackground: (color: string) => string | null;
  setThemeFont:       (fontKey: string) => string | null;
  resetTheme:         () => void;
  FONT_PRESETS: typeof FONT_PRESETS;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ── Utilities ──────────────────────────────────────────────────────────────

const LS_KEY = "socs-theme-v1";
const OVERRIDE_STYLE_ID = "socs-theme-override";

/** Validate any CSS color string using the browser's own parser. */
function isValidColor(raw: string): boolean {
  if (typeof window === "undefined") return true;
  const s = new Option().style;
  s.color = raw;
  return s.color !== "";
}

interface RGB { r: number; g: number; b: number }

/** Resolve any CSS color string → {r,g,b} via a 1×1 canvas. */
function parseCSSColor(color: string): RGB {
  if (typeof document === "undefined") return { r: 200, g: 255, b: 0 };
  try {
    const canvas = Object.assign(document.createElement("canvas"), { width: 1, height: 1 });
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return { r, g, b };
  } catch {
    return { r: 200, g: 255, b: 0 };
  }
}

/** Hex-invert an {r,g,b} triple → CSS hex string. */
function hexInvert({ r, g, b }: RGB): string {
  const h = (n: number) => (255 - n).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** Euclidean distance in RGB space. */
function colorDist(a: RGB, b: RGB): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

/**
 * Apply a complete theme to the DOM.
 *
 * Strategy:
 *  1. Set CSS custom properties on <html> (covers Tailwind utility classes
 *     like text-primary, border-secondary, etc. that use var(--color-*)).
 *  2. Inject a <style> tag that overrides font-family globally with !important.
 *     This is necessary because globals.css has an !important rule on headings
 *     (h1-h6) that blocks inheritance-based overrides.
 *  3. Directly set body background-color as well in case the Tailwind-compiled
 *     bg-background class uses a hardcoded value.
 */
function applyThemeToDom(t: SiteTheme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // 1. CSS custom property overrides
  root.style.setProperty("--color-primary",    t.primary);
  root.style.setProperty("--color-secondary",  t.secondary);
  root.style.setProperty("--color-neutral",    t.background);
  root.style.setProperty("--color-background", t.background);
  root.style.setProperty("--background",       t.background);

  // 2. Direct body background
  document.body.style.setProperty("background-color", t.background);

  // 3. Computed color values for generated CSS
  const pc  = parseCSSColor(t.primary);
  const bgc = parseCSSColor(t.background);

  // Button/nav text contrast: if primary ≈ page background, text becomes
  // the hex-invert of primary so it's always readable
  const dist = colorDist(pc, bgc);
  const btnTextColor = dist < 60 ? hexInvert(pc) : t.primary;

  // Hover color for bordered buttons: if primary ≈ hover-red, use hex-invert
  const hoverRed: RGB = { r: 255, g: 0, b: 64 };
  const btnHoverColor =
    colorDist(pc, hoverRed) < 80 ? hexInvert(pc) : "#FF0040";

  const fontStack = `${t.font}, sans-serif`;

  // 4. Injected style tag — appended last in <head>, so same-specificity
  //    !important rules here beat everything defined in stylesheets.
  let styleEl = document.getElementById(
    OVERRIDE_STYLE_ID
  ) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = OVERRIDE_STYLE_ID;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    /* ── SOCS Dynamic Theme Override ─────────────────────────────── */

    /* CSS variables */
    :root {
      --color-primary:    ${t.primary}  !important;
      --color-secondary:  ${t.secondary} !important;
      --color-background: ${t.background} !important;
      --color-neutral:    ${t.background} !important;
      --background:       ${t.background} !important;
    }

    /* ── Scrollbar ──────────────────────────────────────────────────
       globals.css uses theme('color.primary') which is compiled at
       build-time → override here at runtime instead.               */
    ::-webkit-scrollbar-thumb {
      background: ${t.primary} !important;
      border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: ${t.secondary} !important;
    }
    ::selection {
      background-color: ${t.primary} !important;
      color: ${t.background} !important;
    }
    /* Firefox scrollbar */
    * {
      scrollbar-color: ${t.primary} ${t.background} !important;
    }

    /* ── Active nav link pixel-grid bg ──────────────────────────────
       .active-pixel-bg has hardcoded rgba(200,255,0,...) — replace. */
    .active-pixel-bg {
      background-image:
        linear-gradient(0deg,  rgba(${pc.r},${pc.g},${pc.b},0.2) 1px, transparent 1px),
        linear-gradient(90deg, rgba(${pc.r},${pc.g},${pc.b},0.2) 1px, transparent 1px) !important;
    }

    /* ── NeonButton / bordered-link overrides ───────────────────────
       NeonButton adds Tailwind class .border; we target a.border and
       button.border to override the hardcoded #C8FF00 glow shadows
       and ensure text is always readable against the button bg.     */
    html body a.border,
    html body button.border {
      border-color: ${t.primary} !important;
      color: ${btnTextColor} !important;
    }
    html body a.border:hover,
    html body button.border:hover {
      border-color: ${t.primary} !important;
      color: ${btnTextColor} !important;
      box-shadow: 0 0 15px ${t.primary}, 0 0 15px ${t.primary} inset !important;
      background-color: rgba(${pc.r},${pc.g},${pc.b},0.12) !important;
    }
    /* Glitch slide bg inside button on hover */
    html body a.border .absolute,
    html body button.border .absolute {
      background-color: rgba(${pc.r},${pc.g},${pc.b},0.1) !important;
    }

    /* ── Font — beats globals.css h1-h6 !important ──────────────── */
    html body,
    html body p,
    html body h1,
    html body h2,
    html body h3,
    html body h4,
    html body h5,
    html body h6,
    html body span,
    html body a,
    html body button,
    html body li,
    html body td,
    html body th,
    html body label,
    html body nav,
    html body header,
    html body footer,
    html body section,
    html body article {
      font-family: ${fontStack} !important;
    }

    /* Restore monospace for terminal and code */
    [data-terminal],
    [data-terminal] *,
    pre, code, kbd,
    .font-mono,
    .font-mono * {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                   "Liberation Mono", "Courier New", monospace !important;
    }
  `;
}

function loadThemeFromStorage(): SiteTheme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULT_THEME, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_THEME;
}

// ── Provider ───────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<SiteTheme>(DEFAULT_THEME);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    const saved = loadThemeFromStorage();
    setTheme(saved);
    applyThemeToDom(saved);
  }, []);

  /**
   * Core updater — always uses a functional setState so we read the LATEST
   * state even if multiple commands run before React re-renders.
   * This eliminates the stale-closure bug where e.g. `theme font` would
   * accidentally revert the primary color set by the previous command.
   */
  const updateField = useCallback(
    (patch: Partial<SiteTheme>) => {
      setTheme((prev) => {
        const next = { ...prev, ...patch };
        applyThemeToDom(next);
        try {
          localStorage.setItem(LS_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [] // intentionally empty — we only read `prev` inside the updater
  );

  const setThemePrimary = useCallback(
    (color: string): string | null => {
      if (!isValidColor(color)) return `invalid color: "${color}"`;
      updateField({ primary: color });
      return null;
    },
    [updateField]
  );

  const setThemeSecondary = useCallback(
    (color: string): string | null => {
      if (!isValidColor(color)) return `invalid color: "${color}"`;
      updateField({ secondary: color });
      return null;
    },
    [updateField]
  );

  const setThemeBackground = useCallback(
    (color: string): string | null => {
      if (!isValidColor(color)) return `invalid color: "${color}"`;
      updateField({ background: color });
      return null;
    },
    [updateField]
  );

  const setThemeFont = useCallback(
    (fontKey: string): string | null => {
      const preset = FONT_PRESETS[fontKey.toLowerCase()];
      if (!preset) {
        return `unknown font "${fontKey}". available: ${Object.keys(FONT_PRESETS).join(", ")}`;
      }
      updateField({ font: preset.cssVar });
      return null;
    },
    [updateField]
  );

  const resetTheme = useCallback(() => {
    updateField(DEFAULT_THEME);
  }, [updateField]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setThemePrimary,
        setThemeSecondary,
        setThemeBackground,
        setThemeFont,
        resetTheme,
        FONT_PRESETS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
