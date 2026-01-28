import { useState } from "react";
import { useLogs, useSettings } from "@/lib/storage";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { Link } from "wouter";
import { Plus, Flame, Clock, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const { logs, removeLog, getLogsByDate } = useLogs();
  const { settings } = useSettings();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const calendarDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayLogs = getLogsByDate(selectedDateStr);
  
  const totals = dayLogs.reduce((acc, log) => ({
    calories: acc.calories + log.calories,
    protein: acc.protein + (log.protein || 0),
    carbs: acc.carbs + (log.carbs || 0),
    fat: acc.fat + (log.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const remainingCalories = settings.calorieGoal - totals.calories;
  const progress = Math.min((totals.calories / settings.calorieGoal) * 100, 100);

  const getMealEmoji = (meal: string) => {
    switch (meal) {
      case 'breakfast': return '🍳';
      case 'lunch': return '🥗';
      case 'dinner': return '🍽️';
      case 'snack': return '🍎';
      default: return '🍴';
    }
  };

  const isToday = isSameDay(selectedDate, new Date());

  return (
    <div className="space-y-6 pb-20">
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-muted-foreground text-sm font-medium mb-1 uppercase tracking-wider">
              {isToday ? "Today's Summary" : format(selectedDate, "MMMM d, yyyy")}
            </h2>
            <h1 className="text-3xl font-bold text-foreground">
              Hello, {settings.name}
            </h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary"
            onClick={() => setSelectedDate(new Date())}
            disabled={isToday}
          >
            Today
          </Button>
        </div>

        <div className="flex justify-between items-center bg-card border rounded-2xl p-2 shadow-sm overflow-x-auto no-scrollbar">
          {calendarDays.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isCurrentDay = isSameDay(date, new Date());
            
            return (
              <button
                key={date.toString()}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center justify-center min-w-[3rem] py-2 rounded-xl transition-all duration-200 ${
                  isSelected 
                    ? "bg-primary text-primary-foreground shadow-md scale-105" 
                    : "hover:bg-secondary text-muted-foreground"
                }`}
              >
                <span className="text-[10px] uppercase font-medium mb-1">{format(date, "EEE")}</span>
                <span className="text-lg font-bold">{format(date, "d")}</span>
                {isCurrentDay && !isSelected && <div className="w-1 h-1 bg-primary rounded-full mt-1" />}
              </button>
            );
          })}
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary to-emerald-600 text-white border-none shadow-xl rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="relative z-10 flex flex-col items-center justify-center py-4 space-y-6">
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold tracking-tighter tabular-nums">{remainingCalories}</span>
            <span className="text-primary-foreground/80 font-medium">calories remaining</span>
          </div>

          <div className="w-full space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-primary-foreground/90 px-1">
                <span>{totals.calories} eaten</span>
                <span>{settings.calorieGoal} goal</span>
              </div>
              <div className="[&>div>div]:bg-white">
                <Progress value={progress} className="h-2 bg-black/20" />
              </div>
            </div>

            {/* Macros Grid */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
              <div className="text-center">
                <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Protein</p>
                <p className="text-sm font-bold">{totals.protein}g</p>
                <Progress value={(totals.protein / settings.proteinGoal) * 100} className="h-1 mt-1 bg-black/20" />
              </div>
              <div className="text-center">
                <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Carbs</p>
                <p className="text-sm font-bold">{totals.carbs}g</p>
                <Progress value={(totals.carbs / settings.carbsGoal) * 100} className="h-1 mt-1 bg-black/20" />
              </div>
              <div className="text-center">
                <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Fat</p>
                <p className="text-sm font-bold">{totals.fat}g</p>
                <Progress value={(totals.fat / settings.fatGoal) * 100} className="h-1 mt-1 bg-black/20" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/log">
          <a className="bg-card border border-border/50 shadow-sm rounded-2xl p-4 flex flex-col items-center justify-center gap-2 h-32 hover:bg-secondary/50 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 stroke-[3]" />
            </div>
            <span className="font-semibold">Log Food</span>
          </a>
        </Link>
        <div className="bg-card border border-border/50 shadow-sm rounded-2xl p-4 flex flex-col items-center justify-center gap-2 h-32 opacity-75">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Flame className="w-6 h-6 stroke-[3]" />
          </div>
          <span className="font-semibold">Burn Cals</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Meals
          </h3>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full">{dayLogs.length} entries</span>
        </div>

        <div className="space-y-3">
          {dayLogs.slice().reverse().map((log) => (
            <div key={log.id} className="group flex items-center justify-between p-4 bg-card border border-border/50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">{getMealEmoji(log.meal)}</div>
                <div>
                  <h4 className="font-semibold">{log.name}</h4>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    {log.calories} kcal • P: {log.protein}g C: {log.carbs}g F: {log.fat}g
                  </p>
                </div>
              </div>
              <button onClick={() => removeLog(log.id)} className="text-muted-foreground hover:text-destructive p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
