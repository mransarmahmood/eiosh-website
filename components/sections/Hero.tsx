"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Award, Globe2, ArrowRight, Play, HardHat, Flame, HeartPulse, UtensilsCrossed, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { PatternTile, InitialsAvatar } from "@/components/ui/CourseArt";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      {/* Soft grid + gradient halo */}
      <div className="absolute inset-0 bg-grid-subtle [background-size:32px_32px] opacity-[0.35]" aria-hidden />
      <div className="absolute -top-40 right-[-10%] h-[480px] w-[480px] rounded-full bg-cyan-500/20 blur-3xl" aria-hidden />
      <div className="absolute -bottom-32 left-[-10%] h-[420px] w-[420px] rounded-full bg-navy-700/40 blur-3xl" aria-hidden />

      <Container className="relative z-10 py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <motion.div {...fade} transition={{ duration: 0.5 }}>
              <Badge tone="cyan" className="bg-cyan-500/15 text-cyan-200 ring-cyan-400/30">
                <ShieldCheck className="h-3.5 w-3.5" /> Approved centre · IOSH · OSHAcademy · OSHAwards · HABC · OTHM
              </Badge>
            </motion.div>

            <motion.h1
              {...fade}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 text-display-md sm:text-display-lg lg:text-display-xl font-heading font-semibold tracking-tight text-white text-balance"
            >
              International qualifications,{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-white bg-clip-text text-transparent">
                trusted globally.
              </span>
            </motion.h1>

            <motion.p
              {...fade}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 max-w-2xl text-lg text-white/75 leading-relaxed text-pretty"
            >
              EIOSH is an approved international training centre delivering Ofqual-regulated and awarding-body-certified
              qualifications across health and safety, food safety, environment, leadership and emergency response —
              for professionals and enterprise teams in over 60 countries.
            </motion.p>

            <motion.div
              {...fade}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button href="/courses" variant="gold" size="lg">
                Explore qualifications <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                href="/corporate-training"
                variant="outline"
                size="lg"
                className="bg-white/5 text-white ring-white/20 hover:bg-white/10 hover:ring-white/40"
              >
                <Play className="h-4 w-4" /> Train a team
              </Button>
            </motion.div>

            <motion.ul
              {...fade}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl"
            >
              {[
                { icon: Award, t: "Ofqual regulated", d: "Level 2–8 regulated qualifications" },
                { icon: Globe2, t: "Globally portable", d: "Certificates recognised in 60+ countries" },
                { icon: ShieldCheck, t: "Verifiable", d: "QR-coded certificates, employer-validated" },
              ].map(({ icon: Icon, t, d }) => (
                <li key={t} className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                    <Icon className="h-5 w-5 text-cyan-300" />
                  </span>
                  <div>
                    <p className="font-heading font-medium text-white">{t}</p>
                    <p className="text-sm text-white/60">{d}</p>
                  </div>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right visual: animated tile mosaic + floating proof cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative lg:col-span-5"
          >
            <motion.div
              aria-hidden
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto grid w-full max-w-md grid-cols-2 gap-3"
            >
              <PatternTile label="Health & Safety" sub="IOSH · NEBOSH" tone="navy" icon={HardHat} className="col-span-1" />
              <PatternTile label="Food Safety" sub="HABC · HACCP" tone="gold" icon={UtensilsCrossed} className="col-span-1 translate-y-4" />
              <PatternTile label="Fire Safety" sub="Warden · Marshal" tone="cyan" icon={Flame} className="col-span-1 -translate-y-2" />
              <PatternTile label="Leadership" sub="OTHM L3–7" tone="emerald" icon={Briefcase} className="col-span-1 translate-y-2" />
              <PatternTile label="First Aid" sub="CPR & AED" tone="navy" icon={HeartPulse} className="col-span-2" />
            </motion.div>

            {/* Floating verified certificate card */}
            <motion.div
              initial={{ opacity: 0, y: 18, rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: 2 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute -bottom-10 -right-4 hidden w-64 rounded-2xl bg-white p-5 text-ink shadow-floating ring-1 ring-border sm:block"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <p className="text-sm font-heading font-semibold text-navy-900">Verified certificate</p>
              </div>
              <p className="mt-2 text-xs text-ink-muted">
                Every certificate carries a unique QR code and verifiable reference.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["Saqib Saeed", "Babar Siddique", "Hina Raza"].map((n) => (
                    <InitialsAvatar key={n} name={n} size="sm" accent="navy" className="ring-white" />
                  ))}
                </div>
                <p className="text-xs text-ink-soft">1,500+ enrolled</p>
              </div>
            </motion.div>

            {/* Floating rating card */}
            <motion.div
              initial={{ opacity: 0, y: -18, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute -top-8 -left-6 hidden w-56 rounded-2xl bg-gold-50 p-5 text-navy-900 shadow-floating ring-1 ring-gold-200 sm:block"
            >
              <p className="text-xs uppercase tracking-wider text-gold-700">Satisfaction rate</p>
              <p className="mt-2 text-3xl font-heading font-semibold">100%</p>
              <p className="mt-1 text-xs text-ink-muted">Across 2,400+ verified reviews</p>
            </motion.div>

            {/* Floating cohort ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="absolute left-1/2 -top-3 hidden w-48 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-center ring-1 ring-inset ring-white/20 backdrop-blur lg:inline-flex lg:items-center lg:gap-2"
            >
              <span className="flex h-2.5 w-2.5 items-center">
                <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 opacity-75" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-white">Cohorts open this week</p>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
