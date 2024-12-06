import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';
import { EhrIntegration } from './components/EhrIntegration';
import { ClinikoSetup } from './components/ClinikoSetup';
import { RetentionDashboard } from './components/demo/RetentionDashboard';
import { LoadingSpinner } from './components/LoadingSpinner';

export function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/integration" replace />
              ) : (
                <AuthForm />
              )
            }
          />
          <Route
            path="/integration"
            element={
              user ? (
                <EhrIntegration />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/cliniko-setup"
            element={
              user ? (
                <ClinikoSetup />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/demo-dashboard"
            element={
              user ? (
                <RetentionDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}