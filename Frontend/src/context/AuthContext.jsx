import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socketClient";
import { notificationAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    if (token && role) {
      setUser({ role, email });

      // ✅ CONNECT SOCKET AFTER USER IS SET
      setTimeout(() => {
        console.log("🔌 AuthContext: Connecting socket with stored token...");
        socket.connect(token);
      }, 100); // Small delay to ensure everything is initialized
    }
    setLoading(false);
  }, []);

  const login = async (token, userData, lastLogin) => {
    console.log("✅ AuthContext: Login called with user:", userData);

    localStorage.setItem("token", token);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("email", userData.email);

    setUser(userData);
    // 🔔 Check missed notifications
    if (lastLogin) {
      try {
        const res = await notificationAPI.getNotifications({
          limit: 20,
          page: 1,
        });

        console.log("📥 Notifications fetched:", res.data.notifications);
        console.log("🕒 Last login used for filter:", lastLogin);

        const newNotifications = res.data.notifications.filter(
          (n) => new Date(n.createdAt) > new Date(lastLogin),
        );

        console.log("🔔 Notifications after login:", newNotifications);

        if (newNotifications.length > 0) {
          const audio = new Audio("/sounds/notification.mp3");
          audio.play();

          if (Notification.permission === "granted") {
            new Notification("CareerLink", {
              body: `You have ${newNotifications.length} new notifications`,
              icon: "/logo.png",
            });
          }
        }
      } catch (error) {
        console.error("Missed notifications check failed", error);
      }
    }

    // ✅ CONNECT SOCKET AFTER LOGIN
    setTimeout(() => {
      console.log("🔌 AuthContext: Connecting socket after login...");
      socket.connect(token);
    }, 100);

    // Navigate based on role
    const routes = {
      student: "/student/dashboard",
      recruiter: "/recruiter/dashboard",
      admin: "/admin/dashboard",
      alumni: "/alumni/dashboard",
    };

    navigate(routes[userData.role] || "/");
  };

  const logout = () => {
    console.log("🔌 AuthContext: Logging out and disconnecting socket...");

    // ✅ DISCONNECT SOCKET
    socket.disconnect();

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");

    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
