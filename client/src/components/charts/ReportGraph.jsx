// frontend/src/components/charts/ReportGraph.jsx
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportGraph = ({ data, graphType }) => {
  if (!data || !data.labels || !data.datasets) {
    return <div>No valid data to display</div>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Generated Report" },
    },
  };

  const chartData = {
    labels: data.labels,
    datasets: data.datasets,
  };

  switch (graphType) {
    case "bar":
      return <Bar data={chartData} options={options} />;
    case "line":
      return <Line data={chartData} options={options} />;
    case "pie":
      return <Pie data={chartData} options={options} />;
    default:
      return <div>Unsupported graph type</div>;
  }
};

export default ReportGraph;