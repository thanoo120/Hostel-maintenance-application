import React, { useState, useEffect } from "react";
import { hostelAPI, studentAPI, allocationAPI, roomAPI } from "../services/api";
import { useToast } from "../utils/toast";

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
      <div className="text-center py-8 text-gray-600">
        <div className="border-4 border-gray-300 border-t-indigo-500 rounded-full w-10 h-10 animate-spin mx-auto mb-4"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="text-4xl font-bold text-indigo-500 mb-2">
            {stats.hostels}
          </div>
          <div className="text-gray-600 text-sm">Total Hostels</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="text-4xl font-bold text-indigo-500 mb-2">
            {stats.students}
          </div>
          <div className="text-gray-600 text-sm">Registered Students</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="text-4xl font-bold text-indigo-500 mb-2">
            {stats.activeAllocations}
          </div>
          <div className="text-gray-600 text-sm">Active Allocations</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="text-4xl font-bold text-indigo-500 mb-2">
            {stats.availableRooms}
          </div>
          <div className="text-gray-600 text-sm">Available Rooms</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
