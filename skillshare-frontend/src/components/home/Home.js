// Fully Polished Tailwind Version of Home Feed
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PostService from "../../services/PostService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as solidHeart,
  faComment,
  faImage,
  faTimes,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";

const Home = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
    }
  }, [isAuthenticated]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await PostService.getAllPosts();
      setPosts(response.data.posts);
      const uniqueUserIds = [...new Set(response.data.posts.map(post => post.userId))];
      await loadUserData(uniqueUserIds);
    } catch (error) {
      console.error("Error loading posts:", error);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userIds) => {
    try {
      const userMap = { ...users };
      const token = localStorage.getItem("token");
      if (!token) return;

      for (const userId of userIds) {
        if (userMap[userId]) continue;
        const response = await axios.get(`http://localhost:8080/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.user) {
          userMap[userId] = response.data.user;
        }
      }
      setUsers(userMap);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : "");
  };

  const clearFileSelection = () => {
    setFile(null);
    setPreview("");
    const fileInput = document.getElementById("post-image");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !file) return setError("Please add content or an image.");

    try {
      setSubmitting(true);
      await PostService.createPost(currentUser.id, content, file);
      setContent("");
      setFile(null);
      setPreview("");
      loadPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await PostService.likePost(postId, currentUser.id);
      setPosts(posts.map(post => post.id === postId ? {
        ...post,
        likedUserIds: [...post.likedUserIds, currentUser.id],
      } : post));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await PostService.unlikePost(postId, currentUser.id);
      setPosts(posts.map(post => post.id === postId ? {
        ...post,
        likedUserIds: post.likedUserIds.filter(id => id !== currentUser.id),
      } : post));
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Create Post */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6 border border-gray-200">
        {error && (
          <div className="text-red-500 mb-2 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError("")}>✖</button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            rows="3"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          {preview && (
            <div className="relative mt-2">
              <img src={preview} alt="Preview" className="w-full rounded-md" />
              <button
                type="button"
                onClick={clearFileSelection}
                className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <label htmlFor="post-image" className="cursor-pointer flex items-center gap-2 text-blue-500">
              <FontAwesomeIcon icon={faImage} /> Photo
            </label>
            <input id="post-image" type="file" className="hidden" onChange={handleFileChange} />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
              disabled={submitting}
            >
              {submitting ? "Posting..." : <><FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> Share</>}
            </button>
          </div>
        </form>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="text-center text-gray-500">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500">No posts yet. Be the first to share something!</div>
      ) : (
        posts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map(post => {
            const user = users[post.userId] || { firstname: "User", lastname: "" };
            const isLiked = post.likedUserIds.includes(currentUser?.id);
            return (
              <div key={post.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    {user.profilePic ? (
                      <img src={`http://localhost:8080/uploads/${user.profilePic}`} alt="avatar" className="object-cover w-full h-full" />
                    ) : (
                      <span className="flex items-center justify-center h-full text-lg font-bold">
                        {user.firstname.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <Link to={`/profile/${post.userId}`} className="font-semibold text-blue-600 hover:underline">
                      {user.firstname} {user.lastname}
                    </Link>
                    <div className="text-sm text-gray-500">{formatDate(post.createdAt)}</div>
                  </div>
                </div>
                <div className="mb-2 text-gray-800 dark:text-gray-200 whitespace-pre-line">{post.content}</div>
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <img
                    src={`http://localhost:8080/uploads/${post.mediaUrls[0]}`}
                    alt="Post"
                    className="rounded-md w-full"
                  />
                )}
                <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex gap-4">
                    <button
                      onClick={() => isLiked ? handleUnlike(post.id) : handleLike(post.id)}
                      className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "hover:text-blue-500"}`}
                    >
                      <FontAwesomeIcon icon={isLiked ? solidHeart : regularHeart} />
                      {post.likedUserIds.length}
                    </button>
                    <Link to={`/post/${post.id}`} className="flex items-center gap-1 hover:text-blue-500">
                      <FontAwesomeIcon icon={faComment} /> Comment
                    </Link>
                  </div>
                  <Link to={`/post/${post.id}`} className="text-blue-600 hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
};

export default Home;