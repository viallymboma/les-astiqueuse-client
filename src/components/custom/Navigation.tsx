'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Droplet, Phone, Info, LogIn, Menu, X, Sun, Moon, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';
import keycloak from '@/lib/keycloak';

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme, user, logout } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const login = () => {
    keycloak.init({
      onLoad: "login-required",
      pkceMethod: "S256",
    });
  };


  const navItems = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/services', label: 'Services', icon: Droplet },
    { href: '/about', label: 'À Propos', icon: Info },
    { href: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? theme === 'dark'
          ? 'bg-[#185d88]/80 backdrop-blur-xl shadow-2xl border-b border-white/10'
          : 'bg-white/80 backdrop-blur-xl shadow-2xl border-b border-[#6eaad0]/20'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className={`p-3 rounded-2xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-[#61c4f1] to-[#6eaad0] shadow-lg shadow-[#61c4f1]/50' 
                : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1] shadow-lg shadow-[#6eaad0]/30'
            }`}>
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                LesAstiqueuses
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>Services Premium</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  pathname === item.href
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white shadow-lg shadow-[#61c4f1]/30'
                      : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white shadow-lg shadow-[#6eaad0]/30'
                    : theme === 'dark'
                      ? 'text-[#b2d2e6] hover:bg-white/10'
                      : 'text-[#6d89a3] hover:bg-[#6eaad0]/10'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-[#307aa8] to-[#185d88] text-white hover:shadow-lg hover:shadow-[#307aa8]/30'
                      : 'bg-gradient-to-r from-[#6eaad0] to-[#307aa8] text-white hover:shadow-lg hover:shadow-[#6eaad0]/30'
                  }`}
                >
                  Mon Espace
                </Link>
                <button
                  onClick={logout}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    theme === 'dark'
                      ? 'text-[#b2d2e6] hover:bg-white/10'
                      : 'text-[#6d89a3] hover:bg-[#6eaad0]/10'
                  }`}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
              <button
                  onClick={login}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                    theme === 'dark'
                      ? 'text-[#b2d2e6] hover:bg-white/10'
                      : 'text-[#6d89a3] hover:bg-[#6eaad0]/10'
                  }`}
                  >
                    <LogIn className="w-4 h-4" />
                  <span>Connexion ++++++++</span>
              </button>
                {/* <Link
                  href="/login"
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                    theme === 'dark'
                      ? 'text-[#b2d2e6] hover:bg-white/10'
                      : 'text-[#6d89a3] hover:bg-[#6eaad0]/10'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Connexion</span>
                </Link> */}
                <Link
                  href="/register"
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white hover:shadow-lg hover:shadow-[#61c4f1]/30'
                      : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-lg hover:shadow-[#6eaad0]/30'
                  }`}
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-[#307aa8] text-[#b2d2e6] hover:bg-[#185d88]'
                  : 'bg-[#b2d2e6] text-[#307aa8] hover:bg-[#6eaad0]'
              }`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-3 rounded-xl ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden ${theme === 'dark' ? 'bg-[#185d88]/95' : 'bg-white/95'} backdrop-blur-xl border-t ${theme === 'dark' ? 'border-white/10' : 'border-[#6eaad0]/20'}`}>
          <div className="px-4 py-6 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`w-full px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 ${
                  pathname === item.href
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white'
                      : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white'
                    : theme === 'dark'
                      ? 'text-[#b2d2e6] hover:bg-white/10'
                      : 'text-[#6d89a3] hover:bg-[#6eaad0]/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
