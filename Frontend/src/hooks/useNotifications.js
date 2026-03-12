import { useState, useEffect, useCallback } from "react";
import { notificationAPI } from "../services/api";
import socket from "../socket/socketClient";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchNotifications({ limit: 10 });
    fetchUnreadCount();
  }, []);

  // ✅ FIX: Listen for real-time updates - wait for socket to connect
  useEffect(() => {
    const handleNewNotification = (data) => {
      console.log("🔔 useNotifications: NEW NOTIFICATION RECEIVED!", data);
      setUnreadCount(data.unreadCount);
      setNotifications((prev) => [data.notification, ...prev]);
    };

    // ✅ Wait for socket connection before adding listener
    const setupListener = () => {
      const socketInstance = socket.getSocket();

      if (!socketInstance) {
        console.log("⏳ Socket not ready, will retry...");
        // Retry after 500ms
        setTimeout(setupListener, 500);
        return;
      }

      if (!socketInstance.connected) {
        console.log("⏳ Socket not connected, waiting...");
        // Wait for connection
        socketInstance.once("connect", () => {
          console.log("✅ Socket connected, adding notification listener");
          socketInstance.on("new_notification", handleNewNotification);
        });
      } else {
        console.log(
          "✅ Socket already connected, adding notification listener",
        );
        socketInstance.on("new_notification", handleNewNotification);
      }
    };

    setupListener();

    // Cleanup
    return () => {
      const socketInstance = socket.getSocket();
      if (socketInstance) {
        socketInstance.off("new_notification", handleNewNotification);
      }
    };
  }, []);

  const fetchNotifications = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications(params);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Fetch notifications error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Fetch unread count error:", error);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true })),
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    setNotifications,
    setUnreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  };
};
