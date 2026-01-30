import { useLogs, useSettings } from "@/lib/storage";
import { format, addDays, startOfWeek, eachDayOfInterval } from "date-fns";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Scale, Target } from "lucide-react";
import React from "react";

export default function Progress() {
  const { logs } = useLogs();
  const { settings } = useSettings();

  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 });
  const last7Days = eachDayOfInterval({
    start: start,
    end: addDays(start, 6)
  });

  // Mock weight data based on goal
  const chartData = last7Days.map((date, idx) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayLogs = logs.filter(log => log.date === dateStr);
    const totalCals = dayLogs.reduce((acc, log) => acc + log.calories, 0);
    
    // Simulate slight weight fluctuation
    const baseWeight = parseFloat(settings.weight) || 70;
    const diff = (totalCals - settings.calorieGoal) / 7700; // rough calorie to weight math
    const weight = baseWeight + (diff * (idx + 1)) + (Math.random() * 0.2 - 0.1);

    return {
      day: format(date, 'EEE'),
      dateLabel: format(date, 'M/d'),
      calories: totalCals,
      weight: parseFloat(weight.toFixed(1)),
      isOver: totalCals > settings.calorieGoal
    };
  });

  const weeklyAvg = Math.round(chartData.reduce((acc, d) => acc + d.calories, 0) / 7);
  const startWeight = chartData[0].weight;
  const endWeight = chartData[chartData.length - 1].weight;
  const weightDiff = parseFloat((endWeight - startWeight).toFixed(1));

  const weightInsight = weightDiff <= 0 
    ? { text: `Lost ${Math.abs(weightDiff)} kg this week`, icon: TrendingDown, color: "text-primary" }
    : { text: `Gained ${weightDiff} kg this week`, icon: TrendingUp, color: "text-destructive" };

  return (
    <div className="space-y-8 pb-24">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Progress</h1>
        <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">Body Weight Analysis</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5 bg-card border-none shadow-xl rounded-3xl flex flex-col justify-between h-32">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Starting Weight</span>
          <div>
            <span className="text-3xl font-black text-white">{startWeight}</span>
            <span className="text-xs font-bold text-muted-foreground ml-1">kg</span>
          </div>
        </Card>
        
        <Card className="p-5 bg-card border-none shadow-xl rounded-3xl flex flex-col justify-between h-32">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Weight</span>
          <div>
            <span className="text-3xl font-black text-primary">{endWeight}</span>
            <span className="text-xs font-bold text-muted-foreground ml-1">kg</span>
          </div>
        </Card>
      </div>

      <Card className="p-8 bg-card border-none shadow-2xl rounded-[2.5rem]">
        <div className="mb-6">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" /> Weight Chart (kg)
          </h3>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text x={0} y={20} textAnchor="middle" fill="#888" className="text-[10px] font-black uppercase tracking-tighter">{payload.value}</text>
                    <text x={0} y={35} textAnchor="middle" fill="#555" className="text-[9px] font-bold">{chartData.find(d => d.day === payload.value)?.dateLabel}</text>
                  </g>
                )}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#555', fontSize: 10, fontWeight: 'bold' }} 
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '20px', 
                  border: 'none', 
                  backgroundColor: 'hsl(160, 25%, 15%)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  color: '#fff'
                }}
                itemStyle={{ color: 'hsl(160, 84%, 45%)', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="hsl(160, 84%, 45%)" 
                strokeWidth={4} 
                dot={{ fill: 'hsl(160, 84%, 45%)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8, stroke: 'white', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-8 bg-primary/10 border-none rounded-[2.5rem] border border-primary/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-black text-xl text-white tracking-tight">Weekly Report</h3>
            <div className={`flex items-center gap-1.5 font-black text-sm uppercase tracking-wider ${weightInsight.color}`}>
              <weightInsight.icon className="w-4 h-4" />
              <span>{weightInsight.text}</span>
            </div>
          </div>
        </div>
        <p className="mt-5 text-sm text-white/60 font-medium leading-relaxed">
          Your calorie intake averaged <span className="text-white font-bold">{weeklyAvg} kcal</span>. 
          {weightDiff <= 0 
            ? " You're successfully maintaining a deficit, leading to weight reduction. Keep it up!" 
            : " Your intake is slightly above your target, resulting in minor weight gain. Adjust your portions to stay on track."}
        </p>
      </Card>
    </div>
  );
}
