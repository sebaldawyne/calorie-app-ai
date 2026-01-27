import { useState, useRef } from "react";
import { useLogs, useCustomFoods } from "@/lib/storage";
import { COMMON_FOODS } from "@/lib/mock-data";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { Search, Plus, ArrowRight, Camera, Upload, ScanLine, Loader2, AlertCircle, X } from "lucide-react";
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
  
  // Search State
  const [search, setSearch] = useState("");
  
  // Scan/Upload State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedImage, setAnalyzedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{name: string, calories: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State (for manual or post-scan editing)
  const [foodName, setFoodName] = useState("");
  const [foodCalories, setFoodCalories] = useState("");
  
  const { addLog } = useLogs();
  const { customFoods, addCustomFood } = useCustomFoods();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const allFoods = [...COMMON_FOODS, ...customFoods];
  const filteredFoods = allFoods.filter(food => 
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuickAdd = (food: typeof allFoods[0]) => {
    saveLog(food.name, food.calories, food.id);
  };

  const saveLog = (name: string, calories: number, foodId?: string) => {
    addLog({
      date: format(new Date(), 'yyyy-MM-dd'),
      name: name,
      calories: calories,
      meal: selectedMeal,
      foodId: foodId
    });
    
    toast({
      title: "Food Logged!",
      description: `Added ${name} (${calories} kcal) to ${selectedMeal}.`,
      duration: 2000,
    });
    
    setLocation("/");
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !foodCalories) return;
    
    const calories = parseInt(foodCalories);
    
    // If it's a new custom food (not from scan), add to custom foods
    if (!scanResult) {
      addCustomFood({
        name: foodName,
        calories: calories,
        protein: 0, carbs: 0, fat: 0, 
        servingSize: '1 serving'
      });
    }

    saveLog(foodName, calories);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAnalyzedImage(e.target?.result as string);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    setScanResult(null);
    
    // Mock analysis - simulate network request
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Mock result
      const mockResults = [
        { name: "Avocado Toast", calories: 350 },
        { name: "Grilled Chicken Salad", calories: 420 },
        { name: "Pasta Carbonara", calories: 650 },
        { name: "Berry Smoothie Bowl", calories: 280 },
      ];
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      setScanResult(randomResult);
      setFoodName(randomResult.name);
      setFoodCalories(randomResult.calories.toString());
      
      toast({
        title: "Analysis Complete",
        description: "We've estimated the calories. Please verify.",
      });
    }, 2500);
  };

  const resetScan = () => {
    setAnalyzedImage(null);
    setScanResult(null);
    setFoodName("");
    setFoodCalories("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Log Food</h1>
        <p className="text-muted-foreground">Snap a photo or search to track.</p>
      </div>

      <div className="bg-card border rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="space-y-2">
          <Label>Meal Time</Label>
          <Select value={selectedMeal} onValueChange={(v: any) => setSelectedMeal(v)}>
            <SelectTrigger className="w-full h-12 text-lg">
              <SelectValue placeholder="Select meal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">🍳 Breakfast</SelectItem>
              <SelectItem value="lunch">🥗 Lunch</SelectItem>
              <SelectItem value="dinner">🍽️ Dinner</SelectItem>
              <SelectItem value="snack">🍎 Snack</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="scan" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 mb-6">
          <TabsTrigger value="scan" className="text-base">Scan Meal</TabsTrigger>
          <TabsTrigger value="search" className="text-base">Search / Type</TabsTrigger>
        </TabsList>

        {/* SCAN TAB */}
        <TabsContent value="scan" className="space-y-6 animate-in slide-in-from-left-4 duration-300">
          {!analyzedImage ? (
            <div className="grid gap-4">
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
              
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="h-48 w-full rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 flex flex-col gap-4 text-primary shadow-sm hover:shadow-md transition-all"
                variant="outline"
              >
                <div className="p-4 bg-primary/20 rounded-full">
                  <Camera className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div className="space-y-1 text-center">
                  <span className="text-xl font-bold block">Take Photo</span>
                  <span className="text-sm opacity-80">Scan your meal instantly</span>
                </div>
              </Button>

              <div className="text-center text-muted-foreground text-sm font-medium my-2">- OR -</div>

              <Button 
                variant="secondary" 
                className="h-14 w-full text-lg font-medium"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-5 h-5 mr-2" /> Upload from Gallery
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border bg-black/5 aspect-video md:aspect-[4/3] group">
                <img src={analyzedImage} alt="Analyzed food" className="w-full h-full object-cover" />
                
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute top-2 right-2 rounded-full opacity-80 hover:opacity-100"
                  onClick={resetScan}
                >
                  <X className="w-5 h-5" />
                </Button>

                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <h3 className="text-xl font-bold">Analyzing your meal...</h3>
                    <p className="text-white/80 text-sm mt-2">Identifying food and estimating calories</p>
                  </div>
                )}
                
                {!isAnalyzing && scanResult && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12 text-white">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/80 uppercase tracking-wider mb-1">Identified</p>
                        <h3 className="text-2xl font-bold">{scanResult.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-bold block">{scanResult.calories}</span>
                        <span className="text-sm text-white/80">kcal (est)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!isAnalyzing && scanResult && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  <Alert variant="default" className="bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Estimation Only</AlertTitle>
                    <AlertDescription>
                      This is an AI estimate. Please verify portion size and ingredients.
                    </AlertDescription>
                  </Alert>

                  <Card className="p-6">
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Food Name</Label>
                        <Input 
                          value={foodName} 
                          onChange={(e) => setFoodName(e.target.value)} 
                          className="font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Calories</Label>
                        <div className="relative">
                          <Input 
                            type="number" 
                            value={foodCalories} 
                            onChange={(e) => setFoodCalories(e.target.value)} 
                            className="pl-10 font-medium"
                          />
                          <div className="absolute left-3 top-2.5 font-bold text-muted-foreground">⚡</div>
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-12 text-lg">
                        Confirm & Log Entry <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  </Card>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* SEARCH / MANUAL TAB */}
        <TabsContent value="search" className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search food database..." 
              className="pl-10 h-12 text-lg rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            {filteredFoods.map((food) => (
              <button
                key={food.id}
                onClick={() => handleQuickAdd(food)}
                className="w-full flex items-center justify-between p-4 bg-card hover:bg-secondary/50 border border-border/40 rounded-xl transition-all duration-200 group text-left"
              >
                <div>
                  <div className="font-semibold">{food.name}</div>
                  <div className="text-sm text-muted-foreground">{food.servingSize}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary">{food.calories} kcal</span>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-5 h-5" />
                  </div>
                </div>
              </button>
            ))}
            
            {filteredFoods.length === 0 && (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No results for "{search}"</p>
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Add Manually</h3>
                  <Card className="p-6 border-dashed border-2 shadow-none bg-secondary/20">
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                      <div className="space-y-2 text-left">
                        <Label>Food Name</Label>
                        <Input 
                          placeholder="e.g. Grandma's Lasagna" 
                          value={foodName}
                          onChange={(e) => setFoodName(e.target.value)}
                          className="bg-background"
                        />
                      </div>
                      
                      <div className="space-y-2 text-left">
                        <Label>Calories</Label>
                        <div className="relative">
                          <Input 
                            type="number" 
                            placeholder="0" 
                            value={foodCalories}
                            onChange={(e) => setFoodCalories(e.target.value)}
                            className="pl-10 bg-background"
                          />
                          <div className="absolute left-3 top-2.5 font-bold text-muted-foreground">⚡</div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full h-12 text-lg" disabled={!foodName || !foodCalories}>
                        Add to Log <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
