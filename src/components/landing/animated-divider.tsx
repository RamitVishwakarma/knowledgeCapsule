"use client";

import { motion } from "motion/react";

export function AnimatedDivider() {
  return (
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: 48 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="from-primary mx-auto mb-8 h-1 rounded-full bg-linear-to-r to-amber-400"
    />
  );
}
