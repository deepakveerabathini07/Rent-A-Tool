import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench, Check } from "lucide-react";

export default function Signup() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [role, setRole] = useState<"renter" | "owner">("renter");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "renter") { login(3, "New User", "renter"); setLocation("/home"); }
    else { login(1, "New Owner", "owner"); setLocation("/home"); }
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center py-20 px-4 bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-orange-500/8 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-amber-500/6 blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} className="w-full max-w-xl relative z-10">

        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/25">
              <Wrench className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">ToolHub</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-foreground mb-1">Create an account</h1>
            <p className="text-muted-foreground text-sm">Join the community and start sharing tools today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">First name</Label>
                <Input placeholder="John" required className="h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Last name</Label>
                <Input placeholder="Doe" required className="h-11 rounded-xl" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Email</Label>
              <Input type="email" placeholder="name@example.com" required className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Password</Label>
              <Input type="password" required className="h-11 rounded-xl" />
            </div>

            <div className="space-y-3">
              <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">What brings you here?</Label>
              <div className="grid grid-cols-2 gap-3">
                {(["renter", "owner"] as const).map((r) => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                      role === r
                        ? "border-orange-500/50 bg-orange-500/10 text-orange-500"
                        : "border-border bg-muted/40 text-muted-foreground hover:border-orange-500/30 hover:bg-muted"
                    }`}>
                    {role === r && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                    <span className="font-bold text-sm mb-0.5">{r === "renter" ? "I want to rent" : "I want to list"}</span>
                    <span className="text-xs opacity-60 text-center">{r === "renter" ? "Find tools for my projects" : "Earn money from my tools"}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit"
              className="w-full h-12 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 border-0">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-orange-500 hover:text-orange-600">Log in</Link>
          </p>
        </div>
      </motion.div>
    </PageTransition>
  );
}
