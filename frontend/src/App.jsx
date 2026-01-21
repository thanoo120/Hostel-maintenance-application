import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HostelList from "./components/HostelList.jsx";
import StudentList from "./components/StudentList.jsx";
import AllocationList from "./components/AllocationList.jsx";
import RoomList from "./components/RoomList.jsx";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <nav className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 shadow-lg">
          <div className="max-w-6xl mx-auto px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold">🏠 Hostel Management</h1>
            <ul className="flex list-none gap-8 m-0 p-0">
              <li>
                <Link
                  to="/"
                  className="text-white no-underline font-medium px-4 py-2 rounded-md transition-colors duration-300 hover:bg-white/20"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/hostels"
                  className="text-white no-underline font-medium px-4 py-2 rounded-md transition-colors duration-300 hover:bg-white/20"
                >
                  Hostels
                </Link>
              </li>
              <li>
                <Link
                  to="/students"
                  className="text-white no-underline font-medium px-4 py-2 rounded-md transition-colors duration-300 hover:bg-white/20"
                >
                  Students
                </Link>
              </li>
              <li>
                <Link
                  to="/rooms"
                  className="text-white no-underline font-medium px-4 py-2 rounded-md transition-colors duration-300 hover:bg-white/20"
                >
                  Rooms
                </Link>
              </li>
              <li>
                <Link
                  to="/allocations"
                  className="text-white no-underline font-medium px-4 py-2 rounded-md transition-colors duration-300 hover:bg-white/20"
                >
                  Allocations
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="flex-1 max-w-6xl w-full mx-auto my-8 px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hostels" element={<HostelList />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/rooms" element={<RoomList />} />
            <Route path="/allocations" element={<AllocationList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
