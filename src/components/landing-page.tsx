"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import { Play, Shield, FileText, BookOpen, Zap, ArrowRight, Video, Archive, Clock, Brain, Mic, CirclePlay } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/* ─── Floating Orbs (hero background) ─── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large warm orb top-right */}
      <motion.div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(245,146,27,0.18) 0%, rgba(245,146,27,0) 70%)" }}
        animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Medium orb left */}
      <motion.div
        className="absolute top-1/3 -left-48 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(245,146,27,0.12) 0%, rgba(245,146,27,0) 70%)" }}
        animate={{ x: [0, 40, -10, 0], y: [0, 30, -30, 0], scale: [1, 0.9, 1.05, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      {/* Small accent orb */}
      <motion.div
        className="absolute top-[60%] right-[10%] w-[300px] h-[300px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 70%)" }}
        animate={{ x: [0, -25, 15, 0], y: [0, 20, -35, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
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
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/20"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ opacity: [0, 0.6, 0], y: [0, -60, -120], scale: [0.5, 1, 0.5] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function LandingPage() {
  const { login } = useAppStore();
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleSignIn = () => {
    login();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center shadow-lg shadow-primary/25">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-foreground">Knowledge Capsule</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-muted-foreground">
            <a href="#why" className="hover:text-foreground transition-colors">Why</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          </div>
          <button
            onClick={handleSignIn}
            className="px-5 py-2 bg-primary text-primary-foreground rounded-full hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} className="relative pt-32 pb-8 px-6 min-h-screen flex flex-col justify-center">
        <FloatingOrbs />
        <Particles />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm text-primary mb-10"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Mic className="w-3.5 h-3.5" />
                </motion.div>
                <span className="text-[14px]">Record it. Save it. Revisit it years later.</span>
              </motion.div>

              {/* Headlines — more dominant */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-[clamp(2.8rem,7vw,5.2rem)] tracking-tight text-foreground mb-1 leading-[1.05]"
              >
                Your future self will
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="text-[clamp(2.8rem,7vw,5.2rem)] tracking-tight mb-6 leading-[1.05] relative inline-block"
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
                className="text-foreground/70 text-[clamp(1.05rem,2vw,1.3rem)] mb-5 tracking-wide"
                style={{ letterSpacing: "0.02em" }}
              >
                Your memory fades. Your explanations{" "}
                <span className="relative inline-block">
                  shouldn&rsquo;t.
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/60 to-amber-400/60 origin-left rounded-full"
                  />
                </span>
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65 }}
                className="text-muted-foreground mb-12 max-w-lg mx-auto text-[16px] leading-relaxed"
              >
                Record yourself explaining what you&rsquo;ve learned, save the link, and come back whenever you need it — even five years from now.
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
                  className="group relative px-9 py-4 bg-gradient-to-r from-primary to-amber-500 text-white rounded-full inline-flex items-center gap-3 shadow-xl shadow-primary/30 overflow-hidden"
                >
                  {/* Shine sweep */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                  />
                  <CirclePlay className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Start your capsule</span>
                </motion.button>
                <p className="text-muted-foreground text-[13px]">Free demo &bull; No sign-up required</p>
              </motion.div>
            </motion.div>

            {/* ── Dashboard Preview ── */}
            <motion.div
              initial={{ opacity: 0, y: 80, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, rotateX: 2 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-14 max-w-5xl mx-auto relative"
              style={{ perspective: "1200px" }}
            >
              {/* Gradient bridge connecting headline to preview */}
              <div
                className="absolute -top-14 left-1/2 -translate-x-1/2 w-[1px] h-14 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, transparent, rgba(245,146,27,0.25), transparent)" }}
              />
              <div className="relative group" style={{ transform: "rotateX(2deg) rotateY(-1deg)" }}>
                {/* Subtle ambient glow behind card — reduced */}
                <div
                  className="absolute -inset-8 rounded-3xl pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                  style={{ background: "radial-gradient(ellipse 70% 40% at 50% 100%, rgba(245,146,27,0.08) 0%, transparent 70%)" }}
                />
                {/* Border highlight — toned down */}
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-black/[0.04] via-transparent to-transparent opacity-60" />

                <div className="relative rounded-2xl border border-border/80 bg-card shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_12px_24px_-8px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.06)] overflow-hidden"
                  style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 12px 24px -8px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 2px rgba(0,0,0,0.04)" }}
                >
                  {/* Title bar */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-gradient-to-r from-muted/80 to-muted/40">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                    <span className="ml-3 text-[13px] text-muted-foreground">Knowledge Capsule — Your Knowledge Timeline</span>
                  </div>
                  <div className="flex h-[340px] md:h-[420px]">
                    {/* Sidebar preview */}
                    <div className="w-56 bg-[#1f1f1f] p-4 hidden md:flex flex-col">
                      <div className="text-[#666] text-[11px] mb-4 uppercase tracking-wider">Topics</div>
                      {["DSA", "System Design", "React Internals"].map((t, i) => (
                        <motion.div
                          key={t}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + i * 0.15 }}
                          className={`px-3 py-2 rounded-lg text-[13px] mb-1 ${i === 0 ? "bg-[#2a2a2a] text-white border-l-2 border-primary" : "text-[#aaa]"}`}
                        >
                          {t}
                        </motion.div>
                      ))}
                      <div className="mt-6 pt-4 border-t border-white/[0.08]">
                        <div className="flex items-center gap-2 px-3 py-2 text-[#555] text-[13px]">
                          <Archive className="w-3.5 h-3.5" />
                          Archive
                          <span className="ml-auto bg-[#333] text-[#888] text-[10px] px-1.5 py-0.5 rounded-full">1</span>
                        </div>
                      </div>
                      <div className="mt-auto pt-4 border-t border-white/[0.08]">
                        <div className="text-[#555] text-[13px]">Settings</div>
                      </div>
                    </div>
                    {/* Main content preview */}
                    <div className="flex-1 p-6 overflow-hidden bg-[#fafafa]">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h3 className="text-foreground">DSA</h3>
                          <p className="text-muted-foreground text-[12px]">3 recordings</p>
                        </div>
                        <div className="px-3 py-1.5 bg-gradient-to-r from-primary to-amber-500 text-white rounded-full text-[13px] shadow-sm">+ Add recording</div>
                      </div>
                      <div className="space-y-3">
                        {[
                          { title: "Me explaining Binary Search Trees", date: "Mar 2022", status: "ready", desc: "Recorded after finishing the BST chapter" },
                          { title: "Dynamic Programming — my mental model", date: "Apr 2022", status: "none", desc: "How I think about DP after 50+ problems" },
                          { title: "Graph traversal — BFS vs DFS", date: "Apr 2022", status: "processing", desc: "Whiteboard session tracing both algorithms" },
                        ].map((d, i) => (
                          <motion.div
                            key={d.title}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4 + i * 0.2 }}
                            className="p-4 rounded-xl border border-black/[0.05] bg-white flex items-center gap-4 hover:shadow-md transition-shadow"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-amber-100 flex items-center justify-center shrink-0">
                              <Play className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[14px] text-foreground truncate">{d.title}</div>
                              <div className="text-[12px] text-muted-foreground truncate">{d.desc}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className={`px-2 py-0.5 rounded-full text-[11px] ${
                                d.status === "ready" ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200" :
                                d.status === "processing" ? "bg-amber-50 text-amber-600 ring-1 ring-amber-200" :
                                "bg-gray-50 text-gray-400 ring-1 ring-gray-200"
                              }`}>
                                {d.status === "ready" ? "Summary ready" : d.status === "processing" ? "Processing..." : "No summary"}
                              </div>
                              <div className="text-[10px] text-muted-foreground/50 mt-1">{d.date}</div>
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
      <section id="why" className="relative py-32 px-6">
        {/* Decorative gradient divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-1 bg-gradient-to-r from-primary to-amber-400 rounded-full mx-auto mb-8"
            />
            <h2 className="text-foreground mb-4">The problem we all have</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              You spend weeks learning something — really understanding it. You make notes, maybe some docs. But 4-5 years later? Those notes are scattered, the docs are lost, and you can barely remember the insights that took you days to reach.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto items-start">
            <motion.div
              initial={{ opacity: 0, x: -30, rotateY: 5 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-red-300/30 to-red-100/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
              <div className="relative p-7 rounded-2xl border-2 border-dashed border-red-200/70 bg-gradient-to-br from-red-50/80 via-red-50/40 to-white/80 backdrop-blur-sm">
                {/* Subtle chaotic background pattern */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(239,68,68,0.3) 8px, rgba(239,68,68,0.3) 9px)",
                  }}
                />
                <div className="relative">
                  <motion.div
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 3 }}
                    className="w-10 h-10 rounded-xl bg-red-100 border border-red-200/60 flex items-center justify-center mb-4"
                  >
                    <span className="text-destructive text-[18px]">✕</span>
                  </motion.div>
                  <h3 className="text-foreground mb-4">What usually happens</h3>
                  <ul className="space-y-3 text-muted-foreground text-[14px]">
                    {[
                      "Notes scattered across Notion, Google Docs, random files",
                      "Documentation gets outdated and buried",
                      "You forget the \"aha\" moments and mental models",
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
                        <div className="w-5 h-5 rounded-full bg-red-100 border border-red-200/50 flex items-center justify-center mt-0.5 shrink-0">
                          <span className="text-red-400 text-[10px]">✕</span>
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
              className="relative group md:-translate-y-2"
            >
              {/* Elevated glow */}
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/15 via-amber-300/10 to-primary/5 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              <div className="relative p-7 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-white via-orange-50/30 to-amber-50/40 backdrop-blur-sm shadow-[0_12px_40px_-8px_rgba(27,107,64,0.1),0_4px_16px_-4px_rgba(245,146,27,0.08)]">
                {/* Accent top border */}
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full" />
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <span className="text-primary text-[18px]">✓</span>
                </div>
                <h3 className="text-foreground mb-4">With Knowledge Capsule</h3>
                <ul className="space-y-3 text-muted-foreground text-[14px]">
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
                      <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5 shrink-0">
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
      <section id="how-it-works" className="relative py-32 px-6 bg-gradient-to-b from-card via-card to-background overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* Decorative large number watermark */}
        <div className="absolute top-16 right-8 text-[200px] text-primary/[0.03] pointer-events-none select-none" style={{ lineHeight: 1 }}>
          ?
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-20">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-1 bg-gradient-to-r from-primary to-amber-400 rounded-full mx-auto mb-8"
            />
            <h2 className="text-foreground mb-3">Simple enough to actually use</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">No complex setup. No learning curve. Just capture your knowledge before it fades.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-0 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-[44px] left-[12.5%] right-[12.5%] h-[2px]">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 origin-left"
              />
            </div>

            {[
              { step: "01", icon: Brain, title: "Learn something", desc: "Finish a course, solve a problem, read a paper — any 'aha' moment worth preserving." },
              { step: "02", icon: Video, title: "Record yourself", desc: "Grab your phone or screen recorder. Explain it like you're teaching a friend. 5-15 min is enough." },
              { step: "03", icon: BookOpen, title: "Save the link", desc: "Upload to YouTube as unlisted. Paste the link in Knowledge Capsule under the right topic." },
              { step: "04", icon: Clock, title: "Revisit anytime", desc: "Years later, search your capsule and hear past-you explain it — with all the context intact." },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                className="text-center px-4 relative"
              >
                {/* Step circle with ring */}
                <div className="relative mx-auto mb-6 w-[88px] h-[88px]">
                  <motion.div
                    whileInView={{ rotate: 360 }}
                    viewport={{ once: true }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(from ${i * 90}deg, rgba(245,146,27,0.2), transparent, rgba(245,146,27,0.1), transparent)`,
                    }}
                  />
                  <div className="absolute inset-[3px] rounded-full bg-card" />
                  <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-lg shadow-primary/20">
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="text-[12px] text-primary/60 mb-2 tracking-widest uppercase">{s.step}</div>
                <h3 className="text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" className="relative py-32 px-6">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-1 bg-gradient-to-r from-primary to-amber-400 rounded-full mx-auto mb-8"
            />
            <h2 className="text-foreground mb-3">Built for long-term knowledge</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Every feature exists to help you capture, organize, and rediscover what you've learned.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* ── HERO CARD: Topic Collections (large, spans full width) ── */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative md:col-span-2"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur-xl" />
              <div className="relative p-8 md:p-10 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors duration-500 overflow-hidden">
                {/* Subtle warm gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-transparent to-amber-50/30 pointer-events-none" />
                <div className="relative flex flex-col md:flex-row md:items-center gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-5">
                      <motion.div
                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                        whileHover={{ rotate: 3 }}
                      >
                        <BookOpen className="w-6 h-6 text-white" />
                      </motion.div>
                      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] tracking-wide uppercase">Core feature</span>
                    </div>
                    <h3 className="text-foreground mb-3 text-[clamp(1.15rem,2vw,1.35rem)]">Topic Collections</h3>
                    <p className="text-muted-foreground text-[15px] leading-relaxed max-w-lg">Group recordings by subject — DSA, System Design, ML, anything. Your knowledge stays organized by what you were learning, not when you learned it.</p>
                  </div>
                  {/* Mini UI preview */}
                  <div className="md:w-[280px] shrink-0 rounded-xl border border-border/60 bg-background/80 p-4 shadow-sm">
                    <div className="text-[11px] text-muted-foreground/60 uppercase tracking-wider mb-3">Your topics</div>
                    {["DSA", "System Design", "React Internals"].map((topic, i) => (
                      <div key={topic} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] mb-1 ${i === 0 ? "bg-primary/8 text-foreground border-l-2 border-primary" : "text-muted-foreground"}`}>
                        <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-primary" : "bg-muted-foreground/30"}`} />
                        {topic}
                        <span className="ml-auto text-[11px] text-muted-foreground/50">{[3, 5, 2][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── MEDIUM CARDS (2 side by side) ── */}
            {[
              { icon: FileText, title: "AI Summaries", desc: "Auto-generate searchable summaries from your recordings' transcripts. When you need a quick refresher, read before you re-watch.", accent: "from-blue-400 to-indigo-500", bg: "from-blue-50/30 via-transparent to-indigo-50/20", badge: "Smart", preview: (
                <div className="mt-5 rounded-lg border border-border/50 bg-background/60 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center"><FileText className="w-3 h-3 text-blue-500" /></div>
                    <span className="text-[11px] text-muted-foreground">Auto-generated summary</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 bg-muted-foreground/10 rounded-full w-full" />
                    <div className="h-2 bg-muted-foreground/10 rounded-full w-4/5" />
                    <div className="h-2 bg-muted-foreground/10 rounded-full w-3/5" />
                  </div>
                </div>
              )},
              { icon: Video, title: "Embedded Playback", desc: "Watch your past self explain concepts directly in the app. No context switching, no searching YouTube.", accent: "from-purple-400 to-violet-500", bg: "from-purple-50/30 via-transparent to-violet-50/20", badge: null, preview: (
                <div className="mt-5 rounded-lg border border-border/50 bg-background/60 p-3">
                  <div className="aspect-video rounded bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                      <Play className="w-4 h-4 text-purple-500 ml-0.5" />
                    </div>
                  </div>
                </div>
              )},
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
                <div className={`absolute -inset-0.5 bg-gradient-to-br ${f.accent} rounded-2xl opacity-0 group-hover:opacity-12 transition-opacity duration-500 blur-xl`} />
                <div className="relative p-7 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors duration-500 h-full overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.bg} pointer-events-none`} />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      <motion.div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        whileHover={{ rotate: 3 }}
                      >
                        <f.icon className="w-5 h-5 text-white" />
                      </motion.div>
                      {f.badge && <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 text-[10px] tracking-wide uppercase border border-blue-100/50">{f.badge}</span>}
                    </div>
                    <h3 className="text-foreground mb-2">{f.title}</h3>
                    <p className="text-muted-foreground text-[14px] leading-relaxed">{f.desc}</p>
                    {f.preview}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* ── SMALL CARDS (3 in a row) ── */}
            <div className="md:col-span-2 grid md:grid-cols-3 gap-6">
              {[
                { icon: Archive, title: "Archive System", desc: "Archive topics you've moved past. Restore anytime, or permanently delete only from archive.", accent: "from-emerald-400 to-teal-500", bg: "from-emerald-50/20 via-transparent to-teal-50/15" },
                { icon: Shield, title: "Private by Default", desc: "Single-user capsule. No sharing, no public profiles. Your videos and notes stay private.", accent: "from-rose-400 to-pink-500", bg: "from-rose-50/20 via-transparent to-pink-50/15" },
                { icon: Zap, title: "Inline Editing", desc: "Edit titles, notes, and summaries right where you see them. Add timestamps and annotations.", accent: "from-amber-400 to-yellow-500", bg: "from-amber-50/20 via-transparent to-yellow-50/15" },
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
                  <div className={`absolute -inset-0.5 bg-gradient-to-br ${f.accent} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`} />
                  <div className="relative p-6 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors duration-500 h-full overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${f.bg} pointer-events-none`} />
                    <div className="relative">
                      <motion.div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.accent} flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-all duration-300`}
                        whileHover={{ rotate: 3 }}
                      >
                        <f.icon className="w-4 h-4 text-white" />
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
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* Large decorative quote mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 0.04, scale: 1 }}
          viewport={{ once: true }}
          className="absolute top-12 left-1/2 -translate-x-1/2 text-[300px] text-primary pointer-events-none select-none"
          style={{ lineHeight: 1 }}
        >
          &ldquo;
        </motion.div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Gradient quote bar */}
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-amber-400 rounded-full mx-auto mb-10" />

            <div className="text-[clamp(1.5rem,3vw,2.2rem)] text-foreground leading-snug mb-8 italic">
              "The best explanation of any concept is the one you give right after you finally understand it."
            </div>
            <p className="text-muted-foreground text-[15px] leading-relaxed max-w-lg mx-auto">
              That moment of clarity is fleeting. Knowledge Capsule helps you capture it in your own voice, so you can come back to it whenever you need — whether that's next month or five years from now.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1f1f1f] via-[#2a1f0f] to-[#1f1f1f]" />
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(245,146,27,0.12) 0%, transparent 70%)" }} />
        {/* Subtle particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/30"
              style={{ left: `${15 + i * 10}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -20, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-white mb-4">Start building your knowledge timeline</h2>
            <p className="text-white/60 mb-10 max-w-md mx-auto">Every recording is a gift to your future self. The best time to start was yesterday. The next best time is now.</p>
            <motion.button
              onClick={handleSignIn}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group relative px-9 py-4 bg-gradient-to-r from-primary to-amber-500 text-white rounded-full inline-flex items-center gap-2.5 shadow-xl shadow-primary/30 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
              />
              <span className="relative z-10">Start your capsule</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="py-10 px-6 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 text-muted-foreground text-[13px]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            Knowledge Capsule
          </div>
          <p>Your personal knowledge time capsule.</p>
        </div>
      </footer>
    </div>
  );
}