# Hostel Maintenance Application - Frontend

A modern React frontend for the Hostel Maintenance Application built with Vite.

## Features

- **Dashboard**: Overview of hostels, students, allocations, and available rooms
- **Hostel Management**: Create, update, delete hostels and add rooms to hostels
- **Student Management**: Register, update, and delete students
- **Room Management**: View all rooms or filter by available rooms
- **Allocation Management**: Allocate and deallocate rooms to students

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend services running on:
  - Student Service: `http://localhost:8090`
  - Hostel Service: `http://localhost:8091`
  - Allocation Service: `http://localhost:8092`

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.js     # Dashboard with statistics
│   │   ├── HostelList.js    # Hostel management
│   │   ├── HostelForm.js    # Hostel create/edit form
│   │   ├── RoomForm.js      # Room creation form
│   │   ├── RoomList.js      # Room listing
│   │   ├── StudentList.js   # Student management
│   │   ├── StudentForm.js  # Student registration/edit form
│   │   ├── AllocationList.js # Allocation management
│   │   └── AllocationForm.js # Room allocation form
│   ├── services/
│   │   └── api.js           # API service layer
│   ├── App.js               # Main app component with routing
│   ├── App.css              # Application styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## API Configuration

The API endpoints are configured in `src/services/api.js`. Make sure your backend services are running on the correct ports:

- Student Service: `http://localhost:8090/api`
- Hostel Service: `http://localhost:8091/api`
- Allocation Service: `http://localhost:8092/api`

## Technologies Used

- React 18
- React Router DOM 6
- Axios for HTTP requests
- Vite for build tooling



