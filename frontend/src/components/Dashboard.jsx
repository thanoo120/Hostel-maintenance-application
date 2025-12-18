import React, { useState, useEffect } from 'react';
import { hostelAPI, studentAPI, allocationAPI, roomAPI } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    hostels: 0,
    students: 0,
    activeAllocations: 0,
    availableRooms: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [hostelsRes, studentsRes, allocationsRes, roomsRes] = await Promise.all([
        hostelAPI.getAll(),
        studentAPI.getAll(),
        allocationAPI.getActive(),
        roomAPI.getAvailable()
      ]);
        console.log(hostelAPI.getAll()),
      setStats({
        hostels: hostelsRes.data.length,
        students: studentsRes.data.length,
        activeAllocations: allocationsRes.data.length,
        availableRooms: roomsRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
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


