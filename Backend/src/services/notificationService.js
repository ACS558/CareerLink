import Notification from "../models/Notification.js";

// Create notification helper
export const createNotification = async ({
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
}) => {
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

  newApplication: (studentName, jobTitle) => ({
    type: "application_received",
    title: "New Application Received 📝",
    message: `${studentName} has applied for ${jobTitle}.`,
    priority: "medium",
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
};
