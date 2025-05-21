import axios from "axios";

const API_URL = "http://localhost:8080";

// Helper function to get authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

class NotificationService {
  // Get all notifications for a user
  getNotifications(userId) {
    return axios.get(`${API_URL}/notifications/${userId}`, {
      headers: getAuthHeader(),
    });
  }

  // Delete a notification
  deleteNotification(id) {
    return axios.delete(`${API_URL}/notifications/${id}`, {
      headers: getAuthHeader(),
    });
  }
}

export default new NotificationService();
