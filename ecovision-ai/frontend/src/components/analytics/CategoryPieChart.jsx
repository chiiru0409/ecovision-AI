import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = [
  '#f59e0b', // Cardboard (amber)
  '#14b8a6', // Glass (teal)
  '#64748b', // Metal (slate)
  '#10b981', // Organic (emerald)
  '#3b82f6', // Paper (blue)
  '#06b6d4', // Plastic (cyan)
  '#f43f5e', // Trash (rose)
];

export default function CategoryPieChart({ categoryCounts = {} }) {
  const data = Object.entries(categoryCounts)
    .filter(([_, count]) => count > 0)
    .map(([name, value]) => ({ name, value }));

  const hasData = data.length > 0;

  if (!hasData) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-sm font-medium">No waste items classified yet</p>
        <p className="text-xs text-slate-400 mt-1">Classify your first image to populate this distribution chart.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
