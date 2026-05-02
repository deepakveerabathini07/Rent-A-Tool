import { motion } from "framer-motion";
import { Link } from "wouter";
import { Wrench, LogIn, UserPlus, ArrowRight, Shield, Zap, Star } from "lucide-react";

// Floating tool icons for background decoration
const floatingItems = [
  { icon: "🔧", x: "8%",  y: "20%", delay: 0 },
  { icon: "🔨", x: "88%", y: "15%", delay: 0.4 },
  { icon: "⚙️",  x: "5%",  y: "70%", delay: 0.8 },
  { icon: "🪛",  x: "92%", y: "65%", delay: 0.2 },
  { icon: "🔩",  x: "15%", y: "88%", delay: 1.0 },
  { icon: "🪚",  x: "82%", y: "85%", delay: 0.6 },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden relative">

      {/* Dotted grid background */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-orange-500/8 blur-[160px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      {/* Floating emoji tools */}
      {floatingItems.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl select-none pointer-events-none"
          style={{ left: item.x, top: item.y }}
          animate={{ y: [0, -14, 0], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* Brand badge */}
      <motion.div
        className="flex items-center gap-2 mb-10 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <Wrench className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-black text-xl tracking-tight">ToolHub</span>
        <span className="text-[10px] font-bold text-orange-400 border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">India</span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="text-4xl md:text-6xl font-black text-white text-center leading-tight mb-3 z-10 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        Rent Any Tool.{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
          Anywhere.
        </span>
      </motion.h1>
      <motion.p
        className="text-white/40 text-base md:text-lg text-center mb-12 z-10 max-w-md px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        India's #1 peer-to-peer tool rental marketplace
      </motion.p>

      {/* ── MONITOR MOCKUP ── */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 80 }}
      >
        {/* Big dark circle behind monitor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[520px] h-[520px] rounded-full bg-[#111] border border-white/5 -z-10" />

        {/* Monitor outer shell */}
        <div
          className="relative mx-auto"
          style={{
            width: "min(680px, 90vw)",
            filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.8)) drop-shadow(0 0 40px rgba(251,146,60,0.12))",
          }}
        >
          {/* Screen bezel */}
          <div className="rounded-2xl border-[3px] border-white/10 bg-[#1a1a1a] overflow-hidden shadow-2xl">

            {/* Browser chrome bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#141414] border-b border-white/8">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-[#0d0d0d] border border-white/8 rounded-md px-3 py-1 text-[10px] text-white/30 font-mono">
                  toolhub.in
                </div>
              </div>
              <div className="flex gap-1">
                <div className="w-4 h-0.5 bg-white/20 rounded" />
                <div className="w-4 h-0.5 bg-white/20 rounded" />
                <div className="w-4 h-0.5 bg-white/20 rounded" />
              </div>
            </div>

            {/* Screen content */}
            <div className="bg-[#0d0d0d] p-6 md:p-8" style={{ minHeight: 320 }}>

              {/* Mini navbar inside screen */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <Wrench className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-white font-bold text-sm">ToolHub</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-white/80 text-xs font-semibold hover:bg-white/10 hover:border-white/25 transition-all"
                    >
                      <LogIn className="w-3 h-3" /> Log In
                    </motion.button>
                  </Link>
                  <Link href="/signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-amber-600 transition-all"
                    >
                      <UserPlus className="w-3 h-3" /> Sign Up
                    </motion.button>
                  </Link>
                </div>
              </div>

              {/* Hero text inside screen */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-orange-500/25 bg-orange-500/10 text-orange-400 text-[9px] font-bold uppercase tracking-widest mb-3">
                    <Zap className="w-2.5 h-2.5" /> India's #1 Tool Rental
                  </div>
                  <h2 className="text-white font-black text-xl md:text-2xl leading-tight mb-2">
                    Rent Any Tool.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                      Anywhere.
                    </span>
                  </h2>
                  <p className="text-white/35 text-[11px] leading-relaxed mb-4 max-w-[200px]">
                    Skip the hardware store. Rent from verified owners near you.
                  </p>
                  <Link href="/home">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all"
                    >
                      Browse Tools <ArrowRight className="w-3 h-3" />
                    </motion.button>
                  </Link>
                </div>

                {/* Single floating tool circle */}
                <div className="shrink-0 relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center">
                  {/* Outer glow ring */}
                  <motion.div
                    className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full bg-orange-500/10 border border-orange-500/20"
                    animate={{ scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Inner glow ring */}
                  <motion.div
                    className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-orange-500/8 border border-orange-500/15"
                    animate={{ scale: [1.05, 1, 1.05], opacity: [0.8, 0.4, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  />
                  {/* Main circle with floating */}
                  <motion.div
                    className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-orange-500/30 to-amber-500/20 border-2 border-orange-500/40 flex items-center justify-center shadow-2xl shadow-orange-500/20 backdrop-blur-sm"
                    animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="text-4xl md:text-5xl select-none">🔧</span>
                  </motion.div>
                </div>
              </div>

              {/* Stats bar inside screen */}
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
                {[
                  { icon: <Shield className="w-3 h-3 text-green-400" />, label: "Insured" },
                  { icon: <Star className="w-3 h-3 text-amber-400 fill-current" />, label: "4.8 Rating" },
                  { icon: <Zap className="w-3 h-3 text-orange-400" />, label: "Same-Day" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-1 text-[9px] text-white/30 font-medium">
                    {s.icon} {s.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monitor neck */}
          <div className="mx-auto w-16 h-8 bg-gradient-to-b from-[#1a1a1a] to-[#222] rounded-b-sm" />
          {/* Monitor base */}
          <div className="mx-auto w-32 h-3 bg-[#222] rounded-full shadow-lg" />
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        className="flex items-center gap-6 mt-12 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Link href="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-7 py-3 rounded-full border border-white/15 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-all"
          >
            <LogIn className="w-4 h-4" /> Log In
          </motion.button>
        </Link>
        <Link href="/signup">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-2xl shadow-orange-500/30 hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Get Started Free
          </motion.button>
        </Link>
      </motion.div>

      <motion.p
        className="text-white/20 text-xs mt-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        Already exploring?{" "}
        <Link href="/home" className="text-orange-400/70 hover:text-orange-400 transition-colors underline underline-offset-2">
          Browse tools without signing in
        </Link>
      </motion.p>
    </div>
  );
}
