import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const IssuedVsReturnedChart = ({ issued, returned }) => {
  const data = {
    labels: ["Issued", "Returned"],
    datasets: [
      {
        label: "Books",
        data: [issued, returned],
        backgroundColor: ["#007bff", "#28a745"],
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false } },
    responsive: true
  };

  return (
    <div className="card p-3 shadow mt-3">
      <h6 className="text-center">Issued vs Returned Books</h6>
      <Bar data={data} options={options} />
    </div>
  );
};

export default IssuedVsReturnedChart;
