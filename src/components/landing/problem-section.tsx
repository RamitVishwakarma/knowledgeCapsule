"use client";

import { motion } from "motion/react";
import {
  FileText,
  BookOpen,
  Brain,
  Check,
  X,
  Search,
  RefreshCw,
  Share2,
  BarChart3,
  Headphones,
  type LucideIcon,
} from "lucide-react";

type DesktopRow = {
  icon: LucideIcon;
  feature: string;
  notes: "yes" | "no" | "text";
  notesText?: string;
  ai: "yes" | "no" | "text";
  aiText?: string;
  capsule: "yes" | "text";
  capsuleText?: string;
};

type MobileRow = {
  icon: LucideIcon;
  feature: string;
  notes: boolean | string;
  ai: boolean | string;
  capsule: boolean | string;
};

export function ProblemSection() {
  return (
    <section id="why" className="relative px-6 py-32">
      {/* Decorative gradient divider */}
      <div className="via-primary/20 absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="from-primary mx-auto mb-8 h-1 rounded-full bg-gradient-to-r to-amber-400"
          />
          <h2 className="text-foreground mb-3">Knowledge Capsule preserves context</h2>
          <p className="text-[clamp(1.05rem,2vw,1.3rem)] leading-relaxed">
            unlike <span className="text-primary">Written Notes</span> or{" "}
            <span className="text-primary">Generic AI Tools</span>
          </p>
        </motion.div>

        {/* ── Comparison Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
        >
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="border-border/80 overflow-hidden rounded-2xl border bg-white shadow-sm">
              {/* Header row */}
              <div className="border-border/60 grid grid-cols-[1fr_160px_160px_180px] border-b">
                <div className="p-5" />
                <div className="p-5 text-center">
                  <span className="text-muted-foreground text-[14px]">Written Notes</span>
                </div>
                <div className="p-5 text-center">
                  <span className="text-muted-foreground text-[14px]">Generic AI</span>
                </div>
                <div className="relative p-5 text-center">
                  <div className="from-primary/8 to-primary/3 border-primary/30 absolute inset-0 rounded-t-xl border-x-2 border-t-2 bg-gradient-to-b" />
                  <div className="relative flex items-center justify-center gap-2">
                    <div className="from-primary flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br to-amber-500">
                      <BookOpen className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-primary text-[14px]">Knowledge Capsule</span>
                  </div>
                </div>
              </div>

              {/* Table rows */}
              {(
                [
                  {
                    icon: Headphones,
                    feature: "Your voice, your context",
                    notes: "no",
                    ai: "no",
                    capsule: "yes",
                  },
                  {
                    icon: Search,
                    feature: "Searchable knowledge base",
                    notes: "text",
                    notesText: "IF ORGANIZED",
                    ai: "no",
                    capsule: "yes",
                  },
                  {
                    icon: RefreshCw,
                    feature: "Survives 5+ years",
                    notes: "no",
                    ai: "text",
                    aiText: "Not personal",
                    capsule: "yes",
                  },
                  {
                    icon: FileText,
                    feature: "Auto-generated summaries",
                    notes: "no",
                    ai: "text",
                    aiText: "GENERIC",
                    capsule: "yes",
                  },
                  {
                    icon: Brain,
                    feature: "Captures mental models",
                    notes: "text",
                    notesText: "PARTIAL",
                    ai: "no",
                    capsule: "yes",
                  },
                  {
                    icon: BookOpen,
                    feature: "Topic-based organization",
                    notes: "no",
                    ai: "no",
                    capsule: "yes",
                  },
                  {
                    icon: Share2,
                    feature: "Zero friction to create",
                    notes: "no",
                    ai: "yes",
                    capsule: "yes",
                  },
                  {
                    icon: BarChart3,
                    feature: "Effort to preserve knowledge",
                    notes: "text",
                    notesText: "Hours of writing",
                    ai: "text",
                    aiText: "Lacks your context",
                    capsule: "text",
                    capsuleText: "5-min recording",
                  },
                ] satisfies DesktopRow[]
              ).map((row, i) => {
                const CellIcon = row.icon;
                const renderCell = (value: string, text?: string) => {
                  if (value === "yes")
                    return (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                        <Check className="h-4 w-4 text-emerald-500" />
                      </div>
                    );
                  if (value === "no")
                    return (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-red-200 bg-red-50">
                        <X className="h-4 w-4 text-red-400" />
                      </div>
                    );
                  return (
                    <span className="text-muted-foreground/70 text-[12px] tracking-wide uppercase">
                      {text}
                    </span>
                  );
                };
                return (
                  <motion.div
                    key={row.feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className={`grid grid-cols-[1fr_160px_160px_180px] ${i % 2 === 0 ? "bg-white" : "bg-muted/20"} ${i < 7 ? "border-border/40 border-b" : ""}`}
                  >
                    <div className="flex items-center gap-3 p-5">
                      <div className="bg-muted/60 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                        <CellIcon className="text-muted-foreground h-4 w-4" />
                      </div>
                      <span className="text-foreground text-[14px]">{row.feature}</span>
                    </div>
                    <div className="flex items-center justify-center p-5">
                      {renderCell(row.notes, row.notesText)}
                    </div>
                    <div className="flex items-center justify-center p-5">
                      {renderCell(row.ai, row.aiText)}
                    </div>
                    <div className="relative flex items-center justify-center p-5">
                      <div
                        className={`from-primary/5 to-primary/[0.02] border-primary/30 absolute inset-0 border-x-2 bg-gradient-to-b ${i === 7 ? "rounded-b-xl border-b-2" : ""}`}
                      />
                      <div className="relative">
                        {row.capsule === "yes" ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 shadow-sm">
                            <Check className="h-4 w-4 text-emerald-500" />
                          </div>
                        ) : (
                          <span className="text-primary text-[12px] tracking-wide">
                            {row.capsuleText}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile: Stacked cards */}
          <div className="space-y-3 md:hidden">
            {(
              [
                {
                  icon: Headphones,
                  feature: "Your voice, your context",
                  notes: false,
                  ai: false,
                  capsule: true,
                },
                {
                  icon: Search,
                  feature: "Searchable knowledge base",
                  notes: "If organized",
                  ai: false,
                  capsule: true,
                },
                {
                  icon: RefreshCw,
                  feature: "Survives 5+ years",
                  notes: false,
                  ai: false,
                  capsule: true,
                },
                {
                  icon: FileText,
                  feature: "Auto-generated summaries",
                  notes: false,
                  ai: "Generic",
                  capsule: true,
                },
                {
                  icon: Brain,
                  feature: "Captures mental models",
                  notes: "Partial",
                  ai: false,
                  capsule: true,
                },
                {
                  icon: BookOpen,
                  feature: "Topic-based organization",
                  notes: false,
                  ai: false,
                  capsule: true,
                },
                {
                  icon: Share2,
                  feature: "Zero friction to create",
                  notes: false,
                  ai: true,
                  capsule: true,
                },
                {
                  icon: BarChart3,
                  feature: "Effort",
                  notes: "Hours of writing",
                  ai: "Lacks context",
                  capsule: "5-min recording",
                },
              ] satisfies MobileRow[]
            ).map((row, i) => {
              const MobileIcon = row.icon;
              const renderMobileCell = (value: boolean | string) => {
                if (value === true) return <Check className="mx-auto h-4 w-4 text-emerald-500" />;
                if (value === false) return <X className="mx-auto h-4 w-4 text-red-400" />;
                return (
                  <span className="text-muted-foreground/70 text-[11px]">{String(value)}</span>
                );
              };
              return (
                <motion.div
                  key={row.feature}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="border-border/60 rounded-xl border bg-white p-4"
                >
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="bg-muted/60 flex h-7 w-7 items-center justify-center rounded-lg">
                      <MobileIcon className="text-muted-foreground h-3.5 w-3.5" />
                    </div>
                    <span className="text-foreground text-[14px]">{row.feature}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted/30 rounded-lg px-1 py-2">
                      <div className="text-muted-foreground/60 mb-1 text-[10px]">Notes</div>
                      {renderMobileCell(row.notes)}
                    </div>
                    <div className="bg-muted/30 rounded-lg px-1 py-2">
                      <div className="text-muted-foreground/60 mb-1 text-[10px]">AI</div>
                      {renderMobileCell(row.ai)}
                    </div>
                    <div className="bg-primary/5 border-primary/20 rounded-lg border px-1 py-2">
                      <div className="text-primary/70 mb-1 text-[10px]">Capsule</div>
                      {row.capsule === true ? (
                        <Check className="mx-auto h-4 w-4 text-emerald-500" />
                      ) : (
                        <span className="text-primary text-[11px]">{String(row.capsule)}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
