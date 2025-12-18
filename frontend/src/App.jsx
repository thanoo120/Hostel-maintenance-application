import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import HostelList from "./components/HostelList.jsx";
import StudentList from "./components/StudentList.jsx";
import AllocationList from "./components/AllocationList.jsx";
import RoomList from "./components/RoomList.jsx";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-logo">🏠 Hostel Management</h1>
            <ul className="nav-menu">
              <li>
                <Link to="/" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/hostels" className="nav-link">
                  Hostels
                </Link>
              </li>
              <li>
                <Link to="/students" className="nav-link">
                  Students
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="nav-link">
                  Rooms
                </Link>
              </li>
              <li>
                <Link to="/allocations" className="nav-link">
                  Allocations
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
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
