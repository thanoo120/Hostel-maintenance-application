import React, { useState, useEffect } from "react";
import { hostelAPI, studentAPI, allocationAPI, roomAPI, workerAPI, maintenanceAPI } from "../services/api";
import { useToast } from "../utils/toast";
import { Link } from "react-router-dom";

function Dashboard() {
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    hostels: 0,
    students: 0,
    activeAllocations: 0,
    availableRooms: 0,
    activeTickets: 0,
    availableWorkers: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [hostelsRes, studentsRes, allocationsRes, roomsRes, workersRes, maintenanceRes] =
        await Promise.all([
          hostelAPI.getAll(),
          studentAPI.getAll(),
          allocationAPI.getActive(),
          roomAPI.getAvailable(),
          workerAPI.getAll(),
          maintenanceAPI.getAll(),
        ]);
      
      const allTickets = Array.isArray(maintenanceRes.data) ? maintenanceRes.data : [];
      const allWorkers = Array.isArray(workersRes.data) ? workersRes.data : [];

      setStats({
        hostels: Array.isArray(hostelsRes.data) ? hostelsRes.data.length : 0,
        students: Array.isArray(studentsRes.data) ? studentsRes.data.length : 0,
        activeAllocations: Array.isArray(allocationsRes.data) ? allocationsRes.data.length : 0,
        availableRooms: Array.isArray(roomsRes.data) ? roomsRes.data.length : 0,
        activeTickets: allTickets.filter(t => t.status !== "RESOLVED").length,
        availableWorkers: allWorkers.filter(w => w.isAvailable).length,
      });

      // Sort and slice top 4 active or recent tickets
      const sortedTickets = [...allTickets]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);
      setRecentTickets(sortedTickets);

    } catch (error) {
      console.error("Error fetching stats:", error);
      showToast("Failed to load dashboard statistics", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="border-4 border-gray-200 border-t-indigo-600 rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Loading dashboard stats...</p>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-800";
      case "MEDIUM": return "bg-amber-100 text-amber-800";
      case "LOW":
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED": return "bg-green-100 text-green-800";
      case "ASSIGNED": return "bg-indigo-100 text-indigo-800";
      case "PENDING":
      default: return "bg-rose-100 text-rose-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Hostel Hub Console</h1>
          <p className="text-indigo-100 mt-2 text-base md:text-lg max-w-xl">
            Real-time management dashboard for student occupancy, room allocations, staff logs, and repair tickets.
          </p>
        </div>
        <div className="flex gap-3 z-10">
          <Link
            to="/maintenance"
            className="px-5 py-2.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition shadow-md"
          >
            🛠️ File Ticket
          </Link>
          <Link
            to="/students"
            className="px-5 py-2.5 bg-indigo-500/30 backdrop-blur-md text-white font-semibold rounded-xl border border-indigo-400/30 hover:bg-indigo-500/40 transition"
          >
            + Register Student
          </Link>
        </div>
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {/* Hostels */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="text-sm font-semibold text-gray-500">Total Hostels</div>
          <div className="text-3xl font-black text-gray-900 mt-2">{stats.hostels}</div>
          <div className="text-xs text-indigo-600 font-bold mt-2">🏠 Management Unit</div>
        </div>

        {/* Students */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="text-sm font-semibold text-gray-500">Registered Students</div>
          <div className="text-3xl font-black text-gray-900 mt-2">{stats.students}</div>
          <div className="text-xs text-indigo-600 font-bold mt-2">👥 Active Enrollment</div>
        </div>

        {/* Allocations */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="text-sm font-semibold text-gray-500">Active Occupants</div>
          <div className="text-3xl font-black text-gray-900 mt-2">{stats.activeAllocations}</div>
          <div className="text-xs text-indigo-600 font-bold mt-2">🔑 Placed in Rooms</div>
        </div>

        {/* Available Rooms */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="text-sm font-semibold text-gray-500">Empty Rooms</div>
          <div className="text-3xl font-black text-gray-900 mt-2">{stats.availableRooms}</div>
          <div className="text-xs text-indigo-600 font-bold mt-2">🛏️ Available Immediately</div>
        </div>

        {/* Active Tickets */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="text-sm font-semibold text-gray-500">Active Repair Tickets</div>
          <div className="text-3xl font-black text-rose-600 mt-2">{stats.activeTickets}</div>
          <div className="text-xs text-rose-500 font-semibold mt-2">🛠️ Requiring Attention</div>
        </div>

        {/* Available Workers */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="text-sm font-semibold text-gray-500">Available Staff</div>
          <div className="text-3xl font-black text-green-600 mt-2">{stats.availableWorkers}</div>
          <div className="text-xs text-green-500 font-semibold mt-2">👷 Ready to Assign</div>
        </div>
      </div>

      {/* Main Panel & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tickets Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Maintenance Requests</h2>
              <p className="text-xs text-gray-500 mt-0.5">Quick status preview of reported room issues.</p>
            </div>
            <Link to="/maintenance" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
              View All Tickets →
            </Link>
          </div>

          {recentTickets.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <span className="text-3xl block mb-2">🎉</span>
              <p className="font-semibold text-sm">All clear! No repair requests reported.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="py-4 flex justify-between items-start gap-4 hover:bg-gray-50/50 px-2 rounded-lg transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400">#{ticket.id}</span>
                      <h4 className="text-sm font-bold text-gray-900">{ticket.title}</h4>
                    </div>
                    <p className="text-xs text-gray-500">
                      Room {ticket.roomId} • Submitted by {ticket.studentName}
                    </p>
                    {ticket.assignedWorkerName && (
                      <span className="inline-block text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold mt-1">
                        👷 Worker: {ticket.assignedWorkerName}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Operations Sidebar */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Quick Navigation</h2>
            <p className="text-xs text-gray-500 mt-0.5">Quick access to manage hostel entities.</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Link
              to="/hostels"
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition font-semibold text-gray-800 text-sm shadow-sm"
            >
              <span className="text-xl">🏢</span>
              <div>
                <div>Hostel Management</div>
                <div className="text-[10px] text-gray-500 font-medium">Add, edit and monitor buildings.</div>
              </div>
            </Link>

            <Link
              to="/students"
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition font-semibold text-gray-800 text-sm shadow-sm"
            >
              <span className="text-xl">🎓</span>
              <div>
                <div>Student Enrollment</div>
                <div className="text-[10px] text-gray-500 font-medium">Register and view student directory.</div>
              </div>
            </Link>

            <Link
              to="/allocations"
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition font-semibold text-gray-800 text-sm shadow-sm"
            >
              <span className="text-xl">🔑</span>
              <div>
                <div>Room Allocations</div>
                <div className="text-[10px] text-gray-500 font-medium">Assign rooms and deallocate residents.</div>
              </div>
            </Link>

            <Link
              to="/workers"
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition font-semibold text-gray-800 text-sm shadow-sm"
            >
              <span className="text-xl">👷</span>
              <div>
                <div>Staff Directory</div>
                <div className="text-[10px] text-gray-500 font-medium">Manage maintenance workers availability.</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
