import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export function StatsCard({ label, value, change, changeType = "positive", icon: Icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-xs font-medium mt-0.5 ${
              changeType === "positive" ? "text-emerald-600" :
              changeType === "negative" ? "text-red-500" : "text-gray-500"
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-[var(--ts-primary-500)]/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-[var(--ts-primary-500)]" />
        </div>
      </div>
    </div>
  );
}
