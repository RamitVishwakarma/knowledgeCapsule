"use client";

import { motion } from "motion/react";

export function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Large warm orb top-right */}
      <motion.div
        className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(245,146,27,0.18) 0%, rgba(245,146,27,0) 70%)",
        }}
        animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Medium orb left */}
      <motion.div
        className="absolute top-1/3 -left-48 h-[500px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(245,146,27,0.12) 0%, rgba(245,146,27,0) 70%)",
        }}
        animate={{ x: [0, 40, -10, 0], y: [0, 30, -30, 0], scale: [1, 0.9, 1.05, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      {/* Small accent orb */}
      <motion.div
        className="absolute top-[60%] right-[10%] h-[300px] w-[300px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 70%)" }}
        animate={{ x: [0, -25, 15, 0], y: [0, 20, -35, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
