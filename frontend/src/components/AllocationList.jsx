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
    return <div className="loading">Loading allocations...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Room Allocations</h2>
        <div>
          <button
            className="btn btn-primary"
            onClick={handleAllocate}
            style={{ marginRight: "0.5rem" }}
          >
            + Allocate Room
          </button>
          <button
            className={`btn btn-sm ${
              filter === "all" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => setFilter("all")}
            style={{ marginRight: "0.5rem" }}
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
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>No allocations found. Allocate your first room!</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Hostel</th>
              <th>Room</th>
              <th>Allocation Date</th>
              <th>Deallocation Date</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((allocation) => (
              <tr key={allocation.id}>
                <td>{allocation.id}</td>
                <td>{allocation.studentName || allocation.studentId}</td>
                <td>{allocation.hostelName || "N/A"}</td>
                <td>{allocation.roomNumber || allocation.roomId}</td>
                <td>{formatDate(allocation.allocationDate)}</td>
                <td>{formatDate(allocation.deAllocationDate)}</td>
                <td>
                  {allocation.active ? (
                    <span className="badge badge-success">Active</span>
                  ) : (
                    <span className="badge badge-danger">Inactive</span>
                  )}
                </td>
                <td>{allocation.remarks || "N/A"}</td>
                <td>
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
