import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, SlidersHorizontal, MapPin, TrendingUp, X, ChevronDown, Wrench
} from "lucide-react";
import { PageTransition } from "@/components/layout/page-transition";
import { ToolCard } from "@/components/tools/tool-card";
import { 
  useListTools, 
  useListToolCategories 
} from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Use a simple debounce for search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // In a real app we'd debounce this, but keeping it simple here
    setDebouncedSearch(e.target.value);
  };

  const { data: tools, isLoading: toolsLoading } = useListTools({
    category: activeCategory || undefined,
    search: debouncedSearch || undefined,
  });

  const { data: categories, isLoading: categoriesLoading } = useListToolCategories();

  // Sort tools client-side since API doesn't support sorting
  const sortedTools = useMemo(() => {
    if (!tools) return [];
    
    return [...tools].sort((a, b) => {
      switch (sortOrder) {
        case "price-low":
          return a.pricePerDay - b.pricePerDay;
        case "price-high":
          return b.pricePerDay - a.pricePerDay;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [tools, sortOrder]);

  return (
    <PageTransition className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Find the perfect tool
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Rent high-quality tools from people in your neighborhood.
            </p>
          </div>
          
          <div className="w-full md:w-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="Search tools, categories, or brands..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-6 w-full md:w-80 lg:w-96 rounded-xl border-gray-200 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus-visible:ring-primary shadow-sm hover:border-primary/50 transition-colors text-base"
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(""); setDebouncedSearch(""); }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0 space-y-8">
            <div>
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    activeCategory === null 
                      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  All Categories
                </button>
                
                {categoriesLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full rounded-lg" />
                  ))
                ) : (
                  categories?.map((cat) => (
                    <button
                      key={cat.category}
                      onClick={() => setActiveCategory(cat.category)}
                      className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        activeCategory === cat.category 
                          ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span className="capitalize">{cat.category.replace("-", " ")}</span>
                      </span>
                      <Badge variant={activeCategory === cat.category ? "secondary" : "outline"} className={
                        activeCategory === cat.category ? "bg-primary-foreground/20 border-transparent text-primary-foreground" : "text-xs"
                      }>
                        {cat.count}
                      </Badge>
                    </button>
                  ))
                )}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Wrench className="w-24 h-24" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 relative z-10">Have a tool sitting around?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 relative z-10">
                Turn your idle tools into extra cash by listing them on ToolShare.
              </p>
              <Button asChild size="sm" className="w-full relative z-10 bg-white text-primary border border-primary/20 hover:bg-primary hover:text-white shadow-sm">
                <Link href="/add-tool">List Your Tool</Link>
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Mobile Filters & Sort */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2 rounded-xl">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                      {activeCategory && (
                        <Badge className="ml-1 px-1.5 h-5 rounded bg-primary/20 text-primary hover:bg-primary/30 border-transparent">1</Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                    <SheetHeader className="mb-6">
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>
                        Narrow down your tool search.
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3 text-sm">Categories</h4>
                        <div className="space-y-2">
                          <button
                            onClick={() => setActiveCategory(null)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                              activeCategory === null 
                                ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                            }`}
                          >
                            All Categories
                          </button>
                          
                          {categories?.map((cat) => (
                            <button
                              key={cat.category}
                              onClick={() => setActiveCategory(cat.category)}
                              className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm transition-all ${
                                activeCategory === cat.category 
                                  ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span>{cat.icon}</span>
                                <span className="capitalize">{cat.category.replace("-", " ")}</span>
                              </span>
                              <Badge variant="outline" className="text-xs">{cat.count}</Badge>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
              {/* Category pills for tablet/desktop */}
              <div className="hidden lg:flex flex-wrap gap-2 items-center overflow-x-auto pb-2 scrollbar-none flex-1">
                {activeCategory && (
                  <Badge 
                    variant="secondary" 
                    className="pl-2 pr-1 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 border-transparent flex items-center gap-1"
                  >
                    <span className="capitalize">{activeCategory.replace("-", " ")}</span>
                    <button 
                      onClick={() => setActiveCategory(null)}
                      className="hover:bg-primary/20 rounded-full p-0.5 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <span className="text-sm text-gray-500 font-medium">
                  {sortedTools.length} {sortedTools.length === 1 ? 'result' : 'results'}
                </span>
              </div>
              <div className="lg:hidden text-sm text-gray-500 font-medium">
                {sortedTools.length} {sortedTools.length === 1 ? 'result' : 'results'}
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1 font-medium text-gray-600">
                      Sort by: {
                        sortOrder === "newest" ? "Newest" : 
                        sortOrder === "price-low" ? "Price: Low to High" : 
                        sortOrder === "price-high" ? "Price: High to Low" : "Rating"
                      }
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Sort tools</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                      <DropdownMenuRadioItem value="newest">Newest Additions</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="price-low">Price: Low to High</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="price-high">Price: High to Low</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="rating">Highest Rated</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Results Grid */}
            {toolsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                    <Skeleton className="aspect-[4/3] w-full rounded-none" />
                    <div className="p-4 space-y-3 flex-grow">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedTools.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 }
                  }
                }}
              >
                <AnimatePresence mode="popLayout">
                  {sortedTools.map((tool, index) => (
                    <motion.div
                      key={tool.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ToolCard tool={tool} index={index} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center"
              >
                <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No tools found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  We couldn't find any tools matching your search criteria. Try adjusting your filters or search term.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setDebouncedSearch("");
                    setActiveCategory(null);
                  }}
                  variant="outline"
                >
                  Clear all filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
