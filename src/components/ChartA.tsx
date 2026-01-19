"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ChartA() {
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: { display: false },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#1e293b",
        bodyColor: "#1e293b",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
        displayColors: true,
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 12, family: "'Inter', sans-serif" },
        callbacks: {
          label: (context) => ` Volume: ${context.parsed.y}`,
        },
      },
    },
    layout: {
      padding: {
        left: 0, 
        right: 0,
        top: 20,
        bottom: 0,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#94a3b8",
          // INI UPDATE NYA: Memberi jarak antara garis bawah grafik dengan teks "1-7"
          padding: 20, 
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
        border: { display: false },
      },
      y: {
        min: 0,
        max: 75,
        ticks: {
          stepSize: 25,
          color: "#94a3b8",
          // INI UPDATE NYA: Memberi jarak horizontal (kiri) agar angka tidak nempel ke grafik
          padding: 30, // Sebelumnya 10, sekarang 30 biar jauh seperti referensi
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
        border: { display: false },
        grid: {
          color: "#f1f5f9",
          tickLength: 0,
          drawTicks: false,
          borderDash: [4, 4],
          lineWidth: 1,
        },
      },
    },
    elements: {
      line: { tension: 0.4 },
      point: {
        radius: 6,
        hoverRadius: 8,
        backgroundColor: "#3b82f6",
        borderColor: "#ffffff",
        borderWidth: 3,
      },
    },
  };

  const data: ChartData<"line"> = {
    labels: ["1-7", "8-15", "16-23", "24-30"],
    datasets: [
      {
        label: "Volume",
        data: [20, 38, 25, 200],
        borderColor: "#3b82f6",
        backgroundColor: "transparent",
        borderWidth: 3,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#ffffff",
        fill: false,
      },
    ],
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-slate-800 mb-2 font-sans">
        Tren Volume 30 Hari
      </h3>
      <div className="flex-1 min-h-[250px] w-full relative">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}