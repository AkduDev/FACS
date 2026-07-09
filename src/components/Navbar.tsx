import React from 'react';
import { Anchor, ShieldAlert, Compass, Menu, X, Landmark, UserCheck, Sun, Moon } from 'lucide-react';
import fcasLogo from '../assets/images/fcas_logo_v2_1783530295569.jpg';
import { motion, AnimatePresence } from 'motion/react';
import { useThemeLang } from '../ThemeLangContext';

interface NavbarProps {
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navbar({ isAdminMode, setIsAdminMode, isLoggedIn, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme, toggleTheme, lang, setLang, t } = useThemeLang();

  const navLinks = [
    { name: t.navHome, href: '#inicio' },
    { name: t.navGallery, href: '#galeria' },
    { name: t.navNews, href: '#noticias' },
    { name: t.navEvents, href: '#eventos' },
    { name: t.navInstructors, href: '#instructores' },
    { name: t.navGraduates, href: '#graduados' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
    setIsAdminMode(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-marine-950 to-marine-900 border-b border-marine-800 text-white shadow-xl backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer animate-fade-in" onClick={() => setIsAdminMode(false)}>
            <div className="relative w-12 h-12 bg-white rounded-full overflow-hidden border border-marine-700 p-0.5 shadow-md shadow-cyan-500/10 flex items-center justify-center">
              <img
                src={fcasLogo}
                alt="Logo FCAS"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-cyan-300 via-marine-200 to-white bg-clip-text text-transparent">
                  FCAS
                </span>
                <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded-md font-bold tracking-widest keep-white">
                  CUBA
                </span>
              </div>
              <p className="text-[10px] text-marine-300 font-medium tracking-wider uppercase font-display hidden sm:block">
                {t.appSub}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {!isAdminMode && navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-marine-100 hover:text-white hover:bg-marine-800/50 transition-all duration-200"
              >
                {link.name}
              </a>
            ))}

            {isAdminMode && (
              <button
                onClick={() => setIsAdminMode(false)}
                className="mr-4 px-4 py-2 rounded-lg text-sm font-medium text-cyan-300 hover:text-white hover:bg-marine-800/50 transition-all"
              >
                ← {t.backToPublic}
              </button>
            )}

            <span className="h-6 w-px bg-marine-800 mx-2" />

            {/* Language and Theme Toggles */}
            <div className="flex items-center space-x-2 mr-3">
              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                className="px-2.5 py-1.5 text-xs font-bold border border-marine-800 rounded-xl hover:border-cyan-400 hover:text-cyan-300 transition-colors bg-marine-950/40 uppercase tracking-wider text-marine-100 flex items-center gap-1 cursor-pointer"
                title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              >
                <span className="text-sm">🌐</span>
                <span>{lang === 'es' ? 'EN' : 'ES'}</span>
              </button>

              {/* Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-marine-800 hover:border-cyan-400 text-marine-100 hover:text-cyan-300 transition-all bg-marine-950/40 cursor-pointer"
                title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-cyan-400" />}
              </button>
            </div>

            <span className="h-6 w-px bg-marine-800 mr-2" />

            {/* Admin Toggle Button */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-3 py-1.5 rounded-full flex items-center space-x-1">
                  <UserCheck className="h-3 w-3" />
                  <span>{lang === 'es' ? 'Admin Activo' : 'Admin Active'}</span>
                </span>
                <button
                  onClick={() => {
                    setIsAdminMode(!isAdminMode);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isAdminMode
                      ? 'bg-marine-700 text-white shadow-inner'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/30'
                  }`}
                >
                  {isAdminMode ? (lang === 'es' ? 'Ver Sitio Público' : 'View Public Site') : (lang === 'es' ? 'Panel Admin' : 'Admin Panel')}
                </button>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-all"
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAdminMode(true)}
                className="bg-gradient-to-r from-marine-600 to-marine-500 hover:from-marine-500 hover:to-marine-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-marine-950/50 flex items-center space-x-2 transition-all duration-200 hover:-translate-y-0.5 border border-cyan-500/20"
              >
                <ShieldAlert className="h-4 w-4 text-cyan-200" />
                <span>{t.adminPanel}</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-marine-200 hover:text-white hover:bg-marine-800 focus:outline-none transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden bg-marine-950 border-b border-marine-800 px-2 pt-2 pb-4 space-y-1 sm:px-3 overflow-hidden"
          >
            {!isAdminMode && navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className="block px-4 py-3 rounded-lg text-base font-medium text-marine-100 hover:text-white hover:bg-marine-800 transition-all"
              >
                {link.name}
              </a>
            ))}

            {isAdminMode && (
              <button
                onClick={() => {
                  setIsAdminMode(false);
                  setIsOpen(false);
                }}
                className="w-full text-left block px-4 py-3 rounded-lg text-base font-medium text-cyan-300 hover:text-white hover:bg-marine-800"
              >
                ← {t.backToPublic}
              </button>
            )}

            {/* Mobile Theme & Language Toggles */}
            <div className="flex items-center justify-between px-4 py-3.5 border-t border-marine-800/60 mt-2 bg-marine-950/20 rounded-xl">
              <span className="text-sm font-semibold text-marine-200">
                {lang === 'es' ? 'Idioma / Apariencia' : 'Language / Theme'}
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                  className="px-3 py-1.5 text-xs font-bold border border-marine-800 rounded-xl bg-marine-950/50 uppercase tracking-wider text-marine-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🌐</span>
                  <span>{lang === 'es' ? 'EN' : 'ES'}</span>
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl border border-marine-800 text-marine-100 bg-marine-950/50 cursor-pointer"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-cyan-400" />}
                </button>
              </div>
            </div>

            <div className="pt-4 pb-2 border-t border-marine-800 mt-2 px-4">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                      {lang === 'es' ? 'Panel Activo' : 'Admin Active'}
                    </span>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsOpen(false);
                      }}
                      className="text-xs text-red-400 font-semibold"
                    >
                      {t.logout}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setIsAdminMode(true);
                      setIsOpen(false);
                    }}
                    className="w-full bg-cyan-600 text-white px-4 py-2.5 rounded-xl text-center text-sm font-semibold shadow"
                  >
                    {lang === 'es' ? 'Ir al Panel Admin' : 'Go to Admin Panel'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsAdminMode(true);
                    setIsOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-marine-600 to-marine-500 text-white px-4 py-2.5 rounded-xl text-center text-sm font-semibold shadow flex items-center justify-center space-x-2"
                >
                  <ShieldAlert className="h-4 w-4 text-cyan-200" />
                  <span>{t.adminPanel}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
