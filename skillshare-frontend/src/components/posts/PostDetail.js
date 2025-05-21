// Polished Tailwind-based Post Detail UI Component
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PostService from "../../services/PostService";
import UserService from "../../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faTrash,
  faEdit,
  faArrowLeft,
  faComment,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

const PostDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentUsers, setCommentUsers] = useState({});
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [editingPost, setEditingPost] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadPostData();
  }, [id]);

  const loadPostData = async () => {
    try {
      setLoading(true);
      const postResponse = await PostService.getPostById(id);
      setPost(postResponse.data.post);
      setPostContent(postResponse.data.post.content);

      const authorRes = await UserService.getUserById(postResponse.data.post.userId);
      setAuthor(authorRes.data.user);

      await loadComments();
    } catch (err) {
      console.error(err);
      setError("Post not found or unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    const commentsRes = await PostService.getComments(id);
    setComments(commentsRes.data.comments);
    const uniqueUserIds = [...new Set(commentsRes.data.comments.map(c => c.userId))];
    await loadCommentUserData(uniqueUserIds);
  };

  const loadCommentUserData = async (userIds) => {
    const userMap = { ...commentUsers };
    for (const userId of userIds) {
      if (!userMap[userId]) {
        const res = await UserService.getUserById(userId);
        userMap[userId] = res.data.user;
      }
    }
    setCommentUsers(userMap);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const isPostOwner = currentUser?.id === post?.userId;
  const isLiked = post?.likedUserIds.includes(currentUser?.id);

  const handleLike = async () => {
    await PostService.likePost(id, currentUser.id);
    setPost({ ...post, likedUserIds: [...post.likedUserIds, currentUser.id] });
  };

  const handleUnlike = async () => {
    await PostService.unlikePost(id, currentUser.id);
    setPost({ ...post, likedUserIds: post.likedUserIds.filter(uid => uid !== currentUser.id) });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    await PostService.addComment(id, currentUser.id, commentText);
    setCommentText("");
    await loadComments();
    setSubmittingComment(false);
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.text);
  };

  const handleUpdateComment = async (commentId) => {
    await PostService.updateComment(commentId, editText);
    setComments(comments.map(c => c.id === commentId ? { ...c, text: editText } : c));
    setEditingComment(null);
    setEditText("");
  };

  const handleDeleteComment = async (commentId) => {
    await PostService.deleteComment(commentId);
    setComments(comments.filter(c => c.id !== commentId));
  };

  const handleDeletePost = async () => {
    await PostService.deletePost(id);
    navigate("/");
  };

  const handleEditPost = () => setEditingPost(true);

  const handleUpdatePost = async () => {
    await PostService.updatePost(id, postContent, file);
    setEditingPost(false);
    await loadPostData();
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error || !post) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <Link to="/" className="text-indigo-600 hover:underline">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back
        </Link>
        {isPostOwner && (
          <div className="space-x-2">
            <button onClick={handleEditPost} className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md">
              <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
            </button>
            <button onClick={handleDeletePost} className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md">
              <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
            {author?.profilePic ? (
              <img src={`http://localhost:8080/uploads/${author.profilePic}`} alt="avatar" className="object-cover w-full h-full" />
            ) : (
              <span className="flex items-center justify-center h-full font-bold text-indigo-600">
                {author?.firstname.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <Link to={`/profile/${post.userId}`} className="font-semibold text-blue-600">
              {author?.firstname} {author?.lastname}
            </Link>
            <div className="text-sm text-gray-500">
              <FontAwesomeIcon icon={faClock} className="mr-1" /> {formatDate(post.createdAt)}
            </div>
          </div>
        </div>

        <div className="mb-4">
          {editingPost ? (
            <div className="space-y-2">
              <textarea
                className="w-full p-2 border rounded-md"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <div className="space-x-2">
                <button onClick={handleUpdatePost} className="bg-green-500 text-white px-4 py-1 rounded-md">Save</button>
                <button onClick={() => setEditingPost(false)} className="bg-gray-300 px-4 py-1 rounded-md">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
          )}
          {post.mediaUrls?.[0] && (
            <img src={`http://localhost:8080/uploads/${post.mediaUrls[0]}`} alt="Post media" className="rounded-lg mt-4" />
          )}
        </div>

        <div className="flex gap-4 text-sm text-gray-600">
          <button
            onClick={isLiked ? handleUnlike : handleLike}
            className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "hover:text-blue-500"}`}
          >
            <FontAwesomeIcon icon={faHeart} /> {post.likedUserIds.length} {post.likedUserIds.length === 1 ? "Like" : "Likes"}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl p-5">
        <h3 className="text-lg font-semibold mb-3">Comments</h3>

        <form onSubmit={handleAddComment} className="mb-4">
          <textarea
            className="w-full p-3 border rounded-md"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={submittingComment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-2"
          >
            {submittingComment ? "Posting..." : "Post Comment"}
          </button>
        </form>

        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(comment => {
            const user = commentUsers[comment.userId];
            const isOwner = comment.userId === currentUser?.id;
            return (
              <div key={comment.id} className="border-t pt-4 mt-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden">
                    {user?.profilePic ? (
                      <img src={`http://localhost:8080/uploads/${user.profilePic}`} alt="avatar" className="object-cover w-full h-full" />
                    ) : (
                      <span className="flex items-center justify-center h-full text-sm font-bold text-indigo-600">
                        {user?.firstname.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <Link to={`/profile/${comment.userId}`} className="font-medium text-blue-600">
                      {user?.firstname} {user?.lastname}
                    </Link>
                    <div className="text-xs text-gray-500">{formatDate(comment.createdAt)}</div>
                  </div>
                </div>
                {editingComment === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      className="w-full p-2 border rounded-md"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdateComment(comment.id)} className="bg-green-500 text-white px-3 py-1 rounded-md">Save</button>
                      <button onClick={() => setEditingComment(null)} className="bg-gray-300 px-3 py-1 rounded-md">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700">{comment.text}</p>
                    {isOwner && (
                      <div className="text-sm text-right space-x-2 mt-1">
                        <button onClick={() => handleEditComment(comment)} className="text-yellow-600 hover:underline">
                          <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
                        </button>
                        <button onClick={() => handleDeleteComment(comment.id)} className="text-red-600 hover:underline">
                          <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PostDetail;