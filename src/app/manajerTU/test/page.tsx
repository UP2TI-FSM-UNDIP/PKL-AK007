"use client";

import React from "react";
import ChartA from "@/components/ChartA";
import ChartB from "@/components/ChartB";

export default function TestPage() {
  return (
    <div className="p-8 bg-[#f5f6f8] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Chart Test Page</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Chart A: Tren Volume 30 Hari */}
        
        <div className="h-[300px] w-[600px]">
             <ChartA />
        </div>
       
      </div>
    </div>
  );
}
