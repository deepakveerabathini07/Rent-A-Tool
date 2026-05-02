import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { PageTransition } from "@/components/layout/page-transition";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  useListBookings, 
  Booking, 
  BookingStatus 
} from "@workspace/api-client-react";
import { 
  Calendar, CheckCircle2, Clock, MapPin, 
  Package, Search, ShieldCheck, UserCircle, XCircle 
} from "lucide-react";
import { formatINR } from "@/lib/currency";

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

export default function RenterDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("all");

  // Redirect if not logged in or not a renter
  if (!user || user.role !== "renter") {
    if (user && user.role === "owner") {
      setLocation("/dashboard/owner");
      return null;
    }
    return (
      <PageTransition className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center">
        <UserCircle className="w-16 h-16 text-gray-300 mb-6" />
        <h1 className="text-2xl font-bold mb-4">Renter Access Required</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          You must be logged in as a renter to view this dashboard.
        </p>
        <Button onClick={() => setLocation("/login")}>Go to Login</Button>
      </PageTransition>
    );
  }

  const { data: bookings, isLoading } = useListBookings({
    userId: user.id
  });

  const filteredBookings = Array.isArray(bookings) ? bookings.filter(booking => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return booking.status === "approved" || booking.status === "pending";
    if (activeTab === "past") return booking.status === "completed" || booking.status === "rejected";
    return true;
  }) : [];

  return (
    <PageTransition className="pt-24 pb-20 min-h-screen bg-[#0a0a0f]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
              My Rentals
            </h1>
            <p className="text-gray-500 text-lg">
              Manage your tool bookings and rental history.
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0">
            <Link href="/tools">Browse More Tools</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-white/10 bg-[#111118] shadow-sm overflow-hidden">
              <div className="h-24 bg-gradient-to-br from-orange-500/40 to-amber-500/20" />
              <CardContent className="pt-0 relative px-6 pb-6">
                <div className="w-20 h-20 bg-[#0a0a0f] border-4 border-[#0a0a0f] rounded-full flex items-center justify-center -mt-10 mx-auto mb-4 shadow-sm overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-orange-400 uppercase">{user.name.charAt(0)}</span>
                  )}
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
                  <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/8 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Member since</span>
                    <span className="font-medium text-white">
                      {user.createdAt ? format(new Date(user.createdAt), "MMM yyyy") : "Oct 2023"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total rentals</span>
                    <span className="font-medium text-white">
                      {Array.isArray(bookings) ? bookings.length : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Identity</span>
                    <span className="font-medium text-green-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-500/15 bg-orange-500/5 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-400" />
                  Have tools to share?
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Switch to an owner account to start earning money from your unused tools.
                </p>
                <Button variant="outline" className="w-full border-white/15 bg-white/5 text-gray-400" disabled>
                  Become an Owner
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList className="bg-[#111118] border border-white/10">
                  <TabsTrigger value="all" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">All</TabsTrigger>
                  <TabsTrigger value="active" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">Active & Pending</TabsTrigger>
                  <TabsTrigger value="past" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">Past</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="m-0 border-none p-0 outline-none">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <Card key={i} className="border-white/10 bg-[#111118]">
                        <CardContent className="p-6 flex gap-6">
                          <Skeleton className="w-24 h-24 rounded-lg shrink-0 bg-white/10" />
                          <div className="space-y-3 flex-grow">
                            <div className="flex justify-between">
                              <Skeleton className="h-6 w-1/3 bg-white/10" />
                              <Skeleton className="h-6 w-20 bg-white/10" />
                            </div>
                            <Skeleton className="h-4 w-1/2 bg-white/10" />
                            <Skeleton className="h-4 w-1/4 bg-white/10" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredBookings.length > 0 ? (
                  <motion.div 
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                  >
                    <AnimatePresence>
                      {filteredBookings.map((booking) => (
                        <motion.div
                          key={booking.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="border-white/10 bg-[#111118] shadow-sm hover:border-orange-500/20 transition-all overflow-hidden group">
                            <CardContent className="p-0 sm:flex">
                              <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 relative bg-white/5">
                                <img 
                                  src={booking.toolImageUrl || `https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&q=80`} 
                                  alt={booking.toolName}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                              <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-start mb-2 gap-4">
                                    <h3 className="font-bold text-lg text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
                                      <Link href={`/tools/${booking.toolId}`}>{booking.toolName}</Link>
                                    </h3>
                                    {getStatusBadge(booking.status)}
                                  </div>
                                  
                                  <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-500 gap-2">
                                      <Calendar className="w-4 h-4" />
                                      {format(new Date(booking.startDate), "MMM d, yyyy")} - {format(new Date(booking.endDate), "MMM d, yyyy")}
                                      <span className="text-xs font-medium bg-white/10 px-2 py-0.5 rounded text-gray-400">
                                        {booking.totalDays} {booking.totalDays === 1 ? 'day' : 'days'}
                                      </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 gap-2">
                                      <UserCircle className="w-4 h-4" />
                                      Owner: <span className="font-medium text-gray-300">{booking.ownerName}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-white/8 mt-auto">
                                  <div className="text-lg font-bold text-orange-400">
                                    {formatINR(booking.totalPrice)}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild className="border-white/15 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white">
                                      <Link href={`/tools/${booking.toolId}`}>View Tool</Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20 bg-[#111118] rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center"
                  >
                    <div className="bg-white/5 p-4 rounded-full mb-4">
                      <Search className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No rentals found</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      {activeTab === "all" 
                        ? "You haven't rented any tools yet. Start exploring tools in your neighborhood." 
                        : `You have no ${activeTab} rentals matching this criteria.`}
                    </p>
                    <Button asChild className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0">
                      <Link href="/tools">Browse Tools</Link>
                    </Button>
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
