import React, { useState, useEffect } from "react";
import { hostelAPI, studentAPI, allocationAPI, roomAPI } from "../services/api";
import { useToast } from "../utils/toast";
import "./Dashboard.css";

function Dashboard() {
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    hostels: 0,
    students: 0,
    activeAllocations: 0,
    availableRooms: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [hostelsRes, studentsRes, allocationsRes, roomsRes] =
        await Promise.all([
          hostelAPI.getAll(),
          studentAPI.getAll(),
          allocationAPI.getActive(),
          roomAPI.getAvailable(),
        ]);
      setStats({
        hostels: Array.isArray(hostelsRes.data) ? hostelsRes.data.length : 0,
        students: Array.isArray(studentsRes.data) ? studentsRes.data.length : 0,
        activeAllocations: Array.isArray(allocationsRes.data)
          ? allocationsRes.data.length
          : 0,
        availableRooms: Array.isArray(roomsRes.data) ? roomsRes.data.length : 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      showToast("Failed to load dashboard statistics", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.hostels}</div>
          <div className="stat-label">Total Hostels</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.students}</div>
          <div className="stat-label">Registered Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.activeAllocations}</div>
          <div className="stat-label">Active Allocations</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.availableRooms}</div>
          <div className="stat-label">Available Rooms</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
