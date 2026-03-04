"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { CirclePlay, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingOrbs } from "@/components/landing/floating-orbs";
import { Particles } from "@/components/landing/particles";
import { HeroDashboardPreview } from "@/components/landing/hero-dashboard-preview";

interface HeroSectionProps {
  onSignIn: () => void;
}

export function HeroSection({ onSignIn }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen flex-col justify-center px-6 pt-32 pb-8"
    >
      <FloatingOrbs />
      <Particles />

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="border-primary/20 bg-primary/5 text-primary mb-10 inline-flex items-center gap-2 rounded-full border px-5 py-2 backdrop-blur-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Mic className="size-3.5" />
              </motion.div>
              <span className="text-sm">Record it. Save it. Revisit it years later.</span>
            </motion.div>

            {/* Headlines */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-foreground mb-1 text-[clamp(2.8rem,7vw,5.2rem)] leading-[1.05] tracking-tight"
            >
              Your future self will
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="relative mb-6 inline-block text-[clamp(2.8rem,7vw,5.2rem)] leading-[1.05] tracking-tight"
              style={{
                background: "linear-gradient(135deg, #f5921b 0%, #d97706 50%, #f59e0b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              thank you for this.
            </motion.h1>

            {/* Punchy emotional hook */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="text-foreground/70 tracking-wide-custom mb-5 text-[clamp(1.05rem,2vw,1.3rem)]"
            >
              Your memory fades. Your explanations{" "}
              <span className="relative inline-block">
                shouldn&rsquo;t.
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                  className="from-primary/60 absolute right-0 bottom-0 left-0 h-0.5 origin-left rounded-full bg-linear-to-r to-amber-400/60"
                />
              </span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="text-muted-foreground mx-auto mb-12 max-w-lg text-base leading-relaxed"
            >
              Record yourself explaining what you&rsquo;ve learned, save the link, and come back
              whenever you need it — even five years from now.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={onSignIn}
                  className="group from-primary shadow-primary/30 relative inline-flex h-auto items-center gap-3 overflow-hidden rounded-full bg-linear-to-r to-amber-500 px-9 py-4 text-white shadow-xl"
                >
                  {/* Shine sweep */}
                  <motion.div
                    className="absolute inset-0 -skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                  />
                  <CirclePlay className="relative z-10 size-5" />
                  <span className="relative z-10">Start your capsule</span>
                </Button>
              </motion.div>
              <p className="text-muted-foreground text-sm">Free demo &bull; No sign-up required</p>
            </motion.div>
          </motion.div>

          {/* Dashboard Preview */}
          <HeroDashboardPreview />
        </div>
      </motion.div>
    </section>
  );
}
