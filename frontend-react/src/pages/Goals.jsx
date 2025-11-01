import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

const Goals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    duration: "",
    durationType: "years", // ✅ new
    return_rate: "",
    actual_value: "",
  });

  // Fetch all goals
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await api.get("/goalsdata/lumpsum");
        setGoals(response.data.goals);
      } catch (error) {
        console.error("Error fetching goals:", error);
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

  // Edit handler
  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      amount: goal.amount,
      duration: goal.duration,
      durationType: "months", // default existing goals as months
      return_rate: goal.return_rate,
      actual_value: goal.actual_value || "",
    });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Update API
const handleUpdate = async () => {
  try {
    const dataToSend = { ...formData };

    // ✅ Convert duration to months if selected in years
    if (formData.durationType === "years") {
      dataToSend.duration = formData.duration * 12;
    }

    // ✅ Send update request
    const res = await api.put(`/updategoal/${editingGoal.id}`, dataToSend);

    // ✅ Handle success response (some APIs return 200, some 204)
    if (res.status === 200 || res.status === 201 || res.status === 204) {
      alert("Goal updated successfully!");
      setEditingGoal(null);

      // ✅ Refresh goal list after update
      const refreshed = await api.get("/goalsdata/lumpsum");
      setGoals(refreshed.data.goals);
    } else {
      console.warn("Unexpected response status:", res.status);
      alert("Goal updated (but received unexpected response).");
    }

  } catch (error) {
    console.error("Error updating goal:", error);

    if (error.response?.data?.message) {
      alert(`Failed to update goal: ${error.response.data.message}`);
    } else {
      alert("Failed to update goal. Please try again.");
    }
  }
};


  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-600">Loading goals...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">My Goals</h1>
          <button
            onClick={() => navigate("/goal")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add New Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <p className="text-gray-600 text-center mt-10">
            No goals found. Start by adding your first goal!
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
                  onClick={() => navigate(`/goals/lumpsum/chart/${goal.id}`)} 
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {goal.name}
                  </h2>

                  <p className="text-sm text-gray-500 mb-1">
                    Investment: ₹{goal.amount.toLocaleString()}
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
                      className="h-2 rounded bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
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
                      e.stopPropagation(); // ✅ Prevent redirect when editing
                      handleEdit(goal);
                    }}
                    className="mt-3 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                  >
                    Edit
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Edit Modal */}
        {editingGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Edit Goal
              </h2>

              <div className="space-y-3">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Goal Name"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Amount"
                  className="w-full border p-2 rounded"
                />

                <div className="flex gap-2">
                  <input
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Duration"
                    className="w-full border p-2 rounded"
                  />
                  <select
                    name="durationType"
                    value={formData.durationType}
                    onChange={handleChange}
                    className="border rounded p-2"
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>

                <input
                  name="return_rate"
                  type="number"
                  value={formData.return_rate}
                  onChange={handleChange}
                  placeholder="Return Rate (%)"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="actual_value"
                  type="number"
                  value={formData.actual_value}
                  onChange={handleChange}
                  placeholder="Actual Value (optional)"
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setEditingGoal(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Goals;
