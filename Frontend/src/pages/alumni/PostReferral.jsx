import { useState } from "react";
import { alumniAPI } from "../../services/api";
import toast from "react-hot-toast";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";

const PostReferral = () => {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    referralLink: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await alumniAPI.createReferral(formData);
      toast.success("Referral posted successfully!");

      setFormData({
        company: "",
        role: "",
        location: "",
        referralLink: "",
        description: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post referral");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-6">Post Referral</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow rounded-lg p-6 grid grid-cols-2 gap-4"
          >
            <input
              name="company"
              placeholder="Company"
              value={formData.company}
              onChange={handleChange}
              className="input-field"
              required
            />

            <input
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
              required
            />

            <input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="input-field"
            />

            <input
              name="referralLink"
              placeholder="Referral Link"
              value={formData.referralLink}
              onChange={handleChange}
              className="input-field"
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="input-field col-span-2"
            />

            <button
              type="submit"
              className="btn-primary col-span-2 py-2"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Referral"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default PostReferral;
