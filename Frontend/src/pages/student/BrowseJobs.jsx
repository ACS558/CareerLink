import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobAPI } from "../../services/api";
import { formatDate } from "../../utils/helpers";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    jobType: "",
    location: "",
    workMode: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobAPI.getAllJobs(filters);
      setJobs(res.data.jobs);
    } catch (error) {
      console.error("Fetch jobs error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const handleReset = () => {
    setFilters({ search: "", jobType: "", location: "", workMode: "" });
    setTimeout(fetchJobs, 100);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Browse Jobs 💼</h1>
            <p className="text-gray-600">Explore available job opportunities</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="input-field"
                  placeholder="🔍 Search by job title..."
                />
              </div>
              <div>
                <select
                  name="jobType"
                  value={filters.jobType}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <select
                  name="workMode"
                  value={filters.workMode}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">All Work Modes</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSearch}
                  className="btn-primary px-6 py-2 flex-1"
                >
                  Search
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary px-4 py-2"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{jobs.length}</span>{" "}
              job(s)
            </p>
          </div>

          {/* Jobs List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <span className="text-5xl">🔍</span>
              <p className="text-gray-500 mt-3 text-lg">No jobs found</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Company Logo/Initial */}
                      <div className="flex items-start space-x-4">
                        <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {job.recruiterId?.companyInfo?.companyLogo?.url ? (
                            <img
                              src={job.recruiterId.companyInfo.companyLogo.url}
                              alt="Company Logo"
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-green-600">
                              {job.recruiterId?.companyInfo?.companyName?.[0] ||
                                "C"}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 font-medium mb-2">
                            {job.recruiterId?.companyInfo?.companyName ||
                              "Company Name"}
                          </p>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                              📍 {job.location}
                            </span>
                            <span className="flex items-center">
                              💼 {job.jobType}
                            </span>
                            <span className="flex items-center">
                              🏢 {job.workMode}
                            </span>
                            {job.salaryRange?.min && (
                              <span className="flex items-center">
                                💰 {job.salaryRange.min}-{job.salaryRange.max}{" "}
                                {job.salaryType}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {job.description}
                          </p>

                          {/* Skills */}
                          {job.skillsRequired?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.skillsRequired
                                .slice(0, 5)
                                .map((skill, i) => (
                                  <span
                                    key={i}
                                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              {job.skillsRequired.length > 5 && (
                                <span className="text-xs text-gray-400">
                                  +{job.skillsRequired.length - 5} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Eligibility */}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {job.eligibilityCriteria?.minCGPA && (
                              <span>
                                Min CGPA: {job.eligibilityCriteria.minCGPA}
                              </span>
                            )}
                            {job.eligibilityCriteria?.branches?.length > 0 && (
                              <span>
                                Branches:{" "}
                                {job.eligibilityCriteria.branches
                                  .slice(0, 3)
                                  .join(", ")}
                              </span>
                            )}
                            {job.numberOfOpenings && (
                              <span>Openings: {job.numberOfOpenings}</span>
                            )}
                          </div>

                          <div className="mt-3 text-xs text-gray-400">
                            Posted {formatDate(job.createdAt)}
                            {job.applicationDeadline &&
                              ` • Deadline: ${formatDate(job.applicationDeadline)}`}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="ml-4">
                      <Link
                        to={`/student/jobs/${job._id}`}
                        className="btn-primary px-6 py-2 text-sm whitespace-nowrap"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BrowseJobs;
