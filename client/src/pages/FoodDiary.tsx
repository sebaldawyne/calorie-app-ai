import { useLogs } from "@/lib/storage";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Utensils, Calendar } from "lucide-react";

export default function FoodDiary() {
  const { getAllLogs } = useLogs();
  const logs = getAllLogs();

  // Sort logs by timestamp descending
  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  // Group logs by date
  const groupedLogs = sortedLogs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = [];
    }
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, typeof sortedLogs>);

  const getMealEmoji = (meal: string) => {
    switch (meal) {
      case 'breakfast': return '🍳';
      case 'lunch': return '🥗';
      case 'dinner': return '🍽️';
      case 'snack': return '🍎';
      default: return '🍴';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Food Diary</h1>
        <p className="text-muted-foreground font-medium">History of all your logged meals.</p>
      </div>

      {Object.keys(groupedLogs).length === 0 ? (
        <div className="text-center py-20 bg-card/50 rounded-[2rem] border-2 border-dashed border-white/5">
          <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground font-medium">Your diary is empty. Start logging!</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedLogs).map(([date, dayLogs]) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <Calendar className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                  {format(new Date(date), 'EEEE, MMMM do')}
                </h3>
              </div>
              <div className="space-y-3">
                {dayLogs.map((log) => (
                  <Card key={log.id} className="p-5 border-none bg-card shadow-xl rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-2xl shadow-inner border border-white/5">
                          {getMealEmoji(log.meal)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white tracking-tight">{log.name}</h4>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">
                            {log.meal} • {format(log.timestamp, 'h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-primary">{log.calories} kcal</p>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">
                          P: {log.protein}g • C: {log.carbs}g • F: {log.fat}g
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
