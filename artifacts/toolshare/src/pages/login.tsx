import { Link } from "wouter";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench } from "lucide-react";

export default function Login() {
  const { login } = useAuth();

  const handleLoginAsRenter = () => {
    login(3, "Alice (Renter)", "renter");
    window.location.href = "/dashboard/renter";
  };

  const handleLoginAsOwner = () => {
    login(1, "Bob (Owner)", "owner");
    window.location.href = "/dashboard/owner";
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
              <Wrench className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              ToolShare
            </span>
          </Link>
        </div>

        <Card className="border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Sign in to your ToolShare account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" defaultValue="demo@example.com" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input id="password" type="password" defaultValue="password123" />
              </div>
              <Button className="w-full text-base font-medium py-6" onClick={handleLoginAsRenter}>
                Sign In
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 font-medium">
                  Or use demo accounts
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={handleLoginAsRenter} className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 h-auto py-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-semibold text-gray-900 dark:text-white">Renter</span>
                  <span className="text-xs text-gray-500">Find tools</span>
                </div>
              </Button>
              <Button variant="outline" onClick={handleLoginAsOwner} className="bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/30 h-auto py-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-semibold text-primary">Owner</span>
                  <span className="text-xs text-primary/70">List tools</span>
                </div>
              </Button>
            </div>
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </PageTransition>
  );
}
