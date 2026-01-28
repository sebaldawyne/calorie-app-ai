import { Link, useLocation } from "wouter";
import { Home, PlusCircle, BarChart2, Settings, Utensils } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 md:pl-64 transition-all duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 border-r bg-card/50 backdrop-blur-xl z-50">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Utensils className="w-6 h-6" />
            CalorieSnap
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavItem href="/" icon={Home} label="Dashboard" active={isActive("/")} />
          <NavItem href="/log" icon={PlusCircle} label="Log Food" active={isActive("/log")} />
          <NavItem href="/stats" icon={BarChart2} label="Statistics" active={isActive("/stats")} />
          <NavItem href="/settings" icon={Settings} label="Settings" active={isActive("/settings")} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4 md:p-8 pt-8 md:pt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          <MobileNavItem href="/" icon={Home} label="Home" active={isActive("/")} />
          <MobileNavItem href="/log" icon={PlusCircle} label="Log" active={isActive("/log")} />
          <MobileNavItem href="/stats" icon={BarChart2} label="Stats" active={isActive("/stats")} />
          <MobileNavItem href="/settings" icon={Settings} label="Settings" active={isActive("/settings")} />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link href={href}>
      <span className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
        active 
          ? "bg-primary/10 text-primary font-medium" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}>
        <Icon className={`w-5 h-5 ${active ? "stroke-[2.5px]" : "stroke-2"}`} />
        {label}
      </span>
    </Link>
  );
}

function MobileNavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link href={href}>
      <span className={`flex flex-col items-center justify-center w-full h-full space-y-1 cursor-pointer ${
        active ? "text-primary" : "text-muted-foreground"
      }`}>
        <div className={`p-1.5 rounded-full transition-all duration-300 ${active ? "bg-primary/10 -translate-y-1" : ""}`}>
          <Icon className={`w-6 h-6 ${active ? "stroke-[2.5px]" : "stroke-2"}`} />
        </div>
        <span className="text-[10px] font-medium">{label}</span>
      </span>
    </Link>
  );
}
