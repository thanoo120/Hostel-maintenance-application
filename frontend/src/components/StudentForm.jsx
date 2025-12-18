import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';

function StudentForm({ student, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    studentEmail: '',
    contactNumber: '',
    department: '',
    course: '',
    academicYear: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        studentId: student.studentId || '',
        studentName: student.studentName || '',
        studentEmail: student.studentEmail || '',
        contactNumber: student.contactNumber || '',
        department: student.department || '',
        course: student.course || '',
        academicYear: student.academicYear || ''
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (student) {
        await studentAPI.update(student.studentId, formData);
      } else {
        await studentAPI.register(formData);
      }
      onSuccess();
    } catch (error) {
      alert('Failed to save student: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{student ? 'Edit Student' : 'Register Student'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {!student && (
            <div className="form-group">
              <label className="form-label">Student ID</label>
              <input
                type="text"
                name="studentId"
                className="form-input"
                value={formData.studentId}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Student Name</label>
            <input
              type="text"
              name="studentName"
              className="form-input"
              value={formData.studentName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="studentEmail"
              className="form-input"
              value={formData.studentEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              className="form-input"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              type="text"
              name="department"
              className="form-input"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Course</label>
            <input
              type="text"
              name="course"
              className="form-input"
              value={formData.course}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Academic Year</label>
            <input
              type="text"
              name="academicYear"
              className="form-input"
              value={formData.academicYear}
              onChange={handleChange}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {student ? 'Update' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;


