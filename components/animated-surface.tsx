"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedSurfaceProps = HTMLMotionProps<"div"> & {
  hover?: boolean;
};

export function AnimatedSurface({ className, hover = false, ...props }: AnimatedSurfaceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      className={cn(
        "rounded-[28px] border border-border/80 bg-surface/86 shadow-[var(--shadow)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
