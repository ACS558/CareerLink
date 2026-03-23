import { io } from "socket.io-client";

class SocketClient {
  constructor() {
    this.socket = null;
    this.shownNotifications = new Set(); // Track shown notifications
  }

  connect(token) {
    if (this.socket?.connected) {
      console.log("✅ Socket already connected:", this.socket.id);
      return this.socket;
    }

    if (!token) {
      console.error("❌ No token provided for socket connection");
      return null;
    }

    const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

    console.log("🔌 Connecting to Socket.IO...", SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected!");
      console.log("📍 Socket ID:", this.socket.id);
    });

    // ✅ Handle browser notifications here (separate from UI updates)
    this.socket.on("new_notification", (data) => {
      console.log("🔔 New notification received:", data);

      // Get notification data (handle both structures)
      const notification = data.notification || data;
      const notificationId = notification._id;

      // Skip if already shown
      if (this.shownNotifications.has(notificationId)) {
        console.log("⏭️ Already shown this notification");
        return;
      }

      // Check if notification is new (created within last 10 seconds)
      const notificationAge =
        Date.now() - new Date(notification.createdAt).getTime();
      const isNew = notificationAge < 10000; // 10 seconds

      console.log("📊 Notification age:", notificationAge, "ms");

      if (!isNew) {
        console.log("⏭️ Notification too old, skipping browser popup");
        return;
      }

      // Mark as shown
      this.shownNotifications.add(notificationId);

      // Play sound
      const audio = new Audio("/sounds/notification.mp3");
      audio.play().catch(() => {
        console.log("🔇 Sound blocked by browser");
      });

      // Show browser notification
      if (Notification.permission === "granted") {
        const title = notification.title || "CareerLink";
        const body = notification.message || "You have a new notification";

        console.log("📢 Showing browser notification:", { title, body });

        const browserNotif = new Notification(title, {
          body: body,
          icon: "/logo.png",
          badge: "/logo.png",
          tag: notificationId,
        });

        browserNotif.onclick = () => {
          window.focus();
          browserNotif.close();
        };
      } else {
        console.log("❌ Notification permission:", Notification.permission);
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔴 Socket connection error:", error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      console.log("🔌 Disconnecting socket...");
      this.socket.disconnect();
      this.socket = null;
      this.shownNotifications.clear(); // Clear tracking
    }
  }

  getSocket() {
    return this.socket;
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.warn("⚠️ Socket not connected, cannot listen to event:", event);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

const socketClient = new SocketClient();

if (typeof window !== "undefined") {
  window.socketClient = socketClient;
}

export default socketClient;
