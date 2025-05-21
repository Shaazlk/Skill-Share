// Colorful and Professional Tailwind CSS Profile Component
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserService from "../../services/UserService";
import PostService from "../../services/PostService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as solidHeart,
  faComment,
  faEdit,
  faUserPlus,
  faUserMinus,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

const Profile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, [id]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError("");
      const userResponse = await UserService.getUserById(id);
      setUser(userResponse.data.user);
      await loadUserPosts();
      await loadFollowers();
      await loadFollowing();
      if (currentUser && followers.includes(currentUser.id)) {
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async () => {
    const allPostsResponse = await PostService.getAllPosts();
    const userPosts = allPostsResponse.data.posts.filter(post => post.userId === id);
    setPosts(userPosts);
  };

  const loadFollowers = async () => {
    const response = await UserService.getFollowers(id);
    setFollowers(response.data.followers);
  };

  const loadFollowing = async () => {
    const response = await UserService.getFollowing(id);
    setFollowing(response.data.following);
  };

  const handleFollow = async () => {
    await UserService.followUser(id, currentUser.id);
    setIsFollowing(true);
    setFollowers([...followers, currentUser.id]);
  };

  const handleUnfollow = async () => {
    await UserService.unfollowUser(id, currentUser.id);
    setIsFollowing(false);
    setFollowers(followers.filter(f => f !== currentUser.id));
  };

  const handleLike = async (postId) => {
    await PostService.likePost(postId, currentUser.id);
    setPosts(posts.map(post => post.id === postId ? {
      ...post,
      likedUserIds: [...post.likedUserIds, currentUser.id],
    } : post));
  };

  const handleUnlike = async (postId) => {
    await PostService.unlikePost(postId, currentUser.id);
    setPosts(posts.map(post => post.id === postId ? {
      ...post,
      likedUserIds: post.likedUserIds.filter(id => id !== currentUser.id),
    } : post));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isOwnProfile = currentUser && id === currentUser.id;

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error || !user) return <div className="text-center text-red-500 py-10">{error || "User not found"}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-4 border-indigo-400">
            {user.profilePic ? (
              <img src={`http://localhost:8080/uploads/${user.profilePic}`} alt="Avatar" className="object-cover w-full h-full" />
            ) : (
              <div className="h-full flex items-center justify-center text-2xl font-bold text-indigo-600">
                {user.firstname.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {user.firstname} {user.lastname}
              </h2>
              {isOwnProfile ? (
                <Link to="/profile/edit" className="text-sm text-indigo-700 font-medium hover:underline">
                  <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit Profile
                </Link>
              ) : (
                isFollowing ? (
                  <button onClick={handleUnfollow} className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md">
                    <FontAwesomeIcon icon={faUserMinus} className="mr-1" /> Unfollow
                  </button>
                ) : (
                  <button onClick={handleFollow} className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md">
                    <FontAwesomeIcon icon={faUserPlus} className="mr-1" /> Follow
                  </button>
                )
              )}
            </div>
            {user.bio && <p className="text-sm text-gray-600 mt-1">{user.bio}</p>}
            <div className="flex gap-6 mt-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-indigo-700">{posts.length}</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-indigo-700">{followers.length}</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-indigo-700">{following.length}</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">Posts</h3>
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 bg-white p-6 rounded-xl shadow-sm">
          This user hasn’t shared any posts yet.
        </div>
      ) : (
        <div className="space-y-6">
          {posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(post => {
            const isLiked = post.likedUserIds.includes(currentUser?.id);
            return (
              <div key={post.id} className="bg-white p-5 rounded-xl shadow border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-600">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" /> {formatDate(post.createdAt)}
                  </div>
                </div>
                <p className="text-gray-800 whitespace-pre-line mb-3">{post.content}</p>
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <img src={`http://localhost:8080/uploads/${post.mediaUrls[0]}`} alt="Post media" className="rounded-md mb-3" />
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <div className="flex gap-4">
                    <button onClick={() => isLiked ? handleUnlike(post.id) : handleLike(post.id)} className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "hover:text-blue-500"}`}>
                      <FontAwesomeIcon icon={isLiked ? solidHeart : regularHeart} /> {post.likedUserIds.length}
                    </button>
                    <Link to={`/post/${post.id}`} className="flex items-center gap-1 hover:text-blue-500">
                      <FontAwesomeIcon icon={faComment} /> Comment
                    </Link>
                  </div>
                  <Link to={`/post/${post.id}`} className="text-blue-600 hover:underline">View Details</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;
