import { useLogs, useSettings } from "@/lib/storage";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from "recharts";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";

export default function Stats() {
  const { logs } = useLogs();
  const { settings } = useSettings();

  // Calculate last 7 days data
  const today = new Date();
  const last7Days = eachDayOfInterval({
    start: subDays(today, 6),
    end: today
  });

  const chartData = last7Days.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayLogs = logs.filter(log => log.date === dateStr);
    const totalCals = dayLogs.reduce((acc, log) => acc + log.calories, 0);
    
    return {
      day: format(date, 'EEE'), // Mon, Tue...
      fullDate: dateStr,
      calories: totalCals,
      isTargetMet: totalCals <= settings.calorieGoal && totalCals > 0,
      isOver: totalCals > settings.calorieGoal
    };
  });

  const weeklyAvg = Math.round(chartData.reduce((acc, d) => acc + d.calories, 0) / 7);
  const highestDay = [...chartData].sort((a, b) => b.calories - a.calories)[0];

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Statistics</h1>
        <p className="text-muted-foreground">Your weekly progress report.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 flex flex-col justify-between h-28 border-l-4 border-l-primary">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Weekly Avg</span>
          <div>
            <span className="text-2xl font-bold">{weeklyAvg}</span>
            <span className="text-xs text-muted-foreground ml-1">kcal</span>
          </div>
        </Card>
        
        <Card className="p-4 flex flex-col justify-between h-28 border-l-4 border-l-accent">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Daily Goal</span>
          <div>
            <span className="text-2xl font-bold">{settings.calorieGoal}</span>
            <span className="text-xs text-muted-foreground ml-1">kcal</span>
          </div>
        </Card>
      </div>

      <Card className="p-6 pt-8 bg-card/50 backdrop-blur-sm shadow-sm rounded-3xl">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                hide={false} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888', fontSize: 10 }}
                tickCount={5}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.05)', radius: 8 }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <ReferenceLine y={settings.calorieGoal} stroke="hsl(var(--primary))" strokeDasharray="3 3" opacity={0.5} />
              <Bar dataKey="calories" radius={[6, 6, 6, 6]} barSize={32}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isOver ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} 
                    opacity={entry.calories === 0 ? 0.1 : 0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary/80"></div>
            On Track
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive/80"></div>
            Over Limit
          </div>
        </div>
      </Card>

      <div className="bg-secondary/30 rounded-2xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          Insights
        </h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <div className="bg-background p-2 rounded-full shadow-sm">
              <ArrowUp className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <p className="font-medium">Highest Calorie Day</p>
              <p className="text-muted-foreground">{highestDay.day} with {highestDay.calories} calories.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-background p-2 rounded-full shadow-sm">
              <ArrowDown className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Under Budget</p>
              <p className="text-muted-foreground">
                You stayed under your goal {chartData.filter(d => !d.isOver && d.calories > 0).length} times this week.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
