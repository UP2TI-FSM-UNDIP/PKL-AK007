<<<<<<< HEAD
import { LucideIcon } from "lucide-react";

=======
>>>>>>> fb9ea7590093811c2202f03867ab476793c7afea
interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
<<<<<<< HEAD
  icon?: React.ReactNode;
  trend?: string;
  color?: "blue" | "green" | "orange" | "red";
=======
>>>>>>> fb9ea7590093811c2202f03867ab476793c7afea
}

export default function StatCard({
  title,
  value,
  description,
<<<<<<< HEAD
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
    <div className={`border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${colorClasses[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {icon && <div className="p-2 rounded-lg bg-white shadow-sm">{icon}</div>}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {typeof value === "number"
              ? value.toLocaleString("id-ID")
              : value}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            trend.includes('+') 
              ? 'bg-green-100 text-green-700' 
              : trend.includes('-')
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
=======
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{title}</p>

      <h2 className="text-2xl font-semibold">
        {typeof value === "number"
          ? value.toLocaleString("id-ID")
          : value}
      </h2>

      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  );
}
>>>>>>> fb9ea7590093811c2202f03867ab476793c7afea
