import { useState, useRef } from "react";
import { useSettings } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  User, Target, Ruler, Camera, Save, ArrowLeft, 
  Settings as SettingsIcon, LogOut, ChevronRight, Weight
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useLogs } from "@/lib/storage";
import { format } from "date-fns";

export default function Profile() {
  const { settings, updateSettings } = useSettings();
  const { getLogsByDate } = useLogs();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(settings.name);
  const [goal, setGoal] = useState(settings.calorieGoal.toString());
  const [weight, setWeight] = useState(settings.weight);
  const [height, setHeight] = useState(settings.height);
  const [age, setAge] = useState(settings.age);
  const [gender, setGender] = useState(settings.gender);
  const [goalType, setGoalType] = useState(settings.goalType);

  const today = format(new Date(), 'yyyy-MM-dd');
  const dayLogs = getLogsByDate(today);
  const totals = dayLogs.reduce((acc, log) => ({
    calories: acc.calories + log.calories,
    protein: acc.protein + (log.protein || 0),
    carbs: acc.carbs + (log.carbs || 0),
    fat: acc.fat + (log.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const handleSave = () => {
    updateSettings({
      name,
      calorieGoal: parseInt(goal) || 2000,
      weight,
      height,
      age,
      gender,
      goalType: goalType as any
    });
    toast({ title: "Profile Updated", description: "Your details have been saved." });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateSettings({ profilePhoto: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/settings")} className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-white">Profile</h1>
      </div>

      {/* Profile Photo Section */}
      <div className="flex flex-col items-center space-y-4 pt-4">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[2.5rem] bg-card border-4 border-primary/20 overflow-hidden shadow-2xl relative">
            {settings.profilePhoto ? (
              <img src={settings.profilePhoto} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20">
                <User className="w-16 h-16" />
              </div>
            )}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handlePhotoChange} 
          />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-white">{settings.name || "User"}</h2>
          <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">{settings.goalType}</p>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Personal Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <User className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em]">Personal Info</h3>
          </div>
          <Card className="p-8 space-y-6 bg-card border-none shadow-2xl rounded-[2.5rem]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Display Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} className="h-12 bg-background border-none rounded-xl text-white font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="h-12 bg-background border-none rounded-xl text-white font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Age</Label>
                  <Input type="number" value={age} onChange={e => setAge(e.target.value)} className="h-12 bg-background border-none rounded-xl text-white font-bold" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Targets */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <Target className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em]">Daily Targets</h3>
          </div>
          <Card className="p-8 space-y-6 bg-card border-none shadow-2xl rounded-[2.5rem]">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Calories</p>
                <p className="text-2xl font-black text-white">{totals.calories}</p>
                <p className="text-[9px] text-primary font-bold">Goal: {settings.calorieGoal}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Protein</p>
                <p className="text-2xl font-black text-white">{totals.protein}g</p>
                <p className="text-[9px] text-primary font-bold">Goal: {settings.proteinGoal}g</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Carbs</p>
                <p className="text-2xl font-black text-white">{totals.carbs}g</p>
                <p className="text-[9px] text-primary font-bold">Goal: {settings.carbsGoal}g</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Fats</p>
                <p className="text-2xl font-black text-white">{totals.fat}g</p>
                <p className="text-[9px] text-primary font-bold">Goal: {settings.fatGoal}g</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Body Measurements */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <Ruler className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em]">Body Measurements</h3>
          </div>
          <Card className="p-8 space-y-6 bg-card border-none shadow-2xl rounded-[2.5rem]">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Height (cm)</Label>
                <Input type="number" value={height} onChange={e => setHeight(e.target.value)} className="h-12 bg-background border-none rounded-xl text-white font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Weight (kg)</Label>
                <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="h-12 bg-background border-none rounded-xl text-white font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Weight Goal</Label>
              <Select value={goalType} onValueChange={setGoalType as any}>
                <SelectTrigger className="h-12 bg-background border-none rounded-xl text-white font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose weight">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain</SelectItem>
                  <SelectItem value="gain weight">Gain Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        <Button onClick={handleSave} className="w-full h-16 text-lg font-black rounded-2xl shadow-xl shadow-primary/20">
          <Save className="w-5 h-5 mr-2" /> Save Profile
        </Button>
      </div>
    </div>
  );
}
