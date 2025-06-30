import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WasteReport } from '../../types';

interface WasteChartProps {
  report: WasteReport;
}

export default function WasteChart({ report }: WasteChartProps) {
  const data = Object.entries(report.wasteByCategory).map(([category, value]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    items: value,
  })).filter(item => item.items > 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Waste by Category</h3>
        <p className="text-sm text-gray-600 mt-1">
          Food waste breakdown over the last 30 days
        </p>
      </div>
      
      <div className="p-6">
        {data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No waste data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="items" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}