import { useState, useRef } from "react";
import { useLogs, useCustomFoods } from "@/lib/storage";
import { COMMON_FOODS } from "@/lib/mock-data";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { Search, Plus, ArrowRight, Camera, Upload, Loader2, AlertCircle, X, Sparkles, Image as ImageIcon } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

export default function LogFood() {
  const [activeTab, setActiveTab] = useState("scan");
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [search, setSearch] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedImage, setAnalyzedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{
    name: string, 
    calories: number, 
    protein: number, 
    carbs: number, 
    fat: number,
    ingredients: string[]
  } | null>(null);
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
      const res = { 
        name: "Avocado Toast", 
        calories: 350, 
        protein: 12, 
        carbs: 32, 
        fat: 22,
        ingredients: ["Whole wheat bread", "Hass avocado", "Red pepper flakes", "Lemon juice", "Olive oil"]
      };
      setScanResult(res);
      setFoodName(res.name);
      setFoodCalories(res.calories.toString());
      setFoodProtein(res.protein.toString());
      setFoodCarbs(res.carbs.toString());
      setFoodFat(res.fat.toString());
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAnalyzedImage(URL.createObjectURL(file));
      analyzeImage();
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Log Food</h1>
        <Sparkles className="text-primary w-6 h-6" />
      </div>
      
      <div className="bg-card border rounded-2xl p-4 shadow-sm border-primary/10">
        <Label className="mb-2 block text-sm font-semibold text-muted-foreground uppercase tracking-wider">Meal Time</Label>
        <Select value={selectedMeal} onValueChange={(v: any) => setSelectedMeal(v)}>
          <SelectTrigger className="w-full h-12 text-lg border-none bg-secondary/50 focus:ring-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">🍳 Breakfast</SelectItem>
            <SelectItem value="lunch">🥗 Lunch</SelectItem>
            <SelectItem value="dinner">🍽️ Dinner</SelectItem>
            <SelectItem value="snack">🍎 Snack</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="scan" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 h-14 mb-8 bg-secondary/50 p-1 rounded-2xl">
          <TabsTrigger value="scan" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Scan Meal</TabsTrigger>
          <TabsTrigger value="search" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-6 animate-in slide-in-from-left-4 duration-300">
          {!analyzedImage ? (
            <div className="grid gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange} 
                accept="image/*"
              />
              <Button 
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.setAttribute("capture", "environment");
                    fileInputRef.current.click();
                  }
                }} 
                className="h-56 w-full border-dashed border-2 border-primary/20 flex flex-col gap-4 bg-primary/5 hover:bg-primary/10 rounded-3xl group transition-all" 
                variant="outline"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <span className="text-xl font-bold block text-foreground">Take Photo</span>
                  <p className="text-sm text-muted-foreground mt-1">AI-powered food recognition</p>
                </div>
              </Button>

              <Button 
                variant="secondary" 
                className="h-14 w-full text-lg rounded-2xl font-semibold border border-primary/5"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.removeAttribute("capture");
                    fileInputRef.current.click();
                  }
                }}
              >
                <ImageIcon className="w-5 h-5 mr-3" /> Upload from Gallery
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] border-4 border-white shadow-2xl">
                <img src={analyzedImage} className="w-full h-full object-cover" />
                <Button 
                  onClick={() => {
                    setAnalyzedImage(null);
                    setScanResult(null);
                  }} 
                  variant="secondary" 
                  size="icon" 
                  className="absolute top-4 right-4 rounded-full bg-white/80 backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
                </Button>
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
                    <h3 className="text-xl font-bold">Analyzing your meal...</h3>
                    <p className="text-white/70">Identifying ingredients and nutrients</p>
                  </div>
                )}
              </div>
              
              {!isAnalyzing && scanResult && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  <Card className="p-6 border-none shadow-xl bg-white/50 backdrop-blur-lg rounded-[2rem]">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Ingredients Detected</Label>
                        <div className="flex flex-wrap gap-2">
                          {scanResult.ingredients.map((ing, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-3 py-1 rounded-lg">
                              {ing}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Food Name</Label>
                          <Input value={foodName} onChange={e => setFoodName(e.target.value)} className="rounded-xl border-none bg-secondary/30 h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label>Calories</Label>
                          <Input type="number" value={foodCalories} onChange={e => setFoodCalories(e.target.value)} className="rounded-xl border-none bg-secondary/30 h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label>Protein (g)</Label>
                          <Input type="number" value={foodProtein} onChange={e => setFoodProtein(e.target.value)} className="rounded-xl border-none bg-secondary/30 h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label>Carbs (g)</Label>
                          <Input type="number" value={foodCarbs} onChange={e => setFoodCarbs(e.target.value)} className="rounded-xl border-none bg-secondary/30 h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label>Fat (g)</Label>
                          <Input type="number" value={foodFat} onChange={e => setFoodFat(e.target.value)} className="rounded-xl border-none bg-secondary/30 h-11" />
                        </div>
                      </div>
                      
                      <Button onClick={handleManualSubmit} className="w-full h-14 text-lg rounded-2xl shadow-lg shadow-primary/20">
                        Confirm & Log Entry
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="search" className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search food database..." value={search} onChange={e => setSearch(e.target.value)} className="h-14 pl-12 text-lg rounded-2xl border-none bg-secondary/50" />
          </div>
          <div className="space-y-3">
            {[...COMMON_FOODS, ...customFoods].filter(f => f.name.toLowerCase().includes(search.toLowerCase())).map(food => (
              <button key={food.id} onClick={() => handleQuickAdd(food)} className="w-full flex justify-between items-center p-5 bg-card border-none shadow-sm rounded-2xl hover:bg-secondary/50 transition-all group">
                <div className="text-left">
                  <div className="font-bold text-lg">{food.name}</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">P: {food.protein}g C: {food.carbs}g F: {food.fat}g</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-bold text-primary text-xl">{food.calories} <span className="text-xs text-muted-foreground font-normal">kcal</span></div>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-5 h-5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
