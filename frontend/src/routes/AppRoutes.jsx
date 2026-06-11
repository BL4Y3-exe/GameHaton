import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import LibraryPage from '../pages/LibraryPage.jsx';
import RevivalQueuePage from '../pages/RevivalQueuePage.jsx';
import DealsPage from '../pages/DealsPage.jsx';
import { isAuthenticated } from '../services/auth.js';

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-night text-slate-100">
      <Sidebar />
      <main className="min-h-screen px-4 py-5 md:pl-72 md:pr-8 lg:pr-10">{children}</main>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell>
              <DashboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <AppShell>
              <LibraryPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/revival-queue"
        element={
          <ProtectedRoute>
            <AppShell>
              <RevivalQueuePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/deals"
        element={
          <ProtectedRoute>
            <AppShell>
              <DealsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
