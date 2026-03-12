import { io } from "socket.io-client";

class SocketClient {
  constructor() {
    this.socket = null;
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

// ✅ CREATE AND EXPORT SINGLE INSTANCE
const socketClient = new SocketClient();

// ✅ MAKE AVAILABLE GLOBALLY FOR DEBUGGING
if (typeof window !== "undefined") {
  window.socketClient = socketClient;
}

export default socketClient;
