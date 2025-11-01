import React, { useState } from "react";
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

const SipCalculator = () => {
  const [formData, setFormData] = useState({
    name: "",
    monthly_investment: "",
    annual_return_rate: "",
    years: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ API call to Laravel backend
      const response = await api.post("/goals/sip", formData);
      setResult(response.data.summary);
    } catch (error) {
      console.error("Error calculating SIP:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate chart data
  const generateGrowthData = () => {
    const { monthly_investment, annual_return_rate, years } = formData;
    const monthlyRate = annual_return_rate / 12 / 100;
    const months = years * 12;
    let balance = 0;
    const yearlyData = [];

    for (let m = 1; m <= months; m++) {
      balance = (balance + Number(monthly_investment)) * (1 + monthlyRate);
      if (m % 12 === 0) {
        yearlyData.push({
          year: m / 12,
          totalInvestment: Number(monthly_investment) * m,
          value: balance,
        });
      }
    }

    return yearlyData;
  };

  const growthData = result ? generateGrowthData() : [];

  const chartData = {
    labels: growthData.map((d) => `Year ${d.year}`),
    datasets: [
      {
        label: "Investment Value (₹)",
        data: growthData.map((d) => d.value.toFixed(2)),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Total Investment (₹)",
        data: growthData.map((d) => d.totalInvestment.toFixed(2)),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.3)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white p-6 mt-10 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">SIP Calculator</h2>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Goal Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300"
              placeholder="e.g. Retirement Plan"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Monthly Investment (₹)</label>
            <input
              type="number"
              name="monthly_investment"
              value={formData.monthly_investment}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Expected Return Rate (%)</label>
            <input
              type="number"
              name="annual_return_rate"
              value={formData.annual_return_rate}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Duration (Years)</label>
            <input
              type="number"
              name="years"
              value={formData.years}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Calculating..." : "Calculate & Save Goal"}
          </button>
        </form>

        {/* Result Section */}
        {result && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Results</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-gray-500">Total Investment</p>
                <p className="text-lg font-semibold text-blue-700">
                  ₹{result.total_investment}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-md">
                <p className="text-sm text-gray-500">Estimated Returns</p>
                <p className="text-lg font-semibold text-green-700">
                  ₹{result.estimated_returns}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-md">
                <p className="text-sm text-gray-500">Future Value</p>
                <p className="text-lg font-semibold text-yellow-700">
                  ₹{result.future_value}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-gray-50 p-4 rounded-md">
              <Line data={chartData} options={{ responsive: true }} />
            </div>

            {/* Table */}
            <div className="mt-8 overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Year</th>
                    <th className="py-2 px-4 border">Total Investment (₹)</th>
                    <th className="py-2 px-4 border">Value (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {growthData.map((row) => (
                    <tr key={row.year}>
                      <td className="py-2 px-4 border text-center">{row.year}</td>
                      <td className="py-2 px-4 border text-center">
                        ₹{row.totalInvestment.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border text-center">
                        ₹{row.value.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SipCalculator;
