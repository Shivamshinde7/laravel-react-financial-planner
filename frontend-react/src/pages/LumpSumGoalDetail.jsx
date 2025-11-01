import React, { useEffect, useState , useRef } from "react";
import { useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const LumpSumGoalDetail = () => {
  const { id } = useParams();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const chartRef = useRef();
const handleDownloadPdf = async () => {
  try {
    // Convert chart to base64 image
    const chartImage = chartRef.current.toBase64Image();

    // Send to backend via POST
    const response = await api.post(
      `/goals/${id}/pdf`,
      { chartImage },
      { responseType: "blob" } // for file download
    );

    // Create download link
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




  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await api.get(`/goals/lumpsum/${id}`);
        setGoal(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load goal details");
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto p-5 text-center text-gray-600">
          <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p>Loading goal details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto p-5 text-center text-red-500">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  if (!goal) return null;

const investedAmount =
  goal.goal_type === "sip"
    ? goal.monthly_investment * goal.duration
    : goal.amount;

const chartData = {
  labels: ["Invested Amount", "Expected Return"],
  datasets: [
    {
      label: "₹ Value",
      data: [investedAmount, goal.expected_value],
      backgroundColor: ["#60a5fa", "#34d399"],
    },
  ],
};


  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <DashboardLayout>
          <button
  onClick={handleDownloadPdf}
  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
>
  Download PDF
</button>
      <div className="max-w-3xl mx-auto p-5">
        
        <h2 className="text-2xl font-bold mb-3 text-gray-800">{goal.name}</h2>

        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <p><strong>Investment:</strong> ₹{goal.amount}</p>
          <p><strong>Return Rate:</strong> {goal.return_rate}%</p>
          <p><strong>Duration:</strong> {goal.duration} months</p>
          <p><strong>Expected Value:</strong> ₹{goal.expected_value?.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold mb-3">Performance Chart</h3>
        <Bar ref={chartRef} data={chartData} options={options} />

      

        </div>
      </div>
    </DashboardLayout>
  );
};

export default LumpSumGoalDetail;
