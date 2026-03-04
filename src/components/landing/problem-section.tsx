"use client";

import { motion } from "motion/react";
import { AnimatedDivider } from "@/components/landing/animated-divider";

export function ProblemSection() {
  return (
    <section id="why" className="relative px-6 py-32">
      {/* Decorative gradient divider */}
      <div className="via-primary/20 absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent to-transparent" />

      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 text-center"
        >
          <AnimatedDivider />
          <h2 className="text-foreground mb-4">The problem we all have</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl leading-relaxed">
            You spend weeks learning something — really understanding it. You make notes, maybe some
            docs. But 4-5 years later? Those notes are scattered, the docs are lost, and you can
            barely remember the insights that took you days to reach.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-3xl items-start gap-8 md:grid-cols-2">
          {/* What usually happens */}
          <motion.div
            initial={{ opacity: 0, x: -30, rotateY: 5 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-br from-red-300/30 to-red-100/0 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative rounded-2xl border-2 border-dashed border-red-200/70 bg-linear-to-br from-red-50/80 via-red-50/40 to-white/80 p-7 backdrop-blur-sm">
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.03]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(239,68,68,0.3) 8px, rgba(239,68,68,0.3) 9px)",
                }}
              />
              <div className="relative">
                <motion.div
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 3 }}
                  className="mb-4 flex size-10 items-center justify-center rounded-xl border border-red-200/60 bg-red-100"
                >
                  <span className="text-destructive text-lg">✕</span>
                </motion.div>
                <h3 className="text-foreground mb-4">What usually happens</h3>
                <ul className="text-muted-foreground space-y-3 text-sm">
                  {[
                    "Notes scattered across Notion, Google Docs, random files",
                    "Documentation gets outdated and buried",
                    'You forget the "aha" moments and mental models',
                    "Years later, you have to relearn from scratch",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-2.5"
                    >
                      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-red-200/50 bg-red-100">
                        <span className="text-[10px] text-red-400">✕</span>
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* With Knowledge Capsule */}
          <motion.div
            initial={{ opacity: 0, x: 30, rotateY: -5 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="group relative md:-translate-y-2"
          >
            <div className="from-primary/15 to-primary/5 absolute -inset-1 rounded-2xl bg-linear-to-br via-amber-300/10 opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="border-primary/20 relative rounded-2xl border-2 bg-linear-to-br from-white via-orange-50/30 to-amber-50/40 p-7 shadow-[0_12px_40px_-8px_rgba(27,107,64,0.1),0_4px_16px_-4px_rgba(245,146,27,0.08)] backdrop-blur-sm">
              <div className="via-primary/40 absolute top-0 right-6 left-6 h-0.5 rounded-full bg-linear-to-r from-transparent to-transparent" />
              <div className="bg-primary/10 border-primary/20 mb-4 flex size-10 items-center justify-center rounded-xl border">
                <span className="text-primary text-lg">✓</span>
              </div>
              <h3 className="text-foreground mb-4">With Knowledge Capsule</h3>
              <ul className="text-muted-foreground space-y-3 text-sm">
                {[
                  "Record a short video of you explaining what you learned",
                  "Upload as unlisted on YouTube, save the link",
                  "Auto-generate searchable summaries from your words",
                  "Come back in 5 years and hear yourself teach it to you",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.45 + i * 0.1 }}
                    className="flex items-start gap-2.5"
                  >
                    <div className="bg-primary/10 border-primary/20 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border">
                      <span className="text-primary text-[10px]">✓</span>
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
