import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { alumniAPI } from "../../services/api";
import { getStatusBadgeColor } from "../../utils/helpers";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";

const AlumniDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await alumniAPI.getProfile();
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
                Welcome, {profile?.personalInfo?.firstName} 🎓
              </h1>
              <p className="text-gray-600">Alumni Dashboard</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(profile?.verificationStatus)}`}
            >
              {profile?.verificationStatus === "verified"
                ? "Verified"
                : profile?.verificationStatus?.charAt(0).toUpperCase() +
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
                  Your account is awaiting admin verification. Update your
                  profile while you wait.
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

          {profile?.verificationStatus === "verified" && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-green-800 font-semibold">Account Verified</p>
                <p className="text-green-700 text-sm">
                  You are verified! You can now post referrals and help current
                  students.
                  {profile?.verifiedBy && ` Verified by: ${profile.verifiedBy}`}
                </p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Reg Number</p>
                <span className="text-lg">🎫</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {profile?.registrationNumber}
              </p>
              <p className="text-sm text-gray-500 mt-1">Your ID</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Company</p>
                <span className="text-lg">🏢</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {profile?.currentRole?.company || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Current Company</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Role</p>
                <span className="text-lg">💼</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {profile?.currentRole?.designation || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Current Role</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Experience</p>
                <span className="text-lg">📈</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {profile?.currentRole?.experience || 0} Yrs
              </p>
              <p className="text-sm text-gray-500 mt-1">Work Experience</p>
            </div>
          </div>

          {/* Profile Summary + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Profile Summary
                </h2>
                <Link
                  to="/alumni/profile"
                  className="text-primary-600 text-sm font-medium hover:text-primary-700"
                >
                  Edit →
                </Link>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">
                    {(profile?.personalInfo?.firstName || "?")[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {profile?.personalInfo?.firstName}{" "}
                    {profile?.personalInfo?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {profile?.registrationNumber} • Batch{" "}
                    {profile?.academicInfo?.graduationYear}
                  </p>
                </div>
              </div>
              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Branch</span>
                  <span className="text-sm font-medium text-gray-700">
                    {profile?.academicInfo?.branch || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Graduation</span>
                  <span className="text-sm font-medium text-gray-700">
                    {profile?.academicInfo?.graduationYear || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Company</span>
                  <span className="text-sm font-medium text-gray-700">
                    {profile?.currentRole?.company || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Designation</span>
                  <span className="text-sm font-medium text-gray-700">
                    {profile?.currentRole?.designation || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Experience</span>
                  <span className="text-sm font-medium text-gray-700">
                    {profile?.currentRole?.experience || 0} years
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  to="/alumni/profile"
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="font-medium text-gray-900">Update Profile</p>
                    <p className="text-xs text-gray-500">
                      Keep your profile information updated
                    </p>
                  </div>
                </Link>
                <Link
                  to="/alumni/post-referral"
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl">🔗</span>
                  <div>
                    <p className="font-medium text-gray-900">Post a Referral</p>
                    <p className="text-xs text-gray-500">
                      Share job opportunities with students
                    </p>
                  </div>
                </Link>
                <Link
                  to="/alumni/referrals"
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="font-medium text-gray-900">My Referrals</p>
                    <p className="text-xs text-gray-500">
                      View your posted referrals
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AlumniDashboard;
