
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case UserRole.ADMIN:
        return '/admin/dashboard';
      case UserRole.DOCTOR:
        return '/doctor/dashboard';
      case UserRole.SHOP:
        return '/shop/dashboard';
      case UserRole.PATIENT:
      default:
        return '/';
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={getDashboardLink()} className="flex items-center space-x-2 text-xl font-bold text-teal-600 hover:text-teal-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v.01" />
              </svg>
              <span>Medical Assistant</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-teal-600 transition-colors">Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-teal-600 transition-colors">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-teal-600 transition-colors">Contact Us</Link>
            {user?.role === UserRole.PATIENT && (
              <Link to="/shops" className="text-gray-600 hover:text-teal-600 transition-colors">Shops</Link>
            )}
             {user && (
                <button onClick={logout} className="text-gray-600 hover:text-teal-600 transition-colors">Logout</button>
            )}
          </nav>
          <div className="flex items-center">
            {!user && (
              <button
                onClick={() => navigate('/get-started')}
                className="bg-teal-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-teal-600 transition-transform transform hover:scale-105"
              >
                Get Started
              </button>
            )}
             {user && (
                <div className="text-gray-700 font-semibold">Welcome, { 'name' in user ? user.name : 'firstName' in user ? user.firstName : 'shopName' in user ? user.shopName : 'Admin' }</div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
