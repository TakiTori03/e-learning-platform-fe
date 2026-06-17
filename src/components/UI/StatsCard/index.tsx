import React from "react";
import { Card } from "antd";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'blue' | 'emerald' | 'amber' | 'indigo' | 'purple' | 'rose' | 'orange' | 'cyan' | 'gray';
  loading?: boolean;
}

const colorMap = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  rose: { bg: "bg-rose-50", text: "text-rose-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-600" },
  gray: { bg: "bg-gray-50", text: "text-gray-600" },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color = "blue",
  loading = false,
}) => {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <Card
      loading={loading}
      className="rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 ${colors.bg} ${colors.text} rounded-xl shrink-0`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-0.5">{value}</h3>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
