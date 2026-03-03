"use client";

import { motion } from "motion/react";

export function QuoteSection() {
  return (
    <section className="relative overflow-hidden px-6 py-32">
      <div className="via-primary/20 absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent to-transparent" />

      {/* Large decorative quote mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 0.04, scale: 1 }}
        viewport={{ once: true }}
        className="text-primary leading-xs pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 text-[300px] select-none"
      >
        &ldquo;
      </motion.div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Gradient quote bar */}
          <div className="from-primary mx-auto mb-10 h-1 w-16 rounded-full bg-linear-to-r to-amber-400" />

          <div className="text-foreground mb-8 text-[clamp(1.5rem,3vw,2.2rem)] leading-snug italic">
            &ldquo;The best explanation of any concept is the one you give right after you finally
            understand it.&rdquo;
          </div>
          <p className="text-muted-foreground mx-auto max-w-lg text-[15px] leading-relaxed">
            That moment of clarity is fleeting. Knowledge Capsule helps you capture it in your own
            voice, so you can come back to it whenever you need — whether that&apos;s next month or
            five years from now.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
