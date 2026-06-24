import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HostelList from "./components/HostelList.jsx";
import StudentList from "./components/StudentList.jsx";
import AllocationList from "./components/AllocationList.jsx";
import RoomList from "./components/RoomList.jsx";
import Dashboard from "./components/Dashboard.jsx";
import WorkerList from "./components/WorkerList.jsx";
import MaintenanceList from "./components/MaintenanceList.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50/50">
        <nav className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-4 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <Link to="/" className="text-2xl font-black text-white no-underline tracking-tight flex items-center gap-2">
              🏠 Hostel Hub
            </Link>
            <ul className="flex list-none gap-2 m-0 p-0">
              <li>
                <Link
                  to="/"
                  className="text-white no-underline font-semibold px-3 py-2 rounded-xl transition duration-200 hover:bg-white/10"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/hostels"
                  className="text-white no-underline font-semibold px-3 py-2 rounded-xl transition duration-200 hover:bg-white/10"
                >
                  Hostels
                </Link>
              </li>
              <li>
                <Link
                  to="/students"
                  className="text-white no-underline font-semibold px-3 py-2 rounded-xl transition duration-200 hover:bg-white/10"
                >
                  Students
                </Link>
              </li>
              <li>
                <Link
                  to="/rooms"
                  className="text-white no-underline font-semibold px-3 py-2 rounded-xl transition duration-200 hover:bg-white/10"
                >
                  Rooms
                </Link>
              </li>
              <li>
                <Link
                  to="/allocations"
                  className="text-white no-underline font-semibold px-3 py-2 rounded-xl transition duration-200 hover:bg-white/10"
                >
                  Allocations
                </Link>
              </li>
              <li>
                <Link
                  to="/workers"
                  className="text-white no-underline font-semibold px-3 py-2 rounded-xl transition duration-200 hover:bg-white/10"
                >
                  Staff
                </Link>
              </li>
              <li>
                <Link
                  to="/maintenance"
                  className="text-white no-underline font-semibold px-3 py-2 rounded-xl transition duration-200 hover:bg-white/10 bg-indigo-500/30 border border-white/20 hover:bg-indigo-500/40"
                >
                  Maintenance
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="flex-1 max-w-7xl w-full mx-auto my-8 px-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hostels" element={<HostelList />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/rooms" element={<RoomList />} />
            <Route path="/allocations" element={<AllocationList />} />
            <Route path="/workers" element={<WorkerList />} />
            <Route path="/maintenance" element={<MaintenanceList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
