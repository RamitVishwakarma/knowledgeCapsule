"use client";

import { signIn } from "next-auth/react";
import {
  Play,
  Shield,
  FileText,
  BookOpen,
  Zap,
  ArrowRight,
  Video,
  Archive,
  Clock,
  Brain,
  Mic,
  CirclePlay,
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/* ─── Floating Orbs (hero background) ─── */
function FloatingOrbs() {
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

/* ─── Animated particles ─── */
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 8,
    duration: Math.random() * 6 + 8,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="bg-primary/20 absolute rounded-full"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ opacity: [0, 0.6, 0], y: [0, -60, -120], scale: [0.5, 1, 0.5] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="bg-background min-h-screen overflow-x-hidden">
      {/* Nav */}
      <nav className="bg-background/60 border-border/50 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Knowledge Capsule" className="h-7 w-auto" />
            <span className="text-foreground">Knowledge Capsule</span>
          </div>
          <div className="text-muted-foreground hidden items-center gap-8 md:flex">
            <a href="#why" className="hover:text-foreground transition-colors">
              Why
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
          </div>
          <button
            onClick={handleSignIn}
            className="bg-primary text-primary-foreground hover:shadow-primary/30 rounded-full px-5 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
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
                  <Mic className="h-3.5 w-3.5" />
                </motion.div>
                <span className="text-[14px]">Record it. Save it. Revisit it years later.</span>
              </motion.div>

              {/* Headlines — more dominant */}
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
                className="text-foreground/70 mb-5 text-[clamp(1.05rem,2vw,1.3rem)] tracking-wide"
                style={{ letterSpacing: "0.02em" }}
              >
                Your memory fades. Your explanations{" "}
                <span className="relative inline-block">
                  shouldn&rsquo;t.
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    className="from-primary/60 absolute right-0 bottom-0 left-0 h-[2px] origin-left rounded-full bg-gradient-to-r to-amber-400/60"
                  />
                </span>
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65 }}
                className="text-muted-foreground mx-auto mb-12 max-w-lg text-[16px] leading-relaxed"
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
                <motion.button
                  onClick={handleSignIn}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group from-primary shadow-primary/30 relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r to-amber-500 px-9 py-4 text-white shadow-xl"
                >
                  {/* Shine sweep */}
                  <motion.div
                    className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                  />
                  <CirclePlay className="relative z-10 h-5 w-5" />
                  <span className="relative z-10">Start your capsule</span>
                </motion.button>
                <p className="text-muted-foreground text-[13px]">
                  Free demo &bull; No sign-up required
                </p>
              </motion.div>
            </motion.div>

            {/* ── Dashboard Preview ── */}
            <motion.div
              initial={{ opacity: 0, y: 80, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, rotateX: 2 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto mt-14 max-w-5xl"
              style={{ perspective: "1200px" }}
            >
              {/* Gradient bridge connecting headline to preview */}
              <div
                className="pointer-events-none absolute -top-14 left-1/2 h-14 w-[1px] -translate-x-1/2"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(245,146,27,0.25), transparent)",
                }}
              />
              <div className="group relative" style={{ transform: "rotateX(2deg) rotateY(-1deg)" }}>
                {/* Subtle ambient glow behind card — reduced */}
                <div
                  className="pointer-events-none absolute -inset-8 rounded-3xl opacity-40 transition-opacity duration-700 group-hover:opacity-60"
                  style={{
                    background:
                      "radial-gradient(ellipse 70% 40% at 50% 100%, rgba(245,146,27,0.08) 0%, transparent 70%)",
                  }}
                />
                {/* Border highlight — toned down */}
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-black/[0.04] via-transparent to-transparent opacity-60" />

                <div
                  className="border-border/80 bg-card relative overflow-hidden rounded-2xl border shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_12px_24px_-8px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.06)]"
                  style={{
                    boxShadow:
                      "0 25px 50px -12px rgba(0,0,0,0.25), 0 12px 24px -8px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Title bar */}
                  <div className="border-border from-muted/80 to-muted/40 flex items-center gap-2 border-b bg-gradient-to-r px-4 py-3">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f57]"></div>
                    <div className="h-3 w-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="h-3 w-3 rounded-full bg-[#28c840]"></div>
                    <span className="text-muted-foreground ml-3 text-[13px]">
                      Knowledge Capsule — Your Knowledge Timeline
                    </span>
                  </div>
                  <div className="flex h-[340px] md:h-[420px]">
                    {/* Sidebar preview */}
                    <div className="hidden w-56 flex-col bg-[#1f1f1f] p-4 md:flex">
                      <div className="mb-4 text-[11px] tracking-wider text-[#666] uppercase">
                        Topics
                      </div>
                      {["DSA", "System Design", "React Internals"].map((t, i) => (
                        <motion.div
                          key={t}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + i * 0.15 }}
                          className={`mb-1 rounded-lg px-3 py-2 text-[13px] ${i === 0 ? "border-primary border-l-2 bg-[#2a2a2a] text-white" : "text-[#aaa]"}`}
                        >
                          {t}
                        </motion.div>
                      ))}
                      <div className="mt-6 border-t border-white/[0.08] pt-4">
                        <div className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#555]">
                          <Archive className="h-3.5 w-3.5" />
                          Archive
                          <span className="ml-auto rounded-full bg-[#333] px-1.5 py-0.5 text-[10px] text-[#888]">
                            1
                          </span>
                        </div>
                      </div>
                      <div className="mt-auto border-t border-white/[0.08] pt-4">
                        <div className="text-[13px] text-[#555]">Settings</div>
                      </div>
                    </div>
                    {/* Main content preview */}
                    <div className="flex-1 overflow-hidden bg-[#fafafa] p-6">
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <h3 className="text-foreground">DSA</h3>
                          <p className="text-muted-foreground text-[12px]">3 recordings</p>
                        </div>
                        <div className="from-primary rounded-full bg-gradient-to-r to-amber-500 px-3 py-1.5 text-[13px] text-white shadow-sm">
                          + Add recording
                        </div>
                      </div>
                      <div className="space-y-3">
                        {[
                          {
                            title: "Me explaining Binary Search Trees",
                            date: "Mar 2022",
                            status: "ready",
                            desc: "Recorded after finishing the BST chapter",
                          },
                          {
                            title: "Dynamic Programming — my mental model",
                            date: "Apr 2022",
                            status: "none",
                            desc: "How I think about DP after 50+ problems",
                          },
                          {
                            title: "Graph traversal — BFS vs DFS",
                            date: "Apr 2022",
                            status: "processing",
                            desc: "Whiteboard session tracing both algorithms",
                          },
                        ].map((d, i) => (
                          <motion.div
                            key={d.title}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4 + i * 0.2 }}
                            className="flex items-center gap-4 rounded-xl border border-black/[0.05] bg-white p-4 transition-shadow hover:shadow-md"
                          >
                            <div className="from-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br to-amber-100">
                              <Play className="text-primary h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-foreground truncate text-[14px]">{d.title}</div>
                              <div className="text-muted-foreground truncate text-[12px]">
                                {d.desc}
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <div
                                className={`rounded-full px-2 py-0.5 text-[11px] ${
                                  d.status === "ready"
                                    ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                                    : d.status === "processing"
                                      ? "bg-amber-50 text-amber-600 ring-1 ring-amber-200"
                                      : "bg-gray-50 text-gray-400 ring-1 ring-gray-200"
                                }`}
                              >
                                {d.status === "ready"
                                  ? "Summary ready"
                                  : d.status === "processing"
                                    ? "Processing..."
                                    : "No summary"}
                              </div>
                              <div className="text-muted-foreground/50 mt-1 text-[10px]">
                                {d.date}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ══════════ THE PROBLEM ══════════ */}
      <section id="why" className="relative px-6 py-32">
        {/* Decorative gradient divider */}
        <div className="via-primary/20 absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />

        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20 text-center"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="from-primary mx-auto mb-8 h-1 rounded-full bg-gradient-to-r to-amber-400"
            />
            <h2 className="text-foreground mb-4">The problem we all have</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl leading-relaxed">
              You spend weeks learning something — really understanding it. You make notes, maybe
              some docs. But 4-5 years later? Those notes are scattered, the docs are lost, and you
              can barely remember the insights that took you days to reach.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-3xl items-start gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30, rotateY: 5 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-red-300/30 to-red-100/0 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative rounded-2xl border-2 border-dashed border-red-200/70 bg-gradient-to-br from-red-50/80 via-red-50/40 to-white/80 p-7 backdrop-blur-sm">
                {/* Subtle chaotic background pattern */}
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
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-red-200/60 bg-red-100"
                  >
                    <span className="text-destructive text-[18px]">✕</span>
                  </motion.div>
                  <h3 className="text-foreground mb-4">What usually happens</h3>
                  <ul className="text-muted-foreground space-y-3 text-[14px]">
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
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-200/50 bg-red-100">
                          <span className="text-[10px] text-red-400">✕</span>
                        </div>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30, rotateY: -5 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="group relative md:-translate-y-2"
            >
              {/* Elevated glow */}
              <div className="from-primary/15 to-primary/5 absolute -inset-1 rounded-2xl bg-gradient-to-br via-amber-300/10 opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="border-primary/20 relative rounded-2xl border-2 bg-gradient-to-br from-white via-orange-50/30 to-amber-50/40 p-7 shadow-[0_12px_40px_-8px_rgba(27,107,64,0.1),0_4px_16px_-4px_rgba(245,146,27,0.08)] backdrop-blur-sm">
                {/* Accent top border */}
                <div className="via-primary/40 absolute top-0 right-6 left-6 h-[2px] rounded-full bg-gradient-to-r from-transparent to-transparent" />
                <div className="bg-primary/10 border-primary/20 mb-4 flex h-10 w-10 items-center justify-center rounded-xl border">
                  <span className="text-primary text-[18px]">✓</span>
                </div>
                <h3 className="text-foreground mb-4">With Knowledge Capsule</h3>
                <ul className="text-muted-foreground space-y-3 text-[14px]">
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
                      <div className="bg-primary/10 border-primary/20 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border">
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

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section
        id="how-it-works"
        className="from-card via-card to-background relative overflow-hidden bg-gradient-to-b px-6 py-32"
      >
        <div className="via-primary/20 absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />

        {/* Decorative large number watermark */}
        <div
          className="text-primary/[0.03] pointer-events-none absolute top-16 right-8 text-[200px] select-none"
          style={{ lineHeight: 1 }}
        >
          ?
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-20 text-center">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="from-primary mx-auto mb-8 h-1 rounded-full bg-gradient-to-r to-amber-400"
            />
            <h2 className="text-foreground mb-3">Simple enough to actually use</h2>
            <p className="text-muted-foreground mx-auto max-w-lg">
              No complex setup. No learning curve. Just capture your knowledge before it fades.
            </p>
          </div>

          <div className="relative grid gap-0 md:grid-cols-4">
            {/* Connecting line (desktop) */}
            <div className="absolute top-[44px] right-[12.5%] left-[12.5%] hidden h-[2px] md:block">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="from-primary/40 via-primary/20 to-primary/40 h-full origin-left bg-gradient-to-r"
              />
            </div>

            {[
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
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                className="relative px-4 text-center"
              >
                {/* Step circle with ring */}
                <div className="relative mx-auto mb-6 h-[88px] w-[88px]">
                  <motion.div
                    whileInView={{ rotate: 360 }}
                    viewport={{ once: true }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(from ${i * 90}deg, rgba(245,146,27,0.2), transparent, rgba(245,146,27,0.1), transparent)`,
                    }}
                  />
                  <div className="bg-card absolute inset-[3px] rounded-full" />
                  <div className="from-primary shadow-primary/20 absolute inset-[6px] flex items-center justify-center rounded-full bg-gradient-to-br to-amber-500 shadow-lg">
                    <s.icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="text-primary/60 mb-2 text-[12px] tracking-widest uppercase">
                  {s.step}
                </div>
                <h3 className="text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" className="relative px-6 py-32">
        <div className="via-primary/20 absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />

        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="from-primary mx-auto mb-8 h-1 rounded-full bg-gradient-to-r to-amber-400"
            />
            <h2 className="text-foreground mb-3">Built for long-term knowledge</h2>
            <p className="text-muted-foreground mx-auto max-w-lg">
              Every feature exists to help you capture, organize, and rediscover what you've
              learned.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* ── HERO CARD: Topic Collections (large, spans full width) ── */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative md:col-span-2"
            >
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-15" />
              <div className="border-border bg-card hover:border-primary/20 relative overflow-hidden rounded-2xl border p-8 transition-colors duration-500 md:p-10">
                {/* Subtle warm gradient background */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-50/40 via-transparent to-amber-50/30" />
                <div className="relative flex flex-col gap-8 md:flex-row md:items-center">
                  <div className="flex-1">
                    <div className="mb-5 flex items-center gap-3">
                      <motion.div
                        className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg transition-all duration-300 group-hover:shadow-xl"
                        whileHover={{ rotate: 3 }}
                      >
                        <BookOpen className="h-6 w-6 text-white" />
                      </motion.div>
                      <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-[11px] tracking-wide uppercase">
                        Core feature
                      </span>
                    </div>
                    <h3 className="text-foreground mb-3 text-[clamp(1.15rem,2vw,1.35rem)]">
                      Topic Collections
                    </h3>
                    <p className="text-muted-foreground max-w-lg text-[15px] leading-relaxed">
                      Group recordings by subject — DSA, System Design, ML, anything. Your knowledge
                      stays organized by what you were learning, not when you learned it.
                    </p>
                  </div>
                  {/* Mini UI preview */}
                  <div className="border-border/60 bg-background/80 shrink-0 rounded-xl border p-4 shadow-sm md:w-[280px]">
                    <div className="text-muted-foreground/60 mb-3 text-[11px] tracking-wider uppercase">
                      Your topics
                    </div>
                    {["DSA", "System Design", "React Internals"].map((topic, i) => (
                      <div
                        key={topic}
                        className={`mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] ${i === 0 ? "bg-primary/8 text-foreground border-primary border-l-2" : "text-muted-foreground"}`}
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${i === 0 ? "bg-primary" : "bg-muted-foreground/30"}`}
                        />
                        {topic}
                        <span className="text-muted-foreground/50 ml-auto text-[11px]">
                          {[3, 5, 2][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── MEDIUM CARDS (2 side by side) ── */}
            {[
              {
                icon: FileText,
                title: "AI Summaries",
                desc: "Auto-generate searchable summaries from your recordings' transcripts. When you need a quick refresher, read before you re-watch.",
                accent: "from-blue-400 to-indigo-500",
                bg: "from-blue-50/30 via-transparent to-indigo-50/20",
                badge: "Smart",
                preview: (
                  <div className="border-border/50 bg-background/60 mt-5 rounded-lg border p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-100">
                        <FileText className="h-3 w-3 text-blue-500" />
                      </div>
                      <span className="text-muted-foreground text-[11px]">
                        Auto-generated summary
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="bg-muted-foreground/10 h-2 w-full rounded-full" />
                      <div className="bg-muted-foreground/10 h-2 w-4/5 rounded-full" />
                      <div className="bg-muted-foreground/10 h-2 w-3/5 rounded-full" />
                    </div>
                  </div>
                ),
              },
              {
                icon: Video,
                title: "Embedded Playback",
                desc: "Watch your past self explain concepts directly in the app. No context switching, no searching YouTube.",
                accent: "from-purple-400 to-violet-500",
                bg: "from-purple-50/30 via-transparent to-violet-50/20",
                badge: null,
                preview: (
                  <div className="border-border/50 bg-background/60 mt-5 rounded-lg border p-3">
                    <div className="flex aspect-video items-center justify-center rounded bg-gradient-to-br from-gray-100 to-gray-50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">
                        <Play className="ml-0.5 h-4 w-4 text-purple-500" />
                      </div>
                    </div>
                  </div>
                ),
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.08 + i * 0.08, duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-br ${f.accent} rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-12`}
                />
                <div className="border-border bg-card hover:border-primary/20 relative h-full overflow-hidden rounded-2xl border p-7 transition-colors duration-500">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${f.bg} pointer-events-none`}
                  />
                  <div className="relative">
                    <div className="mb-5 flex items-center gap-3">
                      <motion.div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${f.accent} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl`}
                        whileHover={{ rotate: 3 }}
                      >
                        <f.icon className="h-5 w-5 text-white" />
                      </motion.div>
                      {f.badge && (
                        <span className="rounded-full border border-blue-100/50 bg-blue-50 px-2 py-0.5 text-[10px] tracking-wide text-blue-500 uppercase">
                          {f.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-foreground mb-2">{f.title}</h3>
                    <p className="text-muted-foreground text-[14px] leading-relaxed">{f.desc}</p>
                    {f.preview}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* ── SMALL CARDS (3 in a row) ── */}
            <div className="grid gap-6 md:col-span-2 md:grid-cols-3">
              {[
                {
                  icon: Archive,
                  title: "Archive System",
                  desc: "Archive topics you've moved past. Restore anytime, or permanently delete only from archive.",
                  accent: "from-emerald-400 to-teal-500",
                  bg: "from-emerald-50/20 via-transparent to-teal-50/15",
                },
                {
                  icon: Shield,
                  title: "Private by Default",
                  desc: "Single-user capsule. No sharing, no public profiles. Your videos and notes stay private.",
                  accent: "from-rose-400 to-pink-500",
                  bg: "from-rose-50/20 via-transparent to-pink-50/15",
                },
                {
                  icon: Zap,
                  title: "Inline Editing",
                  desc: "Edit titles, notes, and summaries right where you see them. Add timestamps and annotations.",
                  accent: "from-amber-400 to-yellow-500",
                  bg: "from-amber-50/20 via-transparent to-yellow-50/15",
                },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: 0.16 + i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  className="group relative"
                >
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-br ${f.accent} rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-10`}
                  />
                  <div className="border-border bg-card hover:border-primary/20 relative h-full overflow-hidden rounded-2xl border p-6 transition-colors duration-500">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${f.bg} pointer-events-none`}
                    />
                    <div className="relative">
                      <motion.div
                        className={`h-10 w-10 rounded-xl bg-gradient-to-br ${f.accent} mb-4 flex items-center justify-center shadow-md transition-all duration-300 group-hover:shadow-lg`}
                        whileHover={{ rotate: 3 }}
                      >
                        <f.icon className="h-4 w-4 text-white" />
                      </motion.div>
                      <h3 className="text-foreground mb-1.5">{f.title}</h3>
                      <p className="text-muted-foreground text-[13px] leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ QUOTE ══════════ */}
      <section className="relative overflow-hidden px-6 py-32">
        <div className="via-primary/20 absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />

        {/* Large decorative quote mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 0.04, scale: 1 }}
          viewport={{ once: true }}
          className="text-primary pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 text-[300px] select-none"
          style={{ lineHeight: 1 }}
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
            <div className="from-primary mx-auto mb-10 h-1 w-16 rounded-full bg-gradient-to-r to-amber-400" />

            <div className="text-foreground mb-8 text-[clamp(1.5rem,3vw,2.2rem)] leading-snug italic">
              "The best explanation of any concept is the one you give right after you finally
              understand it."
            </div>
            <p className="text-muted-foreground mx-auto max-w-lg text-[15px] leading-relaxed">
              That moment of clarity is fleeting. Knowledge Capsule helps you capture it in your own
              voice, so you can come back to it whenever you need — whether that's next month or
              five years from now.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="relative overflow-hidden px-6 py-32">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1f1f1f] via-[#2a1f0f] to-[#1f1f1f]" />
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
            <img src="/logo.svg" alt="Knowledge Capsule" className="h-12 w-auto mx-auto mb-8" />
            <h2 className="mb-4 text-white">Start building your knowledge timeline</h2>
            <p className="mx-auto mb-10 max-w-md text-white/60">
              Every recording is a gift to your future self. The best time to start was yesterday.
              The next best time is now.
            </p>
            <motion.button
              onClick={handleSignIn}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group from-primary shadow-primary/30 relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r to-amber-500 px-9 py-4 text-white shadow-xl"
            >
              <motion.div
                className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
              />
              <span className="relative z-10">Start your capsule</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="border-border bg-card border-t px-6 py-10">
        <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col items-center gap-4 text-[13px]">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Knowledge Capsule" className="h-5 w-auto" />
            Knowledge Capsule
          </div>
          <p>Your personal knowledge time capsule.</p>
        </div>
      </footer>
    </div>
  );
}
