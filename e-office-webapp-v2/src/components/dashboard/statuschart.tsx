type StatusItem = {
  label: string;
  value: number;
  color: string;
};

type StatusChartProps = {
  title?: string;
  items?: StatusItem[];
};

export default function StatusChart({ title = "Distribusi Status", items }: StatusChartProps) {
  const chartItems = items ?? [];
  const maxValue = chartItems.length ? Math.max(1, ...chartItems.map((item) => item.value)) : 1;

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <h3 className="font-semibold mb-4">
        {title}
      </h3>

      {chartItems.length ? (
        <div className="flex items-end gap-3 h-40">
          {chartItems.map((item) => (
            <Bar
              key={item.label}
              label={item.label}
              value={item.value}
              color={item.color}
              maxValue={maxValue}
            />
          ))}
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center text-gray-400">
          Tidak ada data
        </div>
      )}
    </div>
  );
}

function Bar({
  label,
  value,
  color,
  maxValue,
}: StatusItem & { maxValue: number }) {
  const height = Math.max(6, (value / maxValue) * 100);
  return (
    <div className="flex flex-col items-center text-xs">
      <div
        className={`${color} w-10 rounded-t transition-all`}
        style={{ height: `${height}%` }}
      />
      <span className="mt-2 text-gray-500">
        {label}
      </span>
    </div>
  );
}
