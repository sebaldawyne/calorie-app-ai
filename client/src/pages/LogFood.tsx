import { useState } from "react";
import { useLogs, useCustomFoods, useSettings } from "@/lib/storage";
import { COMMON_FOODS } from "@/lib/mock-data";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { Search, Plus, ArrowRight, Utensils } from "lucide-react";
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
import { Card } from "@/components/ui/card"; // Added import

export default function LogFood() {
  const [search, setSearch] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [activeTab, setActiveTab] = useState("search");
  
  // Custom Food Form State
  const [customName, setCustomName] = useState("");
  const [customCals, setCustomCals] = useState("");
  
  const { addLog } = useLogs();
  const { customFoods, addCustomFood } = useCustomFoods();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const allFoods = [...COMMON_FOODS, ...customFoods];
  
  const filteredFoods = allFoods.filter(food => 
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuickAdd = (food: typeof allFoods[0]) => {
    addLog({
      date: format(new Date(), 'yyyy-MM-dd'),
      name: food.name,
      calories: food.calories,
      meal: selectedMeal,
      foodId: food.id
    });
    
    toast({
      title: "Food Logged!",
      description: `Added ${food.name} (${food.calories} kcal) to ${selectedMeal}.`,
      duration: 2000,
    });
    
    setLocation("/");
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customCals) return;
    
    const calories = parseInt(customCals);
    
    // Add to custom foods so it's searchable later
    addCustomFood({
      name: customName,
      calories: calories,
      protein: 0, carbs: 0, fat: 0, // Simplified for now
      servingSize: '1 serving'
    });

    // Log it immediately
    addLog({
      date: format(new Date(), 'yyyy-MM-dd'),
      name: customName,
      calories: calories,
      meal: selectedMeal,
    });

    toast({
      title: "Custom Food Added",
      description: `Added ${customName} to your log and saved list.`,
    });
    
    setLocation("/");
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Log Food</h1>
        <p className="text-muted-foreground">Add a meal to your daily tracking.</p>
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

      <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 mb-6">
          <TabsTrigger value="search" className="text-base">Search Food</TabsTrigger>
          <TabsTrigger value="custom" className="text-base">Quick Add</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4 animate-in slide-in-from-left-4 duration-300">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search (e.g., 'Apple', 'Pizza')..." 
              className="pl-10 h-12 text-lg rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
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
              <div className="text-center py-10 text-muted-foreground">
                <p>No foods found matching "{search}"</p>
                <Button variant="link" onClick={() => setActiveTab("custom")}>
                  Create custom entry instead
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="animate-in slide-in-from-right-4 duration-300">
          <Card className="p-6 border-dashed border-2 shadow-none bg-secondary/20">
            <form onSubmit={handleCustomSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Food Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Grandma's Lasagna" 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <div className="relative">
                  <Input 
                    id="calories" 
                    type="number" 
                    placeholder="0" 
                    value={customCals}
                    onChange={(e) => setCustomCals(e.target.value)}
                    className="pl-10 bg-background"
                  />
                  <div className="absolute left-3 top-2.5 font-bold text-muted-foreground">⚡</div>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-lg" disabled={!customName || !customCals}>
                Add to Log <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
