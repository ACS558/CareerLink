import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Token expired or invalid
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        toast.error("Session expired. Please login again.");
      }
      // Forbidden
      else if (error.response.status === 403) {
        toast.error(error.response.data.message || "Access denied");
      }
      // Other errors
      else {
        const message = error.response.data.message || "Something went wrong";
        toast.error(message);
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("An error occurred. Please try again.");
    }
    return Promise.reject(error);
  },
);

// ============ AUTH APIs ============

export const authAPI = {
  // Login
  login: (credentials) => api.post("/auth/login", credentials),

  // Register Student
  registerStudent: (data) => api.post("/auth/register/student", data),

  // Register Recruiter
  registerRecruiter: (data) => api.post("/auth/register/recruiter", data),

  // Register Admin
  registerAdmin: (data) => api.post("/auth/register/admin", data),

  // Register Alumni
  registerAlumni: (data) => api.post("/auth/register/alumni", data),
};

// ============ STUDENT APIs ============

export const studentAPI = {
  // Get profile
  getProfile: () => api.get("/student/profile"),

  // Update profile
  updateProfile: (data) => api.put("/student/profile", data),

  // Get profile completion
  getProfileCompletion: () => api.get("/student/profile/completion"),
};

// ============ RECRUITER APIs ============

export const recruiterAPI = {
  // Get profile
  getProfile: () => api.get("/recruiter/profile"),

  // Update profile
  updateProfile: (data) => api.put("/recruiter/profile", data),
};

// ============ ADMIN APIs ============

export const adminAPI = {
  // Get profile
  getProfile: () => api.get("/admin/profile"),

  // Update profile
  updateProfile: (data) => api.put("/admin/profile", data),

  // Get dashboard stats
  getDashboardStats: () => api.get("/admin/dashboard/stats"),

  // Recruiter management
  getAllRecruiters: (params) => api.get("/admin/recruiters", { params }),
  getPendingRecruiters: () => api.get("/admin/recruiters/pending"),
  verifyRecruiter: (id, data) =>
    api.put(`/admin/recruiters/${id}/verify`, data),

  // Alumni management
  getAllAlumni: (params) => api.get("/admin/alumni", { params }),
  getPendingAlumni: () => api.get("/admin/alumni/pending"),
  verifyAlumni: (id, data) => api.put(`/admin/alumni/${id}/verify`, data),

  // Student management
  getAllStudents: (params) => api.get("/admin/students", { params }),

  // Jobs
  getAllJobs: (params) => api.get("/admin/jobs", { params }),
  getPendingJobs: () => api.get("/admin/jobs/pending"),
  verifyJob: (id, data) => api.put(`/admin/jobs/${id}/verify`, data),

  // Applications
  getAllApplications: (params) => api.get("/admin/applications", { params }),
};

// ============ ALUMNI APIs ============

export const alumniAPI = {
  // Get profile
  getProfile: () => api.get("/alumni/profile"),

  // Update profile
  updateProfile: (data) => api.put("/alumni/profile", data),
};

// Job APIs
export const jobAPI = {
  // Recruiter
  createJob: (data) => api.post("/jobs", data),
  getMyJobs: (params) => api.get("/jobs/my-jobs/all", { params }),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),

  // Student
  getAllJobs: (params) => api.get("/jobs", { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
};

// Application APIs
export const applicationAPI = {
  // Student
  applyForJob: (data) => api.post("/applications", data),
  getMyApplications: (params) =>
    api.get("/applications/my-applications", { params }),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  withdrawApplication: (id) => api.delete(`/applications/${id}`),

  // Recruiter
  getRecruiterApplications: (params) =>
    api.get("/applications/recruiter/all", { params }),
  getJobApplications: (jobId, params) =>
    api.get(`/applications/job/${jobId}`, { params }),
  updateApplicationStatus: (id, data) =>
    api.put(`/applications/${id}/status`, data),
  bulkUpdateApplications: (data) => api.put("/applications/bulk-update", data),
  recalculateATSScores: (jobId, data) =>
    api.post(`/applications/job/${jobId}/calculate-scores`, data),
};

//upload APIs
export const uploadAPI = {
  // Student
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append("photo", file);
    return api.post("/upload/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    return api.post("/upload/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deletePhoto: () => api.delete("/upload/photo"),
  deleteResume: () => api.delete("/upload/resume"),

  // Recruiter
  uploadLogo: (file) => {
    const formData = new FormData();
    formData.append("logo", file);
    return api.post("/upload/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Notification APIs
export const notificationAPI = {
  getNotifications: (params) => api.get("/notifications", { params }),
  getUnreadCount: () => api.get("/notifications/unread-count"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  clearRead: () => api.delete("/notifications/clear-read"),
};

export default api;
