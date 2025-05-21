import axios from "axios";

const API_URL = "http://localhost:8080";

// Helper function to get authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

class PostService {
  // Get all posts
  getAllPosts() {
    return axios.get(`${API_URL}/posts`, {
      headers: getAuthHeader(),
    });
  }

  // Get a specific post by ID
  getPostById(postId) {
    return axios.get(`${API_URL}/posts/${postId}`, {
      headers: getAuthHeader(),
    });
  }

  // Create a new post with optional image
  createPost(userId, content, file) {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("content", content);
    if (file) {
      formData.append("file", file);
    }

    // Merge the Content-Type header with auth headers
    const headers = {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    };

    return axios.post(`${API_URL}/posts/create`, formData, { headers });
  }

  // Update a post
  updatePost(postId, content, file) {
    const formData = new FormData();
    formData.append("content", content);
    if (file) {
      formData.append("file", file);
    }

    // Merge the Content-Type header with auth headers
    const headers = {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    };

    return axios.put(`${API_URL}/posts/${postId}/update`, formData, {
      headers,
    });
  }

  // Delete a post
  deletePost(postId) {
    return axios.delete(`${API_URL}/posts/${postId}`, {
      headers: getAuthHeader(),
    });
  }

  // Like a post
  likePost(postId, userId) {
    return axios.post(
      `${API_URL}/posts/${postId}/like`,
      { userId },
      {
        headers: getAuthHeader(),
      }
    );
  }

  // Unlike a post
  unlikePost(postId, userId) {
    return axios.post(
      `${API_URL}/posts/${postId}/unlike`,
      { userId },
      {
        headers: getAuthHeader(),
      }
    );
  }

  // Add a comment to a post
  addComment(postId, userId, text) {
    return axios.post(
      `${API_URL}/posts/${postId}/comment`,
      {
        postId,
        userId,
        text,
      },
      {
        headers: getAuthHeader(),
      }
    );
  }

  // Get all comments for a post
  getComments(postId) {
    return axios.get(`${API_URL}/posts/${postId}/comments`, {
      headers: getAuthHeader(),
    });
  }

  // Update a comment
  updateComment(commentId, text) {
    return axios.put(
      `${API_URL}/posts/comments/${commentId}`,
      {
        text,
      },
      {
        headers: getAuthHeader(),
      }
    );
  }

  // Delete a comment
  deleteComment(commentId) {
    return axios.delete(`${API_URL}/posts/comments/${commentId}`, {
      headers: getAuthHeader(),
    });
  }
}

export default new PostService();
