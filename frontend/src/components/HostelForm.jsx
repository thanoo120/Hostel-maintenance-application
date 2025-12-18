import React, { useState, useEffect } from 'react';

function HostelForm({ hostel, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    location: ''
  });

  useEffect(() => {
    if (hostel) {
      setFormData({
        name: hostel.name || '',
        location: hostel.location || ''
      });
    }
  }, [hostel]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { hostelAPI } = await import('../services/api');
      if (hostel) {
        await hostelAPI.update(hostel.id, formData);
      } else {
        await hostelAPI.create(formData);
      }
      onSuccess();
    } catch (error) {
      alert('Failed to save hostel: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{hostel ? 'Edit Hostel' : 'Create Hostel'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Hostel Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              className="form-input"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {hostel ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HostelForm;


