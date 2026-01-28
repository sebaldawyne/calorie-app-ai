import { useState, useRef } from "react";
import { useLogs, useCustomFoods } from "@/lib/storage";
import { COMMON_FOODS } from "@/lib/mock-data";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { Search, Plus, ArrowRight, Camera, Upload, Loader2, AlertCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LogFood() {
  const [activeTab, setActiveTab] = useState("scan");
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [search, setSearch] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedImage, setAnalyzedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{name: string, calories: number, protein: number, carbs: number, fat: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [foodName, setFoodName] = useState("");
  const [foodCalories, setFoodCalories] = useState("");
  const [foodProtein, setFoodProtein] = useState("0");
  const [foodCarbs, setFoodCarbs] = useState("0");
  const [foodFat, setFoodFat] = useState("0");
  
  const { addLog } = useLogs();
  const { customFoods, addCustomFood } = useCustomFoods();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleQuickAdd = (food: any) => {
    saveLog(food.name, food.calories, food.protein, food.carbs, food.fat);
  };

  const saveLog = (name: string, calories: number, p: number, c: number, f: number) => {
    addLog({
      date: format(new Date(), 'yyyy-MM-dd'),
      name,
      calories,
      protein: p,
      carbs: c,
      fat: f,
      meal: selectedMeal,
    });
    toast({ title: "Logged!", description: `Added ${name}.` });
    setLocation("/");
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !foodCalories) return;
    saveLog(foodName, parseInt(foodCalories), parseInt(foodProtein), parseInt(foodCarbs), parseInt(foodFat));
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const res = { name: "Avocado Toast", calories: 350, protein: 12, carbs: 32, fat: 22 };
      setScanResult(res);
      setFoodName(res.name);
      setFoodCalories(res.calories.toString());
      setFoodProtein(res.protein.toString());
      setFoodCarbs(res.carbs.toString());
      setFoodFat(res.fat.toString());
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-3xl font-bold">Log Food</h1>
      
      <div className="bg-card border rounded-2xl p-4 shadow-sm">
        <Label className="mb-2 block">Meal Time</Label>
        <Select value={selectedMeal} onValueChange={(v: any) => setSelectedMeal(v)}>
          <SelectTrigger className="w-full h-12 text-lg"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">🍳 Breakfast</SelectItem>
            <SelectItem value="lunch">🥗 Lunch</SelectItem>
            <SelectItem value="dinner">🍽️ Dinner</SelectItem>
            <SelectItem value="snack">🍎 Snack</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="scan" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 h-12 mb-6">
          <TabsTrigger value="scan">Scan Meal</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-6 animate-in slide-in-from-left-4 duration-300">
          {!analyzedImage ? (
            <Button onClick={() => fileInputRef.current?.click()} className="h-48 w-full border-dashed flex flex-col gap-4" variant="outline">
              <Camera className="w-10 h-10" />
              <span className="text-xl font-bold">Take Photo</span>
              <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAnalyzedImage(URL.createObjectURL(file));
                  analyzeImage();
                }
              }} />
            </Button>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-3xl overflow-hidden aspect-video border">
                <img src={analyzedImage} className="w-full h-full object-cover" />
                {isAnalyzing && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white"><Loader2 className="animate-spin" /> Analyzing...</div>}
              </div>
              {!isAnalyzing && scanResult && (
                <Card className="p-6 space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Food Name</Label>
                      <Input value={foodName} onChange={e => setFoodName(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Calories</Label><Input type="number" value={foodCalories} onChange={e => setFoodCalories(e.target.value)} /></div>
                      <div className="space-y-2"><Label>Protein (g)</Label><Input type="number" value={foodProtein} onChange={e => setFoodProtein(e.target.value)} /></div>
                      <div className="space-y-2"><Label>Carbs (g)</Label><Input type="number" value={foodCarbs} onChange={e => setFoodCarbs(e.target.value)} /></div>
                      <div className="space-y-2"><Label>Fat (g)</Label><Input type="number" value={foodFat} onChange={e => setFoodFat(e.target.value)} /></div>
                    </div>
                    <Button onClick={handleManualSubmit} className="w-full h-12">Save Log</Button>
                  </div>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="search" className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <Input placeholder="Search food..." value={search} onChange={e => setSearch(e.target.value)} className="h-12 text-lg" />
          <div className="space-y-2">
            {[...COMMON_FOODS, ...customFoods].filter(f => f.name.toLowerCase().includes(search.toLowerCase())).map(food => (
              <button key={food.id} onClick={() => handleQuickAdd(food)} className="w-full flex justify-between p-4 bg-card border rounded-xl hover:bg-secondary">
                <div><div className="font-semibold">{food.name}</div><div className="text-xs text-muted-foreground">P: {food.protein}g C: {food.carbs}g F: {food.fat}g</div></div>
                <div className="font-bold text-primary">{food.calories} kcal</div>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
