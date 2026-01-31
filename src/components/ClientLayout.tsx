import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home, CreditCard, User, MessageSquare, Calendar, Star, LogOut } from 'lucide-react';
import { ClientDashboard } from './client/ClientDashboard';
import { MembershipPlans } from './client/MembershipPlans';
import { UserProfile } from './client/UserProfile';
import { TrainerChat } from './client/TrainerChat';
import { TrialBooking } from './client/TrialBooking';
import { FeedbackSurvey } from './client/FeedbackSurvey';

interface ClientLayoutProps {
  onLogout: () => void;
}

export function ClientLayout({ onLogout }: ClientLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/client' },
    { icon: CreditCard, label: 'Plans', path: '/client/plans' },
    { icon: Calendar, label: 'Book', path: '/client/book' },
    { icon: MessageSquare, label: 'Chat', path: '/client/chat' },
    { icon: Star, label: 'Feedback', path: '/client/feedback' },
    { icon: User, label: 'Profile', path: '/client/profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/client') {
      return location.pathname === '/client';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-black border-b border-border z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="uppercase tracking-wider text-primary">APEX GYM</h1>
          <button onClick={onLogout} className="text-muted-foreground hover:text-secondary">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-20 bg-card border-r border-border">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-black text-xl">IT</span>
            </div>
          </div>
          <nav className="flex-1 py-4">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full p-4 flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive(item.path)
                    ? 'text-primary bg-muted'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </nav>
          <button
            onClick={onLogout}
            className="p-4 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-secondary transition-colors border-t border-border"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-20 pt-16 lg:pt-0">
        <Routes>
          <Route path="/" element={<ClientDashboard />} />
          <Route path="/plans" element={<MembershipPlans />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/chat" element={<TrainerChat />} />
          <Route path="/book" element={<TrialBooking />} />
          <Route path="/feedback" element={<FeedbackSurvey />} />
        </Routes>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <nav className="flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 p-3 flex flex-col items-center gap-1 transition-colors ${
                isActive(item.path)
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}