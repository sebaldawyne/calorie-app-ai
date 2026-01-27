import { useState } from "react";
import { useLogs, useSettings } from "@/lib/storage";
import { format, addDays, subDays, startOfWeek, isSameDay } from "date-fns";
import { Link } from "wouter";
import { Plus, Flame, Clock, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const { logs, removeLog, getLogsByDate } = useLogs();
  const { settings } = useSettings();
  
  // Date State
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Generate calendar days (current week)
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday start
  const calendarDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const todaysLogs = getLogsByDate(selectedDateStr);
  
  const totalCalories = todaysLogs.reduce((acc, log) => acc + log.calories, 0);
  const remainingCalories = settings.calorieGoal - totalCalories;
  const progress = Math.min((totalCalories / settings.calorieGoal) * 100, 100);

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
      {/* Header with Calendar */}
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
          <div className="text-right">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:bg-primary/10 hover:text-primary"
              onClick={() => setSelectedDate(new Date())}
              disabled={isToday}
            >
              Today
            </Button>
          </div>
        </div>

        {/* Horizontal Calendar */}
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
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                } ${isCurrentDay && !isSelected ? "text-primary font-semibold" : ""}`}
              >
                <span className="text-[10px] uppercase font-medium tracking-wide mb-1">
                  {format(date, "EEE")}
                </span>
                <span className={`text-lg font-bold ${isSelected ? "text-white" : ""}`}>
                  {format(date, "d")}
                </span>
                {isCurrentDay && (
                  <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? "bg-white" : "bg-primary"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Stats Card */}
      <Card className="p-6 bg-gradient-to-br from-primary to-emerald-600 text-white border-none shadow-xl rounded-3xl overflow-hidden relative transition-all duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center py-4 space-y-4">
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold tracking-tighter tabular-nums animate-in fade-in zoom-in duration-300">
              {remainingCalories}
            </span>
            <span className="text-primary-foreground/80 font-medium">calories remaining</span>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm font-medium text-primary-foreground/90 px-1">
              <span>{totalCalories} eaten</span>
              <span>{settings.calorieGoal} goal</span>
            </div>
            {/* Styled progress bar with child selector for the indicator since component doesn't expose it */}
            <div className="[&>div>div]:bg-white">
              <Progress value={progress} className="h-3 bg-black/20" />
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions (Only show if today is selected, or let users log for past days) */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/log">
          <a className="bg-card hover:bg-secondary/50 border border-border/50 shadow-sm rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 group h-32">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 stroke-[3]" />
            </div>
            <span className="font-semibold text-foreground">Log Food</span>
          </a>
        </Link>
        <div className="bg-card border border-border/50 shadow-sm rounded-2xl p-4 flex flex-col items-center justify-center gap-2 h-32 opacity-75 cursor-not-allowed">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Flame className="w-6 h-6 stroke-[3]" />
          </div>
          <span className="font-semibold text-foreground">Burn Cals</span>
          <span className="text-xs text-muted-foreground">(Coming Soon)</span>
        </div>
      </div>

      {/* Daily Logs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            {isToday ? "Today's Meals" : `${format(selectedDate, "EEEE")}'s Meals`}
          </h3>
          <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full font-medium">
            {todaysLogs.length} entries
          </span>
        </div>

        {todaysLogs.length === 0 ? (
          <div className="text-center py-12 bg-secondary/30 rounded-3xl border-2 border-dashed border-border">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-muted-foreground font-medium">No meals logged for this day.</p>
            {isToday && (
              <Link href="/log">
                <Button variant="link" className="text-primary mt-2">Log your first meal</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {todaysLogs.slice().reverse().map((log) => (
              <div 
                key={log.id} 
                className="group flex items-center justify-between p-4 bg-card hover:bg-secondary/40 border border-border/50 shadow-sm rounded-2xl transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl shadow-inner">
                    {getMealEmoji(log.meal)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{log.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize">{log.meal} • {format(log.timestamp, 'h:mm a')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold tabular-nums text-foreground">{log.calories} kcal</span>
                  <button 
                    onClick={() => removeLog(log.id)}
                    className="text-muted-foreground hover:text-destructive p-2 hover:bg-destructive/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
