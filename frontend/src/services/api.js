import axios from 'axios';

const API_BASE_URLS = {
  student: import.meta.env.VITE_API_STUDENT_URL || 'http://localhost:8090/api',
  hostel: import.meta.env.VITE_API_HOSTEL_URL || 'http://localhost:8091/api',
  allocation: import.meta.env.VITE_API_ALLOCATION_URL || 'http://localhost:8092/api'
};

// Create axios instances with interceptors
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      // Handle standardized API response
      if (response.data && response.data.data !== undefined) {
        return { ...response, data: response.data.data, apiResponse: response.data };
      }
      return response;
    },
    (error) => {
      // Handle errors with standardized format
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.message || data?.error || 'An error occurred';
        
        // Extract validation errors if present
        if (status === 400 && typeof data === 'object') {
          const validationErrors = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          error.validationErrors = validationErrors;
          error.message = validationErrors || errorMessage;
        } else {
          error.message = errorMessage;
        }
      } else if (error.request) {
        error.message = 'Network error. Please check your connection.';
      } else {
        error.message = error.message || 'An unexpected error occurred';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const studentClient = createAxiosInstance(API_BASE_URLS.student);
const hostelClient = createAxiosInstance(API_BASE_URLS.hostel);
const allocationClient = createAxiosInstance(API_BASE_URLS.allocation);

export const studentAPI = {
  getAll: () => studentClient.get('/students/all'),
  getById: (studentId) => studentClient.get(`/students/${studentId}`),
  register: (studentData) => studentClient.post('/students/register', studentData),
  update: (studentId, studentData) => studentClient.put(`/students/${studentId}`, studentData),
  delete: (studentId) => studentClient.delete(`/students/${studentId}`)
};

// Hostel API
export const hostelAPI = {
  getAll: () => hostelClient.get('/hostels'),
  getById: (id) => hostelClient.get(`/hostels/${id}`),
  create: (hostelData) => hostelClient.post('/hostels', hostelData),
  update: (id, hostelData) => hostelClient.put(`/hostels/${id}`, hostelData),
  delete: (id) => hostelClient.delete(`/hostels/${id}`),
  getRooms: (hostelId) => hostelClient.get(`/hostels/${hostelId}/rooms`),
  addRoom: (hostelId, roomData) => hostelClient.post(`/hostels/${hostelId}/rooms`, roomData)
};

// Room API
export const roomAPI = {
  getAll: () => hostelClient.get('/rooms'),
  getById: (id) => hostelClient.get(`/rooms/${id}`),
  update: (id, roomData) => hostelClient.put(`/rooms/${id}`, roomData),
  delete: (id) => hostelClient.delete(`/rooms/${id}`),
  getAvailable: () => hostelClient.get('/rooms/available')
};

// Allocation API
export const allocationAPI = {
  getAll: () => allocationClient.get('/allocations'),
  getActive: () => allocationClient.get('/allocations/active'),
  getById: (id) => allocationClient.get(`/allocations/${id}`),
  allocate: (allocationData) => allocationClient.post('/allocations', allocationData),
  deallocate: (id, remarks) => allocationClient.put(`/allocations/${id}/deallocate`, null, {
    params: { remarks }
  }),
  getByStudentId: (studentId) => allocationClient.get(`/allocations/student/${studentId}`),
  getByRoomId: (roomId) => allocationClient.get(`/allocations/room/${roomId}`),
  getByHostelId: (hostelId) => allocationClient.get(`/allocations/hostel/${hostelId}`)
};





