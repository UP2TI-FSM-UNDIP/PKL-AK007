"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  ChartOptions,
  ChartData,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartB() {
  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: "end",
        align: "top",
        color: "#64748b",
        font: {
          weight: "bold",
          size: 12,
          family: "'Inter', sans-serif",
        },
        formatter: (value) => value,
        offset: 0,
      },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#64748b",
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
        },
      },
      y: {
        display: false,
        min: 0,
        max: 55,
      },
    },
    layout: {
      padding: { top: 20 },
    },
    elements: {
      bar: {
        // 1. BIKIN SEMUA SUDUT ROUNDED (ATAS & BAWAH)
        borderRadius: 12, // Nilai radius sedikit diperbesar agar lebih tumpul
        borderSkipped: false, // PENTING: Agar sisi bawah tidak dilewati (jadi rounded juga)
      },
    },
  };

  const data: ChartData<"bar"> = {
    labels: ["Baru", "Proses", "Disposisi", "Selesai", "Ditolak"],
    datasets: [
      {
        data: [10, 20, 8, 40, 2],
        backgroundColor: [
          "#9ca3af", // Baru
          "#facc15", // Proses
          "#3b82f6", // Disposisi
          "#22c55e", // Selesai
          "#ef4444", // Ditolak
        ],
        // 2. BIKIN BATANGNYA DEMPET
        // Hapus 'barThickness' fix agar batang bisa melebar
        // 'categoryPercentage' & 'barPercentage' mendekati 1.0 membuat celah sangat sempit
        categoryPercentage: 0.95, 
        barPercentage: 0.95,
      },
    ],
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-slate-800 mb-6 font-sans">
        Distribusi Status
      </h3>
      <div className="flex-1 min-h-[250px] w-full relative">
        <Bar options={options} data={data} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
}