import { type ReactNode } from "react";
import data from "~/data.json";
import { motion } from "framer-motion";

const formatter = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
});

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16 flex items-center gap-4"
    >
      <h2 className="text-base uppercase tracking-wider text-white/40">
        {children}
      </h2>
      <div className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
    </motion.div>
  );
}

export default function Index() {
  return (
    <div
      className="relative min-h-screen bg-zinc-950 selection:bg-accent/30"
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Enhanced background gradients */}
      <div className="pointer-events-none fixed inset-0">
        {/* Main gradient */}
        <div className="absolute inset-0 bg-gradient-radial-hero" />

        {/* Secondary subtle gradients */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                circle at 20% 50%, 
                rgba(120, 119, 198, 0.05) 0%, 
                transparent 50%
              ),
              radial-gradient(
                circle at 80% 80%, 
                bg-accent/5 0%, 
                transparent 50%
              )
            `,
          }}
        />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: 'url("/noise.png")' }}
        />

        {/* Optional: Subtle vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                circle at center, 
                transparent 0%, 
                rgba(0, 0, 0, 0.1) 100%
              )
            `,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-6 pb-32">
        {/* Header */}
        <header className="relative min-h-screen">
          <nav className="absolute left-0 right-0 top-0">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mx-auto max-w-3xl flex items-center justify-end py-8"
            >
              <div className="flex items-center gap-8">
                <a
                  href="#work"
                  className="group text-sm tracking-wider text-white/60"
                >
                  Work
                  <div className="h-px w-0 transition-all group-hover:w-full bg-accent" />
                </a>
                <a
                  href="#contact"
                  className="group text-sm tracking-wider text-white/60"
                >
                  Contact
                  <div className="h-px w-0 transition-all group-hover:w-full bg-accent" />
                </a>
              </div>
            </motion.div>
          </nav>

          <div className="flex min-h-screen items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto max-w-3xl"
            >
              <h1 className="mb-8">
                <span className="block text-6xl sm:text-7xl font-light tracking-tight bg-gradient-to-r from-accent via-accent/80 to-purple-500 bg-clip-text text-transparent">
                  Massimo Palmieri
                </span>
              </h1>

              <div className="max-w-xl">
                <p className="text-lg font-light leading-relaxed text-white/60">
                  Lead Web Developer crafting high-performance applications with
                  modern JavaScript. Passionate about clean architecture and
                  exceptional user experiences.
                </p>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-3xl">
          {/* Skills section */}
          <section className="py-16">
            <SectionTitle>Expertise</SectionTitle>

            <div className="relative overflow-hidden -mx-6 sm:-mx-12 md:-mx-24 lg:mx-[calc(-50vw+50%)]">
              <motion.div
                className="flex py-4"
                animate={{
                  x: ["0%", "-50%"],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                  },
                }}
              >
                {/* Double the items to create seamless loop */}
                {[...data.skills, ...data.skills].map((skill, i) => (
                  <div key={i} className="group relative shrink-0 px-6">
                    <div className="relative">
                      <span className="font-mono text-xs text-accent/40">
                        {String((i % data.skills.length) + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-2 text-5xl font-light tracking-tight text-white/40 transition-colors duration-300 group-hover:text-white whitespace-nowrap">
                        {skill}
                      </h3>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Experience section - showing just the changes */}
          <section>
            <SectionTitle>Experience</SectionTitle>

            <div className="relative space-y-24">
              {/* Timeline line - keep it at exactly 180px */}
              <div className="absolute bottom-0 left-[180px] top-0 w-px bg-accent/20" />

              {data.history.map((job, i) => (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={job.employer}
                  className="group relative grid gap-8 md:grid-cols-[180px_1fr]"
                >
                  {/* Timeline dot - aligned to the center of the line */}
                  <div className="absolute left-[177px] top-2.5 h-1.5 w-1.5 rounded-full bg-accent" />

                  <div className="relative space-y-1">
                    <div className="font-mono text-xs text-accent/60">
                      {formatter.format(new Date(job.start))} —{" "}
                      {job.end
                        ? formatter.format(new Date(job.end))
                        : "Present"}
                    </div>
                    <div className="text-sm font-light text-white/60">
                      {job.title}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-6 text-lg font-light text-white  transition-colors">
                      {job.employer}
                    </h3>
                    <ul className="space-y-3 text-white/60">
                      {job.achievements.map((achievement) => (
                        <li
                          key={achievement}
                          className="relative flex gap-3 text-sm font-light"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          {/* Education section - similar updates to Experience section */}
          {/* ... */}
        </main>
      </div>
    </div>
  );
}
