import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminGrowthChart = ({ title, data }) => {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="bg-white rounded-xl shadow p-4 h-[350px]">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>

      {/* ResponsiveContainer MUST always render */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={safeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {safeData.length === 0 && (
        <p className="text-center text-gray-400 mt-4">
          No data available
        </p>
      )}
    </div>
  );
};

export default AdminGrowthChart;
