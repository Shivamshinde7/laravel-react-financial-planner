import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

const SipGoals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;

    try {
      await api.delete(`/delete/goals/${id}`);
      alert("Goal deleted successfully!");
      setGoals((prevGoals) => prevGoals.filter((g) => g.id !== id)); // update UI
    } catch (error) {
      console.error("Error deleting goal:", error);
      alert("Failed to delete goal.");
    }
  };

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await api.get("/goalsdata/sip");
        setGoals(response.data.goals);
      } catch (error) {
        console.error("Error fetching SIP goals:", error);
        if (error.response?.status === 401) {
          alert("Session expired. Please login again.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [navigate]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-600">Loading SIP goals...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">My SIP Goals</h1>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/sip-calculator")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              SIP Calculator
            </button>
          </div>
        </div>

        {/* Goals List */}
        {goals.length === 0 ? (
          <p className="text-gray-600 text-center mt-10">
            No SIP goals found. Start by adding your first one!
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const progress =
                goal.expected_value && goal.actual_value
                  ? (goal.actual_value / goal.expected_value) * 100
                  : 0;

              return (
                <div
                  key={goal.id}
                  className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/goals/sip/chart/${goal.id}`)}
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {goal.name}
                  </h2>

                  <p className="text-sm text-gray-500 mb-1">
                    Monthly SIP: ₹{goal.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    Expected Value: ₹{goal.expected_value.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    Actual Value: ₹
                    {goal.actual_value
                      ? goal.actual_value.toLocaleString()
                      : " N/A"}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    Return Rate: {goal.return_rate}%
                  </p>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 h-2 rounded mt-2 mb-2">
                    <div
                      className="h-2 rounded bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>

                  <p className="text-sm text-gray-500">
                    Progress: {progress.toFixed(1)}%
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Duration: {(goal.duration / 12).toFixed(1)} years
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent navigation when clicking delete
                      handleDelete(goal.id);
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 mt-2"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SipGoals;
