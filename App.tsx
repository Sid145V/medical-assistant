import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
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
import { AnimatePresence, motion, Transition } from 'framer-motion';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ToastProvider from './context/ToastContext';
import ThemeToggle from './components/ThemeToggle';
import ErrorPage from './pages/ErrorPage';

// FIX: This seems to be a project-wide TS issue where JSX intrinsic elements are not recognized.
// Declaring this globally in a central file like App.tsx should resolve it for all standard HTML elements.
declare global {
    namespace JSX {
        interface IntrinsicElements extends React.JSX.IntrinsicElements {}
    }
}


// --- ROUTING & LAYOUT ---
const PrivateRoute: React.FC<{ children: React.ReactElement; roles: UserRole[] }> = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user || (roles.length > 0 && !roles.includes(user.role))) {
    return <Navigate to="/get-started" replace />;
  }
  return children;
};

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 },
};

const pageTransition: Transition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.35
};

const AppContent: React.FC = () => {
    const location = useLocation();
    const { user } = useAuth();

    return (
        <div className="flex flex-col min-h-screen bg-bg-light dark:bg-bg-dark">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Routes location={location}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/get-started" element={<GetStartedPage />} />
                            <Route path="/login/:role" element={<LoginPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/shops" element={user && user.role === UserRole.PATIENT ? <ShopPage /> : <Navigate to="/get-started" />} />

                            <Route path="/profile" element={<PrivateRoute roles={[]}><ProfilePage /></PrivateRoute>} />
                            <Route path="/settings" element={<PrivateRoute roles={[]}><SettingsPage /></PrivateRoute>} />

                            <Route path="/chatbot" element={<PrivateRoute roles={[UserRole.PATIENT]}><ChatbotPage /></PrivateRoute>} />
                            <Route path="/book-appointment" element={<PrivateRoute roles={[UserRole.PATIENT]}><AppointmentsPage /></PrivateRoute>} />
                            
                            <Route path="/admin/dashboard" element={<PrivateRoute roles={[UserRole.ADMIN]}><AdminDashboard /></PrivateRoute>} />
                            <Route path="/doctor/dashboard" element={<PrivateRoute roles={[UserRole.DOCTOR]}><DoctorDashboard /></PrivateRoute>} />
                            <Route path="/shop/dashboard" element={<PrivateRoute roles={[UserRole.SHOP]}><ShopDashboard /></PrivateRoute>} />

                            <Route path="*" element={<ErrorPage code={404} />} />
                        </Routes>
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
            <ThemeToggle />
        </div>
    );
};


function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <SettingsProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </SettingsProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;