import axios from 'axios';

const API_BASE_URLS = {
  student: 'http://localhost:8090/api',
  hostel: 'http://localhost:8091/api',
  allocation: 'http://localhost:8092/api'
};


export const studentAPI = {
  getAll: () => axios.get(`${API_BASE_URLS.student}/students/all`),
  getById: (studentId) => axios.get(`${API_BASE_URLS.student}/students/${studentId}`),
  register: (studentData) => axios.post(`${API_BASE_URLS.student}/students/register`, studentData),
  update: (studentId, studentData) => axios.put(`${API_BASE_URLS.student}/students/${studentId}`, studentData),
  delete: (studentId) => axios.delete(`${API_BASE_URLS.student}/students/${studentId}`)
};

// Hostel API
export const hostelAPI = {
  getAll: () => axios.get(`${API_BASE_URLS.hostel}/hostels`),
  getById: (id) => axios.get(`${API_BASE_URLS.hostel}/hostels/${id}`),
  create: (hostelData) => axios.post(`${API_BASE_URLS.hostel}/hostels`, hostelData),
  update: (id, hostelData) => axios.put(`${API_BASE_URLS.hostel}/hostels/${id}`, hostelData),
  delete: (id) => axios.delete(`${API_BASE_URLS.hostel}/hostels/${id}`),
  getRooms: (hostelId) => axios.get(`${API_BASE_URLS.hostel}/hostels/${hostelId}/rooms`),
  addRoom: (hostelId, roomData) => axios.post(`${API_BASE_URLS.hostel}/hostels/${hostelId}/rooms`, roomData)
};

// Room API
export const roomAPI = {
  getAll: () => axios.get(`${API_BASE_URLS.hostel}/rooms`),
  getById: (id) => axios.get(`${API_BASE_URLS.hostel}/rooms/${id}`),
  update: (id, roomData) => axios.put(`${API_BASE_URLS.hostel}/rooms/${id}`, roomData),
  delete: (id) => axios.delete(`${API_BASE_URLS.hostel}/rooms/${id}`),
  getAvailable: () => axios.get(`${API_BASE_URLS.hostel}/rooms/available`)
};

// Allocation API
export const allocationAPI = {
  getAll: () => axios.get(`${API_BASE_URLS.allocation}/allocations`),
  getActive: () => axios.get(`${API_BASE_URLS.allocation}/allocations/active`),
  getById: (id) => axios.get(`${API_BASE_URLS.allocation}/allocations/${id}`),
  allocate: (allocationData) => axios.post(`${API_BASE_URLS.allocation}/allocations`, allocationData),
  deallocate: (id, remarks) => axios.put(`${API_BASE_URLS.allocation}/allocations/${id}/deallocate`, null, {
    params: { remarks }
  }),
  getByStudentId: (studentId) => axios.get(`${API_BASE_URLS.allocation}/allocations/student/${studentId}`),
  getByRoomId: (roomId) => axios.get(`${API_BASE_URLS.allocation}/allocations/room/${roomId}`),
  getByHostelId: (hostelId) => axios.get(`${API_BASE_URLS.allocation}/allocations/hostel/${hostelId}`)
};



