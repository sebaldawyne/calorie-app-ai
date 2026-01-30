import React, { useState } from "react";
import { useSettings } from "@/lib/storage";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Utensils, ArrowRight, Camera, BarChart2, CheckCircle2, 
  ChevronRight, ChevronLeft, User, Target, Activity, Ruler, Calendar as CalendarIcon, UserCircle
} from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

export default function Onboarding() {
  const { updateSettings } = useSettings();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  
  // User Data State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [goalType, setGoalType] = useState<'lose weight' | 'gain weight' | 'maintain'>("maintain");
  const [calorieGoal, setCalorieGoal] = useState("2000");

  const totalSteps = 10; // Guide + Info + Auth

  const handleFinish = () => {
    updateSettings({
      name,
      email,
      weight,
      height,
      age,
      gender,
      activityLevel,
      goalType,
      calorieGoal: parseInt(calorieGoal) || 2000,
      isOnboarded: true,
      isLoggedIn: true
    });
    setLocation("/");
  };

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const renderGuide = (title: string, desc: string, icon: any) => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          {icon}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{desc}</p>
      </div>
      <Button onClick={nextStep} className="w-full h-14 text-lg rounded-2xl">
        Continue
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center mb-4">
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-300 ${
                  step > i ? 'w-4 bg-primary' : 'w-2 bg-secondary'
                }`} 
              />
            ))}
          </div>
        </div>

        <Card className="p-8 shadow-2xl border-none bg-white/50 backdrop-blur-xl rounded-[2.5rem]">
          {step === 1 && renderGuide("Smart Food Scanning", "Just snap a photo of your meal. Our AI identifies the food and calculates calories instantly.", <Camera className="w-10 h-10" />)}
          {step === 2 && renderGuide("Track Your Progress", "Watch your macros and calories in real-time. Stay on track with beautiful visual charts.", <BarChart2 className="w-10 h-10" />)}
          {step === 3 && renderGuide("Achieve Your Goals", "Whether you want to lose, gain, or maintain weight, we provide the tools to get you there.", <CheckCircle2 className="w-10 h-10" />)}
          
          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label className="text-lg">Create Account</Label>
                <div className="space-y-4">
                  <Input placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="h-12" />
                  <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="h-12" />
                </div>
              </div>
              <Button onClick={nextStep} disabled={!email || !password} className="w-full h-14 text-lg rounded-2xl">Next</Button>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label className="text-lg flex items-center gap-2"><UserCircle className="w-5 h-5" /> What's your name?</Label>
                <Input placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} className="h-12 text-lg" />
              </div>
              <Button onClick={nextStep} disabled={!name} className="w-full h-14 text-lg rounded-2xl">Next</Button>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-lg flex items-center gap-2"><User className="w-5 h-5" /> Your Profile</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Age</Label>
                      <Input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Gender</Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className="h-12"><SelectValue placeholder="Gender" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={nextStep} disabled={!age || !gender} className="w-full h-14 text-lg rounded-2xl">Next</Button>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <Label className="text-lg flex items-center gap-2"><Ruler className="w-5 h-5" /> Body Specs</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Height (cm)</Label>
                    <Input type="number" placeholder="Height" value={height} onChange={e => setHeight(e.target.value)} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Weight (kg)</Label>
                    <Input type="number" placeholder="Weight" value={weight} onChange={e => setWeight(e.target.value)} className="h-12" />
                  </div>
                </div>
              </div>
              <Button onClick={nextStep} disabled={!height || !weight} className="w-full h-14 text-lg rounded-2xl">Next</Button>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label className="text-lg flex items-center gap-2"><Activity className="w-5 h-5" /> Activity Level</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger className="h-14 text-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (Little to no exercise)</SelectItem>
                    <SelectItem value="lightly active">Lightly active</SelectItem>
                    <SelectItem value="moderately active">Moderately active</SelectItem>
                    <SelectItem value="very active">Very active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={nextStep} className="w-full h-14 text-lg rounded-2xl">Next</Button>
            </div>
          )}

          {step === 9 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label className="text-lg flex items-center gap-2"><Target className="w-5 h-5" /> Your Primary Goal</Label>
                <Select value={goalType} onValueChange={(v: any) => setGoalType(v)}>
                  <SelectTrigger className="h-14 text-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose weight">Lose Weight</SelectItem>
                    <SelectItem value="maintain">Maintain Weight</SelectItem>
                    <SelectItem value="gain weight">Gain Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={nextStep} className="w-full h-14 text-lg rounded-2xl">Next</Button>
            </div>
          )}

          {step === 10 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label className="text-lg">Daily Calorie Goal</Label>
                <Input type="number" value={calorieGoal} onChange={e => setCalorieGoal(e.target.value)} className="h-14 text-2xl font-bold text-center" />
                <p className="text-xs text-center text-muted-foreground pt-2">Based on your info, we suggest {calorieGoal} kcal/day.</p>
              </div>
              <Button onClick={handleFinish} className="w-full h-14 text-lg rounded-2xl bg-primary shadow-lg shadow-primary/20">Finish Setup</Button>
            </div>
          )}

          {step > 1 && (
            <button onClick={prevStep} className="absolute left-4 top-4 p-2 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
        </Card>
      </div>
    </div>
  );
}
