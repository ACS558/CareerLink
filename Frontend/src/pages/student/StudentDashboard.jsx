import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { studentAPI } from "../../services/api";
import {
  getCompletionColor,
  getCompletionBadgeColor,
} from "../../utils/helpers";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import toast from "react-hot-toast";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, completionRes] = await Promise.all([
        studentAPI.getProfile(),
        studentAPI.getProfileCompletion(),
      ]);
      setProfile(profileRes.data.profile);
      setCompletion(completionRes.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Profile Incomplete Toast Banner */}
          {completion && completion.completionPercentage < 80 && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-yellow-800 font-semibold">
                    Please complete your profile
                  </p>
                  <p className="text-yellow-700 text-sm">
                    Your profile is {completion.completionPercentage}% complete.
                    Complete it to access all features.
                  </p>
                </div>
              </div>
              <Link
                to="/student/profile"
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Complete Profile
              </Link>
            </div>
          )}

          {/* Welcome Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {profile?.personalInfo?.firstName || "Student"} 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Here's your placement dashboard overview
            </p>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Profile Completion */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Profile</p>
                <span className="text-lg">📊</span>
              </div>
              <p
                className={`text-2xl font-bold ${getCompletionColor(completion?.completionPercentage || 0)}`}
              >
                {completion?.completionPercentage || 0}%
              </p>
              <p className="text-sm text-gray-500 mt-1">Complete</p>
              {/* Progress Bar */}
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    (completion?.completionPercentage || 0) >= 80
                      ? "bg-green-500"
                      : (completion?.completionPercentage || 0) >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${completion?.completionPercentage || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Registration Number */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Reg. Number</p>
                <span className="text-lg">🎫</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {profile?.registrationNumber || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Your ID</p>
            </div>

            {/* CGPA */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">CGPA</p>
                <span className="text-lg">🎓</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {profile?.academicInfo?.cgpa || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Out of 10.0</p>
            </div>

            {/* Skills Count */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Skills</p>
                <span className="text-lg">💻</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {profile?.skills?.length || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Added</p>
            </div>
          </div>

          {/* Two Column Layout: Profile Summary + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Profile Summary Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Profile Summary
                </h2>
                <Link
                  to="/student/profile"
                  className="text-primary-600 text-sm font-medium hover:text-primary-700"
                >
                  Edit →
                </Link>
              </div>

              <div className="space-y-4">
                {/* Name & Reg */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                    {profile?.photo?.url ? (
                      <img
                        src={profile.photo.url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary-600">
                        {(profile?.personalInfo?.firstName || "?")[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {profile?.personalInfo?.firstName}{" "}
                      {profile?.personalInfo?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {profile?.registrationNumber}
                    </p>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Branch</span>
                    <span className="text-sm font-medium text-gray-700">
                      {profile?.academicInfo?.branch || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Semester</span>
                    <span className="text-sm font-medium text-gray-700">
                      {profile?.academicInfo?.semester || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Graduation Year
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {profile?.academicInfo?.graduationYear || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Placement Status
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        profile?.placementStatus === "placed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {profile?.placementStatus === "placed"
                        ? "Placed"
                        : "Unplaced"}
                    </span>
                  </div>
                </div>

                {/* Skills */}
                {profile?.skills?.length > 0 && (
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-500 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.slice(0, 6).map((skill, index) => (
                        <span
                          key={index}
                          className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {profile.skills.length > 6 && (
                        <span className="text-xs text-gray-500">
                          +{profile.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Completion Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Profile Completion
                </h2>
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${getCompletionBadgeColor(completion?.completionPercentage || 0)}`}
                >
                  {completion?.completionPercentage || 0}%
                </span>
              </div>

              <div className="space-y-4">
                {completion?.breakdown &&
                  Object.entries(completion.breakdown).map(([key, value]) => {
                    const labels = {
                      personalInfo: { label: "Personal Info", icon: "👤" },
                      academicInfo: { label: "Academic Info", icon: "📚" },
                      skills: { label: "Skills", icon: "💻" },
                      projects: { label: "Projects", icon: "🛠️" },
                      internships: { label: "Internships", icon: "🏢" },
                      certifications: { label: "Certifications", icon: "🏆" },
                      socialLinks: { label: "Social Links", icon: "🔗" },
                    };
                    const item = labels[key];
                    if (!item) return null;
                    return (
                      <div key={key} className="flex items-center space-x-3">
                        <span className="text-lg w-7 text-center">
                          {item.icon}
                        </span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-700">
                              {item.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {value.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${value.completed ? "bg-green-500" : "bg-gray-300"}`}
                              style={{ width: value.completed ? "100%" : "0%" }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-lg">
                          {value.completed ? "✅" : "⭕"}
                        </span>
                      </div>
                    );
                  })}
              </div>

              {completion?.completionPercentage < 80 && (
                <Link
                  to="/student/profile"
                  className="mt-6 block w-full text-center btn-primary py-2"
                >
                  Complete Your Profile
                </Link>
              )}
            </div>
          </div>

          {/* Projects & Internships Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Projects */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Projects
                </h2>
                <span className="text-sm text-gray-500">
                  {profile?.projects?.length || 0}
                </span>
              </div>
              {profile?.projects?.length > 0 ? (
                <div className="space-y-3">
                  {profile.projects.map((project, index) => (
                    <div
                      key={index}
                      className="border border-gray-100 rounded-lg p-3"
                    >
                      <p className="font-medium text-gray-900 text-sm">
                        {project.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {project.description?.substring(0, 60)}...
                      </p>
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:underline mt-1 inline-block"
                        >
                          Live Link →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm">No projects added yet</p>
                  <Link
                    to="/student/profile"
                    className="text-primary-600 text-sm hover:underline mt-1 inline-block"
                  >
                    Add Project
                  </Link>
                </div>
              )}
            </div>

            {/* Internships */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Internships
                </h2>
                <span className="text-sm text-gray-500">
                  {profile?.internships?.length || 0}
                </span>
              </div>
              {profile?.internships?.length > 0 ? (
                <div className="space-y-3">
                  {profile.internships.map((intern, index) => (
                    <div
                      key={index}
                      className="border border-gray-100 rounded-lg p-3"
                    >
                      <p className="font-medium text-gray-900 text-sm">
                        {intern.role}
                      </p>
                      <p className="text-xs text-gray-500">
                        {intern.companyName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {intern.duration}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm">No internships added</p>
                  <Link
                    to="/student/profile"
                    className="text-primary-600 text-sm hover:underline mt-1 inline-block"
                  >
                    Add Internship
                  </Link>
                </div>
              )}
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Certifications
                </h2>
                <span className="text-sm text-gray-500">
                  {profile?.certifications?.length || 0}
                </span>
              </div>
              {profile?.certifications?.length > 0 ? (
                <div className="space-y-3">
                  {profile.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="border border-gray-100 rounded-lg p-3"
                    >
                      <p className="font-medium text-gray-900 text-sm">
                        {cert.name}
                      </p>
                      <p className="text-xs text-gray-500">{cert.issuedBy}</p>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:underline mt-1 inline-block"
                        >
                          View Certificate →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm">
                    No certifications added
                  </p>
                  <Link
                    to="/student/profile"
                    className="text-primary-600 text-sm hover:underline mt-1 inline-block"
                  >
                    Add Certification
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
