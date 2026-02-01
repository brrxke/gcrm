import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, BarChart3, LogOut, Menu } from 'lucide-react';
import { AdminDashboard } from './admin/AdminDashboard';
import { ClientManagement } from './admin/ClientManagement';
import { MembershipManagement } from './admin/MembershipManagement';
import { Analytics } from './admin/Analytics';
import { LanguageSelector } from '../LanguageSelector';
import { useState } from 'react';

interface AdminLayoutProps {
  onLogout: () => void;
}

export function AdminLayout({ onLogout }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Clients', path: '/admin/clients' },
    { icon: CreditCard, label: 'Memberships', path: '/admin/memberships' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-black">
{/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white"
            >
              <Menu className="w-6 h-5" />
            </button>
            <h1 className="uppercase tracking-wider text-primary">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <button onClick={onLogout} className="text-muted-foreground hover:text-secondary">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
          <button onClick={onLogout} className="text-muted-foreground hover:text-secondary">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-40 transition-transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-black font-bold">A</span>
              </div>
              <div>
                <h2 className="text-white uppercase tracking-wider">APEX GYM</h2>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-white hover:bg-muted'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          <button
            onClick={onLogout}
            className="m-4 flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-secondary hover:bg-muted transition-colors border-t border-border"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/clients" element={<ClientManagement />} />
          <Route path="/memberships" element={<MembershipManagement />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </div>
  );
}