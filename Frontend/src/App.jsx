import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import RegisterStudent from "./pages/auth/RegisterStudent";
import RegisterRecruiter from "./pages/auth/RegisterRecruiter";
import RegisterAdmin from "./pages/auth/RegisterAdmin";
import RegisterAlumni from "./pages/auth/RegisterAlumni";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";

// Recruiter Pages
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import RecruiterJobView from "./pages/recruiter/RecruiterJobView";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import PendingRecruiters from "./pages/admin/PendingRecruiters";
import PendingAlumni from "./pages/admin/PendingAlumni";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageRecruiters from "./pages/admin/ManageRecruiters";
import ManageAlumni from "./pages/admin/ManageAlumni";
import ManageApplications from "./pages/admin/ManageApplications";

// Alumni Pages
import AlumniDashboard from "./pages/alumni/AlumniDashboard";
import AlumniProfile from "./pages/alumni/AlumniProfile";

// Other
import Unauthorized from "./pages/Unauthorized";

// Import job pages
import BrowseJobs from "./pages/student/BrowseJobs";
import JobDetails from "./pages/student/JobDetails";
import PostJob from "./pages/recruiter/PostJob";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import ManageJobs from "./pages/admin/ManageJobs";
import PendingJobs from "./pages/admin/PendingJobs";
import MyApplications from "./pages/student/MyApplications";
import JobApplications from "./pages/recruiter/JobApplications";

// Import NotificationsPage
import NotificationsPage from "./components/common/NotificationsPage";

const App = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px 20px",
          },
          success: { iconTheme: { primary: "#16a34a", secondary: "#fff" } },
          error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            !user ? <Login /> : <Navigate to={`/${user.role}/dashboard`} />
          }
        />
        <Route
          path="/register/student"
          element={
            !user ? (
              <RegisterStudent />
            ) : (
              <Navigate to={`/${user.role}/dashboard`} />
            )
          }
        />
        <Route
          path="/register/recruiter"
          element={
            !user ? (
              <RegisterRecruiter />
            ) : (
              <Navigate to={`/${user.role}/dashboard`} />
            )
          }
        />
        <Route
          path="/register/admin"
          element={
            !user ? (
              <RegisterAdmin />
            ) : (
              <Navigate to={`/${user.role}/dashboard`} />
            )
          }
        />
        <Route
          path="/register/alumni"
          element={
            !user ? (
              <RegisterAlumni />
            ) : (
              <Navigate to={`/${user.role}/dashboard`} />
            )
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/profile"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <RecruiterProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:jobId/applications"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <JobApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:id"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <RecruiterJobView />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/recruiters/pending"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PendingRecruiters />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/alumni/pending"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PendingAlumni />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/recruiters"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageRecruiters />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/alumni"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageAlumni />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageApplications />
            </ProtectedRoute>
          }
        />

        {/* Alumni Routes */}
        <Route
          path="/alumni/dashboard"
          element={
            <ProtectedRoute allowedRoles={["alumni"]}>
              <AlumniDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumni/profile"
          element={
            <ProtectedRoute allowedRoles={["alumni"]}>
              <AlumniProfile />
            </ProtectedRoute>
          }
        />
        {/* Student Job Routes */}
        <Route
          path="/student/jobs"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <BrowseJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/jobs/:id"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <JobDetails />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Job Routes */}
        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <RecruiterJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/post-job"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />

        {/* Admin Job Routes */}
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/pending"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PendingJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute
              allowedRoles={["student", "recruiter", "admin", "alumni"]}
            >
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        {/* Other */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;
