import axios from "axios";

const API_URL = "http://localhost:8080";

// Helper function to get authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

class UserService {
  // Get all users
  getAllUsers() {
    return axios.get(`${API_URL}/users`, {
      headers: getAuthHeader(),
    });
  }

  // Get user by ID
  getUserById(id) {
    return axios.get(`${API_URL}/users/${id}`, {
      headers: getAuthHeader(),
    });
  }

  // Update user profile
  updateUser(id, userData) {
    return axios.put(`${API_URL}/users/${id}`, userData, {
      headers: getAuthHeader(),
    });
  }

  // Follow a user
  followUser(userId, followerId) {
    return axios.post(
      `${API_URL}/users/${userId}/follow?followerId=${followerId}`,
      {},
      { headers: getAuthHeader() }
    );
  }

  // Unfollow a user
  unfollowUser(userId, followerId) {
    return axios.post(
      `${API_URL}/users/${userId}/unfollow?followerId=${followerId}`,
      {},
      { headers: getAuthHeader() }
    );
  }

  // Get user followers
  getFollowers(userId) {
    return axios.get(`${API_URL}/users/${userId}/followers`, {
      headers: getAuthHeader(),
    });
  }

  // Get users the current user is following
  getFollowing(userId) {
    return axios.get(`${API_URL}/users/${userId}/following`, {
      headers: getAuthHeader(),
    });
  }
}

export default new UserService();
