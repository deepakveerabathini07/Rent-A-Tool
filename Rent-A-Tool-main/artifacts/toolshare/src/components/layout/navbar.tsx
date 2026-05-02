import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { CartDrawer } from "@/components/ui/cart-drawer";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Menu, X, UserCircle, LogOut, Sun, Moon, ShoppingCart } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout, simulateSwitch } = useAuth();
  const { theme, setTheme } = useTheme();
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDark = theme === "dark";

  const navLinks = [
    { name: "Browse Tools", href: "/tools" },
    { name: "How it Works", href: "/#how-it-works" },
  ];

  return (
    <>
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
      scrolled
        ? "bg-background/95 backdrop-blur-xl border-border shadow-lg shadow-black/10 dark:shadow-black/50"
        : "bg-transparent border-transparent"
    }`}>
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-2 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/25">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-foreground">ToolHub</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}
              className={`text-sm font-medium transition-colors ${
                location === link.href ? "text-orange-500" : "text-muted-foreground hover:text-foreground"
              }`}>
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative w-9 h-9 rounded-full bg-muted/50 hover:bg-muted border border-border hover:border-orange-500/30 flex items-center justify-center text-white/60 hover:text-orange-400 transition-all"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-4 w-4" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-black flex items-center justify-center shadow-lg shadow-orange-500/40"
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Theme toggle */}
          {mounted && (
            <Button
              variant="ghost" size="icon"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDark ? "moon" : "sun"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </motion.span>
              </AnimatePresence>
            </Button>
          )}

          <Button variant="ghost" size="sm" onClick={simulateSwitch}
            className="hidden lg:flex text-muted-foreground hover:text-foreground hover:bg-muted text-xs border border-border">
            Role: {user ? (user.role === "renter" ? "Renter" : "Owner") : "Guest"}
          </Button>

          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "owner" && (
                <Button asChild size="sm"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-lg shadow-orange-500/20">
                  <Link href="/add-tool">List Your Tool</Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover border-border text-foreground">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2 capitalize">
                        {user.role === "owner" ? "Tool Owner" : "Renter"}
                        <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 bg-orange-500/20 text-orange-500 border-0">Demo</Badge>
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem asChild className="text-foreground hover:text-foreground focus:bg-muted cursor-pointer">
                    <Link href={`/dashboard/${user.role}`}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-500 hover:text-red-600 focus:bg-muted cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-lg shadow-orange-500/20">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>

        <button className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-background/98 backdrop-blur-xl"
          >
            <div className="flex flex-col p-4 gap-3">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href}
                  className="text-base font-medium py-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}>
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-border my-1" />
              {/* Mobile theme toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground text-sm font-medium"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                </button>
              )}
              <div className="h-px bg-border my-1" />
              {user ? (
                <>
                  <div className="py-2">
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <Link href={`/dashboard/${user.role}`} className="py-2 text-orange-500 font-medium"
                    onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  {user.role === "owner" && (
                    <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
                      <Link href="/add-tool" onClick={() => setMobileMenuOpen(false)}>List Your Tool</Link>
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-muted px-0">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-1">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                  </Button>
                  <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
