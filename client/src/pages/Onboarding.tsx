import { useState } from "react";
import { useSettings } from "@/lib/storage";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Utensils, ArrowRight } from "lucide-react";

export default function Onboarding() {
  const { updateSettings } = useSettings();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [calorieGoal, setCalorieGoal] = useState("2000");

  const handleFinish = () => {
    updateSettings({
      name,
      calorieGoal: parseInt(calorieGoal) || 2000,
      isOnboarded: true,
      isLoggedIn: true // Auto-login for mockup
    });
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 rotate-3">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome to CalorieSnap</h1>
          <p className="text-muted-foreground">Let's get your profile set up in just a few seconds.</p>
        </div>

        <Card className="p-8 shadow-2xl border-none bg-white/50 backdrop-blur-xl">
          {step === 1 ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg">What should we call you?</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-lg"
                  autoFocus
                />
              </div>
              <Button 
                onClick={() => setStep(2)} 
                disabled={!name} 
                className="w-full h-12 text-lg group"
              >
                Next Step <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="goal" className="text-lg">What's your daily calorie goal?</Label>
                <div className="relative">
                  <Input
                    id="goal"
                    type="number"
                    value={calorieGoal}
                    onChange={(e) => setCalorieGoal(e.target.value)}
                    className="h-12 text-lg pl-10"
                  />
                  <div className="absolute left-3 top-3 font-bold text-muted-foreground">⚡</div>
                </div>
                <p className="text-sm text-muted-foreground pt-2">Don't worry, you can change this later.</p>
              </div>
              <Button 
                onClick={handleFinish} 
                className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
              >
                Get Started
              </Button>
            </div>
          )}
        </Card>

        <div className="flex justify-center gap-2">
          <div className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step === 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step === 2 ? 'bg-primary' : 'bg-muted'}`} />
        </div>
      </div>
    </div>
  );
}
