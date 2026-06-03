import StatsCard
    from "./StatsCard";

type Props = {
    totalStudyTime: number;
    totalSessions: number;
    averageSession: number;
};

export default function StudyAnalytics({
    totalStudyTime,
    totalSessions,
    averageSession,
}: Props) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <StatsCard
                title="Study Time"
                value={`${totalStudyTime} min`}
            />

            <StatsCard
                title="Sessions"
                value={totalSessions}
            />

            <StatsCard
                title="Avg Session"
                value={`${averageSession} min`}
            />
        </div>
    );
}