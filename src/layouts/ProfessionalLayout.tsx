import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Calendar, Clock, LogOut } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/hooks/useTranslation';

const ProfessionalLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthStore();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/pro/login');
  };

  if (!isAuthenticated || location.pathname === '/pro/login') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r">
        <div className="p-6 flex items-center justify-between">
          <Logo />
          <LanguageSwitcher />
        </div>
        <nav className="mt-6">
          <Link
            to="/pro/dashboard"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            <Calendar className="h-5 w-5 mr-3" />
            {t.professional.dashboard.title}
          </Link>
          <Link
            to="/pro/bookings"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            <Calendar className="h-5 w-5 mr-3" />
            {t.professional.bookings.title}
          </Link>
          <Link
            to="/pro/business"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            <Building2 className="h-5 w-5 mr-3" />
            {t.professional.business.title}
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5 mr-3" />
            {t.common.logout}
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ProfessionalLayout;