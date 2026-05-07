import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import TargetCursor from "@/components/ui/TargetCursor";
import NotFound from "@/pages/not-found";

// Pages
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Browse from "@/pages/browse";
import ToolsPage from "@/pages/tools";
import ToolDetail from "@/pages/tool-detail";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import RenterDashboard from "@/pages/renter-dashboard";
import OwnerDashboard from "@/pages/owner-dashboard";
import AddTool from "@/pages/add-tool";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/browse" component={Browse} />
              <Route path="/tools" component={ToolsPage} />
              <Route path="/tools/:id" component={ToolDetail} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/dashboard/renter" component={RenterDashboard} />
              <Route path="/dashboard/owner" component={OwnerDashboard} />
              <Route path="/add-tool" component={AddTool} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AuthProvider>
          <CartProvider>
          <TooltipProvider>
            <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn hoverDuration={0.2} />
            <WouterRouter base="">
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
