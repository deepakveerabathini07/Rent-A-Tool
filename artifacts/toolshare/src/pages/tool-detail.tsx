import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { format, addDays } from "date-fns";
import { PageTransition } from "@/components/layout/page-transition";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  useGetTool, 
  useCreateBooking, 
  getGetToolQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  MapPin, Star, CalendarIcon, ShieldCheck, Wrench, ChevronLeft, CheckCircle2 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ToolDetail() {
  const [, params] = useRoute("/tools/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dateRange, setDateRange] = useState<{from: Date, to: Date | undefined}>({
    from: new Date(),
    to: addDays(new Date(), 2)
  });
  const [message, setMessage] = useState("");

  const { data: tool, isLoading } = useGetTool(id, {
    query: {
      enabled: !!id,
      queryKey: getGetToolQueryKey(id)
    }
  });

  const createBooking = useCreateBooking();

  const days = dateRange.from && dateRange.to 
    ? Math.max(1, Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  const totalCost = tool ? days * tool.pricePerDay : 0;
  const serviceFee = totalCost * 0.15; // 15% service fee
  const finalTotal = totalCost + serviceFee;

  const handleBooking = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to rent this tool.",
        action: <Button onClick={() => setLocation("/login")} size="sm">Login</Button>
      });
      return;
    }

    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Select Dates",
        description: "Please select a valid date range.",
        variant: "destructive"
      });
      return;
    }

    createBooking.mutate(
      {
        data: {
          toolId: id,
          userId: user.id,
          startDate: format(dateRange.from, "yyyy-MM-dd"),
          endDate: format(dateRange.to, "yyyy-MM-dd"),
          message: message || undefined
        }
      },
      {
        onSuccess: () => {
          toast({
            title: "Booking Requested!",
            description: "The owner will review your request shortly.",
          });
          setLocation("/dashboard/renter");
        },
        onError: () => {
          toast({
            title: "Booking Failed",
            description: "There was an error creating your booking. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <PageTransition className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Skeleton className="h-6 w-24 mb-4" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-video w-full rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!tool) {
    return (
      <PageTransition className="pt-32 pb-20 flex flex-col items-center text-center">
        <Wrench className="w-16 h-16 text-gray-300 mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tool Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md">The tool you are looking for might have been removed or is no longer available.</p>
        <Button onClick={() => setLocation("/tools")}>Browse Other Tools</Button>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button 
          variant="ghost" 
          className="mb-6 -ml-4 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Search
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              className="relative aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={tool.imageUrl || `https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=1200&q=80`} 
                alt={tool.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="secondary" className="bg-white/90 text-gray-900 backdrop-blur-sm border-none shadow-sm capitalize">
                  {tool.category.replace("-", " ")}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                {tool.available ? (
                  <Badge className="bg-green-500/90 text-white backdrop-blur-sm border-none shadow-sm shadow-green-900/20">
                    Available Now
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-900/80 text-white backdrop-blur-sm border-none shadow-sm shadow-black/20">
                    Currently Rented
                  </Badge>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                  {tool.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {tool.rating ? tool.rating.toFixed(1) : "New"}
                    </span>
                    {tool.reviewCount > 0 && <span className="text-gray-500">({tool.reviewCount} reviews)</span>}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300" />
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {tool.location}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300" />
                  <div>Listed {format(new Date(tool.createdAt), "MMM d, yyyy")}</div>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  {tool.description}
                </p>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-800" />

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl uppercase shrink-0">
                  {tool.ownerName ? tool.ownerName.charAt(0) : "O"}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    Hosted by {tool.ownerName}
                  </h3>
                  <p className="text-gray-500">Typical response time: under 1 hour</p>
                </div>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-800" />

              <div>
                <h3 className="text-xl font-bold mb-4">ToolShare Protection</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex gap-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <ShieldCheck className="w-6 h-6 text-green-500 shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Damage Protection</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">Rent with peace of mind. Your rental is covered for accidental damage.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Verified Condition</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">Tools are verified by the community to ensure they work as expected.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              className="sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-6 flex items-end gap-1">
                    <span className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                      ${tool.pricePerDay}
                    </span>
                    <span className="text-gray-500 pb-1">/ day</span>
                    
                    {tool.pricePerHour && (
                      <span className="text-sm text-gray-400 ml-2 pb-1">
                        or ${tool.pricePerHour}/hr
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div>
                              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Dates</div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "Add dates"} 
                                {" - "} 
                                {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "Add dates"}
                              </div>
                            </div>
                            <CalendarIcon className="w-5 h-5 text-gray-400" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange.from}
                            selected={{ from: dateRange.from, to: dateRange.to }}
                            onSelect={(range) => {
                              if (range?.from) {
                                setDateRange({ from: range.from, to: range.to });
                              }
                            }}
                            numberOfMonths={1}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        Message to owner (optional)
                      </label>
                      <Textarea 
                        placeholder="Hi! I'm doing a weekend project and would love to rent your tool."
                        className="resize-none rounded-xl"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>

                    {user?.id === tool.ownerId ? (
                      <Button disabled className="w-full py-6 rounded-xl text-base font-semibold">
                        This is your tool
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleBooking} 
                        disabled={createBooking.isPending || !tool.available}
                        className="w-full py-6 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform"
                      >
                        {createBooking.isPending ? "Requesting..." : 
                         !tool.available ? "Currently Unavailable" : "Request to Rent"}
                      </Button>
                    )}
                  </div>

                  {dateRange.from && dateRange.to && tool.available && user?.id !== tool.ownerId && (
                    <motion.div 
                      className="mt-6 space-y-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>${tool.pricePerDay} × {days} {days === 1 ? 'day' : 'days'}</span>
                        <span>${totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>ToolShare service fee</span>
                        <span>${serviceFee.toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />
                      <div className="flex justify-between font-bold text-gray-900 dark:text-white text-lg">
                        <span>Total</span>
                        <span>${finalTotal.toFixed(2)}</span>
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
