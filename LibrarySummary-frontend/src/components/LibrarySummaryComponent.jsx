import React, { useEffect, useState } from "react";
import { getLibrarySummary } from "../services/LibrarySummaryService";

const LibrarySummaryComponent = () => {
  const [summary, setSummary] = useState({
    totalMembers: 0,
    totalBooks: 0,
    totalIssued: 0,
    totalReturned: 0,
    totalBorrowed: 0,
    totalFines: 0.0,
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = () => {
    getLibrarySummary()
      .then((response) => {
        setSummary(response.data);
      })
      .catch((error) => {
        console.error("Error fetching summary:", error);
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        Library Dashboard Summary
      </h2>

      <table className="table table-striped table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>Total Members</th>
            <th>Total Books</th>
            <th>Total Issued</th>
            <th>Total Returned</th>
            <th>Total Borrowed</th>
            <th>Total Fines (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{summary.totalMembers}</td>
            <td>{summary.totalBooks}</td>
            <td>{summary.totalIssued}</td>
            <td>{summary.totalReturned}</td>
            <td>{summary.totalBorrowed}</td>
            <td>{summary.totalFines}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LibrarySummaryComponent;
