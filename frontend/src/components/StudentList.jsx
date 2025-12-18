import React, { useState, useEffect } from "react";
import { studentAPI } from "../services/api";
import StudentForm from "./StudentForm.jsx";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      showMessage("error", "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleCreate = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentAPI.delete(studentId);
        showMessage("success", "Student deleted successfully");
        fetchStudents();
      } catch (error) {
        showMessage("error", "Failed to delete student");
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchStudents();
    showMessage(
      "success",
      editingStudent
        ? "Student updated successfully"
        : "Student registered successfully"
    );
  };

  if (loading) {
    return <div className="loading">Loading students...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Students</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Register Student
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👨‍🎓</div>
          <p>No students found. Register your first student!</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Department</th>
              <th>Course</th>
              <th>Academic Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.studentId}>
                <td>{student.studentId}</td>
                <td>{student.studentName}</td>
                <td>{student.studentEmail}</td>
                <td>{student.contactNumber}</td>
                <td>{student.department}</td>
                <td>{student.course}</td>
                <td>{student.academicYear}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(student.studentId)}
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
        <StudentForm
          student={editingStudent}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default StudentList;
