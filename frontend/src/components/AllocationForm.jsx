import React, { useState } from 'react';
import { allocationAPI } from '../services/api';

function AllocationForm({ students, availableRooms, hostels = [], onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    studentId: '',
    roomId: ''
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
      await allocationAPI.allocate({
        studentId: formData.studentId,
        roomId: parseInt(formData.roomId)
      });
      onSuccess();
    } catch (error) {
      alert('Failed to allocate room: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Allocate Room</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Student</label>
            <select
              name="studentId"
              className="form-input"
              value={formData.studentId}
              onChange={handleChange}
              required
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.studentId} value={student.studentId}>
                  {student.studentName} ({student.studentId})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Available Room</label>
            <select
              name="roomId"
              className="form-input"
              value={formData.roomId}
              onChange={handleChange}
              required
            >
              <option value="">Select a room</option>
              {availableRooms.map((room) => {
                const hostel = hostels.find(h => h.id === room.hostelId);
                const hostelName = hostel ? hostel.name : `Hostel ${room.hostelId || 'N/A'}`;
                return (
                  <option key={room.id} value={room.id}>
                    {room.roomNumber} - {hostelName} (Available: {room.availableSpaces})
                  </option>
                );
              })}
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Allocate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AllocationForm;

