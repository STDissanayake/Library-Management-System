import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const FineStatusChart = ({ paid, unpaid }) => {
  const data = {
    labels: ["Paid Fines", "Unpaid Fines"],
    datasets: [
      {
        data: [paid, unpaid],
        backgroundColor: ["#28a745", "#dc3545"],
      },
    ],
  };

  return (
    <div className="card p-3 shadow mt-3">
      <h6 className="text-center">Fine Status Distribution</h6>
      <Pie data={data} />
    </div>
  );
};

export default FineStatusChart;
