import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useCreateTool } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { PageTransition } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Wrench, Camera, MapPin, IndianRupee,
  ChevronRight, ChevronLeft, CheckCircle2, Upload,
} from "lucide-react";

// ── SVG icon helpers ──────────────────────────────────────────────────────────
const Svg = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    {children}
  </svg>
);

const CATEGORIES = [
  {
    key: "power-tools", label: "Power Tools", desc: "Drills, saws, grinders",
    glow: "#f97316", dot: "bg-orange-500", color: "text-orange-500",
    bg: "bg-orange-500/10", border: "border-orange-500/50",
    icon: <Svg><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></Svg>,
  },
  {
    key: "hand-tools", label: "Hand Tools", desc: "Hammers, wrenches, sets",
    glow: "#3b82f6", dot: "bg-blue-500", color: "text-blue-500",
    bg: "bg-blue-500/10", border: "border-blue-500/50",
    icon: <Svg><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/></Svg>,
  },
  {
    key: "gardening", label: "Gardening", desc: "Mowers, trimmers, sprayers",
    glow: "#22c55e", dot: "bg-green-500", color: "text-green-500",
    bg: "bg-green-500/10", border: "border-green-500/50",
    icon: <Svg><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></Svg>,
  },
  {
    key: "cleaning", label: "Cleaning", desc: "Pressure washers, vacuums",
    glow: "#06b6d4", dot: "bg-cyan-500", color: "text-cyan-500",
    bg: "bg-cyan-500/10", border: "border-cyan-500/50",
    icon: <Svg><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></Svg>,
  },
  {
    key: "construction", label: "Construction", desc: "Mixers, scaffolding, levels",
    glow: "#eab308", dot: "bg-yellow-500", color: "text-yellow-500",
    bg: "bg-yellow-500/10", border: "border-yellow-500/50",
    icon: <Svg><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/></Svg>,
  },
  {
    key: "outdoor", label: "Outdoor", desc: "Generators, blowers, ladders",
    glow: "#10b981", dot: "bg-emerald-500", color: "text-emerald-500",
    bg: "bg-emerald-500/10", border: "border-emerald-500/50",
    icon: <Svg><path d="M3 17l4-8 4 4 4-6 4 10"/><path d="M3 21h18"/></Svg>,
  },
  {
    key: "painting", label: "Painting", desc: "Sprayers, rollers, scaffolds",
    glow: "#a855f7", dot: "bg-purple-500", color: "text-purple-500",
    bg: "bg-purple-500/10", border: "border-purple-500/50",
    icon: <Svg><path d="M19 3H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/><path d="M3 9v10a2 2 0 0 0 2 2h4"/><path d="M15 9v10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5"/><path d="M12 9v4"/><path d="M12 17v.01"/></Svg>,
  },
  {
    key: "other", label: "Other", desc: "Anything else",
    glow: "#64748b", dot: "bg-slate-500", color: "text-slate-500",
    bg: "bg-slate-500/10", border: "border-slate-500/50",
    icon: <Svg><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></Svg>,
  },
];

const STEPS = ["Category", "Details", "Photo", "Pricing"];

const DEFAULT_IMAGES: Record<string, string> = {
  "power-tools":  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
  "hand-tools":   "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80",
  "gardening":    "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800",
  "cleaning":     "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=800",
  "construction": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
  "outdoor":      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
  "painting":     "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80",
  "other":        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
};

export default function AddTool() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createTool = useCreateTool();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    category: "", name: "", description: "", location: "",
    imageUrl: "", pricePerDay: "", pricePerHour: "", available: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (user?.role !== "owner") {
    return (
      <PageTransition className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center bg-background">
        <Wrench className="w-16 h-16 text-muted-foreground/30 mb-6" />
        <h1 className="text-2xl font-bold mb-4 text-foreground">Owner Access Required</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">You must be logged in as an owner to list a tool.</p>
        <Button onClick={() => setLocation("/login")} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">Go to Login</Button>
      </PageTransition>
    );
  }

  const set = (key: string, val: string | boolean) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 0 && !form.category) e.category = "Pick a category";
    if (step === 1) {
      if (!form.name.trim() || form.name.length < 3) e.name = "At least 3 characters";
      if (!form.description.trim() || form.description.length < 10) e.description = "At least 10 characters";
      if (!form.location.trim()) e.location = "Enter a location";
    }
    if (step === 3 && (!form.pricePerDay || Number(form.pricePerDay) < 1)) e.pricePerDay = "Enter a valid price";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const submit = () => {
    if (!validate()) return;
    const imageUrl = form.imageUrl || DEFAULT_IMAGES[form.category] || DEFAULT_IMAGES.other;
    createTool.mutate(
      { data: { ownerId: user.id, name: form.name, description: form.description, category: form.category, imageUrl, pricePerDay: Number(form.pricePerDay), pricePerHour: form.pricePerHour ? Number(form.pricePerHour) : undefined, location: form.location, available: form.available } },
      {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/tools"] }); toast({ title: "Tool listed!", description: "Your tool is now live on ToolHub." }); setLocation("/dashboard/owner"); },
        onError: () => toast({ title: "Error", description: "Please try again.", variant: "destructive" }),
      }
    );
  };

  const progress = ((step + 1) / STEPS.length) * 100;
  const activeCat = CATEGORIES.find(c => c.key === form.category);

  return (
    <PageTransition className="pt-20 pb-16 min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/25 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Wrench className="w-3 h-3" /> List Your Tool
          </div>
          <h1 className="text-3xl font-black text-foreground mb-2">Earn from your tools</h1>
          <p className="text-muted-foreground">Takes less than 2 minutes</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? "bg-orange-500 text-white" : i === step ? "bg-orange-500 text-white ring-4 ring-orange-500/20" : "bg-muted text-muted-foreground"}`}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-orange-400" : "text-muted-foreground"}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`h-px w-8 sm:w-14 mx-1 transition-all ${i < step ? "bg-orange-500" : "bg-border"}`} />}
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="p-6 md:p-8">

              {/* ── STEP 0: Category ── */}
              {step === 0 && (
                <div>
                  <h2 className="text-xl font-black text-foreground mb-1">What type of tool?</h2>
                  <p className="text-muted-foreground text-sm mb-6">Pick the category that best fits your tool.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {CATEGORIES.map(cat => {
                      const active = form.category === cat.key;
                      return (
                        <motion.button
                          key={cat.key}
                          onClick={() => { set("category", cat.key); setErrors({}); }}
                          whileHover={{ y: -4, scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ type: "spring", stiffness: 400, damping: 22 }}
                          className={`group relative flex flex-col items-start gap-3 p-4 rounded-2xl border transition-all duration-300 overflow-hidden text-left ${active ? `${cat.border} bg-card` : "border-border bg-card hover:border-border/80"}`}
                          style={active ? { boxShadow: `0 0 0 1px ${cat.glow}35, 0 8px 32px ${cat.glow}25, 0 2px 8px ${cat.glow}15` } : {}}
                        >
                          {/* Ambient glow blob */}
                          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full blur-3xl pointer-events-none transition-opacity duration-300"
                            style={{ background: cat.glow, opacity: active ? 0.18 : 0 }} />
                          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                            style={{ background: cat.glow }} />

                          {/* Icon */}
                          <div className={`relative z-10 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${active ? `${cat.bg} ${cat.color}` : `bg-muted/50 text-muted-foreground`}`}
                            style={active ? { boxShadow: `0 0 16px ${cat.glow}45` } : {}}>
                            {cat.icon}
                          </div>

                          {/* Label */}
                          <div className="relative z-10 w-full">
                            <p className="text-sm font-bold text-foreground leading-tight">{cat.label}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{cat.desc}</p>
                          </div>

                          {/* Active dot */}
                          {active && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className={`absolute top-3 right-3 w-2 h-2 rounded-full ${cat.dot}`}
                              style={{ boxShadow: `0 0 8px ${cat.glow}` }} />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  {errors.category && <p className="text-red-500 text-sm mt-3">{errors.category}</p>}
                </div>
              )}

              {/* ── STEP 1: Details ── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-black text-foreground mb-1">Tell us about your tool</h2>
                    <p className="text-muted-foreground text-sm">Good descriptions get more rentals.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Tool Name <span className="text-red-500">*</span></label>
                    <Input placeholder="e.g. DeWalt 20V MAX Cordless Drill" value={form.name} onChange={e => set("name", e.target.value)} className={errors.name ? "border-red-500" : ""} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Description <span className="text-red-500">*</span></label>
                    <Textarea placeholder="Describe the condition, what it's good for, and any included accessories..." value={form.description} onChange={e => set("description", e.target.value)} className={`min-h-[110px] resize-none ${errors.description ? "border-red-500" : ""}`} />
                    <div className="flex justify-between mt-1">
                      {errors.description ? <p className="text-red-500 text-xs">{errors.description}</p> : <span />}
                      <span className="text-xs text-muted-foreground">{form.description.length} chars</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5"><MapPin className="w-3.5 h-3.5 inline mr-1 text-orange-400" />Pickup Location <span className="text-red-500">*</span></label>
                    <Input placeholder="e.g. Bengaluru, KA or Koramangala" value={form.location} onChange={e => set("location", e.target.value)} className={errors.location ? "border-red-500" : ""} />
                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                  </div>
                </div>
              )}

              {/* ── STEP 2: Photo ── */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-black text-foreground mb-1">Add a photo</h2>
                    <p className="text-muted-foreground text-sm">Tools with photos get 60% more rentals. You can skip this.</p>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-border bg-muted/30 aspect-video flex items-center justify-center">
                    {form.imageUrl ? (
                      <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = DEFAULT_IMAGES[form.category] || DEFAULT_IMAGES.other; }} />
                    ) : (
                      <div className="text-center">
                        <Camera className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Preview will appear here</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">A default image will be used if you skip</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5"><Upload className="w-3.5 h-3.5 inline mr-1 text-orange-400" />Image URL (optional)</label>
                    <Input placeholder="https://example.com/my-tool.jpg" value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} />
                    <p className="text-xs text-muted-foreground mt-1.5">Paste a direct link to your tool photo</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Or use a stock photo</p>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {["https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80","https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80","https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&q=80","https://images.unsplash.com/photo-1590959651373-a3db0f38a961?w=400&q=80","https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400&q=80"].map((url, i) => (
                        <button key={i} onClick={() => set("imageUrl", url)} className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${form.imageUrl === url ? "border-orange-500 scale-105" : "border-border hover:border-orange-500/50"}`}>
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Pricing ── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-black text-foreground mb-1">Set your price</h2>
                    <p className="text-muted-foreground text-sm">Suggested: 5–10% of the tool's retail value per day.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5"><IndianRupee className="w-3.5 h-3.5 inline mr-1 text-orange-400" />Per Day <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                        <Input type="number" min="1" placeholder="350" value={form.pricePerDay} onChange={e => set("pricePerDay", e.target.value)} className={`pl-7 ${errors.pricePerDay ? "border-red-500" : ""}`} />
                      </div>
                      {errors.pricePerDay && <p className="text-red-500 text-xs mt-1">{errors.pricePerDay}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Per Hour <span className="text-muted-foreground font-normal">(optional)</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                        <Input type="number" min="0" placeholder="80" value={form.pricePerHour} onChange={e => set("pricePerHour", e.target.value)} className="pl-7" />
                      </div>
                    </div>
                  </div>
                  {form.pricePerDay && Number(form.pricePerDay) > 0 && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-orange-500/8 border border-orange-500/20 p-4">
                      <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">Earnings estimate</p>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        {[{ label: "5 days/mo", val: Number(form.pricePerDay) * 5 }, { label: "10 days/mo", val: Number(form.pricePerDay) * 10 }, { label: "20 days/mo", val: Number(form.pricePerDay) * 20 }].map(e => (
                          <div key={e.label} className="bg-background/60 rounded-xl p-2">
                            <p className="text-base font-black text-foreground">₹{e.val.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground">{e.label}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-4">
                    <div>
                      <p className="font-semibold text-foreground text-sm">Available immediately</p>
                      <p className="text-xs text-muted-foreground mt-0.5">List this tool live right now</p>
                    </div>
                    <Switch checked={form.available} onCheckedChange={v => set("available", v)} />
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/20 p-4">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Listing summary</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0">
                        <img src={form.imageUrl || DEFAULT_IMAGES[form.category] || DEFAULT_IMAGES.other} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm">{form.name || "Your Tool"}</p>
                        <p className="text-xs text-muted-foreground capitalize">{form.category.replace("-", " ")} · {form.location}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="font-black text-orange-500">₹{form.pricePerDay || "—"}</p>
                        <p className="text-xs text-muted-foreground">/day</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Footer nav */}
          <div className="px-6 md:px-8 pb-6 flex items-center justify-between border-t border-border pt-5">
            <Button variant="ghost" onClick={step === 0 ? () => setLocation("/dashboard/owner") : back} className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4 mr-1" />{step === 0 ? "Cancel" : "Back"}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={next} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 px-6">
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={submit} disabled={createTool.isPending} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 px-8">
                {createTool.isPending ? "Publishing..." : "Publish Listing 🚀"}
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Your listing will be reviewed and go live within minutes. Every rental is insured.
        </p>
      </div>
    </PageTransition>
  );
}
