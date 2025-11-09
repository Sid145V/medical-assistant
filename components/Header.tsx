import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const Icon = ({ path, className = "h-6 w-6" }: { path: string, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const Logo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L12 22"/>
      <path d="M20 10L4 10"/>
      <path d="M20 14L4 14"/>
      <path d="M12 2a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4Z"/>
      <path d="M12 22a4 4 0 0 0 4-4v0a4 4 0 0 0-4-4Z"/>
      <path d="M20 10a4 4 0 0 0-4-4h0a4 4 0 0 0-4 4Z"/>
      <path d="M4 14a4 4 0 0 0 4 4h0a4 4 0 0 0 4-4Z"/>
    </svg>
);

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isSoundEnabled, toggleSound } = useSettings();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case UserRole.ADMIN: return '/admin/dashboard';
      case UserRole.DOCTOR: return '/doctor/dashboard';
      case UserRole.SHOP: return '/shop/dashboard';
      default: return '/';
    }
  };

  const navLinkClasses = "relative font-semibold text-text-light dark:text-text-dark hover:text-primary transition-colors duration-300";
  const activeNavLinkClasses = "text-primary";

  const navLinks = (
      <>
        <NavLink to="/" className={({isActive}) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Home</NavLink>
        <NavLink to="/about" className={({isActive}) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>About</NavLink>
        <NavLink to="/contact" className={({isActive}) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Contact</NavLink>
        {user?.role === UserRole.PATIENT && (
          <NavLink to="/shops" className={({isActive}) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Shops</NavLink>
        )}
      </>
  );

  return (
    <header className="bg-card-light/60 dark:bg-card-dark/60 backdrop-blur-xl sticky top-4 z-50 border border-[var(--border-color)] rounded-2xl container mx-auto shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to={getDashboardLink()} className="flex items-center space-x-3">
            <Logo />
            <span className="font-display text-2xl font-bold text-text-light dark:text-text-dark">MediAI</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks}
          </nav>

          <div className="flex items-center space-x-1 sm:space-x-2">
             <motion.button onClick={toggleTheme} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                <Icon path={theme === 'light' ? "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" : "M12 3v2.25m6.364.364l-1.591 1.591M21 12h-2.25m-.364 6.364l-1.591-1.591M12 18.75V21m-6.364-.364l1.591-1.591M3 12h2.25m.364-6.364l1.591 1.591M12 6a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z"} className="h-5 w-5 text-text-muted-light dark:text-text-muted-dark" />
             </motion.button>
             <motion.button onClick={toggleSound} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                <Icon path={isSoundEnabled ? "M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" : "M17.25 9.75L19.5 12m0 0L21.75 14.25M19.5 12L21.75 9.75M19.5 12L17.25 14.25M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" } className="h-5 w-5 text-text-muted-light dark:text-text-muted-dark" />
             </motion.button>
            <div className="hidden md:flex items-center space-x-4 pl-2">
              {user ? (
                <>
                  <span className="font-semibold text-text-muted-light dark:text-text-muted-dark hidden lg:block">Welcome, {'name' in user ? user.name.split(' ')[0] : 'firstName' in user ? user.firstName : 'shopName' in user ? user.shopName : 'Admin'}</span>
                  <motion.button onClick={logout} className="font-semibold text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Logout</motion.button>
                </>
              ) : (
                <motion.button
                  onClick={() => navigate('/get-started')}
                  className="btn-primary"
                >
                  Get Started
                </motion.button>
              )}
            </div>
            <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Open menu" className="text-text-light dark:text-text-dark p-2">
                    <Icon path={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </button>
            </div>
          </div>
        </div>
      </div>
       <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden glass-card rounded-t-none border-t-0 -mt-2 mx-4"
            >
                <nav className="flex flex-col items-center space-y-6 py-6 font-semibold">
                    {navLinks}
                     {user ? (
                        <button onClick={logout} className="font-semibold text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors">Logout</button>
                    ) : (
                        <motion.button
                            onClick={() => {navigate('/get-started'); setMobileMenuOpen(false);}}
                            className="btn-primary"
                             whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                        >
                            Get Started
                        </motion.button>
                    )}
                </nav>
            </motion.div>
        )}
       </AnimatePresence>
    </header>
  );
};

export default Header;