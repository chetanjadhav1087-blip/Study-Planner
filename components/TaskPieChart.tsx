"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import { getOverdueTasks } from "@/lib/taskStats";
import { CheckCircle2, Clock, AlertCircle, ListTodo } from "lucide-react";
import { Card } from "@/components/ui/card";

type TaskPieChartProps = {
  tasks: Task[];
};

type SegmentKey = "completed" | "pending" | "overdue";

export default function TaskPieChart({ tasks }: TaskPieChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<SegmentKey | null>(null);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const overdue = getOverdueTasks(tasks).length;
  const pending = total - completed - overdue;

  // Circle Math
  const radius = 50;
  const C = 2 * Math.PI * radius; // ~314.159

  const slices = [
    {
      key: "completed" as const,
      count: completed,
      label: "Completed",
      icon: CheckCircle2,
      strokeClass: "stroke-[url(#completed-grad)]",
      textColor: "text-emerald-400",
      accentBg: "bg-emerald-500/10",
      borderClass: "border-emerald-500/20",
      indicatorBg: "bg-emerald-500",
    },
    {
      key: "pending" as const,
      count: pending,
      label: "Pending",
      icon: Clock,
      strokeClass: "stroke-[url(#pending-grad)]",
      textColor: "text-amber-400",
      accentBg: "bg-amber-500/10",
      borderClass: "border-amber-500/20",
      indicatorBg: "bg-amber-500",
    },
    {
      key: "overdue" as const,
      count: overdue,
      label: "Overdue",
      icon: AlertCircle,
      strokeClass: "stroke-[url(#overdue-grad)]",
      textColor: "text-rose-400",
      accentBg: "bg-rose-500/10",
      borderClass: "border-rose-500/20",
      indicatorBg: "bg-rose-500",
    },
  ];

  let cumulativeCount = 0;
  const slicesWithMeta = slices.map((slice) => {
    const fraction = total > 0 ? slice.count / total : 0;
    const strokeLength = fraction * C;
    const strokeOffset = total > 0 ? -(cumulativeCount / total) * C : 0;
    if (slice.count > 0) {
      cumulativeCount += slice.count;
    }
    return {
      ...slice,
      strokeLength,
      strokeOffset,
      percentage: total > 0 ? Math.round(fraction * 100) : 0,
    };
  });

  return (
    <Card className="p-6 border border-border/50 bg-card/40 backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">
        Task Progress Breakdown
      </h3>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
          <ListTodo className="h-12 w-12 mb-3 opacity-20 text-muted-foreground" />
          <p className="font-medium text-sm">No tasks tracked yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">
            Add a study task to view your visual breakdown.
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-8 justify-around">
          {/* Donut Chart SVG */}
          <div className="relative w-40 h-40 shrink-0">
            <svg
              width="160"
              height="160"
              viewBox="0 0 160 160"
              className="-rotate-90 select-none"
            >
              <defs>
                {/* Emerald Gradient */}
                <linearGradient id="completed-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                {/* Amber Gradient */}
                <linearGradient id="pending-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                {/* Rose Gradient */}
                <linearGradient id="overdue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>

              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="10"
              />

              {/* Slices */}
              {slicesWithMeta.map(
                (slice) =>
                  slice.count > 0 && (
                    <circle
                      key={slice.key}
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      className={`transition-all duration-300 ${slice.strokeClass} cursor-pointer`}
                      strokeWidth={
                        hoveredSegment === slice.key
                          ? "14"
                          : hoveredSegment && hoveredSegment !== slice.key
                          ? "8"
                          : "10"
                      }
                      strokeDasharray={`${slice.strokeLength} ${C}`}
                      strokeDashoffset={slice.strokeOffset}
                      strokeLinecap="round"
                      opacity={
                        hoveredSegment && hoveredSegment !== slice.key ? 0.35 : 1
                      }
                      onMouseEnter={() => setHoveredSegment(slice.key)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                  )
              )}
            </svg>

            {/* Centered Total Counter */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-3xl font-extrabold tracking-tight text-foreground transition-all duration-300">
                {total}
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mt-0.5">
                {total === 1 ? "Task" : "Tasks"}
              </span>
            </div>
          </div>

          {/* Custom Interactive Legend */}
          <div className="flex-1 w-full space-y-2.5">
            {slicesWithMeta.map((slice) => {
              const Icon = slice.icon;
              const isHovered = hoveredSegment === slice.key;
              const anyHovered = hoveredSegment !== null;

              return (
                <div
                  key={slice.key}
                  className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? `${slice.accentBg} ${slice.borderClass} translate-x-1`
                      : anyHovered
                      ? "opacity-40 border-transparent"
                      : "border-transparent hover:bg-muted/30"
                  }`}
                  onMouseEnter={() => setHoveredSegment(slice.key)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${slice.indicatorBg}`} />
                    <Icon className={`h-4 w-4 shrink-0 ${slice.textColor}`} />
                    <span className="text-sm font-medium text-foreground truncate">
                      {slice.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-muted-foreground font-semibold">
                      {slice.count}
                    </span>
                    <span className="text-muted-foreground/60 w-10 text-right">
                      {slice.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
