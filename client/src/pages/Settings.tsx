import { useState } from "react";
import { useSettings, useLogs } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Trash2, LogOut, Crown, User, Bell, ChevronRight, Shield, Database, Trash
} from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const { settings, logout } = useSettings();
  const { resetLogs } = useLogs();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [notifs, setNotifs] = useState(true);

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <div className="space-y-8 pb-24">
      <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>

      {/* Profile Navigation */}
      <Card 
        onClick={() => setLocation("/profile")}
        className="p-6 border-none bg-card shadow-xl rounded-3xl flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-black text-lg text-white">Profile Details</h3>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Personal Info, Targets, Body Specs</p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </Card>

      {!settings.isPro && (
        <Card className="p-6 bg-gradient-to-r from-amber-400 to-orange-600 text-white border-none rounded-3xl shadow-xl shadow-orange-500/10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-black text-xl flex items-center gap-2 uppercase tracking-tighter">
                <Crown className="w-5 h-5" />
                Go Pro
              </h3>
              <p className="text-white/80 text-sm font-bold">Unlock everything for your fitness journey.</p>
            </div>
            <Button onClick={() => setLocation("/paywall")} className="bg-white text-orange-600 hover:bg-white/90 font-black rounded-xl">UPGRADE</Button>
          </div>
        </Card>
      )}

      {/* App Settings */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-2">Preferences</h3>
        <Card className="divide-y divide-white/5 border-none bg-card shadow-xl rounded-3xl overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Bell className="w-5 h-5" />
              </div>
              <span className="font-bold text-white">Smart Notifications</span>
            </div>
            <Switch checked={notifs} onCheckedChange={setNotifs} />
          </div>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-bold text-white">Privacy Lock</span>
            </div>
            <Switch />
          </div>
        </Card>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-2 text-destructive">Danger Zone</h3>
        <Card className="divide-y divide-white/5 border-none bg-destructive/5 shadow-xl rounded-3xl overflow-hidden">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full p-6 flex items-center justify-between hover:bg-destructive/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive">
                    <Database className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-white">Wipe All Data</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[2rem]">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This will permanently delete your diary and profile data.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetLogs} className="bg-destructive hover:bg-destructive/90 rounded-xl">Yes, wipe it</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <button 
            onClick={handleLogout}
            className="w-full p-6 flex items-center justify-between hover:bg-destructive/5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-bold text-white">Sign Out</span>
            </div>
          </button>
        </Card>
      </div>

      <div className="text-center text-xs text-white/20 pt-8 uppercase font-black tracking-widest">
        CalorieSnap v1.1.0 • Built for Fitness
      </div>
    </div>
  );
}
