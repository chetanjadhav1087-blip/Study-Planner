import StatsCard
    from "./StatsCard";

type StudyStatsProps = {
    total: number;
    today: number;
    week: number;
};

export default function StudyStats({
    total,
    today,
    week,
}: StudyStatsProps) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <StatsCard
                title="Total Study"
                value={`${total} min`}
            />

            <StatsCard
                title="Today"
                value={`${today} min`}
            />

            <StatsCard
                title="This Week"
                value={`${week} min`}
            />
        </div>
    );
}