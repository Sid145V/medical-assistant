import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole, Patient, Appointment, Order } from '../types';
import { api } from '../services/mockApi';
import { motion, Variants } from 'framer-motion';
import Hero3D from '../components/Hero3D';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

// --- Reusable Icon Component ---
const Icon = ({ path, className = "h-8 w-8 text-white" }: { path: string, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const featureIcons = {
    chat: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.05 1.05 0 01-1.664-1.223l1.242-2.733-3.72-3.72a1.05 1.05 0 01-1.664-1.223l1.242-2.733-3.72-3.72a1.05 1.05 0 01-1.664-1.223l1.242-2.733-3.72-3.72a1.05 1.05 0 01-1.664-1.223l1.242-2.733-3.72-3.72a1.05 1.05 0 01-.028-1.488A1.05 1.05 0 013 3.512v4.286c0 .97.616 1.813 1.5 2.097",
    appointment: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z",
    shop: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.093-.822l3.482-9.401A1.125 1.125 0 0020.285 3H4.227a1.125 1.125 0 00-1.122 1.026l-1.348 6.404a1.125 1.125 0 001.122 1.274h12.75"
};

const GuestHome: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut"
      } 
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="grid md:grid-cols-2 gap-12 items-center min-h-[70vh]">
        <motion.div 
            className="space-y-6" 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-display font-extrabold text-text-light dark:text-text-dark leading-tight">
            Your Personal AI-Powered Medical Assistant
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-lg">
            Get AI-powered quick guidance for symptoms, book appointments, and shop for medicines from local pharmacies.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
            <motion.button 
              onClick={() => navigate('/get-started')} 
              className="btn-primary">
              Get Started Now
            </motion.button>
             <motion.button 
              onClick={() => navigate('/about')} 
              className="btn-secondary">
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
        <motion.div 
          className="h-96 md:h-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
           <Suspense fallback={<div className="w-full h-full bg-primary/10 rounded-2xl animate-pulse" />}>
               <Hero3D />
           </Suspense>
        </motion.div>
      </div>

      <motion.div 
        className="grid md:grid-cols-3 gap-8 text-center mt-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        {[
          { title: "Chat with AI", desc: "Get instant guidance on your symptoms.", icon: featureIcons.chat },
          { title: "Book Appointment", desc: "Find and schedule a visit with a doctor.", icon: featureIcons.appointment },
          { title: "Shop Now", desc: "Order medicines from nearby pharmacies.", icon: featureIcons.shop }
        ].map(item => (
            <motion.div
                key={item.title}
                className="glass-card p-8 transition-all transform hover:-translate-y-2 cursor-pointer shadow-lg hover:shadow-xl group"
                onClick={() => navigate('/get-started')}
                whileHover={{ y: -8 }}
                variants={itemVariants}
            >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                    <Icon path={item.icon} />
                </div>
                <h2 className="text-2xl font-bold font-display text-text-light dark:text-text-dark">{item.title}</h2>
                <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">{item.desc}</p>
            </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const PatientHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);

  useEffect(() => {
    if (appointmentToCancel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [appointmentToCancel]);

  const fetchAppointments = useCallback(() => {
    if (user) api.getAppointmentsForPatient(user.id).then(setAppointments);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
      api.getOrdersForPatient(user.id).then(setOrders);
    }
  }, [user, fetchAppointments]);

  const handleConfirmCancel = async () => {
    if (appointmentToCancel) {
      try {
        await api.cancelAppointment(appointmentToCancel.id);
        showToast('✅ Appointment cancelled successfully!', 'success');
        fetchAppointments();
      } catch (error) {
        console.error("Failed to cancel appointment:", error);
        showToast('❌ Failed to cancel appointment.', 'error');
      } finally {
        setAppointmentToCancel(null);
      }
    }
  };


  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-display text-text-light dark:text-text-dark">Welcome back, {(user as Patient)?.firstName}!</h1>
        <p className="text-lg text-text-muted-light dark:text-text-muted-dark mt-2">How can we help you today?</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center">
        {[
          { title: "Chat with AI", path: "/chatbot", icon: featureIcons.chat },
          { title: "Book Appointment", path: "/book-appointment", icon: featureIcons.appointment },
          { title: "Shop Now", path: "/shops", icon: featureIcons.shop }
        ].map(item => (
            <motion.div
                key={item.title}
                className="glass-card p-8 transition-all transform hover:-translate-y-2 cursor-pointer shadow-lg hover:shadow-xl group"
                onClick={() => navigate(item.path)}
                whileHover={{ y: -8 }}
            >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                    <Icon path={item.icon} />
                </div>
                <h2 className="text-2xl font-bold font-display text-text-light dark:text-text-dark">{item.title}</h2>
            </motion.div>
        ))}
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 font-display text-text-light dark:text-text-dark">My Appointments</h2>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {appointments.length > 0 ? appointments.map(app => (
              <div key={app.id} className="p-4 border rounded-lg flex justify-between items-center bg-white/50 dark:bg-black/20 border-[var(--border-color)]">
                <div>
                  <p><strong>Doctor:</strong> {app.doctorName}</p>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark"><strong>Date:</strong> {app.date} at {app.time}</p>
                   <p><strong>Status:</strong> <span className={`font-semibold capitalize px-2 py-1 text-xs rounded-full ${app.status === 'booked' ? 'text-blue-800 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300' : app.status === 'completed' ? 'text-green-800 bg-green-100 dark:bg-green-900/50 dark:text-green-300' : 'text-red-800 bg-red-100 dark:bg-red-900/50 dark:text-red-300'}`}>{app.status}</span></p>
                </div>
                 {app.status === 'booked' && (
                  <motion.button onClick={() => setAppointmentToCancel(app)} className="bg-accent text-white font-bold py-1 px-3 rounded-lg hover:bg-red-600 transition-colors text-sm" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Cancel</motion.button>
                )}
              </div>
            )) : <EmptyState title="No Appointments" message="You have no upcoming appointments." />}
          </div>
        </div>
        <div className="glass-card p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 font-display text-text-light dark:text-text-dark">My Orders</h2>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {orders.length > 0 ? orders.map(ord => (
              <div key={ord.id} className="p-4 border rounded-lg bg-white/50 dark:bg-black/20 border-[var(--border-color)]">
                <p><strong>Item:</strong> {ord.medicineName} (x{ord.quantity})</p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark"><strong>Ordered:</strong> {new Date(ord.timestamp).toLocaleDateString()}</p>
                 <p><strong>Status:</strong> <span className="font-semibold capitalize px-2 py-1 text-xs rounded-full text-yellow-800 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-300">Processing</span></p>
              </div>
            )) : <EmptyState title="No Orders" message="You have no recent orders." />}
          </div>
        </div>
      </div>
      
      {appointmentToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <motion.div 
              initial={{scale:0.9, opacity: 0}} 
              animate={{scale:1, opacity: 1}} 
              className="glass-card p-8 w-full max-w-sm text-center shadow-xl max-h-[90vh] overflow-y-auto modal-scroll"
            >
                <h2 className="text-xl font-bold mb-4 text-text-light dark:text-text-dark">Confirm Cancellation</h2>
                <p className="text-text-muted-light dark:text-text-muted-dark mb-6">Are you sure you want to cancel your appointment with <strong>{appointmentToCancel.doctorName}</strong> on <strong>{appointmentToCancel.date}</strong>?</p>
                <div className="flex justify-center space-x-4">
                    <motion.button onClick={() => setAppointmentToCancel(null)} className="py-2 px-6 bg-gray-200 dark:bg-gray-700 rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-600" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>No</motion.button>
                    <motion.button onClick={handleConfirmCancel} className="py-2 px-6 bg-accent text-white rounded-full font-bold hover:bg-red-600" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Yes, Cancel</motion.button>
                </div>
            </motion.div>
        </div>
    )}
    
     <motion.button
        onClick={() => navigate('/chatbot')}
        className="fixed bottom-6 right-6 md:hidden w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full shadow-xl flex items-center justify-center text-white"
        aria-label="New Chat"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Icon path={featureIcons.chat} className="h-8 w-8" />
      </motion.button>

    </div>
  );
};

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto">
      {user && user.role === UserRole.PATIENT ? <PatientHome /> : <GuestHome />}
    </div>
  );
};

export default HomePage;