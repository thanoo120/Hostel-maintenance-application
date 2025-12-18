import React, { useState, useEffect } from "react";
import { hostelAPI } from "../services/api";
import HostelForm from "./HostelForm.jsx";
import RoomForm from "./RoomForm.jsx";

function HostelList() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [editingHostel, setEditingHostel] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const response = await hostelAPI.getAll();
      setHostels(response.data);
    } catch (error) {
      showMessage("error", "Failed to fetch hostels");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleCreate = () => {
    setEditingHostel(null);
    setShowForm(true);
  };

  const handleEdit = (hostel) => {
    setEditingHostel(hostel);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hostel?")) {
      try {
        await hostelAPI.delete(id);
        showMessage("success", "Hostel deleted successfully");
        fetchHostels();
      } catch (error) {
        showMessage("error", "Failed to delete hostel");
      }
    }
  };

  const handleAddRoom = (hostel) => {
    setSelectedHostel(hostel);
    setShowRoomForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setShowRoomForm(false);
    setEditingHostel(null);
    setSelectedHostel(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchHostels();
    showMessage(
      "success",
      editingHostel
        ? "Hostel updated successfully"
        : "Hostel created successfully"
    );
  };

  if (loading) {
    return <div className="loading">Loading hostels...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Hostels</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Add Hostel
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {hostels.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏠</div>
          <p>No hostels found. Create your first hostel!</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Total Capacity</th>
              <th>Available Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hostels.map((hostel) => (
              <tr key={hostel.id}>
                <td>{hostel.id}</td>
                <td>{hostel.name}</td>
                <td>{hostel.location || "N/A"}</td>
                <td>{hostel.totalCapacity || 0}</td>
                <td>{hostel.availableCapacity || 0}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(hostel)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleAddRoom(hostel)}
                    >
                      Add Room
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(hostel.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <HostelForm
          hostel={editingHostel}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {showRoomForm && selectedHostel && (
        <RoomForm
          hostelId={selectedHostel.id}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default HostelList;
