import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { ChartConfig } from '../types';
import { COLORS } from '../constants';

interface ChartRendererProps {
  config: ChartConfig;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ config }) => {
  const { chartType, data, title, xAxisKey = 'name', dataKey = 'value', yAxisLabel } = config;

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey={xAxisKey}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey={xAxisKey} tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#f3f4f6'}}
                formatter={(value: number) => [`$${value.toLocaleString()}`, dataKey]}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey={dataKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey={xAxisKey} tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip 
                 formatter={(value: number) => [`$${value.toLocaleString()}`, dataKey]}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Line type="monotone" dataKey={dataKey} stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
           <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey={xAxisKey} tick={{fill: '#6b7280'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill: '#6b7280'}} axisLine={false} tickLine={false}/>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <Tooltip 
                 formatter={(value: number) => [`$${value.toLocaleString()}`, dataKey]}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Area type="monotone" dataKey={dataKey} stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="text-gray-500 italic">Unsupported chart type</div>;
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 my-4">
      {title && <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">{title}</h3>}
      {renderChart()}
    </div>
  );
};

export default ChartRenderer;
