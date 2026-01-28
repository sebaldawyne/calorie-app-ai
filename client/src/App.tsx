import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import LogFood from "@/pages/LogFood";
import Stats from "@/pages/Stats";
import Settings from "@/pages/Settings";
import Onboarding from "@/pages/Onboarding";
import Login from "@/pages/Login";
import { useSettings } from "@/lib/storage";

function Router() {
  const { settings } = useSettings();

  // Protect routes
  if (!settings.isLoggedIn && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/onboarding')) {
    return <Redirect to="/login" />;
  }

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/">
        <Layout>
          <Dashboard />
        </Layout>
      </Route>
      <Route path="/log">
        <Layout>
          <LogFood />
        </Layout>
      </Route>
      <Route path="/stats">
        <Layout>
          <Stats />
        </Layout>
      </Route>
      <Route path="/settings">
        <Layout>
          <Settings />
        </Layout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
