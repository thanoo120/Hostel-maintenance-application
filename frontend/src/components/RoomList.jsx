import React, { useState, useEffect } from 'react';
import { roomAPI, hostelAPI } from '../services/api';

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'available'
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (hostels.length > 0) {
      if (filter === 'available') {
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
        roomAPI.getAll()
      ]);
      setHostels(hostelsRes.data);
      setRooms(roomsRes.data);
    } catch (error) {
      showMessage('error', 'Failed to fetch data');
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
          console.error(`Failed to fetch rooms for hostel ${hostel.id}:`, error);
        }
      }
      setRooms(allRooms);
    } catch (error) {
      showMessage('error', 'Failed to fetch rooms');
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const response = await roomAPI.getAvailable();
      setRooms(response.data);
    } catch (error) {
      showMessage('error', 'Failed to fetch available rooms');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await roomAPI.delete(id);
        showMessage('success', 'Room deleted successfully');
        if (filter === 'available') {
          fetchAvailableRooms();
        } else {
          fetchAllRooms();
        }
      } catch (error) {
        showMessage('error', 'Failed to delete room');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Rooms</h2>
        <div>
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
            style={{ marginRight: '0.5rem' }}
          >
            All Rooms
          </button>
          <button
            className={`btn btn-sm ${filter === 'available' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('available')}
          >
            Available Only
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {rooms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🚪</div>
          <p>No rooms found.</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Room ID</th>
              <th>Room Number</th>
              <th>Hostel</th>
              <th>Capacity</th>
              <th>Available Spaces</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => {
              const hostel = hostels.find(h => h.id === room.hostelId);
              return (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td>{room.roomNumber}</td>
                  <td>{hostel ? hostel.name : `Hostel ID: ${room.hostelId || 'N/A'}`}</td>
                  <td>{room.capacity}</td>
                  <td>{room.availableSpaces}</td>
                  <td>
                    {room.availableSpaces > 0 ? (
                      <span className="badge badge-success">Available</span>
                    ) : (
                      <span className="badge badge-danger">Full</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
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

