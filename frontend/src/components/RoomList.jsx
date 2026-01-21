import React, { useState, useEffect } from "react";
import { roomAPI, hostelAPI } from "../services/api";

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'available'
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (hostels.length > 0) {
      if (filter === "available") {
        fetchAvailableRooms();
      } else {
        fetchAllRooms();
      }
    }
  }, [filter, hostels]);

  const fetchData = async () => {
    try {
      const [hostelsRes, roomsRes] = await Promise.all([
        hostelAPI.getAll(),
        roomAPI.getAll(),
      ]);
      setHostels(hostelsRes.data);
      setRooms(roomsRes.data);
    } catch (error) {
      showMessage("error", "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRooms = async () => {
    try {
      const allRooms = [];
      for (const hostel of hostels) {
        try {
          const response = await hostelAPI.getRooms(hostel.id);
          allRooms.push(...response.data);
        } catch (error) {
          console.error(
            `Failed to fetch rooms for hostel ${hostel.id}:`,
            error,
          );
        }
      }
      setRooms(allRooms);
    } catch (error) {
      showMessage("error", "Failed to fetch rooms");
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const response = await roomAPI.getAvailable();
      setRooms(response.data);
    } catch (error) {
      showMessage("error", "Failed to fetch available rooms");
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await roomAPI.delete(id);
        showMessage("success", "Room deleted successfully");
        if (filter === "available") {
          fetchAvailableRooms();
        } else {
          fetchAllRooms();
        }
      } catch (error) {
        showMessage("error", "Failed to delete room");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">Loading rooms...</div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Rooms</h2>
        <div className="flex gap-2">
          <button
            className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilter("all")}
          >
            All Rooms
          </button>
          <button
            className={`btn btn-sm ${filter === "available" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilter("available")}
          >
            Available Only
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {rooms.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-6xl mb-4">🚪</div>
          <p>No rooms found.</p>
        </div>
      ) : (
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Room ID
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Room Number
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Hostel
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Capacity
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Available Spaces
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Status
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => {
              const hostel = hostels.find((h) => h.id === room.hostelId);
              return (
                <tr
                  key={room.id}
                  className="hover:bg-gray-50 border-b border-gray-200"
                >
                  <td className="px-4 py-3">{room.id}</td>
                  <td className="px-4 py-3">{room.roomNumber}</td>
                  <td className="px-4 py-3">
                    {hostel
                      ? hostel.name
                      : `Hostel ID: ${room.hostelId || "N/A"}`}
                  </td>
                  <td className="px-4 py-3">{room.capacity}</td>
                  <td className="px-4 py-3">{room.availableSpaces}</td>
                  <td className="px-4 py-3">
                    {room.availableSpaces > 0 ? (
                      <span className="badge badge-success">Available</span>
                    ) : (
                      <span className="badge badge-danger">Full</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(room.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RoomList;
