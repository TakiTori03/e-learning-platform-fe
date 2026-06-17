import React from "react";
import { Card, Statistic } from "antd";

interface StatCardProps {
  title: string;
  value: string | number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  trend?: {
    value: number | string;
    isUp: boolean;
    text?: string;
  };
  iconBgColor?: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  loading = false,
}) => {
  return (
    <Card 
      loading={loading}
      className="border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="w-full">
          <Statistic
            title={<span className="text-gray-500 font-medium text-sm">{title}</span>}
            value={value}
            prefix={prefix}
            suffix={suffix}
            styles={{ content: { fontWeight: "bold", fontSize: "1.75rem", letterSpacing: "-0.025em" } }}
          />
          {trend && (
            <div className={`text-xs mt-2 flex items-center gap-1 ${trend.isUp ? "text-green-500" : "text-red-500"}`}>
              <span>{trend.isUp ? "▲" : "▼"} {trend.value}%</span>
              {trend.text && <span className="text-gray-400">{trend.text}</span>}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
