import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function PerformanceChart() {
  const { theme } = useTheme();

  const textColor = theme === "dark" ? "#ffffff" : "#1f2937";
  const gridColor = theme === "dark" ? "#334155" : "#d1d5db";

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

    datasets: [
      {
        label: "Interview Score",
        data: [60, 75, 80, 70, 90, 95, 88],
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },

      y: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-all duration-300">

      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Weekly Performance
      </h2>

      <Line data={data} options={options} />

    </div>
  );
}

export default PerformanceChart;
