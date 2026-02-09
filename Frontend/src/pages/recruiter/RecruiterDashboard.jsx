import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { recruiterAPI } from "../../services/api";
import { getStatusBadgeColor } from "../../utils/helpers";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";

const RecruiterDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await recruiterAPI.getProfile();
      setProfile(res.data.profile);
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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {profile?.companyInfo?.companyName} 🏢
              </h1>
              <p className="text-gray-600">Recruiter Dashboard</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(profile?.verificationStatus)}`}
            >
              {profile?.verificationStatus?.charAt(0).toUpperCase() +
                profile?.verificationStatus?.slice(1)}
            </span>
          </div>

          {/* Verification Banners */}
          {profile?.verificationStatus === "pending" && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="text-yellow-800 font-semibold">
                  Verification Pending
                </p>
                <p className="text-yellow-700 text-sm">
                  Your account is awaiting admin approval. You can update your
                  company profile while waiting.
                </p>
              </div>
            </div>
          )}

          {profile?.verificationStatus === "rejected" && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <span className="text-2xl">❌</span>
              <div>
                <p className="text-red-800 font-semibold">
                  Verification Rejected
                </p>
                <p className="text-red-700 text-sm">
                  Please contact the placement cell for more information.
                </p>
              </div>
            </div>
          )}

          {profile?.verificationStatus === "approved" && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-green-800 font-semibold">Account Verified</p>
                <p className="text-green-700 text-sm">
                  Your account has been approved. You can now post jobs and
                  manage applications.
                  {profile?.verifiedBy && ` Verified by: ${profile.verifiedBy}`}
                </p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span className="text-lg">🛡️</span>
              </div>
              <p
                className={`text-lg font-bold capitalize ${
                  profile?.verificationStatus === "approved"
                    ? "text-green-600"
                    : profile?.verificationStatus === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                }`}
              >
                {profile?.verificationStatus}
              </p>
              <p className="text-sm text-gray-500 mt-1">Verification</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Industry</p>
                <span className="text-lg">🏭</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {profile?.companyInfo?.industry || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Company Type</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Location</p>
                <span className="text-lg">📍</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {profile?.companyInfo?.location || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Company Location</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Size</p>
                <span className="text-lg">👥</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {profile?.companyInfo?.companySize || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Employees</p>
            </div>
          </div>

          {/* Two Column: Company + Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Company Information
                </h2>
                <Link
                  to="/recruiter/profile"
                  className="text-primary-600 text-sm font-medium hover:text-primary-700"
                >
                  Edit →
                </Link>
              </div>

              {/* Company Logo */}
              {profile?.companyInfo?.companyLogo?.url && (
                <div className="flex justify-center mb-4 pb-4 border-b">
                  <img
                    src={profile.companyInfo.companyLogo.url}
                    alt="Company Logo"
                    className="h-20 w-auto object-contain"
                  />
                </div>
              )}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Company Name</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {profile?.companyInfo?.companyName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Industry</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {profile?.companyInfo?.industry || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Size</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {profile?.companyInfo?.companySize || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Location</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {profile?.companyInfo?.location || "—"}
                  </span>
                </div>
                {profile?.companyInfo?.website && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Website</span>
                    <a
                      href={profile.companyInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      {profile.companyInfo.website}
                    </a>
                  </div>
                )}
                {profile?.companyInfo?.description && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-500 mb-1">About</p>
                    <p className="text-sm text-gray-700">
                      {profile.companyInfo.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Contact Person
                </h2>
                <Link
                  to="/recruiter/profile"
                  className="text-primary-600 text-sm font-medium hover:text-primary-700"
                >
                  Edit →
                </Link>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-green-600">
                    {(profile?.contactPerson?.name || "?")[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {profile?.contactPerson?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {profile?.contactPerson?.designation}
                  </p>
                </div>
              </div>
              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Phone</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {profile?.contactPerson?.phoneNumber || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {profile?.contactPerson?.email || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
