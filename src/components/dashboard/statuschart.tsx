interface BarProps {
  label: string;
  value: number;
  color: string;
}

export default function StatusChart(){
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <h3 className="font-semibold mb-4">Distribusi Status</h3>

      <div className="flex items-end gap-3 h-40">
        <Bar label="Baru" value={10} color="bg-gray-400" />
        <Bar label="Proses" value={20} color="bg-yellow-400" />
        <Bar label="Disposisi" value={8} color="bg-blue-400" />
        <Bar label="Selesai" value={40} color="bg-green-500" />
        <Bar label="Ditolak" value={2} color="bg-red-400" />
      </div>
    </div>
  );
}

function Bar({ label, value, color }: BarProps) {
  return (
    <div className="flex flex-col items-center text-xs">
      <div
        className={`${color} w-10 rounded-t`}
        style={{ height: `${value * 2}px` }}
      />
      <span className="mt-2 text-gray-500">{label}</span>
    </div>
  );
}
