import React, { useState, useEffect } from "react";
import { maintenanceAPI, studentAPI, hostelAPI, workerAPI } from "../services/api";
import { useToast } from "../utils/toast";

function MaintenanceList() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Create Request Form State
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    hostelId: "",
    roomId: "",
    title: "",
    description: "",
    category: "PLUMBING",
    priority: "MEDIUM",
  });
  const [formErrors, setFormErrors] = useState({});

  // Assign Form State
  const [selectedWorkerId, setSelectedWorkerId] = useState("");
  
  // Resolve Form State
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    fetchRequests();
    fetchDropdownData();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await maintenanceAPI.getAll();
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      showToast("Failed to fetch maintenance tickets", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [studentsRes, hostelsRes, workersRes] = await Promise.all([
        studentAPI.getAll(),
        hostelAPI.getAll(),
        workerAPI.getAll(),
      ]);
      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
      setHostels(Array.isArray(hostelsRes.data) ? hostelsRes.data : []);
      setWorkers(Array.isArray(workersRes.data) ? workersRes.data : []);
    } catch (error) {
      console.error("Error fetching dropdowns:", error);
    }
  };

  // Load rooms when hostel is selected in Create Request Form
  const handleHostelChange = async (hostelId) => {
    if (!hostelId) {
      setRooms([]);
      return;
    }
    try {
      const res = await hostelAPI.getRooms(hostelId);
      setRooms(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      showToast("Failed to load rooms for the selected hostel", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "studentId") {
      const selectedStudent = students.find((s) => s.studentId === value);
      setFormData((prev) => ({
        ...prev,
        studentName: selectedStudent ? selectedStudent.name : "",
      }));
    }

    if (name === "hostelId") {
      handleHostelChange(value);
      setFormData((prev) => ({ ...prev, roomId: "" })); // reset room
    }

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.studentId) errors.studentId = "Student selection is required";
    if (!formData.hostelId) errors.hostelId = "Hostel selection is required";
    if (!formData.roomId) errors.roomId = "Room selection is required";
    if (!formData.title.trim()) errors.title = "Summary is required";
    if (!formData.description.trim()) errors.description = "Detailed description is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await maintenanceAPI.create(formData);
      showToast("Maintenance ticket logged successfully", "success");
      setShowCreateModal(false);
      setFormData({
        studentId: "",
        studentName: "",
        hostelId: "",
        roomId: "",
        title: "",
        description: "",
        category: "PLUMBING",
        priority: "MEDIUM",
      });
      fetchRequests();
    } catch (error) {
      console.error("Error creating request:", error);
      showToast(error.message || "Failed to log maintenance request", "error");
    }
  };

  const openAssignModal = (ticket) => {
    setSelectedTicket(ticket);
    // Reload workers to get latest availability
    fetchDropdownData();
    setSelectedWorkerId("");
    setShowAssignModal(true);
  };

  const handleAssignWorker = async (e) => {
    e.preventDefault();
    if (!selectedWorkerId) {
      showToast("Please select a worker", "warning");
      return;
    }

    try {
      await maintenanceAPI.assign(selectedTicket.id, selectedWorkerId);
      showToast("Worker assigned successfully", "success");
      setShowAssignModal(false);
      fetchRequests();
    } catch (error) {
      console.error("Error assigning worker:", error);
      showToast(error.message || "Failed to assign worker", "error");
    }
  };

  const openResolveModal = (ticket) => {
    setSelectedTicket(ticket);
    setRemarks("");
    setShowResolveModal(true);
  };

  const handleResolveTicket = async (e) => {
    e.preventDefault();
    try {
      await maintenanceAPI.resolve(selectedTicket.id, remarks);
      showToast("Ticket marked as resolved", "success");
      setShowResolveModal(false);
      fetchRequests();
    } catch (error) {
      console.error("Error resolving ticket:", error);
      showToast("Failed to resolve ticket", "error");
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "LOW":
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-100 text-green-800 border border-green-200";
      case "ASSIGNED":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      case "PENDING":
      default:
        return "bg-rose-100 text-rose-800 border border-rose-200";
    }
  };

  // Helper: Find Hostel Name and Room Number by IDs
  const getHostelName = (hostelId) => {
    const hostel = hostels.find((h) => h.id === hostelId);
    return hostel ? hostel.hostelName : `Hostel #${hostelId}`;
  };

  // Filter requests based on status tabs and search
  const filteredRequests = requests.filter((req) => {
    const matchesStatus = statusFilter === "ALL" || req.status === statusFilter;
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Maintenance Tickets</h1>
          <p className="text-gray-500 mt-1">Log, assign, and track progress of room repair requests.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition duration-200 self-start md:self-auto"
        >
          + File Repair Request
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {/* Status Tabs */}
        <div className="flex bg-gray-100 p-1.5 rounded-lg w-full sm:w-auto overflow-x-auto">
          {["ALL", "PENDING", "ASSIGNED", "RESOLVED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                statusFilter === tab
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by title, student, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="border-4 border-gray-200 border-t-indigo-600 rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading tickets...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
          <span className="text-5xl block mb-4">🛠️</span>
          <h3 className="text-xl font-bold text-gray-800">No Tickets Found</h3>
          <p className="text-gray-500 mt-2">There are no maintenance tickets matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-gray-400">#{ticket.id}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getPriorityBadge(ticket.priority)}`}>
                    {ticket.priority} Priority
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium border border-gray-200">
                    {ticket.category}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadge(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900">{ticket.title}</h3>
                <p className="text-gray-600 text-sm">{ticket.description}</p>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500 font-medium pt-1">
                  <div>
                    👤 Student: <span className="text-gray-800">{ticket.studentName} ({ticket.studentId})</span>
                  </div>
                  <div>
                    🏠 Location: <span className="text-gray-800">{getHostelName(ticket.hostelId)} - Room {ticket.roomId}</span>
                  </div>
                  <div>
                    📅 Filed: <span className="text-gray-800">{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {ticket.assignedWorkerName && (
                  <div className="text-xs bg-indigo-50/50 text-indigo-800 border border-indigo-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 mt-2">
                    👷 Assigned Worker: <span className="font-bold">{ticket.assignedWorkerName}</span>
                  </div>
                )}

                {ticket.status === "RESOLVED" && ticket.remarks && (
                  <div className="text-xs bg-green-50/50 text-green-800 border border-green-100 px-3 py-2 rounded-lg block mt-2">
                    ✅ <span className="font-bold">Resolution Remarks:</span> {ticket.remarks}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                {ticket.status === "PENDING" && (
                  <button
                    onClick={() => openAssignModal(ticket)}
                    className="w-full md:w-36 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition shadow-sm"
                  >
                    Assign Worker
                  </button>
                )}
                {ticket.status === "ASSIGNED" && (
                  <button
                    onClick={() => openResolveModal(ticket)}
                    className="w-full md:w-36 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition shadow-sm"
                  >
                    Resolve Issue
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE TICKET MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-lg overflow-hidden animate-scale-up border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">File Maintenance / Repair Request</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-white/80 hover:text-white text-2xl font-light focus:outline-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Student</label>
                  <select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                      formErrors.studentId ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s.studentId} value={s.studentId}>
                        {s.name} ({s.studentId})
                      </option>
                    ))}
                  </select>
                  {formErrors.studentId && <span className="text-red-500 text-xs mt-1 block">{formErrors.studentId}</span>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Hostel</label>
                  <select
                    name="hostelId"
                    value={formData.hostelId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                      formErrors.hostelId ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select Hostel</option>
                    {hostels.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.hostelName}
                      </option>
                    ))}
                  </select>
                  {formErrors.hostelId && <span className="text-red-500 text-xs mt-1 block">{formErrors.hostelId}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Room ID / Number</label>
                  <select
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleInputChange}
                    disabled={!formData.hostelId}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition disabled:bg-gray-100 ${
                      formErrors.roomId ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select Room</option>
                    {rooms.map((r) => (
                      <option key={r.roomId} value={r.roomId}>
                        Room {r.roomNumber} (Floor {r.floorNumber})
                      </option>
                    ))}
                  </select>
                  {formErrors.roomId && <span className="text-red-500 text-xs mt-1 block">{formErrors.roomId}</span>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  >
                    <option value="PLUMBING">Plumbing (Water leakage, Taps)</option>
                    <option value="ELECTRICAL">Electrical (Fan, Light, Sockets)</option>
                    <option value="INTERNET">Internet & Wi-Fi</option>
                    <option value="FURNITURE">Furniture (Bed, Table, Door)</option>
                    <option value="OTHER">Other Issues</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Priority Level</label>
                <div className="flex gap-4">
                  {["LOW", "MEDIUM", "HIGH"].map((level) => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={level}
                        checked={formData.priority === level}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 font-medium">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Short Summary (Title)</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Ceiling fan making loud noises"
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                    formErrors.title ? "border-red-500" : ""
                  }`}
                />
                {formErrors.title && <span className="text-red-500 text-xs mt-1 block">{formErrors.title}</span>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the issue in detail to help our worker prepare the tools."
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                    formErrors.description ? "border-red-500" : ""
                  }`}
                ></textarea>
                {formErrors.description && <span className="text-red-500 text-xs mt-1 block">{formErrors.description}</span>}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-95 transition"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN WORKER MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-md overflow-hidden animate-scale-up border border-gray-100">
            <div className="bg-indigo-600 p-5 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Assign Staff to Ticket</h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-white/80 hover:text-white text-2xl font-light focus:outline-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAssignWorker} className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="text-sm font-bold text-gray-800">{selectedTicket?.title}</h4>
                <p className="text-xs text-gray-500 mt-1">Category: {selectedTicket?.category}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Available Worker</label>
                <select
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                >
                  <option value="">Choose Worker...</option>
                  {workers
                    .filter((w) => w.isAvailable)
                    .map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.job}) - Available
                      </option>
                    ))}
                </select>
                {workers.filter((w) => w.isAvailable).length === 0 && (
                  <span className="text-amber-600 text-xs mt-1 block">⚠️ No workers currently available. Please mark a worker available in the Workers list first.</span>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={workers.filter((w) => w.isAvailable).length === 0}
                  className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  Assign Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESOLVE TICKET MODAL */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-md overflow-hidden animate-scale-up border border-gray-100">
            <div className="bg-green-600 p-5 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Resolve Ticket</h2>
              <button
                onClick={() => setShowResolveModal(false)}
                className="text-white/80 hover:text-white text-2xl font-light focus:outline-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleResolveTicket} className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="text-sm font-bold text-gray-800">{selectedTicket?.title}</h4>
                <p className="text-xs text-gray-500 mt-1">Assigned worker: {selectedTicket?.assignedWorkerName}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Resolution Remarks</label>
                <textarea
                  rows="3"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Replaced capacitor of the ceiling fan. Fan is running normally now."
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                >
                  Confirm Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaintenanceList;
