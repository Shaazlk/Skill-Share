import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUtensils,
  faUser,
  faSignOutAlt,
  faHome,
  faDumbbell,
  faCloud,
  faTemperatureHigh
} from "@fortawesome/free-solid-svg-icons";

const Navigation = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/", icon: faHome, text: "Home" },
    { to: "/notifications", icon: faBell, text: "Notifications" },
    { to: "/workoutplans", icon: faDumbbell, text: "Workout Plans" },
    currentUser && {
      to: `/profile/${currentUser.id}`,
      icon: faUser,
      text: "Profile",
    },
  ].filter(Boolean);

  return (
    <nav className="fixed left-0 top-0 bottom-0 flex flex-col h-full bg-gray-800 w-56 border-r border-gray-700 shadow-lg">
      {/* Top section - Logo and navigation links */}
      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <h2 className="text-xl font-bold text-purple-400">SkillShare</h2>
        </div>

        <div className="mt-4">
          {isAuthenticated &&
            links.map(({ to, icon, text }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 font-medium transition-colors ${
                  isActive(to)
                    ? "bg-gray-700 text-purple-400"
                    : "text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                <FontAwesomeIcon icon={icon} className={isActive(to) ? "text-purple-400" : "text-gray-400"} />
                <span>{text}</span>
              </Link>
            ))}
        </div>
      </div>
      
      {/* Bottom section - Weather and logout */}
      <div className="p-4 border-t border-gray-700">
        {/* Weather widget */}
        <div className="flex items-center gap-2 text-sm mb-3 text-gray-200">
          <span className="text-yellow-400">
            <FontAwesomeIcon icon={faTemperatureHigh} />
          </span>
          <span>26°C</span>
          <span className="text-gray-400 flex items-center gap-1">
            <FontAwesomeIcon icon={faCloud} className="ml-1" />
            <span>Mostly</span> cloudy
          </span>
        </div>
        
        {/* Logout button */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-md transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;