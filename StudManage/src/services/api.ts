import axios from 'axios';

// ==================== TYPE DEFINITIONS ====================
export interface Student {
  id: number;
  matriculation_number: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  phone_number: string;
  state_of_origin: string;
  local_government_area: string;
  nationality: string;
  address: string;
  enrollment_date: string;
}

export interface AcademicRecord {
  id: number;
  student: number;
  student_name?: string;
  student_matric?: string;
  course_name: string;
  cgpa: number;
  grade: string;
  semester: string;
  level: number;
}

export interface StudentFormData {
  matriculation_number: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  phone_number: string;
  state_of_origin: string;
  local_government_area: string;
  nationality: string;
  address: string;
  enrollment_date: string;
}

// Add DashboardStats interface
export interface DashboardStats {
  total_students: number;
  average_cgpa: number;
  level_stats: Array<{
    level: number;
    count: number;
  }>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
// ==================== END TYPE DEFINITIONS ====================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// Helper function to get CSRF token
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.response.config.url,
      });
    }
    return Promise.reject(error);
  }
);

// API Service Functions - Return data directly, not response object
export const studentAPI = {
  // Students
  getStudents: (params?: {
    page?: number;
    search?: string;
    gender?: string;
    state_of_origin?: string;
    ordering?: string;
  }) => api.get<Student[]>('/students/', { params }).then(res => res.data), // Fixed to Student[]
  
  getStudent: (id: number) => api.get<Student>(`/students/${id}/`).then(res => res.data),
  
  createStudent: (data: StudentFormData) => 
    api.post<Student>('/students/', data).then(res => res.data),
  
  updateStudent: (id: number, data: Partial<StudentFormData>) =>
    api.put<Student>(`/students/${id}/`, data).then(res => res.data),
  
  patchStudent: (id: number, data: Partial<StudentFormData>) =>
    api.patch<Student>(`/students/${id}/`, data).then(res => res.data),
  
  deleteStudent: (id: number) => api.delete(`/students/${id}/`).then(res => res.data),
  
  getStudentStats: () => api.get('/students/stats/').then(res => res.data),
  
  getStudentAcademicRecords: (studentId: number) =>
    api.get<AcademicRecord[]>(`/students/${studentId}/academic_records/`).then(res => res.data),
  
  // Add Dashboard Stats endpoint
  getDashboardStats: () => api.get<DashboardStats>('/dashboard/stats/').then(res => res.data),
};

// Format date for Django (YYYY-MM-DD)
export const formatDateForDjango = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date format:', dateString);
      return '';
    }
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Format date for display
export const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date for display:', dateString);
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting display date:', error);
    return 'Invalid Date';
  }
};

export default api;