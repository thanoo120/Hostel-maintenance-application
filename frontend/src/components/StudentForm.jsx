import React, { useState, useEffect } from "react";
import { studentAPI } from "../services/api";
import { useToast } from "../utils/toast";

function StudentForm({ student, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    studentEmail: "",
    contactNumber: "",
    department: "",
    course: "",
    academicYear: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (student) {
      setFormData({
        studentId: student.studentId || "",
        studentName: student.studentName || "",
        studentEmail: student.studentEmail || "",
        contactNumber: student.contactNumber || "",
        department: student.department || "",
        course: student.course || "",
        academicYear: student.academicYear || "",
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName || formData.studentName.length < 2) {
      newErrors.studentName = "Student name must be at least 2 characters";
    }

    if (
      !formData.studentEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail)
    ) {
      newErrors.studentEmail = "Please enter a valid email address";
    }

    if (
      !formData.contactNumber ||
      !/^[0-9]{10}$/.test(formData.contactNumber)
    ) {
      newErrors.contactNumber = "Contact number must be exactly 10 digits";
    }

    if (!formData.department || formData.department.length < 2) {
      newErrors.department = "Department is required";
    }

    if (!formData.course || formData.course.length < 2) {
      newErrors.course = "Course is required";
    }

    if (
      !formData.academicYear ||
      !/^[0-9]{4}-[0-9]{4}$/.test(formData.academicYear)
    ) {
      newErrors.academicYear = "Academic year must be in format YYYY-YYYY";
    }

    if (!student && !formData.studentId) {
      newErrors.studentId = "Student ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fix the validation errors", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (student) {
        await studentAPI.update(student.studentId, formData);
      } else {
        await studentAPI.register(formData);
      }
      onSuccess();
    } catch (error) {
      showToast(error.message || "Failed to save student", "error");
      if (error.validationErrors) {
        const validationErrors = {};
        error.validationErrors.split(", ").forEach((err) => {
          const [field] = err.split(":");
          validationErrors[field] = err;
        });
        setErrors(validationErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            {student ? "Edit Student" : "Register Student"}
          </h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {!student && (
            <div className="form-group">
              <label className="form-label">Student ID *</label>
              <input
                type="text"
                name="studentId"
                className={`form-input ${errors.studentId ? "error" : ""}`}
                value={formData.studentId}
                onChange={handleChange}
                required
              />
              {errors.studentId && (
                <span className="form-error">{errors.studentId}</span>
              )}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Student Name *</label>
            <input
              type="text"
              name="studentName"
              className={`form-input ${errors.studentName ? "error" : ""}`}
              value={formData.studentName}
              onChange={handleChange}
              required
            />
            {errors.studentName && (
              <span className="form-error">{errors.studentName}</span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="studentEmail"
              className={`form-input ${errors.studentEmail ? "error" : ""}`}
              value={formData.studentEmail}
              onChange={handleChange}
              required
            />
            {errors.studentEmail && (
              <span className="form-error">{errors.studentEmail}</span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Contact Number *</label>
            <input
              type="text"
              name="contactNumber"
              className={`form-input ${errors.contactNumber ? "error" : ""}`}
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="10 digits"
              maxLength="10"
              required
            />
            {errors.contactNumber && (
              <span className="form-error">{errors.contactNumber}</span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Department *</label>
            <input
              type="text"
              name="department"
              className={`form-input ${errors.department ? "error" : ""}`}
              value={formData.department}
              onChange={handleChange}
              required
            />
            {errors.department && (
              <span className="form-error">{errors.department}</span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Course *</label>
            <input
              type="text"
              name="course"
              className={`form-input ${errors.course ? "error" : ""}`}
              value={formData.course}
              onChange={handleChange}
              required
            />
            {errors.course && (
              <span className="form-error">{errors.course}</span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Academic Year *</label>
            <input
              type="text"
              name="academicYear"
              className={`form-input ${errors.academicYear ? "error" : ""}`}
              value={formData.academicYear}
              onChange={handleChange}
              placeholder="YYYY-YYYY"
              required
            />
            {errors.academicYear && (
              <span className="form-error">{errors.academicYear}</span>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : student ? "Update" : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
