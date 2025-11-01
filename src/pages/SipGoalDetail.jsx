import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const SipGoalDetail = () => {
  const { id } = useParams();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null); // ✅ chart reference

  // Fetch SIP goal details
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await api.get(`/goals/sip/${id}`);
        // ✅ your backend returns the goal directly
        setGoal(res.data.goal || res.data); 
      } catch (error) {
        console.error("Error fetching SIP goal:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center p-8 text-gray-600">Loading SIP details...</div>
      </DashboardLayout>
    );
  }

  if (!goal) {
    return (
      <DashboardLayout>
        <div className="text-center p-8 text-gray-600">SIP goal not found.</div>
      </DashboardLayout>
    );
  }

  // Generate chart data
  const monthlyRate = goal.return_rate / 12 / 100;
  const months = goal.duration * 12;
  let balance = 0;
  const yearlyData = [];

  for (let m = 1; m <= months; m++) {
    balance = (balance + Number(goal.amount)) * (1 + monthlyRate);
    if (m % 12 === 0) {
      yearlyData.push({
        year: m / 12,
        totalInvestment: Number(goal.amount) * m,
        value: balance,
      });
    }
  }

  const chartData = {
    labels: yearlyData.map((d) => `Year ${d.year}`),
    datasets: [
      {
        label: "Investment Value (₹)",
        data: yearlyData.map((d) => d.value.toFixed(2)),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Total Investment (₹)",
        data: yearlyData.map((d) => d.totalInvestment.toFixed(2)),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.3)",
        tension: 0.3,
        fill: true,
      },
    ],
  };


  const handleDownloadPdf = async () => {
    try {
      const chartImage = chartRef.current?.toBase64Image();

      const response = await api.post(
  `/goals/sip/pdf/${id}`,
  {
    chartImage,
    yearlyData, 
  },
  { responseType: "blob" }
);



  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${goal.name}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download PDF:", error);
      alert("Failed to generate PDF");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto bg-white p-6 mt-10 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">{goal.name}</h2>
          <button
            onClick={handleDownloadPdf}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Download PDF
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Monthly SIP: ₹{goal.amount.toLocaleString()} | Duration: {goal.duration} years | Return
          Rate: {goal.return_rate}%
        </p>

        {/* Chart Section */}
        <div className="bg-gray-50 p-4 rounded-md mb-8">
          <Line ref={chartRef} data={chartData} options={{ responsive: true }} /> {/* ✅ ref added */}
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Year</th>
                <th className="py-2 px-4 border">Total Investment (₹)</th>
                <th className="py-2 px-4 border">Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              {yearlyData.map((row) => (
                <tr key={row.year}>
                  <td className="py-2 px-4 border text-center">{row.year}</td>
                  <td className="py-2 px-4 border text-center">
                    ₹{row.totalInvestment.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border text-center">₹{row.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SipGoalDetail;
