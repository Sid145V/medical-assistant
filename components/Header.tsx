import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// As we can't create new files, icons are defined here.
const Icon = ({ path, className = "h-6 w-6" }: { path: string, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const Logo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
    </svg>
);

const Header: React.FC = () => {
  const { user, logout } = useAuth();
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

  const navLinkClasses = "relative text-text hover:text-primary transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300";
  const activeNavLinkClasses = "after:w-full text-primary";

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
    <header className="bg-bgSoft/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to={getDashboardLink()} className="flex items-center space-x-2">
            <Logo />
            <span className="font-display text-2xl font-bold text-text">MediAI</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 font-semibold">
            {navLinks}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <span className="font-semibold text-text-muted hidden lg:block">Welcome, {'name' in user ? user.name.split(' ')[0] : 'firstName' in user ? user.firstName : 'shopName' in user ? user.shopName : 'Admin'}</span>
                  <motion.button onClick={logout} className="font-semibold text-text-muted hover:text-primary transition-colors" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Logout</motion.button>
                </>
              ) : (
                <motion.button
                  onClick={() => navigate('/get-started')}
                  className="btn-primary"
                  whileHover={{scale: 1.03, y: -2, boxShadow: '0 10px 20px rgba(15, 157, 146, 0.25)'}}
                  whileTap={{scale: 0.95}}
                >
                  Get Started
                </motion.button>
              )}
            </div>
            <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Open menu" className="text-text">
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
                className="md:hidden glass-card rounded-t-none border-t border-white/20"
            >
                <nav className="flex flex-col items-center space-y-4 py-4 font-semibold">
                    {navLinks}
                     {user ? (
                        <button onClick={logout} className="font-semibold text-text-muted hover:text-primary transition-colors">Logout</button>
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