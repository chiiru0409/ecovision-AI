import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrendsBarChart({ categoryCounts = {} }) {
  const data = Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
  }));

  const hasData = Object.values(categoryCounts).some((c) => c > 0);

  if (!hasData) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-sm font-medium">No classification comparison data</p>
        <p className="text-xs text-slate-400 mt-1">Upload and classify waste images to see volumetric totals.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="category" 
            tickLine={false} 
            axisLine={{ stroke: '#cbd5e1' }}
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <YAxis 
            allowDecimals={false} 
            tickLine={false} 
            axisLine={{ stroke: '#cbd5e1' }}
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }}
            contentStyle={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} barSize={34} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
