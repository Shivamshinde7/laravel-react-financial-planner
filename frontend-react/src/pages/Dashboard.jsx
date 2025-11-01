import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axios.js";
import DashboardLayout from "../layouts/DashboardLayout";
import { Link } from "react-router-dom"; // optional, remove if not using

const Dashboard = () => {
  const [goals, setGoals] = useState([]);
  const [summary, setSummary] = useState({
    totalGoals: 0,
    totalInvestment: 0,
    avgReturnRate: 0,
    avgDuration: 0,
  });

  // hoveredCard can be "goals", "investment", "return", "duration" or null
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/goalsdata");

      // <-- you already fixed this: API returns { goals: [...] }
      const data = response.data.goals || [];

      setGoals(data);

      const totalGoals = data.length;
      const totalInvestment = data.reduce((sum, g) => sum + Number(g.amount || 0), 0);
      const avgReturnRate =
        totalGoals > 0
          ? (data.reduce((sum, g) => sum + Number(g.return_rate || 0), 0) / totalGoals).toFixed(2)
          : 0;
      const avgDuration =
        totalGoals > 0
          ? (data.reduce((sum, g) => sum + Number(g.duration || 0), 0) / totalGoals).toFixed(1)
          : 0;

      setSummary({ totalGoals, totalInvestment, avgReturnRate, avgDuration });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // helper to pull first 5 items
  const firstFive = (arr) => (arr && arr.length ? arr.slice(0, 5) : []);

  // small component to render the hover box
  const HoverBox = ({ items, variant = "amount" }) => {
    return (
      <div className="mt-3 absolute left-1/2 transform -translate-x-1/2 w-64 md:w-72 bg-white border rounded-lg shadow-lg p-3 z-50">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Top {items.length} items</h4>
        {items.length === 0 ? (
          <p className="text-xs text-gray-500">No goals yet.</p>
        ) : (
          <ul className="text-sm text-gray-700 space-y-1 max-h-40 overflow-auto">
            {items.map((g) => (
              <li key={g.id} className="flex justify-between">
                <span className="truncate pr-2">{g.name}</span>
                <span className="text-gray-500 text-xs">
                  {variant === "amount" ? `₹${Number(g.amount).toLocaleString()}` : variant === "return" ? `${g.return_rate}%` : `${g.duration} yrs`}
                </span>
              </li>
            ))}
          </ul>
        )}
        {/* <div className="mt-3 text-right">
          <Link to="/dashboard/goals" className="text-xs text-blue-600 hover:underline">
            View all
          </Link>
        </div> */}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Welcome Back 👋</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Total Goals Card */}
          <div
            className="relative bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl shadow hover:shadow-xl transition-shadow cursor-default"
            onMouseEnter={() => setHoveredCard("goals")}
            onMouseLeave={() => setHoveredCard(null)}
            aria-describedby="goals-hover"
          >
            <h3 className="text-sm text-gray-600 mb-1">Total Goals</h3>
            <p className="text-2xl font-bold text-blue-700">{summary.totalGoals}</p>

            {/* small text list (always visible, optional) */}
            <p className="text-xs text-gray-500 mt-2">Quick preview (hover for full)</p>

            {/* hover box */}
            {hoveredCard === "goals" && (
              <div id="goals-hover" role="dialog" aria-label="First five goals">
                <HoverBox items={firstFive(goals)} variant="amount" />
              </div>
            )}
          </div>

          {/* Total Investment Card */}
          <div
            className="relative bg-gradient-to-br from-green-50 to-white p-4 rounded-xl shadow hover:shadow-xl transition-shadow cursor-default"
            onMouseEnter={() => setHoveredCard("investment")}
            onMouseLeave={() => setHoveredCard(null)}
            aria-describedby="investment-hover"
          >
            <h3 className="text-sm text-gray-600 mb-1">Total Investment</h3>
            <p className="text-2xl font-bold text-green-700">
              ₹{Number(summary.totalInvestment).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">Top contributors (hover)</p>

            {hoveredCard === "investment" && (
              <div id="investment-hover" role="dialog" aria-label="Top 5 investments">
                <HoverBox items={firstFive(goals)} variant="amount" />
              </div>
            )}
          </div>

          {/* Average Return Rate Card */}
          <div
            className="relative bg-gradient-to-br from-yellow-50 to-white p-4 rounded-xl shadow hover:shadow-xl transition-shadow cursor-default"
            onMouseEnter={() => setHoveredCard("return")}
            onMouseLeave={() => setHoveredCard(null)}
            aria-describedby="return-hover"
          >
            <h3 className="text-sm text-gray-600 mb-1">Avg Return Rate</h3>
            <p className="text-2xl font-bold text-yellow-700">{summary.avgReturnRate}%</p>
            <p className="text-xs text-gray-500 mt-2">Hover to see each goal's rate</p>

            {hoveredCard === "return" && (
              <div id="return-hover" role="dialog" aria-label="Top 5 return rates">
                <HoverBox items={firstFive(goals)} variant="return" />
              </div>
            )}
          </div>

          {/* Average Duration Card */}
          <div
            className="relative bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow hover:shadow-xl transition-shadow cursor-default"
            onMouseEnter={() => setHoveredCard("duration")}
            onMouseLeave={() => setHoveredCard(null)}
            aria-describedby="duration-hover"
          >
            <h3 className="text-sm text-gray-600 mb-1">Avg Duration</h3>
            <p className="text-2xl font-bold text-purple-700">{summary.avgDuration} yrs</p>
            <p className="text-xs text-gray-500 mt-2">Hover to see durations</p>

            {hoveredCard === "duration" && (
              <div id="duration-hover" role="dialog" aria-label="Top 5 durations">
                <HoverBox items={firstFive(goals)} variant="duration" />
              </div>
            )}
          </div>
        </div>

        {/* Optional: Recent goals / other sections */}
        <div className="mt-8 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Recent Goals</h2>
          {goals.length === 0 ? (
            <p className="text-gray-500">No goals yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {goals.slice(0, 5).map((g) => (
                <li key={g.id} className="py-3 flex justify-between">
                  <span className="font-medium">{g.name}</span>
                  <span className="text-gray-600">₹{Number(g.amount).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
