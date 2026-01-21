import React, { useState, useEffect } from "react";
import { studentAPI } from "../services/api";
import { useToast } from "../utils/toast";
import StudentForm from "./StudentForm.jsx";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      showToast("Failed to fetch students", "error");
    } finally {
      setLoading(false);
    }
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
        showToast("Student deleted successfully", "success");
        fetchStudents();
      } catch (error) {
        showToast(error.message || "Failed to delete student", "error");
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
    showToast(
      editingStudent
        ? "Student updated successfully"
        : "Student registered successfully",
      "success",
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Students</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Register Student
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-600">
          <div className="border-4 border-gray-300 border-t-indigo-500 rounded-full w-10 h-10 animate-spin mx-auto mb-4"></div>
          <p>Loading students...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-6xl mb-4">👨‍🎓</div>
          <p>No students found. Register your first student!</p>
        </div>
      ) : (
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Student ID
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Name
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Email
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Contact
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Department
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Course
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Academic Year
              </th>
              <th className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.studentId}
                className="hover:bg-gray-50 border-b border-gray-200"
              >
                <td className="px-4 py-3">{student.studentId}</td>
                <td className="px-4 py-3">{student.studentName}</td>
                <td className="px-4 py-3">{student.studentEmail}</td>
                <td className="px-4 py-3">{student.contactNumber}</td>
                <td className="px-4 py-3">{student.department}</td>
                <td className="px-4 py-3">{student.course}</td>
                <td className="px-4 py-3">{student.academicYear}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
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
