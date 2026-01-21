import React, { useState, useEffect } from "react";
import { allocationAPI, studentAPI, roomAPI } from "../services/api";
import AllocationForm from "./AllocationForm.jsx";

function AllocationList() {
  const [allocations, setAllocations] = useState([]);
  const [students, setStudents] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all"); // 'all', 'active'
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (filter === "active") {
      fetchActiveAllocations();
    } else {
      fetchAllAllocations();
    }
  }, [filter]);

  const fetchData = async () => {
    try {
      const { hostelAPI } = await import("../services/api");
      const [studentsRes, roomsRes, hostelsRes] = await Promise.all([
        studentAPI.getAll(),
        roomAPI.getAvailable(),
        hostelAPI.getAll(),
      ]);
      setStudents(studentsRes.data);
      setAvailableRooms(roomsRes.data);
      setHostels(hostelsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAllAllocations = async () => {
    try {
      const response = await allocationAPI.getAll();
      setAllocations(response.data);
    } catch (error) {
      showMessage("error", "Failed to fetch allocations");
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveAllocations = async () => {
    try {
      const response = await allocationAPI.getActive();
      setAllocations(response.data);
    } catch (error) {
      showMessage("error", "Failed to fetch active allocations");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleAllocate = () => {
    setShowForm(true);
  };

  const handleDeallocate = async (id) => {
    const remarks = window.prompt("Enter deallocation remarks (optional):");
    if (remarks !== null) {
      try {
        await allocationAPI.deallocate(id, remarks);
        showMessage("success", "Room deallocated successfully");
        if (filter === "active") {
          fetchActiveAllocations();
        } else {
          fetchAllAllocations();
        }
      } catch (error) {
        showMessage("error", "Failed to deallocate room");
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchData();
    if (filter === "active") {
      fetchActiveAllocations();
    } else {
      fetchAllAllocations();
    }
    showMessage("success", "Room allocated successfully");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">
        Loading allocations...
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Room Allocations</h2>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={handleAllocate}>
            + Allocate Room
          </button>
          <button
            className={`btn btn-sm ${
              filter === "all" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`btn btn-sm ${
              filter === "active" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => setFilter("active")}
          >
            Active Only
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {allocations.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-6xl mb-4">📋</div>
          <p>No allocations found. Allocate your first room!</p>
        </div>
      ) : (
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                ID
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Student
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Hostel
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Room
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Allocation Date
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Deallocation Date
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Status
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Remarks
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((allocation) => (
              <tr
                key={allocation.id}
                className="hover:bg-gray-50 border-b border-gray-200"
              >
                <td className="px-4 py-3">{allocation.id}</td>
                <td className="px-4 py-3">
                  {allocation.studentName || allocation.studentId}
                </td>
                <td className="px-4 py-3">{allocation.hostelName || "N/A"}</td>
                <td className="px-4 py-3">
                  {allocation.roomNumber || allocation.roomId}
                </td>
                <td className="px-4 py-3">
                  {formatDate(allocation.allocationDate)}
                </td>
                <td className="px-4 py-3">
                  {formatDate(allocation.deAllocationDate)}
                </td>
                <td className="px-4 py-3">
                  {allocation.active ? (
                    <span className="badge badge-success">Active</span>
                  ) : (
                    <span className="badge badge-danger">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-3">{allocation.remarks || "N/A"}</td>
                <td className="px-4 py-3">
                  {allocation.active && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeallocate(allocation.id)}
                    >
                      Deallocate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <AllocationForm
          students={students}
          availableRooms={availableRooms}
          hostels={hostels}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default AllocationList;
