import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: ReactNode;
  trend?: string;
  color?: "blue" | "green" | "orange" | "red";
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  color = "blue",
}: StatCardProps) {
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    orange: "border-orange-200 bg-orange-50",
    red: "border-red-200 bg-red-50",
  };

  return (
    <div className={`border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${colorClasses[color]} dark:border-slate-700/60 dark:bg-slate-900/70`}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-gray-600 dark:text-slate-300">{title}</p>
        {icon && <div className="p-2 rounded-lg bg-white shadow-sm dark:bg-slate-800 dark:text-slate-200">{icon}</div>}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            {typeof value === "number"
              ? value.toLocaleString("id-ID")
              : value}
          </h2>
          <p className="text-sm text-gray-500 mt-1 dark:text-slate-400">{description}</p>
        </div>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            trend.includes('+') 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200' 
              : trend.includes('-')
              ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200'
              : 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-200'
          }`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
