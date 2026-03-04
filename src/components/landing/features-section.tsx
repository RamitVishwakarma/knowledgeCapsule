"use client";

import { motion } from "motion/react";
import { FileText, BookOpen, Video, Archive, Shield, Zap, Play } from "lucide-react";

const MEDIUM_CARDS = [
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
          <div className="flex size-5 items-center justify-center rounded bg-blue-100">
            <FileText className="size-3 text-blue-500" />
          </div>
          <span className="text-muted-foreground text-[10px]">Auto-generated summary</span>
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
        <div className="bg-linear-to-brrom-gray-100 flex aspect-video items-center justify-center rounded to-gray-50">
          <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-md">
            <Play className="ml-0.5 size-4 text-purple-500" />
          </div>
        </div>
      </div>
    ),
  },
];

const SMALL_CARDS = [
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
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative px-6 py-32">
      <div className="via-primary/20 absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="from-primary bg-linear-to-ro-amber-400 mx-auto mb-8 h-1 rounded-full"
          />
          <h2 className="text-foreground mb-3">Built for long-term knowledge</h2>
          <p className="text-muted-foreground mx-auto max-w-lg">
            Every feature exists to help you capture, organize, and rediscover what you&apos;ve
            learned.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Hero card: Topic Collections */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="group relative md:col-span-2"
          >
            <div className="group-hover(bg-blue-50/50):opacity-100 absolute -inset-0.5 rounded-xl bg-linear-to-br from-blue-500/30 to-indigo-600/30 opacity-0 blur filter transition-opacity duration-500" />
            <div className="border-border bg-card hover:border-primary/20 relative overflow-hidden rounded-2xl border p-8 transition-colors duration-500 md:p-10">
              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-orange-50/40 via-transparent to-amber-50/30" />
              <div className="relative flex flex-col gap-8 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="mb-5 flex items-center gap-3">
                    <motion.div
                      className="relative z-10 flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-md"
                      whileHover={{ rotate: 3 }}
                    >
                      <BookOpen className="size-6 text-white" />
                    </motion.div>
                    <span className="rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 p-2 text-[10px] tracking-wide text-white uppercase shadow-lg">
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
                <div className="border-border/60 bg-background/80 shrink-0 rounded-xl border p-4 shadow-sm md:w-70">
                  <div className="text-muted-foreground/60 mb-3 text-[10px] tracking-wider uppercase">
                    Your topics
                  </div>
                  {["DSA", "System Design", "React Internals"].map((topic, i) => (
                    <div
                      key={topic}
                      className={`mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${i === 0 ? "bg-primary/8 text-foreground border-primary border-l-2" : "text-muted-foreground"}`}
                    >
                      <div
                        className={`size-2 rounded-full ${i === 0 ? "bg-primary" : "bg-muted-foreground/30"}`}
                      />
                      {topic}
                      <span className="text-muted-foreground/50 ml-auto text-[10px]">
                        {[3, 5, 2][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Medium cards */}
          {MEDIUM_CARDS.map((f, i) => (
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
                className={`absolute -inset-0.5 bg-linear-to-br ${f.accent} rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-12`}
              />
              <div className="border-border bg-card hover:border-primary/20 relative h-full overflow-hidden rounded-2xl border p-7 transition-colors duration-500">
                <div className={`absolute inset-0 bg-linear-to-br ${f.bg} pointer-events-none`} />
                <div className="relative">
                  <div className="mb-5 flex items-center gap-3">
                    <motion.div
                      className={`size-12 rounded-xl bg-linear-to-br ${f.accent} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl`}
                      whileHover={{ rotate: 3 }}
                    >
                      <f.icon className="size-5 text-white" />
                    </motion.div>
                    {f.badge && (
                      <span className="rounded-full border border-blue-100/50 bg-blue-50 px-2 py-0.5 text-[10px] tracking-wide text-blue-500 uppercase">
                        {f.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                  {f.preview}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Small cards */}
          <div className="grid gap-6 md:col-span-2 md:grid-cols-3">
            {SMALL_CARDS.map((f, i) => (
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
                  className={`absolute -inset-0.5 rounded-xl bg-linear-to-br from-blue-500/30 to-indigo-600/30 opacity-0 blur filter transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="border-border bg-card hover:border-primary/20 relative h-full overflow-hidden rounded-2xl border p-6 transition-colors duration-500">
                  <div className={`absolute inset-0 bg-linear-to-br ${f.bg} pointer-events-none`} />
                  <div className="relative">
                    <motion.div
                      className={`size-10 rounded-xl bg-linear-to-br ${f.accent} mb-4 flex items-center justify-center shadow-md transition-all duration-300 group-hover:shadow-lg`}
                      whileHover={{ rotate: 3 }}
                    >
                      <f.icon className="size-4 text-white" />
                    </motion.div>
                    <h3 className="text-foreground mb-1.5">{f.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
