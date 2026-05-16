"use client";

import { motion } from "framer-motion";

export function RetroWireframeVisual() {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[36px] border border-border bg-surface/70 p-5 shadow-[var(--shadow)] blueprint-grid">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-8 top-8 w-56 rounded-2xl border border-primary/40 bg-surface/88 p-4 shadow-sm"
      >
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted/50" />
        </div>
        <div className="mt-5 h-3 w-32 rounded-full bg-foreground/20" />
        <div className="mt-3 h-3 w-44 rounded-full bg-muted/25" />
        <div className="mt-3 h-3 w-24 rounded-full bg-muted/25" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-7 w-60 rounded-2xl border border-accent/50 bg-surface/90 p-4 shadow-sm"
      >
        <div className="font-mono text-xs text-muted">unannoy://clean-text</div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, index) => (
            <span key={index} className="h-8 rounded-xl border border-border bg-surface-soft/80" />
          ))}
        </div>
      </motion.div>
      <motion.div
        animate={{ x: [0, 7, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-20 top-20 w-36 rotate-3 rounded-2xl border border-border bg-primary p-4 text-primary-foreground shadow-sm"
      >
        <p className="font-mono text-xs">copied</p>
        <p className="mt-2 text-sm font-semibold">One less tiny problem.</p>
      </motion.div>
      <div className="absolute bottom-5 left-5 rounded-full border border-border bg-surface/85 px-4 py-2 font-mono text-xs text-muted">
        no-login.exe
      </div>
    </div>
  );
}
