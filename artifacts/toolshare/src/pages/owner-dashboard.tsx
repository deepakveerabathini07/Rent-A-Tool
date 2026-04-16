import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { PageTransition } from "@/components/layout/page-transition";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  useListBookings, 
  useGetOwnerStats,
  useUpdateBookingStatus,
  useListTools,
  BookingStatus 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, CheckCircle2, Clock, DollarSign, 
  Package, Search, Star, TrendingUp, UserCircle, Wrench, XCircle 
} from "lucide-react";

const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Pending
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3" /> Approved
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3" /> Completed
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 flex items-center gap-1.5">
          <XCircle className="w-3 h-3" /> Rejected
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("requests");

  // Redirect if not logged in or not an owner
  if (!user || user.role !== "owner") {
    if (user && user.role === "renter") {
      setLocation("/dashboard/renter");
      return null;
    }
    return (
      <PageTransition className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center">
        <UserCircle className="w-16 h-16 text-gray-300 mb-6" />
        <h1 className="text-2xl font-bold mb-4">Owner Access Required</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          You must be logged in as an owner to view this dashboard.
        </p>
        <Button onClick={() => setLocation("/login")}>Go to Login</Button>
      </PageTransition>
    );
  }

  const { data: stats, isLoading: statsLoading } = useGetOwnerStats(user.id, {
    query: {
      enabled: !!user.id,
      queryKey: ["/api/owner/stats", user.id]
    }
  });

  const { data: bookings, isLoading: bookingsLoading } = useListBookings({
    ownerId: user.id
  });

  const { data: allTools, isLoading: toolsLoading } = useListTools();
  
  const myTools = useMemo(() => {
    return allTools?.filter(t => t.ownerId === user.id) || [];
  }, [allTools, user.id]);

  const updateBooking = useUpdateBookingStatus();

  const handleUpdateStatus = (bookingId: number, status: "approved" | "rejected" | "completed") => {
    updateBooking.mutate(
      {
        id: bookingId,
        data: { status }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
          queryClient.invalidateQueries({ queryKey: ["/api/owner/stats", user.id] });
          toast({
            title: `Booking ${status}`,
            description: `The booking has been ${status} successfully.`,
          });
        },
        onError: () => {
          toast({
            title: "Error updating booking",
            description: "There was an error. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  const pendingRequests = bookings?.filter(b => b.status === "pending") || [];
  const activeRentals = bookings?.filter(b => b.status === "approved") || [];
  const pastBookings = bookings?.filter(b => b.status === "completed" || b.status === "rejected") || [];

  return (
    <PageTransition className="pt-24 pb-20 min-h-screen bg-gray-50/50 dark:bg-gray-900/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
              Owner Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Manage your tools, rental requests, and track earnings.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/tools">Browse Tools</Link>
            </Button>
            <Button asChild>
              <Link href="/add-tool">List a Tool</Link>
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { 
              title: "Total Earnings", 
              value: statsLoading ? null : `$${stats?.totalEarnings.toFixed(2) || "0.00"}`, 
              icon: <DollarSign className="w-5 h-5 text-green-500" />,
              desc: `+$${stats?.monthlyEarnings.toFixed(2) || "0.00"} this month`
            },
            { 
              title: "Active Rentals", 
              value: statsLoading ? null : stats?.activeRentals || 0, 
              icon: <Package className="w-5 h-5 text-blue-500" />,
              desc: "Currently rented out"
            },
            { 
              title: "Pending Requests", 
              value: statsLoading ? null : stats?.pendingRequests || 0, 
              icon: <Clock className="w-5 h-5 text-amber-500" />,
              desc: "Awaiting your approval"
            },
            { 
              title: "Total Tools", 
              value: statsLoading ? null : stats?.totalTools || 0, 
              icon: <Wrench className="w-5 h-5 text-primary" />,
              desc: `${stats?.averageRating ? stats.averageRating.toFixed(1) : "No"} avg rating`
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  {stat.value === null ? (
                    <Skeleton className="h-8 w-20 mb-1" />
                  ) : (
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{stat.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="requests" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <TabsTrigger value="requests" className="relative">
                    Requests
                    {pendingRequests.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="active">Active Rentals</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
              </div>

              {/* Requests Tab */}
              <TabsContent value="requests" className="m-0 border-none p-0 outline-none space-y-4">
                {bookingsLoading ? (
                  <div className="space-y-4">
                    {Array(2).fill(0).map((_, i) => (
                      <Card key={i} className="border-gray-200 dark:border-gray-800 shadow-sm">
                        <CardContent className="p-6">
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : pendingRequests.length > 0 ? (
                  <AnimatePresence>
                    {pendingRequests.map((booking) => (
                      <motion.div
                        key={booking.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="border-amber-200 dark:border-amber-900/50 shadow-sm overflow-hidden group bg-gradient-to-r from-amber-50/50 to-white dark:from-amber-900/10 dark:to-gray-900">
                          <CardContent className="p-0 sm:flex">
                            <div className="w-full sm:w-40 h-40 shrink-0 relative bg-gray-100 dark:bg-gray-800">
                              <img 
                                src={booking.toolImageUrl || `https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&q=80`} 
                                alt={booking.toolName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-5 flex-grow flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start mb-2 gap-4">
                                  <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                                    {booking.toolName}
                                  </h3>
                                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                                    ${booking.totalPrice.toFixed(2)}
                                  </div>
                                </div>
                                
                                <div className="space-y-2 mb-4">
                                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    {format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d, yyyy")}
                                    <span className="text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                      {booking.totalDays} days
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                                    <UserCircle className="w-4 h-4 text-primary" />
                                    Renter: <span className="font-medium text-gray-700 dark:text-gray-300">{booking.userName}</span>
                                  </div>
                                  {booking.message && (
                                    <div className="mt-3 p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 italic">
                                      "{booking.message}"
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-end gap-3 pt-2">
                                <Button 
                                  variant="outline" 
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                  onClick={() => handleUpdateStatus(booking.id, "rejected")}
                                  disabled={updateBooking.isPending}
                                >
                                  Decline
                                </Button>
                                <Button 
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleUpdateStatus(booking.id, "approved")}
                                  disabled={updateBooking.isPending}
                                >
                                  Approve Rental
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-full shadow-sm mb-4 inline-block">
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">All caught up!</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      You have no pending rental requests at the moment.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Active Rentals Tab */}
              <TabsContent value="active" className="m-0 border-none p-0 outline-none space-y-4">
                {activeRentals.length > 0 ? (
                  <AnimatePresence>
                    {activeRentals.map((booking) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                          <CardContent className="p-5 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                            <img 
                              src={booking.toolImageUrl || `https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=200&q=80`} 
                              alt={booking.toolName}
                              className="w-24 h-24 rounded-lg object-cover bg-gray-100 shrink-0"
                            />
                            <div className="flex-grow text-center sm:text-left">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                <div>
                                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                    {booking.toolName}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    Rented to <span className="font-medium text-gray-700 dark:text-gray-300">{booking.userName}</span>
                                  </p>
                                </div>
                                {getStatusBadge(booking.status)}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-2 mb-4">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d, yyyy")}
                              </div>
                              <div className="flex justify-center sm:justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUpdateStatus(booking.id, "completed")}
                                  disabled={updateBooking.isPending}
                                >
                                  Mark as Returned
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No active rentals</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      None of your tools are currently rented out.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="m-0 border-none p-0 outline-none space-y-4">
                {pastBookings.length > 0 ? (
                  <AnimatePresence>
                    {pastBookings.map((booking) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="border-gray-200 dark:border-gray-800 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                          <CardContent className="p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <img 
                                src={booking.toolImageUrl || `https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=100&q=80`} 
                                alt={booking.toolName}
                                className="w-12 h-12 rounded-md object-cover bg-gray-100 hidden sm:block"
                              />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">{booking.toolName}</h4>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(booking.startDate), "MMM d, yyyy")} • Rented to {booking.userName}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <div className="font-medium text-gray-900 dark:text-white">${booking.totalPrice.toFixed(2)}</div>
                              {getStatusBadge(booking.status)}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No rental history</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Your past rentals will appear here.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Tools List */}
          <div className="lg:col-span-1">
            <Card className="border-gray-200 dark:border-gray-800 shadow-sm sticky top-24">
              <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">My Tools</CardTitle>
                  <Badge variant="secondary">{myTools.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {toolsLoading ? (
                  <div className="p-4 space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="w-12 h-12 rounded-md" />
                        <div className="space-y-2 flex-grow">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : myTools.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[500px] overflow-y-auto">
                    {myTools.map(tool => (
                      <Link key={tool.id} href={`/tools/${tool.id}`} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                        <img 
                          src={tool.imageUrl || `https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=100&q=80`} 
                          alt={tool.name}
                          className="w-12 h-12 rounded-md object-cover bg-gray-100 shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{tool.name}</h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">${tool.pricePerDay}/day</span>
                            <span className="flex items-center text-xs text-amber-500">
                              <Star className="w-3 h-3 mr-0.5 fill-current" />
                              {tool.rating ? tool.rating.toFixed(1) : "New"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Wrench className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-4">You haven't listed any tools yet.</p>
                    <Button asChild size="sm" className="w-full">
                      <Link href="/add-tool">List a Tool</Link>
                    </Button>
                  </div>
                )}
                {myTools.length > 0 && (
                  <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/add-tool">List Another Tool</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
