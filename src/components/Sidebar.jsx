import { Home, Target, BarChart2, User,Goal, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="h-screen w-64 bg-slate-800 text-white flex flex-col justify-between shadow-lg">
      {/* Brand */}
      <div>
        <div className="p-5 text-2xl font-bold text-center border-b border-slate-700 tracking-wide">
          FinPlanner
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            <Home size={20} /> Dashboard
          </NavLink>

             <NavLink
            to="/goal"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
             <Goal size={20} /> Create Goal
          </NavLink>

   <NavLink
            to="/sip-calculator"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            <Target size={20} /> SIP Calculator
          </NavLink>

<NavLink
            to="/sip-goals"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            <Target size={20} /> SIP Goals
          </NavLink>

          <NavLink
            to="/lumpsum-goals"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            <Target size={20} /> Lumpsum Goals
          </NavLink>

          

       

          {/* <NavLink
            to="/dashboard/reports"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            <BarChart2 size={20} /> Reports
          </NavLink> */}

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            <User size={20} /> Profile
          </NavLink>
        </nav>
      </div>

      {/* Logout */}
      <div className="p-6 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left text-gray-300 hover:bg-slate-700 hover:text-white py-3 px-4 rounded transition"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
