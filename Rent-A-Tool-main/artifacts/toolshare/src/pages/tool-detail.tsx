import { useState, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { format, addDays, isSameDay, parseISO, eachDayOfInterval, startOfDay } from "date-fns";
import { PageTransition } from "@/components/layout/page-transition";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useGetTool, useCreateBooking, getGetToolQueryKey } from "@/lib/api-client";
import { MapPin, Star, CalendarIcon, ShieldCheck, Wrench, ChevronLeft, CheckCircle2, CalendarCheck, CalendarX, ShoppingCart, Check } from "lucide-react";
import { formatINR } from "@/lib/currency";

const MOCK_BOOKED_RANGES: Record<number, { from: string; to: string }[]> = {
  1:  [{ from: "2026-04-22", to: "2026-04-24" }, { from: "2026-05-01", to: "2026-05-03" }],
  2:  [{ from: "2026-04-25", to: "2026-04-27" }],
  4:  [{ from: "2026-04-28", to: "2026-04-30" }],
  7:  [{ from: "2026-04-23", to: "2026-04-25" }],
};

export default function ToolDetail() {
  const [, params] = useRoute<{ id: string }>("/tools/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date | undefined }>({ from: new Date(), to: addDays(new Date(), 2) });
  const [message, setMessage] = useState("");
  const [cartAdded, setCartAdded] = useState(false);

  const { data: tool, isLoading } = useGetTool(id, { query: { enabled: !!id, queryKey: getGetToolQueryKey(id) } });
  const createBooking = useCreateBooking();

  const bookedDates = useMemo(() => {
    const ranges = MOCK_BOOKED_RANGES[id] || [];
    return ranges.flatMap(({ from, to }) => eachDayOfInterval({ start: parseISO(from), end: parseISO(to) }));
  }, [id]);

  const bookedRanges = MOCK_BOOKED_RANGES[id] || [];

  const availableWindows = useMemo(() => {
    const today = startOfDay(new Date());
    const windows: { from: Date; to: Date }[] = [];
    let start: Date | null = null;
    for (let i = 0; i <= 30; i++) {
      const d = addDays(today, i);
      const booked = bookedDates.some(b => isSameDay(b, d));
      if (!booked && !start) start = d;
      if (booked && start) { windows.push({ from: start, to: addDays(d, -1) }); start = null; }
    }
    if (start) windows.push({ from: start, to: addDays(today, 30) });
    return windows.slice(0, 4);
  }, [bookedDates]);

  const days = dateRange.from && dateRange.to ? Math.max(1, Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / 86400000)) : 1;
  const totalCost = tool ? days * tool.pricePerDay : 0;
  const serviceFee = Math.round(totalCost * 0.15);
  const finalTotal = totalCost + serviceFee;

  const handleAddToCart = () => {
    if (!tool) return;
    addToCart(tool);
    setCartAdded(true);
    toast({ title: "Added to cart", description: `${tool.name} added to your rental cart.` });
    setTimeout(() => setCartAdded(false), 2000);
  };

  const handleBooking = () => {
    if (!user) { toast({ title: "Login Required", description: "Please login to rent this tool.", action: <Button onClick={() => setLocation("/login")} size="sm">Login</Button> }); return; }
    if (!dateRange.from || !dateRange.to) { toast({ title: "Select Dates", description: "Please select a valid date range.", variant: "destructive" }); return; }
    createBooking.mutate(
      { data: { toolId: id, userId: user.id, startDate: format(dateRange.from, "yyyy-MM-dd"), endDate: format(dateRange.to, "yyyy-MM-dd"), message: message || undefined } },
      {
        onSuccess: () => { toast({ title: "Booking Requested!", description: "The owner will review your request shortly." }); setLocation("/dashboard/renter"); },
        onError: () => toast({ title: "Booking Failed", description: "Please try again.", variant: "destructive" }),
      }
    );
  };

  if (isLoading) return (
    <PageTransition className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    </PageTransition>
  );

  if (!tool) return (
    <PageTransition className="pt-32 pb-20 flex flex-col items-center text-center bg-background min-h-screen">
      <Wrench className="w-16 h-16 text-muted-foreground/30 mb-6" />
      <h1 className="text-2xl font-bold text-foreground mb-2">Tool Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">This tool may have been removed or is no longer available.</p>
      <Button onClick={() => setLocation("/tools")} className="bg-orange-500 hover:bg-orange-600 text-white border-0">Browse Tools</Button>
    </PageTransition>
  );

  return (
    <PageTransition className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground" onClick={() => window.history.back()}>
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <motion.div className="relative aspect-video rounded-3xl overflow-hidden border border-border"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <img src={tool.imageUrl} alt={tool.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-black/50 backdrop-blur-sm border-white/20 text-white capitalize">{tool.category.replace("-", " ")}</Badge>
              </div>
              <div className="absolute top-4 right-4">
                {tool.available ? <Badge className="bg-green-500/90 text-white border-0">Available Now</Badge> : <Badge className="bg-red-500/80 text-white border-0">Currently Rented</Badge>}
              </div>
            </motion.div>

            <motion.div className="space-y-7" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3">{tool.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold text-foreground">{tool.rating?.toFixed(1) ?? "New"}</span>
                    {tool.reviewCount > 0 && <span className="text-muted-foreground">({tool.reviewCount} reviews)</span>}
                  </div>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{tool.location}</div>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>Listed {format(new Date(tool.createdAt), "MMM d, yyyy")}</span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed text-base">{tool.description}</p>
              <div className="h-px bg-border" />

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-500 flex items-center justify-center font-black text-lg uppercase shrink-0">
                  {tool.ownerName?.charAt(0) ?? "O"}
                </div>
                <div>
                  <p className="font-semibold text-foreground">Hosted by {tool.ownerName}</p>
                  <p className="text-sm text-muted-foreground">Typical response: under 1 hour</p>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">ToolHub Protection</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: <ShieldCheck className="w-5 h-5 text-green-500" />, t: "Damage Protection", d: "Every rental is covered for accidental damage." },
                    { icon: <CheckCircle2 className="w-5 h-5 text-orange-500" />, t: "Verified Condition", d: "Tools are community-verified to work as expected." },
                  ].map((p, i) => (
                    <div key={i} className="flex gap-3 bg-muted/40 border border-border p-4 rounded-xl">
                      {p.icon}
                      <div>
                        <p className="font-semibold text-foreground text-sm mb-0.5">{p.t}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{p.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border" />

              <div>
                <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-orange-500" /> Availability
                </h3>
                {bookedRanges.length > 0 && (
                  <div className="mb-5">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold mb-3 flex items-center gap-1.5">
                      <CalendarX className="w-3.5 h-3.5 text-red-500" /> Already Booked
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {bookedRanges.map((r, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                          {format(parseISO(r.from), "MMM d")} � {format(parseISO(r.to), "MMM d, yyyy")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold mb-3 flex items-center gap-1.5">
                  <CalendarCheck className="w-3.5 h-3.5 text-green-500" /> Open Windows � Next 30 Days
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableWindows.map((w, i) => (
                    <button key={i} onClick={() => setDateRange({ from: w.from, to: w.to })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      {format(w.from, "MMM d")} � {format(w.to, "MMM d")}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">Tap a window to auto-fill your booking dates.</p>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div className="sticky top-24" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card className="border-border bg-card shadow-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-6 flex items-end gap-1">
                    <span className="text-3xl font-black text-foreground">{formatINR(tool.pricePerDay)}</span>
                    <span className="text-muted-foreground pb-1 text-sm">/ day</span>
                    {tool.pricePerHour && <span className="text-xs text-muted-foreground ml-2 pb-1">or {formatINR(tool.pricePerHour)}/hr</span>}
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-border overflow-hidden">
                      <div className="w-full flex items-center justify-between p-4 bg-muted/40">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Rental Dates</p>
                          <p className="text-sm font-semibold text-foreground">
                            {dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "Pick start"}{" � "}
                            {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "Pick end"}
                          </p>
                        </div>
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>

                    <Textarea placeholder="Message to owner (optional)"
                      className="resize-none rounded-xl focus:border-orange-500/50 text-sm"
                      value={message} onChange={e => setMessage(e.target.value)} />

                    {user?.id === tool.ownerId ? (
                      <Button disabled className="w-full h-12 rounded-xl font-bold">This is your tool</Button>
                    ) : (
                      <>
                        <Button onClick={handleBooking} disabled={createBooking.isPending || !tool.available}
                          className="w-full h-12 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 hover:scale-[1.02] transition-all border-0">
                          {createBooking.isPending ? "Requesting�" : !tool.available ? "Currently Unavailable" : "Request to Rent"}
                        </Button>
                        <motion.button
                          onClick={handleAddToCart}
                          disabled={isInCart(tool.id) || cartAdded}
                          whileTap={{ scale: 0.97 }}
                          className={`w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
                            isInCart(tool.id) || cartAdded
                              ? "bg-green-500/10 border-green-500/30 text-green-400 cursor-default"
                              : "bg-white/4 border-white/10 text-white/70 hover:bg-white/8 hover:border-orange-500/30 hover:text-orange-400"
                          }`}
                        >
                          <motion.span
                            key={isInCart(tool.id) || cartAdded ? "added" : "add"}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2"
                          >
                            {isInCart(tool.id) || cartAdded
                              ? <><Check className="w-4 h-4" /> Added to Cart</>
                              : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                            }
                          </motion.span>
                        </motion.button>
                      </>
                    )}
                  </div>

                  {dateRange.from && dateRange.to && tool.available && user?.id !== tool.ownerId && (
                    <motion.div className="mt-6 space-y-2.5 pt-5 border-t border-border" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{formatINR(tool.pricePerDay)} � {days} {days === 1 ? "day" : "days"}</span>
                        <span className="text-foreground">{formatINR(totalCost)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Service fee (15%)</span>
                        <span className="text-foreground">{formatINR(serviceFee)}</span>
                      </div>
                      <div className="h-px bg-border my-1" />
                      <div className="flex justify-between font-black text-foreground text-base">
                        <span>Total</span>
                        <span className="text-orange-500">{formatINR(finalTotal)}</span>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
