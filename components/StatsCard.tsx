import { Card } from "@/components/ui/card";

type StatsCardProps = {
  title: string;
  value: number;
};

export default function StatsCard({
  title,
  value,
}: StatsCardProps) {
  return (
    <Card className="p-4">
      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <h2 className="text-3xl font-bold">
        {value}
      </h2>
    </Card>
  );
}