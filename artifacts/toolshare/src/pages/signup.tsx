import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench, Check } from "lucide-react";

export default function Signup() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [role, setRole] = useState<"renter" | "owner">("renter");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "renter") {
      login(3, "New User", "renter");
      setLocation("/dashboard/renter");
    } else {
      login(1, "New Owner", "owner");
      setLocation("/dashboard/owner");
    }
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
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
          <CardHeader className="space-y-1 pb-6 text-center">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription className="text-gray-500">
              Join the community and start sharing tools today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
              </div>

              <div className="space-y-3">
                <Label>What brings you to ToolShare?</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`relative flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${
                      role === "renter" 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                    }`}
                    onClick={() => setRole("renter")}
                  >
                    {role === "renter" && (
                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                    <span className="font-semibold mb-1">I want to rent</span>
                    <span className="text-xs text-center opacity-70">Find tools for my projects</span>
                  </div>
                  
                  <div 
                    className={`relative flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${
                      role === "owner" 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                    }`}
                    onClick={() => setRole("owner")}
                  >
                    {role === "owner" && (
                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                    <span className="font-semibold mb-1">I want to list</span>
                    <span className="text-xs text-center opacity-70">Earn money from my tools</span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full text-base font-medium py-6">
                Create Account
              </Button>
            </form>
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </PageTransition>
  );
}
