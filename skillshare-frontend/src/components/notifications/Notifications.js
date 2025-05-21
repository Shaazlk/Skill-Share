import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationService from "../../services/NotificationService";
import UserService from "../../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faUser,
  faTrash,
  faBell,
  faClock,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";

const Notifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) loadNotifications();
  }, [currentUser]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await NotificationService.getNotifications(currentUser.id);
      setNotifications(response.data.notifications);

      const senderIds = [...new Set(response.data.notifications.map(n => n.senderId))];
      await loadUserData(senderIds);
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userIds) => {
    const userMap = { ...users };
    for (const userId of userIds) {
      if (userMap[userId]) continue;
      try {
        const res = await UserService.getUserById(userId);
        userMap[userId] = res.data.user;
      } catch (err) {
        console.error(`Failed to load user ${userId}:`, err);
      }
    }
    setUsers(userMap);
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await NotificationService.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    if (diff < 10080) return `${Math.floor(diff / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  const getIcon = (type) => {
    switch (type) {
      case "like": return faHeart;
      case "comment": return faComment;
      case "follow": return faUser;
      default: return faBell;
    }
  };

  const getAction = (type) => {
    switch (type) {
      case "like": return "liked your post";
      case "comment": return "commented on your post";
      case "follow": return "started following you";
      default: return "interacted with you";
    }
  };

  const getLink = (n) => {
    if (n.type === "follow") return `/profile/${n.senderId}`;
    if (["like", "comment"].includes(n.type)) return `/post/${n.postId}`;
    return "#";
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faBell} /> Notifications
        {notifications.length > 0 && (
          <span className="ml-2 bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </h2>

      {error && <div className="text-red-500 mb-3">{error}</div>}

      {loading ? (
        <div className="text-center py-8">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <FontAwesomeIcon icon={faBell} size="2x" className="mb-2" />
          <p>You have no notifications yet.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => {
            const sender = users[n.senderId] || { firstname: "User", lastname: "" };
            return (
              <li key={n.id} className={`flex items-start gap-4 p-4 rounded-md shadow-sm ${!n.read ? "bg-blue-50" : "bg-white"}`}>
                <div className="text-blue-500">
                  <FontAwesomeIcon icon={getIcon(n.type)} size="lg" />
                </div>

                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <Link to={`/profile/${n.senderId}`} className="font-semibold hover:underline">
                      {sender.firstname} {sender.lastname}
                    </Link> {n.message || getAction(n.type)}
                  </p>

                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} /> {formatDate(n.createdAt)}
                    <Link to={getLink(n)} className="ml-4 text-blue-600 hover:underline text-xs flex items-center gap-1">
                      View <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                    </Link>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDeleteNotification(n.id, e)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
