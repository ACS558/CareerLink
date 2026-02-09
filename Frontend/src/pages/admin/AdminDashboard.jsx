import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminAPI } from "../../services/api";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminAPI.getDashboardStats();
      setStats(res.data.statistics);
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard 📊
            </h1>
            <p className="text-gray-600">Placement Cell Management Overview</p>
          </div>

          {/* Pending Actions Alert */}
          {stats?.pendingActions?.total > 0 && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🔔</span>
                <div>
                  <p className="text-blue-800 font-semibold">
                    Pending Approvals
                  </p>
                  <p className="text-blue-700 text-sm">
                    {stats.pendingActions.recruitersAwaitingVerification}{" "}
                    recruiter(s) and{" "}
                    {stats.pendingActions.alumniAwaitingVerification} alumni
                    awaiting verification
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                {stats.pendingActions.recruitersAwaitingVerification > 0 && (
                  <Link
                    to="/admin/recruiters/pending"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Review Recruiters
                  </Link>
                )}
                {stats.pendingActions.alumniAwaitingVerification > 0 && (
                  <Link
                    to="/admin/alumni/pending"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Review Alumni
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">
                  Total Students
                </p>
                <span className="text-lg">👨‍🎓</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.students?.total || 0}
              </p>
              <div className="mt-2 flex space-x-3">
                <span className="text-xs text-green-600">
                  Placed: {stats?.students?.placed || 0}
                </span>
                <span className="text-xs text-yellow-600">
                  Unplaced: {stats?.students?.unplaced || 0}
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">
                  Total Recruiters
                </p>
                <span className="text-lg">🏢</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.recruiters?.total || 0}
              </p>
              <div className="mt-2 flex space-x-3">
                <span className="text-xs text-green-600">
                  Approved: {stats?.recruiters?.approved || 0}
                </span>
                <span className="text-xs text-yellow-600">
                  Pending: {stats?.recruiters?.pending || 0}
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">
                  Total Alumni
                </p>
                <span className="text-lg">🎓</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.alumni?.total || 0}
              </p>
              <div className="mt-2 flex space-x-3">
                <span className="text-xs text-green-600">
                  Verified: {stats?.alumni?.verified || 0}
                </span>
                <span className="text-xs text-yellow-600">
                  Pending: {stats?.alumni?.pending || 0}
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">
                  Placement Rate
                </p>
                <span className="text-lg">📈</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.students?.placementPercentage || 0}%
              </p>
              <p className="text-xs text-gray-500 mt-2">Current Year</p>
            </div>
          </div>

          {/* Second Row: Package Stats + Pending Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Package Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📦 Package Statistics
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-green-700">
                    Highest Package
                  </span>
                  <span className="font-bold text-green-800">
                    {stats?.packages?.highest
                      ? `${stats.packages.highest} LPA`
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-700">
                    Average Package
                  </span>
                  <span className="font-bold text-blue-800">
                    {stats?.packages?.average
                      ? `${stats.packages.average} LPA`
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-yellow-700">
                    Lowest Package
                  </span>
                  <span className="font-bold text-yellow-800">
                    {stats?.packages?.lowest
                      ? `${stats.packages.lowest} LPA`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Pending Recruiters Quick View */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  🏢 Pending Recruiters
                </h2>
                <Link
                  to="/admin/recruiters/pending"
                  className="text-primary-600 text-sm font-medium hover:text-primary-700"
                >
                  View All →
                </Link>
              </div>
              {stats?.recruiters?.pending > 0 ? (
                <div className="flex items-center justify-center p-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-yellow-600">
                      {stats.recruiters.pending}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Recruiter(s) awaiting approval
                    </p>
                    <Link
                      to="/admin/recruiters/pending"
                      className="mt-3 inline-block btn-primary px-4 py-2 text-sm"
                    >
                      Review Now
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <span className="text-3xl">✅</span>
                  <p className="text-gray-500 text-sm mt-2">
                    All recruiters verified
                  </p>
                </div>
              )}
            </div>

            {/* Pending Alumni Quick View */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  🎓 Pending Alumni
                </h2>
                <Link
                  to="/admin/alumni/pending"
                  className="text-primary-600 text-sm font-medium hover:text-primary-700"
                >
                  View All →
                </Link>
              </div>
              {stats?.alumni?.pending > 0 ? (
                <div className="flex items-center justify-center p-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-yellow-600">
                      {stats.alumni.pending}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Alumni awaiting verification
                    </p>
                    <Link
                      to="/admin/alumni/pending"
                      className="mt-3 inline-block btn-primary px-4 py-2 text-sm"
                    >
                      Review Now
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <span className="text-3xl">✅</span>
                  <p className="text-gray-500 text-sm mt-2">
                    All alumni verified
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Navigation
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/admin/recruiters/pending"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-3xl mb-2">🏢</span>
                <p className="text-sm font-medium text-gray-700">
                  Pending Recruiters
                </p>
                {stats?.recruiters?.pending > 0 && (
                  <span className="mt-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    {stats.recruiters.pending}
                  </span>
                )}
              </Link>
              <Link
                to="/admin/alumni/pending"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-3xl mb-2">🎓</span>
                <p className="text-sm font-medium text-gray-700">
                  Pending Alumni
                </p>
                {stats?.alumni?.pending > 0 && (
                  <span className="mt-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    {stats.alumni.pending}
                  </span>
                )}
              </Link>
              <Link
                to="/admin/students"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-3xl mb-2">👥</span>
                <p className="text-sm font-medium text-gray-700">
                  All Students
                </p>
              </Link>
              <Link
                to="/admin/recruiters"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-3xl mb-2">📋</span>
                <p className="text-sm font-medium text-gray-700">
                  All Recruiters
                </p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
