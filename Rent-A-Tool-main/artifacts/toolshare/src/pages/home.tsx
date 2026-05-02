import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { PageTransition } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";
import { useGetPlatformStats } from "@workspace/api-client-react";
import { MOCK_TOOLS } from "@/lib/mock-data";
import type { Tool } from "@workspace/api-client-react";
import {
  ShieldCheck, MapPin, Clock, ArrowRight, Zap,
  Star, TrendingUp, Users, Package, Sparkles, ChevronRight
} from "lucide-react";
import { formatINR } from "@/lib/currency";

function CountUp({ end }: { end: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <span ref={ref}>
      {isInView
        ? <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>{end.toLocaleString()}</motion.span>
        : "0"}
    </span>
  );
}

const CARD_W = 300;
const CARD_GAP = 20;
const CARD_STEP = CARD_W + CARD_GAP;

function HorizontalSlider({ tools, categoryKey }: { tools: Tool[]; categoryKey: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lastX = useRef<number | null>(null);
  const rawX = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 80, damping: 20, mass: 1 });
  const [hovered, setHovered] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const raf = useRef<number>(0);
  const velocity = useRef(0);

  const maxOffset = -(tools.length - 1) * CARD_STEP;
  const clamp = useCallback((v: number) => Math.min(0, Math.max(maxOffset, v)), [maxOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (lastX.current === null) { lastX.current = e.clientX; return; }
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    velocity.current = -dx * 3.5;
    const next = clamp(rawX.get() + velocity.current);
    rawX.set(next);
    const idx = Math.round(Math.abs(next) / CARD_STEP);
    setActiveIdx(Math.min(idx, tools.length - 1));
  }, [rawX, clamp, tools.length]);

  const handleMouseLeave = useCallback(() => {
    lastX.current = null;
    setHovered(false);
    const coast = () => {
      velocity.current *= 0.92;
      if (Math.abs(velocity.current) < 0.5) return;
      const next = clamp(rawX.get() + velocity.current);
      rawX.set(next);
      const idx = Math.round(Math.abs(next) / CARD_STEP);
      setActiveIdx(Math.min(idx, tools.length - 1));
      raf.current = requestAnimationFrame(coast);
    };
    raf.current = requestAnimationFrame(coast);
  }, [rawX, clamp, tools.length]);

  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => {
      setActiveIdx(prev => {
        const next = (prev + 1) % tools.length;
        rawX.set(-next * CARD_STEP);
        return next;
      });
    }, 2600);
    return () => { clearInterval(id); cancelAnimationFrame(raf.current); };
  }, [hovered, rawX, tools.length]);

  return (
    <div
      ref={trackRef}
      className="relative overflow-hidden cursor-ew-resize"
      style={{ height: 340 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

      <motion.div
        style={{ x: springX, gap: CARD_GAP, paddingLeft: 8, paddingRight: 8 }}
        className="flex items-center absolute top-0 left-0 h-full"
      >
        {tools.map((tool, i) => {
          const isActive = i === activeIdx;
          return (
            <Link key={tool.id} href={`/tools/${tool.id}`}>
              <motion.div
                animate={{ scale: isActive ? 1 : 0.88, opacity: isActive ? 1 : 0.45, y: isActive ? 0 : 16 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="relative rounded-2xl overflow-hidden border border-border bg-card cursor-pointer shrink-0 group"
                style={{ width: CARD_W, height: 300 }}
              >
                <img src={tool.imageUrl} alt={tool.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {isActive && (
                  <motion.div layoutId={`ring-${categoryKey}`} className="absolute inset-0 ring-2 ring-inset ring-orange-500/70 rounded-2xl" />
                )}

                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className={`w-1.5 h-1.5 rounded-full ${tool.available ? "bg-green-400" : "bg-red-400"}`} />
                  <span className="text-[10px] text-foreground/80 font-medium">{tool.available ? "Available" : "Rented"}</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-1 capitalize">
                    {tool.category.replace("-", " ")}
                  </p>
                  <h4 className="text-foreground font-bold text-sm leading-snug line-clamp-2 mb-2">{tool.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-400 font-extrabold text-base">{formatINR(tool.pricePerDay)}<span className="text-foreground/40 text-xs font-normal">/day</span></span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs text-foreground/70">{tool.rating?.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5 text-[10px] text-foreground/40">
                    <MapPin className="w-2.5 h-2.5" />{tool.location}
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>

      <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-white/10 rounded-full z-20">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
          style={{ width: `${((activeIdx + 1) / tools.length) * 100}%`, transition: "width 0.3s ease" }}
        />
      </div>
    </div>
  );
}

const CATEGORIES = [
  { key: "power-tools",  label: "Power Tools" },
  { key: "hand-tools",   label: "Hand Tools" },
  { key: "gardening",    label: "Gardening" },
  { key: "cleaning",     label: "Cleaning" },
  { key: "construction", label: "Construction" },
  { key: "outdoor",      label: "Outdoor" },
  { key: "painting",     label: "Painting" },
];

export default function Home() {
  const { data: stats } = useGetPlatformStats();
  const [activeCategory, setActiveCategory] = useState("power-tools");
  const categoryTools = MOCK_TOOLS.filter(t => t.category === activeCategory);

  return (
    <PageTransition className="min-h-screen bg-background">

      {/* HERO */}
      <section className="relative overflow-hidden bg-background pt-28 pb-0">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-orange-500/10 blur-[140px]" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-amber-500/8 blur-[140px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }} />

        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-14">
            <motion.span
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/25 bg-orange-500/8 text-orange-400 text-xs font-semibold mb-7 tracking-wide uppercase"
            >
              <Sparkles className="w-3 h-3" /> India's #1 Tool Rental Marketplace
            </motion.span>

            <motion.h1
              className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-5 leading-[1.04]"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            >
              Rent Any Tool.{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">Anywhere.</span>
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: 0.6 }}
                />
              </span>
            </motion.h1>

            <motion.p
              className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >
              Skip the hardware store. Rent high-quality tools from verified owners near you — delivered or picked up same day.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            >
              <Button asChild size="lg"
                className="h-14 px-9 rounded-full text-base font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-foreground shadow-2xl shadow-orange-500/30 hover:scale-105 transition-all border-0">
                <Link href="/tools"><Package className="w-4 h-4 mr-2" />Browse All Tools</Link>
              </Button>
              <Button asChild variant="outline" size="lg"
                className="h-14 px-9 rounded-full text-base font-bold border-border bg-muted/50 text-foreground hover:bg-muted hover:scale-105 transition-all">
                <Link href="/add-tool">List Your Tool</Link>
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-5 text-sm text-gray-500"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            >
              {[
                { icon: <ShieldCheck className="w-3.5 h-3.5 text-green-400" />, t: "Insured Rentals" },
                { icon: <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />, t: "4.8 Avg Rating" },
                { icon: <Users className="w-3.5 h-3.5 text-blue-400" />, t: "500+ Verified Owners" },
                { icon: <Zap className="w-3.5 h-3.5 text-orange-400" />, t: "Same-Day Pickup" },
              ].map((b, i) => (
                <span key={i} className="flex items-center gap-1.5">{b.icon}{b.t}</span>
              ))}
            </motion.div>
          </div>

          {/* SLIDER */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/8" />
              <p className="text-[11px] text-gray-600 uppercase tracking-widest font-medium">Move cursor left / right to slide</p>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/8" />
            </div>

            <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-none pb-1">
              {CATEGORIES.map(cat => (
                <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat.key ? "text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {activeCategory === cat.key && (
                    <motion.span layoutId="catPill" className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30" />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              ))}
              <div className="ml-auto shrink-0">
                <Link href={`/tools?category=${activeCategory}`}
                  className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-semibold transition-colors whitespace-nowrap">
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-orange-500/30 via-white/5 to-transparent mb-4" />

            <AnimatePresence mode="wait">
              <motion.div key={activeCategory} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <HorizontalSlider tools={categoryTools} categoryKey={activeCategory} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 bg-muted/30 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-muted-foreground text-xs font-semibold mb-4 uppercase tracking-wide">
              <Zap className="w-3 h-3 text-orange-500" /> Simple Process
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Three steps to get any tool you need.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 relative">
            <div className="hidden md:block absolute top-11 left-[22%] right-[22%] h-px bg-gradient-to-r from-transparent via-orange-500/25 to-transparent" />
            {[
              { icon: <MapPin className="w-6 h-6" />, n: "01", title: "Find Nearby", desc: "Search tools listed by verified owners in your neighbourhood." },
              { icon: <Clock className="w-6 h-6" />, n: "02", title: "Book & Pick Up", desc: "Reserve dates, pay securely, arrange a quick pickup." },
              { icon: <ShieldCheck className="w-6 h-6" />, n: "03", title: "Use & Return", desc: "Get your project done. Every rental is fully insured." },
            ].map((s, i) => (
              <motion.div key={i}
                className="relative rounded-2xl border border-border bg-card p-8 hover:border-orange-500/40 hover:shadow-lg transition-all group"
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.12 }}
              >
                <span className="absolute top-5 right-6 text-5xl font-black text-muted/30 select-none">{s.n}</span>
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-5 group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-amber-500" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Package className="w-5 h-5" />, label: "Active Tools",    value: stats?.totalTools    || 105,  s: "+" },
              { icon: <Users   className="w-5 h-5" />, label: "Members",         value: stats?.totalUsers    || 512,  s: "+" },
              { icon: <TrendingUp className="w-5 h-5" />, label: "Rentals Done", value: stats?.totalBookings || 2840, s: "" },
              { icon: <Star className="w-5 h-5 fill-current" />, label: "5-Star Reviews", value: 1240, s: "+" },
            ].map((st, i) => (
              <motion.div key={i} className="text-center text-white"
                initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="flex justify-center mb-2 opacity-75">{st.icon}</div>
                <div className="text-4xl md:text-5xl font-black mb-1"><CountUp end={st.value} />{st.s}</div>
                <div className="text-foreground/65 text-xs font-semibold uppercase tracking-widest">{st.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-28 bg-background relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-muted-foreground text-xs font-semibold mb-4 uppercase tracking-wide">
              <Sparkles className="w-3 h-3 text-orange-500" /> Why ToolShare
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">Built for you</h2>
            <p className="text-muted-foreground text-lg">Everything renters and owners need.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { t: "Insured Rentals",   d: "Every rental covered for accidental damage. Rent with complete peace of mind." },
              { t: "Instant Booking",   d: "Browse, book, and confirm in minutes. No back-and-forth needed." },
              { t: "Hyperlocal",        d: "Find tools within your neighbourhood. Quick pickup, no long drives." },
              { t: "Earn Extra Income", d: "Turn idle tools into cash. List in 2 minutes and start earning." },
              { t: "Verified Reviews",  d: "Real ratings from real renters. Know exactly what you're getting." },
              { t: "Secure Payments",   d: "Payments held safely until pickup confirmed. Full refund if anything goes wrong." },
            ].map((f, i) => (
              <motion.div key={i}
                className="rounded-2xl border border-border bg-card p-7 hover:border-orange-500/40 hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.07 }}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 mb-4" />
                <h3 className="text-base font-bold text-foreground mb-2">{f.t}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="relative rounded-3xl overflow-hidden border border-border p-10 md:p-20 text-center bg-card shadow-xl"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5 pointer-events-none" />
            <h2 className="text-4xl md:text-6xl font-black text-foreground mb-5 leading-tight relative z-10">Ready to get started?</h2>
            <p className="text-muted-foreground text-xl mb-10 max-w-xl mx-auto leading-relaxed relative z-10">
              Join thousands of Indians who rent smarter. Sign up free and find your first tool today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Button asChild size="lg"
                className="h-14 px-10 rounded-full text-base font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-foreground shadow-2xl shadow-orange-500/30 hover:scale-105 transition-all border-0">
                <Link href="/signup">Sign Up Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg"
                className="h-14 px-10 rounded-full text-base font-bold hover:scale-105 transition-all">
                <Link href="/tools">Browse Tools <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    </PageTransition>
  );
}
