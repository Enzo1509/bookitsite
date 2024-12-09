import React, { useState } from 'react';
import { User, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './ui/Logo';
import Button from './ui/Button';
import AuthModal from './auth/AuthModal';
import LanguageSwitcher from './LanguageSwitcher';
import UserMenu from './UserMenu';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore } from '@/store/languageStore';

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { translations } = useLanguageStore();

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Logo />
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/favoris"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                  </Link>
                  <UserMenu />
                </div>
              ) : (
                <Button onClick={() => setIsAuthModalOpen(true)}>
                  <User className="h-5 w-5 mr-2" />
                  <span>{translations.common.login}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;