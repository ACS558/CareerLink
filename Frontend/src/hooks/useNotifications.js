import { useState, useEffect, useCallback, useRef } from "react";
import { notificationAPI } from "../services/api";
import socket from "../socket/socketClient";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const soundRef = useRef(new Audio("/sounds/notification.mp3"));

  const isInitialLoad = useRef(true);

  // Fetch initial data
  useEffect(() => {
    const init = async () => {
      await fetchNotifications({ limit: 10 });
      await fetchUnreadCount();

      // Mark initial load complete
      isInitialLoad.current = false;
    };

    init();
  }, []);

  // ✅ FIX: Listen for real-time updates - wait for socket to connect
  useEffect(() => {
    const socketInstance = socket.getSocket();

    if (!socketInstance) {
      console.log("❌ Socket not initialized");
      return;
    }

    const handleNewNotification = (data) => {
      console.log("🔔 NEW NOTIFICATION:", data);

      setUnreadCount(data.unreadCount);
      setNotifications((prev) => [data.notification, ...prev]);

      // 🔊 Play sound
      if (!isInitialLoad.current) {
        soundRef.current.currentTime = 0;
        soundRef.current.play().catch(() => {
          console.log("Sound blocked by browser");
        });
      }
    };

    console.log("✅ Attaching notification listener");

    socketInstance.on("new_notification", handleNewNotification);

    return () => {
      socketInstance.off("new_notification", handleNewNotification);
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
