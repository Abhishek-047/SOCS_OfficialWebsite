"use client";

import React from "react";
import { useTerminal } from "../hooks/useTerminal";
import { useWindowControls } from "../hooks/useWindowControls";
import { TerminalHeader } from "./TerminalHeader";
import { TerminalOutput } from "./TerminalOutput";
import { TerminalInput } from "./TerminalInput";

export function Terminal() {
  const { state, actions, refs, currentDir } = useTerminal();
  const { onDragStart, onResizeStart } = useWindowControls(
    state.pos,
    actions.setPos,
    state.size,
    actions.setSize
  );

  if (!state.isOpen) return null;

  return (
    <div
      data-terminal
      className="fixed"
      style={{
        left: state.pos.x,
        top: state.pos.y,
        width: state.isMinimized ? 260 : state.size.w,
        height: state.isMinimized ? "auto" : state.size.h,
        zIndex: 3000001,
      }}
    >
      <TerminalHeader
        currentDir={currentDir}
        onDragStart={onDragStart}
        onClose={() => actions.setIsOpen(false)}
        onMinimize={() => actions.setIsMinimized((p) => !p)}
      />

      {!state.isMinimized && (
        <div
          className="relative bg-[#07070c]/95 backdrop-blur-lg border border-primary/20 flex flex-col overflow-hidden"
          style={{ height: `calc(100% - 32px)` }}
          onClick={() => refs.inputRef.current?.focus()}
        >
          {/* Scanline effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(200,255,0,0.08) 2px, rgba(200,255,0,0.08) 4px)",
            }}
          />

          {/* Scrollable output */}
          <div
            ref={refs.scrollRef}
            data-lenis-prevent
            className="flex-1 overflow-y-auto overflow-x-hidden p-3 pb-10 font-mono text-[13px] leading-relaxed relative z-[1] select-text"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#C8FF00 transparent" }}
          >
            <TerminalOutput history={state.history} />
            <TerminalInput
              input={state.input}
              setInput={actions.setInput}
              currentDir={currentDir}
              onCommand={actions.processCommand}
              cmdHistory={state.cmdHistory}
              setCmdHistory={actions.setCmdHistory}
              cmdHistoryIdx={state.cmdHistoryIdx}
              setCmdHistoryIdx={actions.setCmdHistoryIdx}
              inputRef={refs.inputRef}
              playType={actions.playType}
            />
          </div>

          {/* Resize handle */}
          <div
            onMouseDown={onResizeStart}
            className="absolute bottom-1 right-1 w-6 h-6 cursor-nwse-resize opacity-40 hover:opacity-100 transition-all duration-200 z-[10]"
            style={{
              background: `linear-gradient(135deg, transparent 65%, var(--color-primary) 65%)`,
            }}
          >
            <div className="absolute bottom-1 right-1 w-3 h-[2px] bg-primary/40 rotate-[-45deg] origin-right" />
            <div className="absolute bottom-[6px] right-[6px] w-1.5 h-[1.5px] bg-primary/40 rotate-[-45deg] origin-right" />
          </div>
        </div>
      )}
    </div>
  );
}
