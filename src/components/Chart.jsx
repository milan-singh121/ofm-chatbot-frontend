import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

// Accessible colors for light and dark modes
const lightPalette = ["#2563eb","#16a34a","#d97706","#db2777","#14b8a6","#c2410c","#5b21b6", "#b45309"];
const darkPalette = ["#60a5fa","#4ade80","#fbbf24","#f472b6","#2dd4bf","#fb923c","#a78bfa","#f59e0b"];

function formatNumber(val) {
  if (typeof val !== "number") return val;
  if (Math.abs(val) >= 1e6) return (val / 1e6).toFixed(1) + "M";
  if (Math.abs(val) >= 1e3) return (val / 1e3).toFixed(1) + "K";
  return val.toLocaleString();
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: "rgba(31,41,55,0.95)",
      borderRadius: 8,
      color: "#fff",
      padding: 14,
      minWidth: 160,
      boxShadow: "0 4px 12px rgba(30,41,59,0.2)"
    }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {payload.map(entry => (
        <div key={entry.dataKey} style={{ color: entry.color, fontSize: 13 }}>● {entry.name}: <strong>{formatNumber(entry.value)}</strong></div>
      ))}
    </div>
  );
}

const Chart = ({ chartData, dataKeys, chartType = 'line' }) => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkPalette : lightPalette;
  const textColor = theme === 'dark' ? "#e0e7ff" : "#1e293b";

  if (!chartData || !dataKeys || chartData.length === 0) {
    return <div className="flex items-center justify-center h-[45vh] italic text-gray-500 dark:text-gray-400">No data to display</div>;
  }

  switch (chartType) {
    case 'pie': {
      const pieKey = dataKeys[0] || "value";
      return (
        <div className="w-full h-[60vh] md:h-[400px] p-4 bg-white dark:bg-gray-950 rounded-lg border">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey={pieKey}
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, percent, value }) => (
                  <span style={{ color: textColor }}>{`${name}: ${formatNumber(value)} (${(percent * 100).toFixed(0)}%)`}</span>
                )}
                stroke={theme === 'dark' ? "#1e293b" : "#fff"}
                isAnimationActive
              >
                {chartData.map((_, idx) => <Cell key={idx} fill={colors[idx % colors.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 14, color: textColor, bottom: 0 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }
    case 'bar':
      return (
        <div className="w-full h-[60vh] md:h-[400px] p-4 bg-white dark:bg-gray-950 rounded-lg border">
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 15, right: 30, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#4b5563" : "#e2e8f0"} />
              <XAxis dataKey="name" stroke={textColor} tick={{ fill: textColor }} angle={-15} dy={10} interval={0} textAnchor="end" />
              <YAxis stroke={textColor} tickFormatter={formatNumber} tick={{ fill: textColor }} width={70} allowDecimals />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 14, color: textColor }} />
              {dataKeys.map((key, i) => 
                <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[3,3,0,0]} maxBarSize={28}>
                  <LabelList dataKey={key} position="top" formatter={formatNumber} fontSize={12} />
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    default:
      // line chart
      return (
        <div className="w-full h-[60vh] md:h-[400px] p-4 bg-white dark:bg-gray-950 rounded-lg border">
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 15, right: 30, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#4b5563" : "#e2e8f0"} />
              <XAxis dataKey="name" stroke={textColor} tick={{ fill: textColor }} angle={-15} dy={10} interval={0} textAnchor="end" />
              <YAxis stroke={textColor} tickFormatter={formatNumber} tick={{ fill: textColor }} width={70} allowDecimals />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 14, color: textColor }} />
              {dataKeys.map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[i % colors.length]}
                  strokeWidth={3}
                  dot={{ r: 5, fill: colors[i % colors.length], stroke: "#fff", strokeWidth: 1 }}
                  activeDot={{ r: 8 }}
                  isAnimationActive
                >
                  <LabelList dataKey={key} position="top" formatter={formatNumber} fontSize={12} />
                </Line>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
  }
};

export default Chart;
