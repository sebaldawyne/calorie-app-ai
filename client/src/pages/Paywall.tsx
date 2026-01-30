import React from "react";
import { useSettings } from "@/lib/storage";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, Zap, BarChart3, ShieldCheck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Paywall() {
  const { updateSettings } = useSettings();
  const [, setLocation] = useLocation();

  const handleSubscribe = () => {
    updateSettings({ isPro: true });
    setLocation("/");
  };

  const features = [
    { title: "Advanced AI Scan", desc: "Scan complex meals with multiple ingredients.", icon: Zap },
    { title: "Detailed Analytics", desc: "Weekly & Monthly progress reports.", icon: BarChart3 },
    { title: "Macro Breakdown", desc: "Detailed tracking of P/C/F per meal.", icon: ShieldCheck },
    { title: "Priority Support", desc: "24/7 access to our nutritionist bot.", icon: Crown }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 animate-in fade-in duration-500">
      <div className="flex justify-end">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")} className="rounded-full">
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100/10 text-amber-500 rounded-full text-xs font-black uppercase tracking-widest mb-2">
            <Crown className="w-3.5 h-3.5" /> Pro Access
          </div>
          <h1 className="text-4xl font-black tracking-tight leading-none text-white">Elevate Your Journey</h1>
          <p className="text-muted-foreground text-lg font-medium">Unlock the full power of CalorieSnap.</p>
        </div>

        <div className="grid gap-6 w-full max-w-sm">
          {features.map((f, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <f.icon className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-black text-white">{f.title}</h3>
                <p className="text-sm text-muted-foreground font-medium">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Card className="w-full max-w-sm p-8 bg-card border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4">
            <Badge className="bg-primary/20 text-primary border-none font-black px-3 py-1">BEST VALUE</Badge>
          </div>
          <div className="space-y-6 relative z-10">
            <div className="text-center">
              <h4 className="text-muted-foreground font-black uppercase tracking-widest text-xs mb-1">Annual Plan</h4>
              <div className="flex items-center justify-center gap-1">
                <span className="text-4xl font-black text-white">$4.99</span>
                <span className="text-muted-foreground font-bold">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-bold">Billed annually at $59.88</p>
            </div>
            <Button onClick={handleSubscribe} className="w-full h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/30 group-hover:scale-[1.02] transition-transform bg-primary text-white">
              Start 7-Day Free Trial
            </Button>
            <p className="text-[10px] text-center text-muted-foreground font-medium px-4">Cancel anytime. Terms of service apply.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
