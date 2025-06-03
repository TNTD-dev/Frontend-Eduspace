import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';

const SpacedRepetitionChart = ({ data }) => {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
          <p className="text-sm font-medium text-gray-900">
            {label === 0 ? 'New Cards' : `${label} days`}
          </p>
          <p className="text-sm text-gray-600">
            Cards: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom colors based on interval
  const getBarColor = (interval) => {
    if (interval === 0) return '#F59E0B'; // New cards - yellow
    if (interval <= 7) return '#3B82F6';  // Short term - blue
    return '#10B981';                     // Long term - green
  };

  return (
    <div className="w-full h-[400px]">
        <h1 className="text-2xl font-bold text-[#303345]">Spaced Repetition Schedule</h1>
      {/* Spaced Repetition Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="interval" 
            tickFormatter={(value) => value === 0 ? 'New' : `${value}d`}
            tick={{ fill: '#6B7280' }}
          />
          <YAxis 
            tick={{ fill: '#6B7280' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.interval)} />
            ))}
          </Bar>
          <Legend 
            content={
              <div className="flex justify-center space-x-6 text-sm text-gray-500 mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                  <span>New Cards</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span>Short Term (1-7 days)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span>Long Term (14+ days)</span>
                </div>
              </div>
            }
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpacedRepetitionChart; 