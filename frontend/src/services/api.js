import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle responses and 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear and optionally redirect
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
};

// Subjects & Topics
export const subjectAPI = {
  getAll: () => api.get('/subjects'),
  getOne: (id) => api.get(`/subjects/${id}`),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
  seedDefaults: () => api.post('/subjects/seed-defaults'),
};

export const topicAPI = {
  getBySubject: (subjectId) => api.get(`/topics/subject/${subjectId}`),
  getOne: (id) => api.get(`/topics/${id}`),
  create: (data) => api.post('/topics', data),
  update: (id, data) => api.put(`/topics/${id}`, data),
  delete: (id) => api.delete(`/topics/${id}`),
};

// AI Learning Content
export const contentAPI = {
  generate: (data) => api.post('/content/generate', data),
  getAll: () => api.get('/content'),
  getOne: (id) => api.get(`/content/${id}`),
  delete: (id) => api.delete(`/content/${id}`),
};

// AI Quiz & Results
export const quizAPI = {
  generate: (data) => api.post('/quiz/generate', data),
  getAll: () => api.get('/quiz'),
  getOne: (id) => api.get(`/quiz/${id}`),
};

export const quizResultAPI = {
  submit: (data) => api.post('/quiz-results/submit', data),
  getAll: () => api.get('/quiz-results'),
  getOne: (id) => api.get(`/quiz-results/${id}`),
};

// Analytics & Recommendations
export const analyticsAPI = {
  get: () => api.get('/analytics'),
};

export const recommendationAPI = {
  get: () => api.get('/recommendations'),
  generate: () => api.post('/recommendations/generate'),
};

// AI Chatbot
export const chatAPI = {
  send: (data) => api.post('/chat/send', data),
  getHistory: () => api.get('/chat/history'),
  getOne: (id) => api.get(`/chat/${id}`),
  delete: (id) => api.delete(`/chat/${id}`),
};

// Admin
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getStudents: () => api.get('/admin/students'),
  updateStudent: (id, data) => api.put(`/admin/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
};

export default api;
