import { Owner } from "@/types";

interface OwnershipChartProps {
  owners: Owner[];
}

const colors = [
  'hsl(214 84% 56%)', // primary
  'hsl(142 76% 36%)', // success 
  'hsl(25 95% 53%)',  // warning
  'hsl(262 80% 50%)', // purple
  'hsl(0 84% 60%)',   // destructive
];

export const OwnershipChart = ({ owners }: OwnershipChartProps) => {
  return (
    <div className="space-y-3">
      {/* Visual Bar */}
      <div className="ownership-bar">
        {owners.map((owner, index) => (
          <div
            key={owner.user.id}
            className="ownership-segment"
            style={{
              width: `${owner.percentage}%`,
              backgroundColor: colors[index % colors.length],
            }}
          />
        ))}
      </div>

      {/* Owner Details */}
      <div className="space-y-2">
        {owners.map((owner, index) => (
          <div key={owner.user.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="font-medium">{owner.user.name}</span>
            </div>
            <span className="text-muted-foreground">{owner.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};