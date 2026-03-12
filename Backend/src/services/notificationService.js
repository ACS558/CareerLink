import Notification from "../models/Notification.js";

// Create notification helper
export const createNotification = async (
  {
    userId,
    userRole,
    type,
    title,
    message,
    relatedJob = null,
    relatedApplication = null,
    relatedUser = null,
    actionUrl = null,
    priority = "medium",
  },
  io = null,
) => {
  try {
    const notification = await Notification.create({
      userId,
      userRole,
      type,
      title,
      message,
      relatedJob,
      relatedApplication,
      relatedUser,
      actionUrl,
      priority,
    });

    console.log(`📬 Notification created for ${userRole} ${userId}: ${title}`);

    // ✅ EMIT REAL-TIME NOTIFICATION VIA SOCKET
    if (io) {
      try {
        // Get unread count
        const unreadCount = await Notification.countDocuments({
          userId,
          isRead: false,
        });

        // Emit to user's room
        io.to(userId.toString()).emit("new_notification", {
          notification: {
            _id: notification._id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            priority: notification.priority,
            actionUrl: notification.actionUrl,
            createdAt: notification.createdAt,
          },
          unreadCount,
        });

        console.log(`🔔 Real-time notification sent to user ${userId}`);
      } catch (socketError) {
        console.error("Socket emit error:", socketError);
        // Don't fail notification creation if socket fails
      }
    }

    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
};

// Notification templates
export const notificationTemplates = {
  // Student notifications
  applicationShortlisted: (jobTitle, companyName) => ({
    type: "application_shortlisted",
    title: "Application Shortlisted! 🎉",
    message: `Congratulations! You've been shortlisted for ${jobTitle} at ${companyName}.`,
    priority: "high",
  }),

  applicationRejected: (jobTitle, companyName) => ({
    type: "application_rejected",
    title: "Application Update",
    message: `Your application for ${jobTitle} at ${companyName} was not successful this time.`,
    priority: "medium",
  }),

  applicationSelected: (jobTitle, companyName) => ({
    type: "application_selected",
    title: "You're Selected! 🎊",
    message: `Congratulations! You've been selected for ${jobTitle} at ${companyName}.`,
    priority: "high",
  }),

  applicationPending: (jobTitle, companyName) => ({
    type: "application_pending",
    title: "📋 Application Under Review",
    message: `Your application for ${jobTitle} at ${companyName} is being reviewed.`,
    priority: "medium",
  }),

  // Recruiter notifications
  jobApproved: (jobTitle) => ({
    type: "job_approved",
    title: "Job Posting Approved ✅",
    message: `Your job posting "${jobTitle}" has been approved and is now live.`,
    priority: "high",
  }),

  jobRejected: (jobTitle, reason) => ({
    type: "job_rejected",
    title: "Job Posting Rejected ❌",
    message: `Your job posting "${jobTitle}" was rejected. Reason: ${reason}`,
    priority: "high",
  }),

  recruiterApproved: () => ({
    type: "recruiter_approved",
    title: "Account Approved! 🎉",
    message: "Your recruiter account has been approved. You can now post jobs.",
    priority: "high",
  }),

  recruiterRejected: (reason) => ({
    type: "recruiter_rejected",
    title: "Account Rejected",
    message: `Your recruiter account was not approved. Reason: ${reason}`,
    priority: "high",
  }),

  // Alumni notifications
  alumniApproved: () => ({
    type: "alumni_approved",
    title: "Account Approved! 🎓",
    message: "Your alumni account has been verified and approved.",
    priority: "high",
  }),

  alumniRejected: (reason) => ({
    type: "alumni_rejected",
    title: "Account Rejected",
    message: `Your alumni account was not approved. Reason: ${reason}`,
    priority: "high",
  }),
  extensionApproved: (days) => ({
    type: "extension_approved",
    title: "✅ Extension Request Approved",
    message: `Your account extension request has been approved! Your account is now valid for ${days} more days.`,
  }),

  extensionRejected: () => ({
    type: "extension_rejected",
    title: "❌ Extension Request Rejected",
    message:
      "Your account extension request has been reviewed and rejected. Please contact administration for more details.",
  }),

  newExtensionRequest: (studentName, registrationNumber) => ({
    type: "extension_request",
    title: "📝 New Extension Request",
    message: `${studentName} (${registrationNumber}) has requested an account extension.`,
  }),

  placementOffer: (jobTitle, companyName) => ({
    type: "placement_offer",
    title: "🎉 New Job Offer!",
    message: `Congratulations! You've been selected for ${jobTitle} at ${companyName}. Check "My Placements" to manage your offer.`,
    priority: "high",
  }),
};
