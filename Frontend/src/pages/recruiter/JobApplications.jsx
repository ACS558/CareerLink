import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applicationAPI, jobAPI } from "../../services/api";
import {
  getApplicationStatusColor,
  getApplicationStatusLabel,
  formatDate,
} from "../../utils/helpers";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import toast from "react-hot-toast";

const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedApps, setSelectedApps] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusAction, setStatusAction] = useState("");
  const [recruiterNotes, setRecruiterNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [calculatingATS, setCalculatingATS] = useState(false);

  useEffect(() => {
    fetchJob();
    fetchApplications();
  }, [jobId, filterStatus]);

  const fetchJob = async () => {
    try {
      const res = await jobAPI.getJobById(jobId);
      setJob(res.data.job);
    } catch (error) {
      console.error("Fetch job error:", error);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const res = await applicationAPI.getJobApplications(jobId, params);
      setApplications(res.data.applications);
      setStats(res.data.stats);
    } catch (error) {
      console.error("Fetch applications error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (statusAction === "rejected" && !rejectionReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }

    setActionLoading(true);
    try {
      await applicationAPI.updateApplicationStatus(selectedApp._id, {
        status: statusAction,
        recruiterNotes,
        rejectionReason,
      });
      toast.success(`Application ${statusAction} successfully`);
      setShowStatusModal(false);
      setSelectedApp(null);
      setStatusAction("");
      setRecruiterNotes("");
      setRejectionReason("");
      fetchApplications();
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedApps.length === 0) {
      toast.error("Please select applications first");
      return;
    }

    let reason = "";
    if (action === "rejected") {
      reason = prompt("Enter rejection reason:");
      if (!reason) return;
    }

    try {
      await applicationAPI.bulkUpdateApplications({
        applicationIds: selectedApps,
        status: action,
        rejectionReason: reason || undefined,
      });
      toast.success(`${selectedApps.length} application(s) ${action}`);
      setSelectedApps([]);
      fetchApplications();
    } catch (error) {
      console.error("Bulk action error:", error);
    }
  };

  const toggleSelectApp = (appId) => {
    if (selectedApps.includes(appId)) {
      setSelectedApps(selectedApps.filter((id) => id !== appId));
    } else {
      setSelectedApps([...selectedApps, appId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedApps.length === applications.length) {
      setSelectedApps([]);
    } else {
      setSelectedApps(applications.map((app) => app._id));
    }
  };

  if (loading && !applications.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const handleCalculateATS = async () => {
    const threshold = prompt("Enter auto-shortlist threshold (0-100):", "70");
    if (!threshold) return;

    const thresholdNum = parseInt(threshold);
    if (isNaN(thresholdNum) || thresholdNum < 0 || thresholdNum > 100) {
      toast.error("Invalid threshold. Must be between 0-100");
      return;
    }

    setCalculatingATS(true);
    try {
      const res = await applicationAPI.recalculateATSScores(jobId, {
        autoShortlistThreshold: thresholdNum,
      });
      toast.success(res.data.message);
      fetchApplications();
    } catch (error) {
      console.error("Calculate ATS error:", error);
    } finally {
      setCalculatingATS(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/recruiter/jobs")}
              className="text-primary-600 hover:text-primary-700 mb-4 flex items-center"
            >
              ← Back to My Jobs
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Applications for: {job?.title}
              </h1>
              <p className="text-gray-600">
                {job?.location} • {job?.jobType}
              </p>
            </div>
            <button
              onClick={handleCalculateATS}
              disabled={calculatingATS}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              {calculatingATS ? "Calculating..." : "🎯 Calculate ATS Scores"}
            </button>
          </div>
          <br />

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg shadow-md p-4">
                <p className="text-sm text-blue-600">Applied</p>
                <p className="text-2xl font-bold text-blue-700">
                  {stats.applied}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg shadow-md p-4">
                <p className="text-sm text-green-600">Shortlisted</p>
                <p className="text-2xl font-bold text-green-700">
                  {stats.shortlisted}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg shadow-md p-4">
                <p className="text-sm text-purple-600">Selected</p>
                <p className="text-2xl font-bold text-purple-700">
                  {stats.selected}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg shadow-md p-4">
                <p className="text-sm text-red-600">Rejected</p>
                <p className="text-2xl font-bold text-red-700">
                  {stats.rejected}
                </p>
              </div>
            </div>
          )}

          {/* Filters & Bulk Actions */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input-field w-48"
                >
                  <option value="">All Applications</option>
                  <option value="applied">Applied</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="selected">Selected</option>
                  <option value="on-hold">On Hold</option>
                </select>
                <span className="text-sm text-gray-500">
                  {applications.length} application(s)
                </span>
              </div>
              {selectedApps.length > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {selectedApps.length} selected
                  </span>
                  <button
                    onClick={() => handleBulkAction("shortlisted")}
                    className="btn-success px-4 py-1 text-sm"
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() => handleBulkAction("on-hold")}
                    className="btn-secondary px-4 py-1 text-sm"
                  >
                    On Hold
                  </button>
                  <button
                    onClick={() => handleBulkAction("rejected")}
                    className="btn-danger px-4 py-1 text-sm"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Applications List */}
          {applications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <span className="text-5xl">📭</span>
              <p className="text-gray-500 mt-3 text-lg">No applications yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Select All */}
              <div className="bg-gray-50 px-6 py-3 border-b flex items-center">
                <input
                  type="checkbox"
                  checked={selectedApps.length === applications.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Select All
                </span>
              </div>

              {/* Applications */}
              <div className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedApps.includes(app._id)}
                        onChange={() => toggleSelectApp(app._id)}
                        className="mt-1 w-4 h-4 text-primary-600 rounded"
                      />

                      {/* Student Avatar */}
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-primary-600">
                          {app.studentId?.personalInfo?.firstName?.[0] || "?"}
                        </span>
                      </div>

                      {/* Student Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {app.studentId?.personalInfo?.firstName}{" "}
                              {app.studentId?.personalInfo?.lastName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {app.studentId?.registrationNumber}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${getApplicationStatusColor(app.status)}`}
                          >
                            {getApplicationStatusLabel(app.status)}
                          </span>
                        </div>

                        {/* Academic Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div>
                            <p className="text-xs text-gray-400">Branch</p>
                            <p className="text-sm font-medium text-gray-700">
                              {app.studentId?.academicInfo?.branch || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">CGPA</p>
                            <p className="text-sm font-medium text-gray-700">
                              {app.studentId?.academicInfo?.cgpa || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Backlogs</p>
                            <p className="text-sm font-medium text-gray-700">
                              {app.studentId?.academicInfo?.backlogs || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Graduation</p>
                            <p className="text-sm font-medium text-gray-700">
                              {app.studentId?.academicInfo?.graduationYear ||
                                "—"}
                            </p>
                          </div>
                        </div>

                        {/* Skills */}
                        {app.studentId?.skills?.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-400 mb-1">Skills</p>
                            <div className="flex flex-wrap gap-1">
                              {app.studentId.skills
                                .slice(0, 6)
                                .map((skill, i) => (
                                  <span
                                    key={i}
                                    className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              {app.studentId.skills.length > 6 && (
                                <span className="text-xs text-gray-400">
                                  +{app.studentId.skills.length - 6} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Projects Count */}
                        <div>
                          <p className="text-xs text-gray-400">Projects</p>
                          <p className="text-sm font-medium text-gray-700">
                            {app.studentId?.projects?.length || 0}
                          </p>
                        </div>

                        {/* ATS Score Badge - INLINE */}
                        {app.atsScore?.score && (
                          <div>
                            <p className="text-xs text-gray-400">ATS Score</p>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-bold text-purple-600">
                                {app.atsScore.score}%
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  app.atsScore.score >= 80
                                    ? "bg-green-100 text-green-700"
                                    : app.atsScore.score >= 60
                                      ? "bg-blue-100 text-blue-700"
                                      : app.atsScore.score >= 40
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                              >
                                {app.atsScore.score >= 80
                                  ? "Excellent"
                                  : app.atsScore.score >= 60
                                    ? "Good"
                                    : app.atsScore.score >= 40
                                      ? "Fair"
                                      : "Poor"}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Cover Letter */}
                        {app.coverLetter && (
                          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-400 mb-1">
                              Cover Letter
                            </p>
                            <p className="text-sm text-gray-700">
                              {app.coverLetter}
                            </p>
                          </div>
                        )}

                        {/* Timeline */}
                        <div className="flex items-center space-x-4 text-xs text-gray-400 mb-3">
                          <span>Applied: {formatDate(app.appliedAt)}</span>
                          {app.shortlistedAt && (
                            <span>
                              Shortlisted: {formatDate(app.shortlistedAt)}
                            </span>
                          )}
                          {app.selectedAt && (
                            <span>Selected: {formatDate(app.selectedAt)}</span>
                          )}
                        </div>
                        {/* ATS Score Display */}
                        {app.atsScore?.score && (
                          <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div
                                  className="w-12 h-12 rounded-full flex items-center justify-center"
                                  style={{
                                    background: `conic-gradient(#8b5cf6 ${app.atsScore.score * 3.6}deg, #e5e7eb 0deg)`,
                                  }}
                                >
                                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-purple-600">
                                      {app.atsScore.score}%
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-700">
                                    ATS Match Score
                                  </p>
                                  <p
                                    className={`text-xs font-medium ${
                                      app.atsScore.recommendation ===
                                      "Highly recommended"
                                        ? "text-green-700"
                                        : app.atsScore.recommendation ===
                                            "Recommended"
                                          ? "text-blue-700"
                                          : app.atsScore.recommendation ===
                                              "Maybe"
                                            ? "text-yellow-700"
                                            : "text-red-700"
                                    }`}
                                  >
                                    {app.atsScore.recommendation}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  alert(
                                    `Strengths:\n${app.atsScore.strengths?.join("\n")}\n\nWeaknesses:\n${app.atsScore.weaknesses?.join("\n")}`,
                                  );
                                }}
                                className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                              >
                                View Details →
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          {app.status === "applied" && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedApp(app);
                                  setStatusAction("shortlisted");
                                  setShowStatusModal(true);
                                }}
                                className="btn-success px-4 py-1 text-sm"
                              >
                                Shortlist
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedApp(app);
                                  setStatusAction("on-hold");
                                  setShowStatusModal(true);
                                }}
                                className="btn-secondary px-4 py-1 text-sm"
                              >
                                On Hold
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedApp(app);
                                  setStatusAction("rejected");
                                  setShowStatusModal(true);
                                }}
                                className="btn-danger px-4 py-1 text-sm"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {app.status === "shortlisted" && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedApp(app);
                                  setStatusAction("selected");
                                  setShowStatusModal(true);
                                }}
                                className="bg-purple-600 text-white px-4 py-1 rounded-lg hover:bg-purple-700 text-sm"
                              >
                                Select
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedApp(app);
                                  setStatusAction("rejected");
                                  setShowStatusModal(true);
                                }}
                                className="btn-danger px-4 py-1 text-sm"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Update Modal */}
          {showStatusModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {statusAction.charAt(0).toUpperCase() + statusAction.slice(1)}{" "}
                  Application
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  {selectedApp?.studentId?.personalInfo?.firstName}{" "}
                  {selectedApp?.studentId?.personalInfo?.lastName}
                </p>
                <div className="space-y-3">
                  {statusAction === "rejected" && (
                    <div>
                      <label className="label">Rejection Reason *</label>
                      <textarea
                        className="input-field"
                        rows="3"
                        placeholder="Enter reason..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </div>
                  )}
                  <div>
                    <label className="label">Notes (Optional)</label>
                    <textarea
                      className="input-field"
                      rows="2"
                      placeholder="Add notes..."
                      value={recruiterNotes}
                      onChange={(e) => setRecruiterNotes(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-5">
                  <button
                    onClick={() => {
                      setShowStatusModal(false);
                      setSelectedApp(null);
                      setRecruiterNotes("");
                      setRejectionReason("");
                    }}
                    className="btn-secondary px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusChange}
                    disabled={actionLoading}
                    className="btn-primary px-6 py-2"
                  >
                    {actionLoading ? "Updating..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobApplications;
