import { useState } from "react";
import { studentAPI } from "../../services/api";
import toast from "react-hot-toast";

const UnplacedStudentGuidance = ({ daysLeft }) => {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    setLoading(true);
    try {
      await studentAPI.requestExtension(reason);
      toast.success("Extension request submitted!");
      setShowModal(false);
      setReason("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const careerPaths = [
    {
      icon: "🎓",
      title: "Higher Education",
      desc: "Pursue M.Tech, MS, MBA, or PhD for advanced learning",
    },
    {
      icon: "💻",
      title: "Skill Development",
      desc: "Learn new skills through online courses and certifications",
    },
    {
      icon: "🏢",
      title: "Off-Campus Jobs",
      desc: "Apply to companies hiring throughout the year",
    },
    {
      icon: "💼",
      title: "Freelancing",
      desc: "Start freelancing or take up internships to gain experience",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">🎯</span>
          <div>
            <h2 className="text-2xl font-bold">Explore Your Career Options</h2>
            <p className="text-blue-100">Many paths lead to success</p>
          </div>
        </div>
      </div>

      {/* Expiry Warning */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-orange-800">
              ⏰ Account expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
            </p>
            <p className="text-sm text-orange-700 mt-1">
              Download your data and explore options below
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm"
          >
            Request Extension
          </button>
        </div>
      </div>

      {/* Career Paths */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Career Path Options</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {careerPaths.map((path, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition"
            >
              <div className="flex items-start space-x-3">
                <span className="text-3xl">{path.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {path.title}
                  </h4>
                  <p className="text-sm text-gray-600">{path.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Request Extension</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border rounded-lg p-3 mb-4"
                rows="4"
                placeholder="E.g., Preparing for GATE, Enrolled in course..."
                required
              />
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border rounded-lg py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnplacedStudentGuidance;
