import React, { useState } from 'react';
import { hostelAPI } from '../services/api';

function RoomForm({ hostelId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    roomNumber: '',
    capacity: '',
    availableSpaces: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await hostelAPI.addRoom(hostelId, {
        roomNumber: formData.roomNumber,
        capacity: parseInt(formData.capacity),
        availableSpaces: parseInt(formData.availableSpaces || formData.capacity)
      });
      onSuccess();
    } catch (error) {
      alert('Failed to add room: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Add Room</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Room Number</label>
            <input
              type="text"
              name="roomNumber"
              className="form-input"
              value={formData.roomNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Capacity</label>
            <input
              type="number"
              name="capacity"
              className="form-input"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Available Spaces</label>
            <input
              type="number"
              name="availableSpaces"
              className="form-input"
              value={formData.availableSpaces}
              onChange={handleChange}
              min="0"
              placeholder="Leave empty to match capacity"
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoomForm;


