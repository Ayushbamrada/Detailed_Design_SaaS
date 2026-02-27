import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Completed", value: 4 },
  { name: "Ongoing", value: 6 },
  { name: "Delayed", value: 2 },
];

const COLORS = ["#16A34A", "#2563EB", "#DC2626"];

const AnalyticsChart = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-80">
      <h4 className="font-semibold mb-4">
        Project Distribution
      </h4>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={100}>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;