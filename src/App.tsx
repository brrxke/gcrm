import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ClientLayout } from './components/ClientLayout';
import { AdminLayout } from './components/AdminLayout';
import { I18nProvider } from './context/I18nContext';
import { authApi } from './api/auth';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (authApi.isAuthenticated()) {
        setIsAuthenticated(true);
        setIsAdmin(authApi.isAdmin());
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      await authApi.login(email, password);
      setIsAuthenticated(true);
      setIsAdmin(authApi.isAdmin());
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  };

  const handleRegister = async (name: string, email: string, password: string, phone?: string, age?: number) => {
    try {
      await authApi.register({ name, email, password, phone, age });
      setIsAuthenticated(true);
      setIsAdmin(authApi.isAdmin());
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    await authApi.logout();
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={isAdmin ? "/admin" : "/client"} replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to={isAdmin ? "/admin" : "/client"} replace />
            ) : (
              <RegisterPage onRegister={handleRegister} />
            )
          }
        />
        <Route
          path="/client/*"
          element={
            isAuthenticated && !isAdmin ? (
              <ClientLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/*"
          element={
            isAuthenticated && isAdmin ? (
              <AdminLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
