"use client";

import { motion } from "motion/react";

export function ShineSweep({ repeatDelay = 4 }: { repeatDelay?: number }) {
  return (
    <motion.div
      className="absolute inset-0 -skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent"
      animate={{ x: ["-200%", "200%"] }}
      transition={{ duration: 3, repeat: Infinity, repeatDelay }}
    />
  );
}
