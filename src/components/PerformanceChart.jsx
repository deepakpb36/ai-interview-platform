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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function PerformanceChart() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

    datasets: [
      {
        label: "Interview Score",

        data: [60, 75, 80, 70, 90, 95, 88],

        borderColor: "#3b82f6",

        backgroundColor: "#3b82f6",

        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },

      y: {
        ticks: {
          color: "white",
        },
      },
    },
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-white text-2xl font-bold mb-6">
        Weekly Performance
      </h2>

      <Line data={data} options={options} />
    </div>
  );
}

export default PerformanceChart;