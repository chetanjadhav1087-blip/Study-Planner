import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: string;
};

export default function StatsCard({ title, value, icon: Icon, accent }: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden p-5 flex flex-col gap-2 border-border/60 bg-card/80 hover:bg-card transition-colors duration-200 group">
      {/* Subtle accent glow */}
      {accent && (
        <div
          className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity rounded-xl"
          style={{ background: accent }}
        />
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          {title}
        </p>
        {Icon && (
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>

      <p className="text-2xl font-bold tracking-tight text-foreground">
        {value}
      </p>
    </Card>
  );
}