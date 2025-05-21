// Fully Polished Tailwind Version of WorkoutPlans.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import WorkoutPlanService from "../../services/WorkoutPlanService";
import UserService from "../../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faDumbbell,
  faUser,
  faCalendarDays,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

const WorkoutPlans = () => {
  const { currentUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await WorkoutPlanService.getAllPlans();
      setPlans(response.data);
      const userIds = [...new Set(response.data.map((p) => p.userId))];
      await loadUserData(userIds);
    } catch (err) {
      setError("Failed to load workout plans.");
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userIds) => {
    const userMap = { ...users };
    for (const id of userIds) {
      if (!userMap[id]) {
        const res = await UserService.getUserById(id);
        userMap[id] = res.data.user;
      }
    }
    setUsers(userMap);
  };

  const filteredPlans =
    activeTab === "my" ? plans.filter((p) => p.userId === currentUser.id) : plans;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-1 flex items-center gap-3">
              <FontAwesomeIcon icon={faDumbbell} className="text-indigo-600 text-3xl" />
              Workout Plans
            </h2>
            <p className="text-sm text-gray-500">Explore and manage your fitness routines</p>
          </div>
          <Link
            to="/workoutplans/create"
            className="inline-flex items-center bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Create Plan
          </Link>
        </div>

        <div className="flex gap-3 mb-6">
          {['all', 'my'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                tab === activeTab
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-50"
              }`}
            >
              {tab === 'all' ? 'All Plans' : 'My Plans'}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-500 text-center mt-10">Loading workout plans...</div>
        ) : filteredPlans.length === 0 ? (
          <div className="bg-indigo-100 border-l-4 border-indigo-500 text-indigo-700 p-4 rounded flex items-center gap-2">
            <FontAwesomeIcon icon={faCircleInfo} /> No workout plans found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPlans.map((plan) => {
              const user = users[plan.userId] || { firstname: "User", lastname: "" };
              const badgeColor =
                plan.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : plan.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700";

              return (
                <div
                  key={plan.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-semibold text-gray-800">{plan.title}</h4>
                    {plan.status && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColor}`}>
                        {plan.status}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600">
                    <FontAwesomeIcon icon={faUser} className="mr-1 text-indigo-500" />
                    {user.firstname} {user.lastname}
                  </p>

                  {plan.deadline && (
                    <p className="text-sm text-gray-600 mt-1">
                      <FontAwesomeIcon icon={faCalendarDays} className="mr-1 text-indigo-500" />
                      Deadline: {new Date(plan.deadline).toLocaleDateString()}
                    </p>
                  )}

                  <p className="text-gray-700 text-sm mt-3 mb-4 line-clamp-3">
                    {plan.description}
                  </p>

                  <Link
                    to={`/workoutplans/${plan.id}`}
                    className="text-sm font-medium text-indigo-600 hover:underline"
                  >
                    View Plan →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlans;
