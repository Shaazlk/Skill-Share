import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import WorkoutPlanService from "../../services/WorkoutPlanService";
import UserService from "../../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUser,
  faCalendarDays,
  faEdit,
  faTrash,
  faCircleCheck,
  faClock,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const WorkoutPlanDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const res = await WorkoutPlanService.getPlanById(id);
      const planData = res.data;
      setPlan(planData);

      const userRes = await UserService.getUserById(planData.userId);
      setUser(userRes.data.user);
    } catch (err) {
      console.error(err);
      setError("Workout plan not found.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await WorkoutPlanService.deletePlan(id);
        navigate("/workoutplans");
      } catch (err) {
        setError("Failed to delete the plan.");
      }
    }
  };

  const renderStatus = (status) => {
    let icon;
    let color = "";
    switch (status) {
      case "Planned":
        icon = faClock;
        color = "bg-yellow-100 text-yellow-700";
        break;
      case "In Progress":
        icon = faCircleCheck;
        color = "bg-blue-100 text-blue-700";
        break;
      case "Completed":
        icon = faCheckCircle;
        color = "bg-green-100 text-green-700";
        break;
      default:
        icon = faClock;
        color = "bg-gray-100 text-gray-600";
    }
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md ${color}`}>
        <FontAwesomeIcon icon={icon} /> {status}
      </span>
    );
  };

  if (error) return (
    <div className="max-w-2xl mx-auto mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow">
      {error}
    </div>
  );

  if (!plan) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  const isOwner = currentUser?.id === plan.userId;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-sky-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/workoutplans" className="text-indigo-600 hover:underline inline-flex items-center mb-6 font-medium">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back to Plans
        </Link>

        <div className="bg-white shadow-2xl ring-2 ring-indigo-200 rounded-2xl p-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight">{plan.title}</h2>

          <p className="text-gray-600 mb-2 text-sm">
            <FontAwesomeIcon icon={faUser} className="mr-2 text-indigo-500" />
            {user?.firstname} {user?.lastname}
          </p>

          {plan.deadline && (
            <p className="text-gray-600 mb-2 text-sm">
              <FontAwesomeIcon icon={faCalendarDays} className="mr-2 text-indigo-500" />
              Deadline: <span className="font-medium">{new Date(plan.deadline).toLocaleDateString()}</span>
            </p>
          )}

          <div className="mb-4 text-sm">
            <strong className="text-gray-700">Status:</strong> {renderStatus(plan.status)}
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed border-t pt-4">{plan.description}</p>

          <h4 className="text-lg font-semibold text-indigo-700 mb-2">Exercises</h4>
          {plan.exercises?.length > 0 ? (
            <ul className="list-disc list-inside text-gray-800 space-y-1 mb-6">
              {plan.exercises.map((ex, idx) => (
                <li key={idx}>{ex}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No exercises listed.</p>
          )}

          {isOwner && (
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                to={`/workoutplans/edit/${plan.id}`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md shadow inline-flex items-center gap-2 justify-center text-sm font-medium"
              >
                <FontAwesomeIcon icon={faEdit} /> Edit
              </Link>

              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md shadow inline-flex items-center gap-2 justify-center text-sm font-medium"
              >
                <FontAwesomeIcon icon={faTrash} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanDetail;