import { Link } from "wouter";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench } from "lucide-react";

export default function Login() {
  const { login } = useAuth();

  const handleLoginAsRenter = () => { login(3, "Alice (Renter)", "renter"); window.location.href = "/home"; };
  const handleLoginAsOwner  = () => { login(1, "Bob (Owner)", "owner");   window.location.href = "/home"; };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center py-20 px-4 bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-orange-500/8 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-amber-500/6 blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">

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
            <h1 className="text-2xl font-black text-foreground mb-1">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your ToolHub account</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Email</Label>
              <Input type="email" defaultValue="demo@example.com" className="h-11 rounded-xl focus:ring-orange-500/50" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Password</Label>
                <a href="#" className="text-xs text-orange-500 hover:text-orange-600">Forgot password?</a>
              </div>
              <Input type="password" defaultValue="password123" className="h-11 rounded-xl focus:ring-orange-500/50" />
            </div>
            <Button onClick={handleLoginAsRenter}
              className="w-full h-12 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 border-0">
              Sign In
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground font-semibold tracking-wider">Or use demo accounts</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={handleLoginAsRenter}
              className="flex flex-col items-center gap-1 p-4 rounded-xl border border-border bg-muted/40 hover:bg-muted hover:border-orange-500/30 transition-all">
              <span className="font-bold text-foreground text-sm">Renter</span>
              <span className="text-xs text-muted-foreground">Find tools</span>
            </button>
            <button onClick={handleLoginAsOwner}
              className="flex flex-col items-center gap-1 p-4 rounded-xl border border-orange-500/30 bg-orange-500/8 hover:bg-orange-500/15 hover:border-orange-500/50 transition-all">
              <span className="font-bold text-orange-500 text-sm">Owner</span>
              <span className="text-xs text-orange-500/60">List tools</span>
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-orange-500 hover:text-orange-600">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </PageTransition>
  );
}
