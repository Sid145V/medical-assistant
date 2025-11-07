
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import GetStartedPage from './pages/GetStartedPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ShopDashboard from './pages/ShopDashboard';
import ChatbotPage from './pages/ChatbotPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { UserRole } from './types';

const PrivateRoute: React.FC<{ children: React.ReactElement; roles: UserRole[] }> = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/get-started" replace />;
  }
  return children;
};

const AppContent: React.FC = () => {
    const { user } = useAuth();
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/get-started" element={<GetStartedPage />} />
                    <Route path="/login/:role" element={<LoginPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/shops" element={user && user.role === UserRole.PATIENT ? <ShopPage /> : <Navigate to="/get-started" />} />

                    <Route path="/chatbot" element={<PrivateRoute roles={[UserRole.PATIENT]}><ChatbotPage /></PrivateRoute>} />
                    <Route path="/book-appointment" element={<PrivateRoute roles={[UserRole.PATIENT]}><AppointmentsPage /></PrivateRoute>} />
                    
                    <Route path="/admin/dashboard" element={<PrivateRoute roles={[UserRole.ADMIN]}><AdminDashboard /></PrivateRoute>} />
                    <Route path="/doctor/dashboard" element={<PrivateRoute roles={[UserRole.DOCTOR]}><DoctorDashboard /></PrivateRoute>} />
                    <Route path="/shop/dashboard" element={<PrivateRoute roles={[UserRole.SHOP]}><ShopDashboard /></PrivateRoute>} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};


function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
