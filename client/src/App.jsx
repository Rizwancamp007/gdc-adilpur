import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Admin Layout & Login
import AdminLogin from './admin/pages/AdminLogin';
import AdminLayout from './admin/components/AdminLayout';

// Admin Pages
import AdminDashboard from './admin/pages/AdminDashboard';
import CollegeProfilePage from './admin/pages/CollegeProfilePage';
import HeroSlidesPage from './admin/pages/HeroSlidesPage';
import DirectorMessagePage from './admin/pages/DirectorMessagePage';
import DepartmentsFacultyPage from './admin/pages/DepartmentsFacultyPage';
import ProgramsPage from './admin/pages/ProgramsPage';
import AdmissionsInfoPage from './admin/pages/AdmissionsInfoPage';
import FeeSchemesPage from './admin/pages/FeeSchemesPage';
import NoticesPage from './admin/pages/NoticesPage';
import DownloadsPage from './admin/pages/DownloadsPage';
import SuccessStoriesPage from './admin/pages/SuccessStoriesPage';
import GalleryPage from './admin/pages/GalleryPage';
import FeedbackPage from './admin/pages/FeedbackPage';
import MessagesPage from './admin/pages/MessagesPage';
import StatsPage from './admin/pages/StatsPage';
import PagesPage from './admin/pages/PagesPage';
import UsersPage from './admin/pages/UsersPage';
import ActivityLogPage from './admin/pages/ActivityLogPage';
import SettingsPage from './admin/pages/SettingsPage';

// Public Layout & Pages
import PublicLayout from './pages/components/PublicLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PublicDepartmentsPage from './pages/DepartmentsPage';
import PublicProgramsPage from './pages/ProgramsPage';
import AdmissionsPage from './pages/AdmissionsPage';
import PublicNoticesPage from './pages/NoticesPage';
import PublicDownloadsPage from './pages/DownloadsPage';
import PublicGalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import PublicSuccessStoriesPage from './pages/SuccessStoriesPage';
import DynamicPage from './pages/DynamicPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* ─── PUBLIC WEBSITE ─── */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/departments" element={<PublicDepartmentsPage />} />
              <Route path="/departments/:id" element={<PublicDepartmentsPage />} />
              <Route path="/programs" element={<PublicProgramsPage />} />
              <Route path="/admissions" element={<AdmissionsPage />} />
              <Route path="/notices" element={<PublicNoticesPage />} />
              <Route path="/downloads" element={<PublicDownloadsPage />} />
              <Route path="/gallery" element={<PublicGalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/success-stories" element={<PublicSuccessStoriesPage />} />
              <Route path="/info/:slug" element={<DynamicPage />} />
            </Route>

            {/* ─── ADMIN ─── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="college-profile" element={<CollegeProfilePage />} />
              <Route path="hero-slides" element={<HeroSlidesPage />} />
              <Route path="director-message" element={<DirectorMessagePage />} />
              <Route path="departments-faculty" element={<DepartmentsFacultyPage />} />
              <Route path="programs" element={<ProgramsPage />} />
              <Route path="admissions-info" element={<AdmissionsInfoPage />} />
              <Route path="fee-schemes" element={
                <ProtectedRoute roles={['Admin']}><FeeSchemesPage /></ProtectedRoute>
              } />
              <Route path="notices" element={<NoticesPage />} />
              <Route path="downloads" element={<DownloadsPage />} />
              <Route path="success-stories" element={<SuccessStoriesPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="feedback" element={<FeedbackPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="stats" element={<StatsPage />} />
              <Route path="pages" element={<PagesPage />} />
              <Route path="users" element={
                <ProtectedRoute roles={['Admin']}><UsersPage /></ProtectedRoute>
              } />
              <Route path="activity-log" element={
                <ProtectedRoute roles={['Admin']}><ActivityLogPage /></ProtectedRoute>
              } />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
              },
              success: { iconTheme: { primary: 'var(--color-success)', secondary: '#fff' } },
              error: { iconTheme: { primary: 'var(--color-danger)', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
