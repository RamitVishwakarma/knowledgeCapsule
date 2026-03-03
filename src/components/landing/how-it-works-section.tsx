"use client";

import { motion } from "motion/react";
import { Brain, Video, BookOpen, Clock } from "lucide-react";
import { AnimatedDivider } from "@/components/landing/animated-divider";

const STEPS = [
  {
    step: "01",
    icon: Brain,
    title: "Learn something",
    desc: "Finish a course, solve a problem, read a paper — any 'aha' moment worth preserving.",
  },
  {
    step: "02",
    icon: Video,
    title: "Record yourself",
    desc: "Grab your phone or screen recorder. Explain it like you're teaching a friend. 5-15 min is enough.",
  },
  {
    step: "03",
    icon: BookOpen,
    title: "Save the link",
    desc: "Upload to YouTube as unlisted. Paste the link in Knowledge Capsule under the right topic.",
  },
  {
    step: "04",
    icon: Clock,
    title: "Revisit anytime",
    desc: "Years later, search your capsule and hear past-you explain it — with all the context intact.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="from-card via-card to-background relative overflow-hidden bg-linear-to-b px-6 py-32"
    >
      <div className="via-primary/20 absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent to-transparent" />

      {/* Decorative large number watermark */}
      <div className="text-primary/3 leading-xs pointer-events-none absolute top-16 right-8 text-[200px] select-none">
        ?
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-20 text-center">
          <AnimatedDivider />
          <h2 className="text-foreground mb-3">Simple enough to actually use</h2>
          <p className="text-muted-foreground mx-auto max-w-lg">
            No complex setup. No learning curve. Just capture your knowledge before it fades.
          </p>
        </div>

        <div className="relative grid gap-0 md:grid-cols-4">
          {/* Connecting line (desktop) */}
          <div className="absolute top-11 right-[12.5%] left-[12.5%] hidden h-0.5 md:block">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="from-primary/40 via-primary/20 to-primary/40 h-full origin-left bg-linear-to-r"
            />
          </div>

          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              className="relative px-4 text-center"
            >
              {/* Step circle with ring */}
              <div className="relative mx-auto mb-6 h-22 w-22">
                <motion.div
                  whileInView={{ rotate: 360 }}
                  viewport={{ once: true }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from ${i * 90}deg, rgba(245,146,27,0.2), transparent, rgba(245,146,27,0.1), transparent)`,
                  }}
                />
                <div className="bg-card absolute inset-0.75 rounded-full" />
                <div className="from-primary shadow-primary/20 absolute inset-1.5 flex items-center justify-center rounded-full bg-linear-to-br to-amber-500 shadow-lg">
                  <s.icon className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="text-primary/60 mb-2 text-xs tracking-widest uppercase">{s.step}</div>
              <h3 className="text-foreground mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
