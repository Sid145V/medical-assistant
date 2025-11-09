import React, { useState, useEffect, useRef } from 'react';
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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
       <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l-3.23-3.23c-2.34-2.34-2.34-6.14 0-8.48l8.48-8.48c2.34-2.34 6.14-2.34 8.48 0L21 3.5m-3.23 14.27L12 12m0 0l-3.23-3.23m3.23 3.23l3.23 3.23" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l3.23-3.23c2.34-2.34 2.34-6.14 0-8.48L.5 3.51c-2.34-2.34-6.14-2.34-8.48 0L-12 12m3.23-3.23L-3 12m0 0l3.23 3.23m-3.23-3.23L0 5.5" transform="scale(-1, 1) translate(-21.5, 0)"/>
    </svg>
);


const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isSoundEnabled, toggleSound } = useSettings();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const getUserDisplayName = () => {
    if (!user) return '';
    if ('name' in user) return user.name;
    if ('firstName' in user) return user.firstName;
    if ('shopName' in user) return user.shopName;
    if ('username' in user) return user.username;
    return 'User';
  };
  
  const displayName = getUserDisplayName();
  const avatarUrl = (user && 'image' in user && user.image) 
    ? user.image 
    : `https://ui-avatars.com/api/?name=${displayName.replace(/\s+/g, '+')}&background=0b786e&color=fff&size=96&font-size=0.4`;

  const dropdownItemClasses = "w-full text-left px-3 py-2 text-sm text-text-light dark:text-text-dark hover:bg-primary/10 rounded-md transition-colors flex items-center space-x-3";

  return (
    <header className={`sticky top-4 z-50 container mx-auto rounded-2xl transition-all duration-300 ease-out ${isScrolled ? 'bg-card-light/80 dark:bg-card-dark/70 backdrop-blur-xl shadow-xl border border-[var(--border-color)]' : 'shadow-lg'}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ease-out ${isScrolled ? 'h-16' : 'h-20'}`}>
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
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setIsDropdownOpen(p => !p)} className="flex items-center space-x-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <img src={avatarUrl} alt="User Avatar" className="h-8 w-8 rounded-full object-cover" />
                      <span className="font-semibold text-text-light dark:text-text-dark hidden lg:block">{displayName}</span>
                      <Icon path="M19 9l-7 7-7-7" className={`h-4 w-4 text-text-muted-light dark:text-text-muted-dark transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute top-full right-0 mt-2 w-48 glass-card p-2 shadow-xl border border-[var(--border-color)] z-10"
                      >
                        <div className="flex flex-col space-y-1">
                          <Link to="/profile" className={dropdownItemClasses} onClick={() => setIsDropdownOpen(false)}>
                            <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" className="h-4 w-4 text-text-muted-light dark:text-text-muted-dark" />
                            <span>Profile</span>
                          </Link>
                          <Link to="/settings" className={dropdownItemClasses} onClick={() => setIsDropdownOpen(false)}>
                            <Icon path="M10.343 3.94c.09-.542.56-1.008 1.11-1.212l1.232-.41a2.25 2.25 0 012.656 2.656l-.41 1.232c-.204.55-.67.92-1.212 1.11l-1.258.315a2.25 2.25 0 01-1.503-1.503l.315-1.258zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" className="h-4 w-4 text-text-muted-light dark:text-text-muted-dark" />
                            <span>Settings</span>
                          </Link>
                           <hr className="border-[var(--border-color)] my-1" />
                          <button onClick={() => { logout(); setIsDropdownOpen(false); }} className={dropdownItemClasses}>
                            <Icon path="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" className="h-4 w-4 text-accent" />
                            <span className="text-accent">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
                        <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="font-semibold text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors">Logout</button>
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