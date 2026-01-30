import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import LogFood from "@/pages/LogFood";
import Progress from "@/pages/Progress";
import Settings from "@/pages/Settings";
import Onboarding from "@/pages/Onboarding";
import Login from "@/pages/Login";
import Paywall from "@/pages/Paywall";
import Profile from "@/pages/Profile";
import FoodDiary from "@/pages/FoodDiary";
import { useSettings } from "@/lib/storage";

function Router() {
  const { settings } = useSettings();

  const isAuthPage = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/onboarding');

  // Protect routes
  if (!settings.isLoggedIn && !isAuthPage) {
    return <Redirect to="/login" />;
  }

  // Handle authenticated users on auth pages
  if (settings.isLoggedIn && isAuthPage) {
    return <Redirect to="/" />;
  }

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/paywall" component={Paywall} />
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
      <Route path="/diary">
        <Layout>
          <FoodDiary />
        </Layout>
      </Route>
      <Route path="/stats">
        <Layout>
          <Progress />
        </Layout>
      </Route>
      <Route path="/settings">
        <Layout>
          <Settings />
        </Layout>
      </Route>
      <Route path="/profile">
        <Layout>
          <Profile />
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
