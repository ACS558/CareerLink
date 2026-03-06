import api from "./api";

// Feed API functions
export const feedAPI = {
  // Create post
  createPost: (formData) => {
    return api.post("/feed/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Get feed with pagination and filters
  getFeed: (params = {}) => {
    return api.get("/feed", { params });
  },

  // Get single post
  getPost: (postId) => {
    return api.get(`/feed/${postId}`);
  },

  // Update post
  updatePost: (postId, formData) => {
    return api.put(`/feed/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete post
  deletePost: (postId) => {
    return api.delete(`/feed/${postId}`);
  },

  // Pin post
  pinPost: (postId) => {
    return api.put(`/feed/${postId}/pin`);
  },

  // Unpin post
  unpinPost: (postId) => {
    return api.put(`/feed/${postId}/unpin`);
  },

  // Track view
  trackView: (postId) => {
    return api.post(`/feed/${postId}/view`);
  },

  // Get analytics
  getAnalytics: (postId) => {
    return api.get(`/feed/analytics/${postId}`);
  },

  // Remove image
  removeImage: (postId, publicId) => {
    return api.delete(`/feed/${postId}/image`, {
      data: { publicId },
    });
  },

  // Remove document
  removeDocument: (postId, publicId) => {
    return api.delete(`/feed/${postId}/document`, {
      data: { publicId },
    });
  },
};

export default feedAPI;
