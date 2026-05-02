import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { PageTransition } from "@/components/layout/page-transition";
import { ToolCard } from "@/components/tools/tool-card";
import { Button } from "@/components/ui/button";
import { useListFeaturedTools, useGetPlatformStats } from "@workspace/api-client-react";
import { Wrench, ShieldCheck, MapPin, Clock, ArrowRight, Zap, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function CountUp({ end, duration = 2 }: { end: number; duration?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <span ref={ref}>
      {isInView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration }}
        >
          {end.toLocaleString()}
        </motion.span>
      ) : (
        "0"
      )}
    </span>
  );
}

export default function Home() {
  const { data: featuredTools, isLoading: toolsLoading } = useListFeaturedTools();
  const { data: stats, isLoading: statsLoading } = useGetPlatformStats();

  return (
    <PageTransition className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 py-20 lg:py-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                The smart way to get things done
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Rent tools from your <span className="text-primary relative whitespace-nowrap">
                <span className="relative z-10">neighbors</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-secondary/30 -rotate-1 z-0"></span>
              </span> instead of buying
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Why buy a pressure washer you'll use once a year? ToolShare connects you with locals who have exactly what you need, when you need it.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button asChild size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                <Link href="/tools">Find a Tool</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 transition-transform">
                <Link href="/add-tool">List Your Tools</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">How ToolShare Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Simple, secure, and community-driven. Get the tools you need in three easy steps.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 -translate-y-1/2 z-0" />
            
            {[
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Find Tools Nearby",
                desc: "Search our marketplace for tools listed by people in your neighborhood."
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Book & Pick Up",
                desc: "Reserve dates, pay securely, and arrange a quick pickup with the owner."
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Use & Return",
                desc: "Get your project done and return the tool. Every rental is fully insured."
              }
            ].map((step, i) => (
              <motion.div 
                key={i}
                className="relative z-10 flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              >
                <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-xl border border-gray-100 dark:border-gray-800 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Featured Tools</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">Our most popular and highly-rated tools available to rent right now.</p>
            </div>
            <Button asChild variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 group">
              <Link href="/tools">
                View all tools 
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          {toolsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="p-4 space-y-3 flex-grow">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredTools && featuredTools.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              {featuredTools.slice(0, 4).map((tool, index) => (
                <ToolCard key={tool.id} tool={tool} index={index} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 text-gray-500">No featured tools available.</div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-primary/90" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: "Active Tools", value: stats?.totalTools || 0, suffix: "+" },
              { label: "Community Members", value: stats?.totalUsers || 0, suffix: "+" },
              { label: "Successful Rentals", value: stats?.totalBookings || 0, suffix: "" },
              { label: "Total Saved by Renters", value: (stats?.totalBookings || 0) * 45, prefix: "$" }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-extrabold mb-2 text-white">
                  {stat.prefix}<CountUp end={stat.value} />{stat.suffix}
                </div>
                <div className="text-primary-foreground/80 font-medium text-sm uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 md:p-16 border border-gray-200 dark:border-gray-800 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Ready to join the community?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                Whether you need a tool for a weekend project or want to earn money from the tools gathering dust in your garage, ToolShare is for you.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="h-14 px-8 rounded-full text-lg shadow-lg hover:scale-105 transition-transform">
                  <Link href="/signup">Sign Up for Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full text-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 transition-transform">
                  <Link href="/tools">Browse Tools First</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
