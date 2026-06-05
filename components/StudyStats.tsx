import StatsCard from "./StatsCard";
import { Clock, Sun, CalendarDays } from "lucide-react";

type StudyStatsProps = {
    total: number;
    today: number;
    week: number;
};

export default function StudyStats({ total, today, week }: StudyStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard
                title="Total Study"
                value={`${total} min`}
                icon={Clock}
                accent="linear-gradient(135deg, #6366f1, #8b5cf6)"
            />
            <StatsCard
                title="Today"
                value={`${today} min`}
                icon={Sun}
                accent="linear-gradient(135deg, #f59e0b, #f97316)"
            />
            <StatsCard
                title="This Week"
                value={`${week} min`}
                icon={CalendarDays}
                accent="linear-gradient(135deg, #10b981, #06b6d4)"
            />
        </div>
    );
}