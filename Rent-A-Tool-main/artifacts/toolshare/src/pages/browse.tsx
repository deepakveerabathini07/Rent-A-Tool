import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { MOCK_TOOLS } from "@/lib/mock-data";
import { formatINR } from "@/lib/currency";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import {
  Wrench, Search, MapPin, Star, Zap, Shield, Package,
  Hammer, Drill, Leaf, Paintbrush, HardHat, Wind, Sparkles,
  ArrowRight, Filter, SlidersHorizontal, ChevronRight, ShoppingCart, Check,
} from "lucide-react";

const CATEGORIES = [
  { key: "all",          label: "All Tools",    icon: <Package className="w-5 h-5" />,     emoji: "🧰" },
  { key: "power-tools",  label: "Power Tools",  icon: <Drill className="w-5 h-5" />,       emoji: "🔧" },
  { key: "hand-tools",   label: "Hand Tools",   icon: <Hammer className="w-5 h-5" />,      emoji: "🔨" },
  { key: "gardening",    label: "Gardening",    icon: <Leaf className="w-5 h-5" />,        emoji: "🌿" },
  { key: "cleaning",     label: "Cleaning",     icon: <Wind className="w-5 h-5" />,        emoji: "🧹" },
  { key: "construction", label: "Construction", icon: <HardHat className="w-5 h-5" />,     emoji: "🏗️" },
  { key: "painting",     label: "Painting",     icon: <Paintbrush className="w-5 h-5" />,  emoji: "🎨" },
  { key: "outdoor",      label: "Outdoor",      icon: <Sparkles className="w-5 h-5" />,    emoji: "⛺" },
];

const SORT_OPTIONS = [
  { key: "popular",  label: "Most Popular" },
  { key: "price-lo", label: "Price: Low → High" },
  { key: "price-hi", label: "Price: High → Low" },
  { key: "rating",   label: "Top Rated" },
];

export default function Browse() {
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);

  const handleAddToCart = (e: React.MouseEvent, tool: typeof MOCK_TOOLS[0]) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart(tool.id)) return;
    addToCart(tool);
    setAddedId(tool.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const filtered = MOCK_TOOLS
    .filter(t => activeCategory === "all" || t.category === activeCategory)
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-lo") return a.pricePerDay - b.pricePerDay;
      if (sort === "price-hi") return b.pricePerDay - a.pricePerDay;
      if (sort === "rating")   return (b.rating ?? 0) - (a.rating ?? 0);
      return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
    });

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden bg-background pt-16 pb-14 border-b border-border">
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[100px] pointer-events-none" />

        {/* Floating tool emojis */}
        {["🔧","🔨","⚙️","🪛","🔩","🪚","🛠️","⛏️"].map((e, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl select-none pointer-events-none opacity-20"
            style={{ left: `${8 + i * 12}%`, top: `${15 + (i % 3) * 25}%` }}
            animate={{ y: [0, -10, 0], rotate: [0, 6, -6, 0] }}
            transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
          >
            {e}
          </motion.span>
        ))}

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/25 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest mb-5"
          >
            <Zap className="w-3 h-3" />
            {user ? `Welcome back, ${user.name.split(" ")[0]}` : "Browse Tools"}
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-black text-foreground mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            Find the Right Tool,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              Right Now
            </span>
          </motion.h1>
          <motion.p
            className="text-foreground/40 text-lg mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            {filtered.length} tools available from verified owners near you
          </motion.p>

          {/* Search bar */}
          <motion.div
            className="max-w-xl mx-auto relative"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tools, location..."
              className="w-full h-13 pl-11 pr-4 py-3.5 rounded-2xl bg-muted/60 border border-border text-foreground placeholder-muted-foreground/60 text-sm focus:outline-none focus:border-orange-500/50 focus:bg-muted transition-all"
            />
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORY PILLS ── */}
      <section className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                  activeCategory === cat.key
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeCategory === cat.key && (
                  <motion.span
                    layoutId="catBg"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>{cat.emoji}</span>
                  {cat.label}
                </span>
              </motion.button>
            ))}

            {/* Sort + Filter */}
            <div className="ml-auto flex items-center gap-2 shrink-0">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="text-xs font-semibold bg-muted border border-border rounded-full px-3 py-2 text-muted-foreground focus:outline-none focus:border-orange-500/50 cursor-pointer"
              >
                {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
              </select>
              <button
                onClick={() => setShowFilters(f => !f)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-semibold transition-all ${showFilters ? "border-orange-500/50 bg-orange-500/10 text-orange-400" : "border-border bg-muted text-muted-foreground hover:border-orange-500/30"}`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOL GRID ── */}
      <section className="container mx-auto px-4 py-10">

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground text-sm">
            Showing <span className="text-foreground font-semibold">{filtered.length}</span> tools
            {activeCategory !== "all" && <> in <span className="text-orange-400 font-semibold capitalize">{activeCategory.replace("-", " ")}</span></>}
          </p>
          <Link href="/tools" className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-semibold transition-colors">
            Advanced search <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + search + sort}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
              >
                <Link href={`/tools/${tool.id}`}>
                  <div className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 cursor-pointer">

                    {/* Image */}
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={tool.imageUrl}
                        alt={tool.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Availability badge */}
                      <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm ${
                        tool.available ? "bg-green-500/20 border border-green-500/30 text-green-400" : "bg-red-500/20 border border-red-500/30 text-red-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${tool.available ? "bg-green-400" : "bg-red-400"}`} />
                        {tool.available ? "Available" : "Rented"}
                      </div>

                      {/* Category emoji */}
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-base">
                        {CATEGORIES.find(c => c.key === tool.category)?.emoji ?? "🔧"}
                      </div>

                      {/* Price overlay */}
                      <div className="absolute bottom-3 left-3">
                        <span className="text-orange-400 font-extrabold text-lg">{formatINR(tool.pricePerDay)}</span>
                        <span className="text-foreground/50 text-xs">/day</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-1 capitalize">
                        {tool.category.replace("-", " ")}
                      </p>
                      <h3 className="text-foreground font-bold text-sm leading-snug line-clamp-2 mb-3 group-hover:text-orange-400 transition-colors">
                        {tool.name}
                      </h3>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-[100px]">{tool.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-foreground font-semibold">{tool.rating?.toFixed(1)}</span>
                          <span className="text-muted-foreground">({tool.reviewCount})</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Shield className="w-3 h-3 text-green-500" /> Insured
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={(e) => handleAddToCart(e, tool)}
                            whileTap={{ scale: 0.92 }}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                              isInCart(tool.id) || addedId === tool.id
                                ? "bg-green-500/15 border border-green-500/30 text-green-400"
                                : "bg-orange-500/10 border border-orange-500/25 text-orange-400 hover:bg-orange-500/20"
                            }`}
                          >
                            <AnimatePresence mode="wait">
                              {isInCart(tool.id) || addedId === tool.id ? (
                                <motion.span key="added" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Added
                                </motion.span>
                              ) : (
                                <motion.span key="add" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                                  <ShoppingCart className="w-3 h-3" /> Add
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.button>
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-orange-400 group-hover:gap-2 transition-all">
                            Rent now <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-muted-foreground text-lg font-semibold">No tools found</p>
            <p className="text-muted-foreground text-sm mt-1">Try a different category or search term</p>
          </div>
        )}
      </section>

      {/* ── TRUST BAR ── */}
      <section className="border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            {[
              { icon: <Shield className="w-4 h-4 text-green-400" />, label: "Every rental insured" },
              { icon: <Star className="w-4 h-4 text-amber-400 fill-current" />, label: "4.8 avg rating" },
              { icon: <Zap className="w-4 h-4 text-orange-400" />, label: "Same-day pickup" },
              { icon: <Wrench className="w-4 h-4 text-blue-400" />, label: "500+ verified tools" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 font-medium">
                {item.icon} {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
