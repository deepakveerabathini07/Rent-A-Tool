import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, X, ChevronDown, Wrench,
  Zap, Hammer, Leaf, Sparkles, HardHat, Tent, Paintbrush,
  LayoutGrid,
} from "lucide-react";
import { PageTransition } from "@/components/layout/page-transition";
import { ToolCard } from "@/components/tools/tool-card";
import { useListTools, useListToolCategories } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader,
  SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";

// Map category slugs to Lucide icons
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "power-tools":  <Zap className="w-4 h-4" />,
  "hand-tools":   <Hammer className="w-4 h-4" />,
  "gardening":    <Leaf className="w-4 h-4" />,
  "cleaning":     <Sparkles className="w-4 h-4" />,
  "construction": <HardHat className="w-4 h-4" />,
  "outdoor":      <Tent className="w-4 h-4" />,
  "painting":     <Paintbrush className="w-4 h-4" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  "power-tools":  "Power Tools",
  "hand-tools":   "Hand Tools",
  "gardening":    "Gardening",
  "cleaning":     "Cleaning",
  "construction": "Construction",
  "outdoor":      "Outdoor",
  "painting":     "Painting",
};

function CategoryButton({
  category, count, active, onClick,
}: { category: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
        active
          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/20"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <span className={`${active ? "text-white" : "text-orange-500"}`}>
          {CATEGORY_ICONS[category] ?? <Wrench className="w-4 h-4" />}
        </span>
        <span>{CATEGORY_LABELS[category] ?? category.replace("-", " ")}</span>
      </span>
      <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold tabular-nums ${
        active ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
      }`}>
        {count}
      </span>    </button>
  );
}

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setDebouncedSearch(e.target.value);
  };

  const { data: tools, isLoading: toolsLoading } = useListTools({
    category: activeCategory || undefined,
    search: debouncedSearch || undefined,
  });

  const { data: categories, isLoading: categoriesLoading } = useListToolCategories();

  const sortedTools = useMemo(() => {
    if (!Array.isArray(tools)) return [];
    return [...tools].sort((a, b) => {
      switch (sortOrder) {
        case "price-low":  return a.pricePerDay - b.pricePerDay;
        case "price-high": return b.pricePerDay - a.pricePerDay;
        case "rating":     return (b.rating || 0) - (a.rating || 0);
        default:           return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [tools, sortOrder]);

  const sortLabel = {
    "newest": "Newest", "price-low": "Price: Low–High",
    "price-high": "Price: High–Low", "rating": "Top Rated",
  }[sortOrder] ?? "Sort";

  return (
    <PageTransition className="pt-24 pb-16 min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6">

        {/* ── Page Header ── */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">Browse Tools</h1>
          <p className="text-muted-foreground text-base">Rent professional-grade tools from verified owners near you.</p>
        </div>

        {/* ── Search Bar ── */}
        <div className="relative mb-8 max-w-2xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search by tool name, brand, or category…"
            value={searchQuery}
            onChange={handleSearchChange}
          className="pl-10 pr-10 h-11 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground shadow-sm text-sm focus-visible:ring-orange-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setDebouncedSearch(""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 gap-6">
            <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">Categories</p>

              {/* All */}
              <button
                onClick={() => setActiveCategory(null)}
                className={`w-full flex items-center gap-2.5 text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mb-1 ${
                  activeCategory === null
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/25"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <LayoutGrid className={`w-4 h-4 ${activeCategory === null ? "text-primary-foreground" : "text-primary"}`} />
                All Categories
              </button>

              <Separator className="my-2" />

              {categoriesLoading
                ? Array(7).fill(0).map((_, i) => <Skeleton key={i} className="h-9 w-full rounded-lg mb-1" />)
                : Array.isArray(categories) && categories.map((cat) => (
                    <CategoryButton
                      key={cat.category}
                      category={cat.category}
                      count={cat.count}
                      active={activeCategory === cat.category}
                      onClick={() => setActiveCategory(cat.category)}
                    />
                  ))
              }
            </div>

            {/* Upsell card */}
            <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/15 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute -right-3 -bottom-3 opacity-[0.07]"><Wrench className="w-28 h-28" /></div>
              <p className="font-bold text-foreground text-sm mb-1 relative z-10">Have tools sitting idle?</p>
              <p className="text-xs text-muted-foreground mb-4 relative z-10 leading-relaxed">Turn them into income by listing on ToolHub.</p>
              <Button asChild size="sm" className="w-full relative z-10 h-8 text-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0">
                <Link href="/add-tool">List a Tool</Link>
              </Button>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar row */}
            <div className="flex items-center justify-between mb-5 gap-3">
              {/* Mobile filter trigger */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 rounded-lg h-9">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Filters
                      {activeCategory && (
                        <span className="ml-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">1</span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px] bg-background border-border">
                    <SheetHeader className="mb-5">
                      <SheetTitle>Filter Tools</SheetTitle>
                      <SheetDescription className="text-muted-foreground">Narrow down your search by category.</SheetDescription>
                    </SheetHeader>
                    <div className="space-y-1">
                      <button
                        onClick={() => setActiveCategory(null)}
                        className={`w-full flex items-center gap-2.5 text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          activeCategory === null ? "bg-primary text-primary-foreground" : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <LayoutGrid className="w-4 h-4" /> All Categories
                      </button>
                      <Separator className="my-2" />
                      {Array.isArray(categories) && categories.map((cat) => (
                        <CategoryButton
                          key={cat.category}
                          category={cat.category}
                          count={cat.count}
                          active={activeCategory === cat.category}
                          onClick={() => setActiveCategory(cat.category)}
                        />
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Active filter pill + result count */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {activeCategory && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5 pl-2 pr-1 py-1 bg-primary/10 text-primary border-transparent text-xs font-medium"
                  >
                    <span className="flex items-center gap-1">
                      {CATEGORY_ICONS[activeCategory]}
                      {CATEGORY_LABELS[activeCategory] ?? activeCategory}
                    </span>
                    <button
                      onClick={() => setActiveCategory(null)}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground font-medium">
                  {sortedTools.length} {sortedTools.length === 1 ? "result" : "results"}
                </span>
              </div>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 h-9 rounded-lg text-xs font-medium shrink-0">
                    {sortLabel}
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
                  <DropdownMenuLabel className="text-xs">Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                    <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price-low">Price: Low to High</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price-high">Price: High to Low</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="rating">Top Rated</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Results */}
            {toolsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                    <Skeleton className="aspect-[4/3] w-full rounded-none" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4 bg-white/5" />
                      <Skeleton className="h-4 w-full bg-white/5" />
                      <Skeleton className="h-4 w-2/3 bg-white/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedTools.length > 0 ? (              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                initial="hidden"
                animate="visible"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
              >
                <AnimatePresence mode="popLayout">
                  {sortedTools.map((tool, index) => (
                    <motion.div
                      key={tool.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ToolCard tool={tool} index={index} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24 bg-card rounded-2xl border border-dashed border-border flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">No tools found</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">Try adjusting your filters or search term.</p>
                <Button onClick={() => { setSearchQuery(""); setDebouncedSearch(""); setActiveCategory(null); }} variant="outline" size="sm">
                  Clear filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
