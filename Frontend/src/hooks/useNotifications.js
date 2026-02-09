import { useState, useEffect } from "react";
import { notificationAPI } from "../services/api";

export const useNotifications = (pollingInterval = 30000) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUnreadCount();

    // Poll for new notifications
    const interval = setInterval(fetchUnreadCount, pollingInterval);

    return () => clearInterval(interval);
  }, [pollingInterval]);

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationAPI.getUnreadCount();
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error("Fetch unread count error:", error);
    }
  };

  const fetchNotifications = async (params = {}) => {
    setLoading(true);
    try {
      const res = await notificationAPI.getNotifications(params);
      setNotifications(res.data.notifications);
      return res.data;
    } catch (error) {
      console.error("Fetch notifications error:", error);
      return { notifications: [], pagination: {}, unreadCount: 0 };
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  };

  return {
    unreadCount,
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    refreshCount: fetchUnreadCount,
  };
};
