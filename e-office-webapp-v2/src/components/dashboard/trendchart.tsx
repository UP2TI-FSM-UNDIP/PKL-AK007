type TrendPoint = {
  label: string;
  count: number;
};

type TrendChartProps = {
  title?: string;
  data?: TrendPoint[];
};

export default function TrendChart({ title = "Tren Volume 30 Hari", data }: TrendChartProps) {
  const hasData = data && data.length > 0;
  const maxValue = hasData ? Math.max(1, ...data.map((item) => item.count)) : 1;

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm h-full">
      <h3 className="font-semibold mb-4">{title}</h3>

      {hasData ? (
        <div className="h-40 flex items-end gap-3">
          {data.map((item) => {
            const height = Math.max(6, (item.count / maxValue) * 100);
            return (
              <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-md bg-blue-500/80" style={{ height: `${height}%` }} />
                <span className="text-[10px] text-gray-500">{item.label}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center text-gray-400">
          Tidak ada data
        </div>
      )}
    </div>
  );
}
