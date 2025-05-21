import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import WorkoutPlanService from "../../services/WorkoutPlanService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const CreateWorkoutPlan = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "Planned",
    exercises: [""],
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExerciseChange = (index, value) => {
    const updated = [...formData.exercises];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, exercises: updated }));
  };

  const addExercise = () => {
    setFormData((prev) => ({ ...prev, exercises: [...prev.exercises, ""] }));
  };

  const removeExercise = (index) => {
    const updated = [...formData.exercises];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, exercises: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const workoutData = {
        ...formData,
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
      };
      await WorkoutPlanService.createPlan(workoutData);
      navigate("/workoutplans");
    } catch (err) {
      console.error(err);
      setError("Failed to create workout plan.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-sky-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/workoutplans" className="text-indigo-600 hover:text-indigo-800 text-sm inline-flex items-center mb-6 font-medium">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back to Plans
        </Link>

        <h2 className="text-4xl font-extrabold text-gray-800 mb-8">Create Workout Plan</h2>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl ring-2 ring-indigo-300 rounded-2xl px-10 py-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-indigo-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-indigo-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50 text-gray-800"
              placeholder="Enter workout plan title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-indigo-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-indigo-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50 text-gray-800"
              placeholder="Describe your plan"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-indigo-700 mb-1">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full border border-indigo-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-indigo-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-indigo-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50 text-gray-800"
            >
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-indigo-700 mb-1">Exercises</label>
            {formData.exercises.map((exercise, idx) => (
              <div key={idx} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={exercise}
                  onChange={(e) => handleExerciseChange(idx, e.target.value)}
                  required
                  className="flex-1 border border-indigo-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 bg-indigo-50 text-gray-800"
                  placeholder={`Exercise ${idx + 1}`}
                />
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => removeExercise(idx)}
                    className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-md shadow"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addExercise}
              className="mt-2 flex items-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow-lg"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Exercise
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 rounded-lg shadow-xl transition-all text-lg"
          >
            Create Plan
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkoutPlan;