import React, { useState } from "react";
import { useLogs, useSettings } from "@/lib/storage";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { Link } from "wouter";
import { Plus, Flame, Clock, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function CircularProgress({ value, color, label, unit, current }: { value: number, color: string, label: string, unit: string, current: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/10"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold tabular-nums leading-none">{current}</span>
          <span className="text-[10px] opacity-70">{unit}</span>
        </div>
      </div>
      <p className="text-[10px] text-white/70 uppercase tracking-[0.2em] font-black">{label}</p>
    </div>
  );
}

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
  const deficit = settings.calorieGoal - totals.calories;
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
            className="text-primary hover:bg-primary/10"
            onClick={() => setSelectedDate(new Date())}
            disabled={isToday}
          >
            Today
          </Button>
        </div>

        <div className="flex justify-between items-center bg-card border rounded-2xl p-2 shadow-sm overflow-x-auto no-scrollbar border-primary/5">
          {calendarDays.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isCurrentDay = isSameDay(date, new Date());
            
            return (
              <button
                key={date.toString()}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center justify-center min-w-[3rem] py-2 rounded-xl transition-all duration-200 ${
                  isSelected 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                    : "hover:bg-secondary text-muted-foreground"
                }`}
              >
                <span className={`text-[10px] uppercase font-bold mb-1 ${isSelected ? 'text-white/80' : ''}`}>{format(date, "EEE")}</span>
                <span className="text-lg font-bold">{format(date, "d")}</span>
                {isCurrentDay && !isSelected && <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1" />}
              </button>
            );
          })}
        </div>
      </div>

      <Card className="p-8 bg-gradient-to-br from-primary to-emerald-600 text-white border-none shadow-2xl rounded-[2.5rem] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center py-4 space-y-8">
          <div className="flex flex-col items-center">
            <span className="text-6xl font-bold tracking-tighter tabular-nums drop-shadow-sm">{remainingCalories}</span>
            <span className="text-primary-foreground/80 font-semibold uppercase tracking-widest text-xs mt-1">kcal remaining</span>
            <div className="mt-3 px-4 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
              <span className="text-xs font-bold text-white/90">Deficit: {deficit > 0 ? `+${deficit}` : deficit} kcal</span>
            </div>
          </div>

          <div className="w-full space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-primary-foreground/90 px-1 uppercase tracking-widest">
                <span>{totals.calories} eaten</span>
                <span>{settings.calorieGoal} goal</span>
              </div>
              <div className="[&>div>div]:bg-white shadow-inner rounded-full overflow-hidden">
                <Progress value={progress} className="h-3 bg-black/20 border-none" />
              </div>
            </div>

            {/* Macros Grid */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              <CircularProgress 
                label="Protein" 
                current={totals.protein} 
                unit="g" 
                value={(totals.protein / settings.proteinGoal) * 100} 
                color="#ef4444" // Red
              />
              <CircularProgress 
                label="Carbs" 
                current={totals.carbs} 
                unit="g" 
                value={(totals.carbs / settings.carbsGoal) * 100} 
                color="#eab308" // Yellow
              />
              <CircularProgress 
                label="Fat" 
                current={totals.fat} 
                unit="g" 
                value={(totals.fat / settings.fatGoal) * 100} 
                color="#39ff14" // Neon Green
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/log">
          <span className="bg-card border-none shadow-xl rounded-3xl p-6 flex flex-col items-center justify-center gap-3 h-36 hover:bg-primary/5 transition-all group relative overflow-hidden cursor-pointer">
            <div className="absolute top-0 left-0 w-1 bg-primary h-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
              <Plus className="w-8 h-8 stroke-[3]" />
            </div>
            <span className="font-bold text-foreground tracking-tight">Log Food</span>
          </span>
        </Link>
        <div className="bg-card border-none shadow-xl rounded-3xl p-6 flex flex-col items-center justify-center gap-3 h-36 opacity-75 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full opacity-50"></div>
          <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
            <Flame className="w-8 h-8 stroke-[3]" />
          </div>
          <span className="font-bold text-foreground tracking-tight">Burn Cals</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black flex items-center gap-2 text-foreground/80 tracking-tight uppercase text-xs">
            <Clock className="w-4 h-4 text-primary" />
            Recent Log History
          </h3>
          <span className="text-[10px] bg-secondary px-3 py-1 rounded-full font-black text-muted-foreground uppercase tracking-widest border border-primary/5">{dayLogs.length} entries</span>
        </div>

        <div className="space-y-4">
          {dayLogs.length === 0 ? (
            <div className="text-center py-10 bg-secondary/20 rounded-[2rem] border-2 border-dashed border-primary/10">
              <p className="text-muted-foreground font-medium">No meals logged yet.</p>
            </div>
          ) : (
            dayLogs.slice().reverse().map((log) => (
              <div key={log.id} className="group flex items-center justify-between p-5 bg-card border-none shadow-xl rounded-[1.5rem] hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-2xl shadow-inner border border-white">{getMealEmoji(log.meal)}</div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground tracking-tight">{log.name}</h4>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em] mt-0.5">
                      {log.calories} kcal • P: {log.protein}g C: {log.carbs}g F: {log.fat}g
                    </p>
                  </div>
                </div>
                <button onClick={() => removeLog(log.id)} className="text-muted-foreground/30 hover:text-destructive p-3 opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 rounded-xl">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
