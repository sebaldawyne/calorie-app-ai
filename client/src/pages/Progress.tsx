import { useLogs, useSettings } from "@/lib/storage";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from "recharts";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, Scale } from "lucide-react";

export default function Progress() {
  const { logs } = useLogs();
  const { settings } = useSettings();

  // Weekly range starting Monday
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 });
  const last7Days = eachDayOfInterval({
    start: start,
    end: addDays(start, 6)
  });

  const chartData = last7Days.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayLogs = logs.filter(log => log.date === dateStr);
    const totalCals = dayLogs.reduce((acc, log) => acc + log.calories, 0);
    
    return {
      day: format(date, 'EEE'),
      dateLabel: format(date, 'M/d'),
      fullDate: dateStr,
      calories: totalCals,
      isOver: totalCals > settings.calorieGoal
    };
  });

  const weeklyAvg = Math.round(chartData.reduce((acc, d) => acc + d.calories, 0) / 7);
  
  // Weekly insight logic
  const isGoalWeightLoss = settings.goalType === 'lose weight';
  const weightInsight = weeklyAvg < settings.calorieGoal 
    ? { text: "Likely losing weight", icon: TrendingDown, color: "text-primary" }
    : { text: "Likely gaining weight", icon: TrendingUp, color: "text-destructive" };

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
        <p className="text-muted-foreground font-medium">Weekly nutrient overview.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5 bg-card border-none shadow-xl rounded-3xl flex flex-col justify-between h-32">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Avg Intake</span>
          <div>
            <span className="text-3xl font-black">{weeklyAvg}</span>
            <span className="text-xs font-bold text-muted-foreground ml-1">kcal</span>
          </div>
        </Card>
        
        <Card className="p-5 bg-card border-none shadow-xl rounded-3xl flex flex-col justify-between h-32">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target</span>
          <div>
            <span className="text-3xl font-black">{settings.calorieGoal}</span>
            <span className="text-xs font-bold text-muted-foreground ml-1">kcal</span>
          </div>
        </Card>
      </div>

      <Card className="p-8 bg-card border-none shadow-2xl rounded-[2.5rem]">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 20 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text x={0} y={15} textAnchor="middle" fill="#888" className="text-[10px] font-black uppercase tracking-tighter">{payload.value}</text>
                    <text x={0} y={30} textAnchor="middle" fill="#bbb" className="text-[9px] font-bold">{chartData.find(d => d.day === payload.value)?.dateLabel}</text>
                  </g>
                )}
              />
              <YAxis hide axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.03)', radius: 12 }}
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              />
              <ReferenceLine y={settings.calorieGoal} stroke="hsl(var(--primary))" strokeDasharray="4 4" opacity={0.3} />
              <Bar dataKey="calories" radius={[10, 10, 10, 10]} barSize={28}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isOver ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} 
                    opacity={entry.calories === 0 ? 0.05 : 0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-8 bg-primary/5 border-none rounded-[2.5rem]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-black text-lg tracking-tight">Weekly Insight</h3>
            <div className={`flex items-center gap-1.5 font-bold ${weightInsight.color}`}>
              <weightInsight.icon className="w-4 h-4" />
              <span>{weightInsight.text}</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground font-medium leading-relaxed">
          Based on your average intake of {weeklyAvg} kcal and your profile settings, you are currently in a 
          {weeklyAvg < settings.calorieGoal ? " calorie deficit" : " calorie surplus"}. 
          {settings.goalType === 'lose weight' && weeklyAvg < settings.calorieGoal ? " Great job staying on track for your weight loss goal!" : ""}
        </p>
      </Card>
    </div>
  );
}

import { addDays } from "date-fns";
