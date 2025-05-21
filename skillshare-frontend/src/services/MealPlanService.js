import axios from "axios";

const API_URL = "http://localhost:8080";

// Helper function to get authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

class MealPlanService {
  // Get all meal plans
  getAllPlans() {
    return axios.get(`${API_URL}/mealplans`, {
      headers: getAuthHeader(),
    });
  }

  // Get meal plans by user ID
  getPlansByUser(userId) {
    return axios.get(`${API_URL}/mealplans/user/${userId}`, {
      headers: getAuthHeader(),
    });
  }

  // Get a meal plan by ID
  getPlanById(id) {
    return axios.get(`${API_URL}/mealplans/${id}`, {
      headers: getAuthHeader(),
    });
  }

  // Create a new meal plan
  createPlan(plan) {
    return axios.post(`${API_URL}/mealplans`, plan, {
      headers: getAuthHeader(),
    });
  }

  // Update a meal plan
  updatePlan(id, plan) {
    return axios.put(`${API_URL}/mealplans/${id}`, plan, {
      headers: getAuthHeader(),
    });
  }

  // Delete a meal plan
  deletePlan(id) {
    return axios.delete(`${API_URL}/mealplans/${id}`, {
      headers: getAuthHeader(),
    });
  }
}

export default new MealPlanService();
