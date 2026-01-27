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
import { Trash2, Save, User, Target } from "lucide-react";

export default function Settings() {
  const { settings, updateSettings } = useSettings();
  const { resetLogs } = useLogs();
  const { toast } = useToast();

  const [name, setName] = useState(settings.name);
  const [goal, setGoal] = useState(settings.calorieGoal.toString());

  const handleSave = () => {
    updateSettings({
      name,
      calorieGoal: parseInt(goal) || 2000
    });
    
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  const handleReset = () => {
    resetLogs();
    toast({
      title: "Data Reset",
      description: "All your history has been cleared.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and data.</p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              Goals
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="goal">Daily Calorie Target</Label>
              <div className="flex gap-2">
                <Input 
                  id="goal" 
                  type="number" 
                  value={goal} 
                  onChange={(e) => setGoal(e.target.value)} 
                />
                <div className="flex items-center text-sm font-medium text-muted-foreground px-2">
                  kcal
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended: 2000 for women, 2500 for men (average).
              </p>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full h-12 text-lg mt-4">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </Card>

        <Card className="p-6 border-destructive/20 bg-destructive/5">
          <h3 className="text-lg font-semibold text-destructive mb-2 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            This action cannot be undone. This will permanently delete your logging history from this device.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Reset All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your food logs. Your settings will be preserved.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, delete everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      </div>

      <div className="text-center text-xs text-muted-foreground pt-8">
        <p>CalorieSnap v1.0</p>
        <p>Data stored locally on your device.</p>
      </div>
    </div>
  );
}
