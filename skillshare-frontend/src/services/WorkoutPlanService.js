// File: services/WorkoutPlanService.js
import axios from "axios";

const API_URL = "http://localhost:8080"; // Adjust as needed

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const WorkoutPlanService = {
  getAllPlans: () =>
    axios.get(`${API_URL}/workoutplans`, { headers: getAuthHeader() }),

  getPlansByUser: (userId) =>
    axios.get(`${API_URL}/workoutplans/user/${userId}`, {
      headers: getAuthHeader(),
    }),

  getPlanById: (id) =>
    axios.get(`${API_URL}/workoutplans/${id}`, {
      headers: getAuthHeader(),
    }),

  createPlan: (plan) =>
    axios.post(`${API_URL}/workoutplans`, plan, {
      headers: getAuthHeader(),
    }),

  updatePlan: (id, plan) =>
    axios.put(`${API_URL}/workoutplans/${id}`, plan, {
      headers: getAuthHeader(),
    }),

  deletePlan: (id) =>
    axios.delete(`${API_URL}/workoutplans/${id}`, {
      headers: getAuthHeader(),
    }),
};

export default WorkoutPlanService;
