import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

const TopBooksChart = ({ books }) => {
  const chartData = books.slice(0, 5); // top 5

  return (
    <div className="card shadow p-3">
      <h5 className="text-center">📊 Top 5 Borrowed Books</h5>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="borrowCount" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopBooksChart;
