import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { ClientLayout } from './components/ClientLayout';
import { AdminLayout } from './components/AdminLayout';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Mock authentication
    if (email.includes('admin')) {
      setIsAdmin(true);
      setIsAuthenticated(true);
    } else {
      setIsAdmin(false);
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
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
  );
}
