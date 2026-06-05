import StatsCard from "./StatsCard";
import { Timer, Activity, BarChart2 } from "lucide-react";

type Props = {
    totalStudyTime: number;
    totalSessions: number;
    averageSession: number;
};

export default function StudyAnalytics({ totalStudyTime, totalSessions, averageSession }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard
                title="Study Time"
                value={`${totalStudyTime} min`}
                icon={Timer}
                accent="linear-gradient(135deg, #6366f1, #8b5cf6)"
            />
            <StatsCard
                title="Sessions"
                value={totalSessions}
                icon={Activity}
                accent="linear-gradient(135deg, #ec4899, #f43f5e)"
            />
            <StatsCard
                title="Avg Session"
                value={`${averageSession} min`}
                icon={BarChart2}
                accent="linear-gradient(135deg, #14b8a6, #06b6d4)"
            />
        </div>
    );
}