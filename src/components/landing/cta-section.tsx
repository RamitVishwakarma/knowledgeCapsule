"use client";

import { motion } from "motion/react";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onSignIn: () => void;
}

export function CTASection({ onSignIn }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden px-6 py-32">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-preview-dark via-[#2a1f0f] to-preview-dark" />
      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(245,146,27,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Subtle particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-primary/30 absolute h-1 w-1 rounded-full"
            style={{ left: `${15 + i * 10}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -20, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="from-primary shadow-primary/30 mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br to-amber-500 shadow-2xl">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h2 className="mb-4 text-white">Start building your knowledge timeline</h2>
          <p className="mx-auto mb-10 max-w-md text-white/60">
            Every recording is a gift to your future self. The best time to start was yesterday. The
            next best time is now.
          </p>
          <motion.div
            className="group inline-block"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              onClick={onSignIn}
              className="from-primary shadow-primary/30 relative overflow-hidden rounded-full bg-linear-to-r to-amber-500 px-9 py-4 text-white shadow-xl"
            >
              <motion.div
                className="absolute inset-0 -skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
              />
              <span className="relative z-10">Start your capsule</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
