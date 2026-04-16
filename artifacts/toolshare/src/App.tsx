import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/home";
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
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
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
