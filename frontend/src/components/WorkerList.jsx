import React, { useState, useEffect } from "react";
import { workerAPI } from "../services/api";
import { useToast } from "../utils/toast";

function WorkerList() {
  const { showToast } = useToast();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    job: "Electrician",
    isAvailable: true,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const res = await workerAPI.getAll();
      setWorkers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching workers:", error);
      showToast("Failed to fetch workers list", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear field error
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    else if (formData.name.length < 2) errors.name = "Name must be at least 2 characters";

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    if (!formData.job.trim()) errors.job = "Job specialty is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateWorker = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitLoading(true);
      await workerAPI.create(formData);
      showToast("Worker registered successfully!", "success");
      setShowModal(false);
      // Reset form
      setFormData({
        name: "",
        phoneNumber: "",
        job: "Electrician",
        isAvailable: true,
      });
      fetchWorkers();
    } catch (error) {
      console.error("Error creating worker:", error);
      showToast(error.message || "Failed to register worker", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteWorker = async (id) => {
    if (!window.confirm("Are you sure you want to delete this worker?")) return;
    try {
      await workerAPI.delete(id);
      showToast("Worker deleted successfully!", "success");
      fetchWorkers();
    } catch (error) {
      console.error("Error deleting worker:", error);
      showToast("Failed to delete worker", "error");
    }
  };

  const handleToggleAvailability = async (worker) => {
    try {
      const updatedData = {
        name: worker.name,
        phoneNumber: worker.phoneNumber,
        job: worker.job,
        isAvailable: !worker.isAvailable,
      };
      await workerAPI.update(worker.id, updatedData);
      showToast(
        `Worker status updated to ${!worker.isAvailable ? "Available" : "Busy"}`,
        "info"
      );
      fetchWorkers();
    } catch (error) {
      console.error("Error updating worker status:", error);
      showToast("Failed to update status", "error");
    }
  };

  const getJobColor = (job) => {
    switch (job.toLowerCase()) {
      case "electrician":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "plumber":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "it support":
      case "wifi support":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "carpenter":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "cleaning":
        return "bg-teal-100 text-teal-800 border-teal-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Staff & Workers</h1>
          <p className="text-gray-500 mt-1">Manage hostel maintenance technicians, electricians, plumbers, and IT staff.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition duration-200"
        >
          + Register Worker
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="border-4 border-gray-200 border-t-indigo-600 rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading workers list...</p>
        </div>
      ) : workers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
          <span className="text-5xl block mb-4">👷</span>
          <h3 className="text-xl font-bold text-gray-800">No Workers Registered</h3>
          <p className="text-gray-500 mt-2">Add technicians to assign them to student maintenance request tickets.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition"
          >
            Add Your First Worker
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{worker.name}</h3>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border mt-1.5 ${getJobColor(worker.job)}`}>
                      {worker.job}
                    </span>
                  </div>
                  <span
                    onClick={() => handleToggleAvailability(worker)}
                    className={`cursor-pointer px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                      worker.isAvailable
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {worker.isAvailable ? "● Available" : "● Busy (Assigned)"}
                  </span>
                </div>

                <div className="space-y-2.5 text-gray-600 text-sm my-5">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📞</span>
                    <a href={`tel:${worker.phoneNumber}`} className="hover:text-indigo-600 font-medium">
                      {worker.phoneNumber}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 border-t border-gray-100 pt-4 mt-2">
                <button
                  onClick={() => handleToggleAvailability(worker)}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition"
                >
                  Change Status
                </button>
                <button
                  onClick={() => handleDeleteWorker(worker.id)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-100 transition"
                  title="Remove Worker"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Worker Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-md overflow-hidden animate-scale-up border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Register New Staff/Worker</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white text-2xl font-light focus:outline-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateWorker} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                    formErrors.name ? "border-red-500 focus:ring-red-300" : "border-gray-300"
                  }`}
                />
                {formErrors.name && <span className="text-red-500 text-xs mt-1 block">{formErrors.name}</span>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number (10 digits)</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 9876543210"
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                    formErrors.phoneNumber ? "border-red-500 focus:ring-red-300" : "border-gray-300"
                  }`}
                />
                {formErrors.phoneNumber && <span className="text-red-500 text-xs mt-1 block">{formErrors.phoneNumber}</span>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Job Specialty</label>
                <select
                  name="job"
                  value={formData.job}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                >
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="IT Support">IT & Wi-Fi Support</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Cleaning">Cleaning / Janitorial</option>
                  <option value="Painter">Painter</option>
                  <option value="Locksmith">Locksmith</option>
                  <option value="Other">Other Maintenance</option>
                </select>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  name="isAvailable"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="isAvailable" className="text-sm text-gray-700 font-medium select-none">
                  Available for Assignment immediately
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-95 transition disabled:opacity-50"
                >
                  {submitLoading ? "Registering..." : "Register Worker"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkerList;
