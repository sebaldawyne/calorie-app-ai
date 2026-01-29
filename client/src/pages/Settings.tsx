import { useState } from "react";
import { useSettings, useLogs } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { Trash2, Save, User, Target, LogOut, Crown, Activity, Ruler } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

export default function Settings() {
  const { settings, updateSettings, logout } = useSettings();
  const { resetLogs } = useLogs();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [name, setName] = useState(settings.name);
  const [goal, setGoal] = useState(settings.calorieGoal.toString());
  const [weight, setWeight] = useState(settings.weight);
  const [goalType, setGoalType] = useState(settings.goalType);

  const handleSave = () => {
    updateSettings({
      name,
      calorieGoal: parseInt(goal) || 2000,
      weight,
      goalType: goalType as any
    });
    toast({ title: "Settings Saved", description: "Profile updated successfully." });
  };

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
          <LogOut className="w-6 h-6" />
        </Button>
      </div>

      {!settings.isPro && (
        <Card className="p-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white border-none rounded-3xl shadow-xl shadow-orange-200">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-black text-xl flex items-center gap-2 uppercase tracking-tighter">
                <Crown className="w-5 h-5" />
                Unlock Pro
              </h3>
              <p className="text-white/80 text-sm font-bold">Get advanced AI analysis and detailed insights.</p>
            </div>
            <Button onClick={() => setLocation("/paywall")} className="bg-white text-orange-500 hover:bg-white/90 font-black rounded-xl">UPGRADE</Button>
          </div>
        </Card>
      )}

      <Card className="p-8 space-y-8 bg-card border-none shadow-2xl rounded-[2.5rem]">
        <div className="space-y-6">
          <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <User className="w-4 h-4" /> Personal Info
          </h3>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} className="h-12 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input value={weight} onChange={e => setWeight(e.target.value)} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Goal Type</Label>
                <Select value={goalType} onValueChange={setGoalType as any}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose weight">Lose Weight</SelectItem>
                    <SelectItem value="maintain">Maintain</SelectItem>
                    <SelectItem value="gain weight">Gain Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-secondary">
          <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Target className="w-4 h-4" /> Goals
          </h3>
          <div className="space-y-2">
            <Label>Daily Calorie Target</Label>
            <Input type="number" value={goal} onChange={e => setGoal(e.target.value)} className="h-12 text-xl font-bold rounded-xl" />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20">
          <Save className="w-5 h-5 mr-2" /> Save Profile
        </Button>
      </Card>

      <Card className="p-8 border-none bg-destructive/5 rounded-[2.5rem]">
        <h3 className="text-lg font-black text-destructive mb-2 flex items-center gap-2">
          <Trash2 className="w-5 h-5" /> Danger Zone
        </h3>
        <p className="text-sm text-muted-foreground font-medium mb-6 leading-relaxed">Permanently delete your entire logging history. This cannot be undone.</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full h-12 font-bold rounded-2xl">Reset All Data</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-[2rem]">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>This will wipe all your meal logs forever.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={resetLogs} className="bg-destructive hover:bg-destructive/90 rounded-xl">Yes, delete everything</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
}
