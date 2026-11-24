import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'

// Public pages
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
import FeaturesPage from './pages/FeaturesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Student pages
import StudentDashboard from './pages/StudentDashboard'
import SubjectSelection from './pages/SubjectSelection'
import TopicSelection from './pages/TopicSelection'
import ContentGenerator from './pages/ContentGenerator'
import QuizGenerator from './pages/QuizGenerator'
import QuizInterface from './pages/QuizInterface'
import QuizResults from './pages/QuizResults'
import Analytics from './pages/Analytics'
import Recommendations from './pages/Recommendations'
import ChatAssistant from './pages/ChatAssistant'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageStudents from './pages/admin/ManageStudents'
import ManageSubjects from './pages/admin/ManageSubjects'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#7C3AED', secondary: '#fff' },
            },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected student routes */}
          <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/subjects" element={<ProtectedRoute><SubjectSelection /></ProtectedRoute>} />
          <Route path="/subjects/:subjectId/topics" element={<ProtectedRoute><TopicSelection /></ProtectedRoute>} />
          <Route path="/content" element={<ProtectedRoute><ContentGenerator /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><QuizGenerator /></ProtectedRoute>} />
          <Route path="/quiz/:quizId" element={<ProtectedRoute><QuizInterface /></ProtectedRoute>} />
          <Route path="/quiz/results/:resultId" element={<ProtectedRoute><QuizResults /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatAssistant /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/students" element={<AdminRoute><ManageStudents /></AdminRoute>} />
          <Route path="/admin/subjects" element={<AdminRoute><ManageSubjects /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
