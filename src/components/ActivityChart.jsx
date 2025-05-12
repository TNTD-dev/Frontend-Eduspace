import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ActivityChart() {
  // Sample data based on the image
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const data = [
    { name: 'Jan', activityTime: 15 },
    { name: 'Feb', activityTime: 18 },
    { name: 'Mar', activityTime: 19 },
    { name: 'Apr', activityTime: 15 },
    { name: 'May', activityTime: 10 },
    { name: 'Jun', activityTime: 12 },
    { name: 'Jul', activityTime: 17 },
    { name: 'Aug', activityTime: 20 },
    { name: 'Sep', activityTime: 21 },
    { name: 'Oct', activityTime: 20 },
    { name: 'Nov', activityTime: 21 },
    { name: 'Dec', activityTime: 22 },
  ];
  const maxActivityTime = Math.max(...data.map(item => item.activityTime));


  return (
    <div className=" w-full max-w-3xl">
      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 0, right: 15, left: 20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a3a6aa', fontSize: 14 }}
            />
            <YAxis 
              width={5}
              domain={[0, maxActivityTime]} 
              ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40]} 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#a3a6aa', fontSize: 14 }}
            />
            <Tooltip />
            <Line 
        
              type="monotone" 
              dataKey="activityTime" 
              stroke="#1cd767" 
              strokeWidth={4} 
              dot={true} 
              activeDot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}