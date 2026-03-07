"use client";

import { motion } from "motion/react";
import { Play, Archive } from "lucide-react";

export function HeroDashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 2 }}
      transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-14 max-w-5xl"
      style={{ perspective: "1200px" }}
    >
      {/* Gradient bridge connecting headline to preview */}
      <div
        className="pointer-events-none absolute -top-14 left-1/2 h-14 w-px -translate-x-1/2"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(245,146,27,0.25), transparent)",
        }}
      />
      <div className="group relative" style={{ transform: "rotateX(2deg) rotateY(-1deg)" }}>
        {/* Subtle ambient glow */}
        <div
          className="pointer-events-none absolute -inset-8 rounded-3xl opacity-40 transition-opacity duration-700 group-hover:opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 50% 100%, rgba(245,146,27,0.08) 0%, transparent 70%)",
          }}
        />
        {/* Border highlight */}
        <div className="absolute -inset-px rounded-2xl bg-linear-to-b from-black/4 via-transparent to-transparent opacity-60" />

        <div
          className="border-border/80 bg-card relative overflow-hidden rounded-2xl border shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_12px_24px_-8px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.06)]"
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(0,0,0,0.25), 0 12px 24px -8px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 2px rgba(0,0,0,0.04)",
          }}
        >
          {/* Title bar */}
          <div className="border-border from-muted/80 to-muted/40 flex items-center gap-2 border-b bg-linear-to-r px-4 py-3">
            <div className="bg-macos-close size-3 rounded-full"></div>
            <div className="bg-macos-min size-3 rounded-full"></div>
            <div className="bg-macos-max size-3 rounded-full"></div>
            <span className="text-muted-foreground ml-3 text-sm">
              Knowledge Capsule — Your Knowledge Timeline
            </span>
          </div>
          <div className="flex aspect-video">
            {/* Sidebar preview */}
            <div className="bg-preview-dark hidden w-56 flex-col p-4 md:flex">
              <div className="text-preview-muted mb-4 text-[10px] tracking-wider uppercase">
                Topics
              </div>
              {["DSA", "System Design", "React Internals"].map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.15 }}
                  className={`mb-1 rounded-lg px-3 py-2 text-sm ${i === 0 ? "border-primary bg-preview-accent border-l-2 text-white" : "text-preview-foreground"}`}
                >
                  {t}
                </motion.div>
              ))}
              <div className="mt-6 border-t border-white/8 pt-4">
                <div className="text-preview-text flex items-center gap-2 px-3 py-2 text-sm">
                  <Archive className="h-3.5 w-3.5" />
                  Archive
                  <span className="bg-preview-badge text-preview-badge-text ml-auto rounded-full px-1.5 py-0.5 text-[10px]">
                    1
                  </span>
                </div>
              </div>
              <div className="mt-auto border-t border-white/8 pt-4">
                <div className="text-preview-text text-sm">Settings</div>
              </div>
            </div>
            {/* Main content preview */}
            <div className="bg-preview-light flex-1 overflow-hidden p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-foreground">DSA</h3>
                  <p className="text-muted-foreground text-xs">3 recordings</p>
                </div>
                <div className="from-primary rounded-full bg-linear-to-r to-amber-500 px-3 py-1.5 text-sm text-white shadow-sm">
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
                    className="flex items-center gap-4 rounded-xl border border-black/5 bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="from-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br to-amber-100">
                      <Play className="text-primary size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-foreground truncate text-sm">{d.title}</div>
                      <div className="text-muted-foreground truncate text-xs">{d.desc}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div
                        className={`rounded-full px-2 py-0.5 text-[10px] ${
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
                      <div className="text-muted-foreground/50 mt-1 text-[10px]">{d.date}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
