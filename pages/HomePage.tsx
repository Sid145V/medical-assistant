import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole, Patient, Appointment, Order } from '../types';
import { api } from '../services/mockApi';
import { motion, Variants } from 'framer-motion';

// --- Reusable Icon Component ---
const Icon = ({ path, className = "h-8 w-8 text-white" }: { path: string, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const FallbackSVG = () => (
    <div className="w-full h-full flex items-center justify-center glass-card">
         <svg xmlns="http://www.w3.org/2000/svg" className="w-48 h-48 text-primary opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-5.747-8.994l11.494 5.747m-11.494 0l11.494-5.747" />
            <path d="M21.25,12A9.25,9.25,0,1,1,12,2.75,9.25,9.25,0,0,1,21.25,12Z" />
        </svg>
    </div>
);


const GuestHome: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Decorative blurred blobs */}
      <div className="absolute -left-20 -top-28 w-[560px] h-[560px] rounded-full blur-3xl opacity-20 bg-[radial-gradient(circle,#0f9d92,transparent)] -z-10"></div>
      <div className="absolute -right-40 -bottom-20 w-[600px] h-[600px] rounded-full blur-3xl opacity-15 bg-[radial-gradient(circle,#ff6b6b,transparent)] -z-10"></div>

      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[60vh]">
          <motion.div className="space-y-6" variants={containerVariants}>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-display font-extrabold text-text leading-tight">
              Your Personal AI-Powered Medical Assistant
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-text-muted">
              Get AI-powered quick guidance for symptoms, book appointments, and shop for medicines from local pharmacies.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
              <motion.button 
                onClick={() => navigate('/get-started')} 
                className="btn-primary"
                whileHover={{ y: -2, boxShadow: '0 10px 20px rgba(15, 157, 146, 0.25)' }}>
                Get Started Now
              </motion.button>
               <motion.button 
                onClick={() => navigate('/about')} 
                className="btn-secondary">
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div className="h-80 md:h-96" variants={itemVariants}>
              <FallbackSVG />
          </motion.div>
        </div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 text-center mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {[
            { title: "Chat with AI", desc: "Get instant guidance on your symptoms.", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
            { title: "Book Appointment", desc: "Find and schedule a visit with a doctor.", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            { title: "Shop Now", desc: "Order medicines from nearby pharmacies.", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" }
          ].map(item => (
              <motion.div
                  key={item.title}
                  className="glass-card p-8 transition-all transform hover:-translate-y-2 cursor-pointer"
                  onClick={() => navigate('/get-started')}
                  whileHover={{ y: -8 }}
                  variants={itemVariants}
              >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
                      <Icon path={item.icon} />
                  </div>
                  <h2 className="text-2xl font-bold text-text">{item.title}</h2>
                  <p className="mt-2 text-text-muted">{item.desc}</p>
              </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

const PatientHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);

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
        alert('Appointment cancelled successfully!');
        fetchAppointments();
      } catch (error) {
        console.error("Failed to cancel appointment:", error);
        alert('Failed to cancel appointment. Please try again.');
      } finally {
        setAppointmentToCancel(null);
      }
    }
  };


  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text">Welcome back, {(user as Patient)?.firstName}!</h1>
        <p className="text-lg text-text-muted mt-2">How can we help you today?</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center">
        {[
          { title: "Chat with AI", path: "/chatbot", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
          { title: "Book Appointment", path: "/book-appointment", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
          { title: "Shop Now", path: "/shops", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" }
        ].map(item => (
            <motion.div
                key={item.title}
                className="glass-card p-8 transition-all transform hover:-translate-y-2 cursor-pointer"
                onClick={() => navigate(item.path)}
                whileHover={{ y: -8 }}
            >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
                    <Icon path={item.icon} />
                </div>
                <h2 className="text-2xl font-bold text-text">{item.title}</h2>
            </motion.div>
        ))}
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {appointments.length > 0 ? appointments.map(app => (
              <div key={app.id} className="p-4 border rounded-lg flex justify-between items-center bg-white/50">
                <div>
                  <p><strong>Doctor:</strong> {app.doctorName}</p>
                  <p className="text-sm text-text-muted"><strong>Date:</strong> {app.date} at {app.time}</p>
                   <p><strong>Status:</strong> <span className={`font-semibold capitalize px-2 py-1 text-xs rounded-full ${app.status === 'booked' ? 'text-blue-800 bg-blue-100' : app.status === 'completed' ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'}`}>{app.status}</span></p>
                </div>
                 {app.status === 'booked' && (
                  <motion.button onClick={() => setAppointmentToCancel(app)} className="bg-accent text-white font-bold py-1 px-3 rounded-lg hover:bg-red-600 transition-colors text-sm" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Cancel</motion.button>
                )}
              </div>
            )) : <p className="text-text-muted text-center py-8">You have no upcoming appointments.</p>}
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-4">My Orders</h2>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {orders.length > 0 ? orders.map(ord => (
              <div key={ord.id} className="p-4 border rounded-lg bg-white/50">
                <p><strong>Item:</strong> {ord.medicineName} (x{ord.quantity})</p>
                <p className="text-sm text-text-muted"><strong>Ordered:</strong> {new Date(ord.timestamp).toLocaleDateString()}</p>
                 <p><strong>Status:</strong> <span className="font-semibold capitalize px-2 py-1 text-xs rounded-full text-yellow-800 bg-yellow-100">Processing</span></p>
              </div>
            )) : <p className="text-text-muted text-center py-8">You have no recent orders.</p>}
          </div>
        </div>
      </div>
      
      {appointmentToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <motion.div initial={{scale:0.9, opacity: 0}} animate={{scale:1, opacity: 1}} className="glass-card p-8 w-full max-w-sm text-center">
                <h2 className="text-xl font-bold mb-4 text-text">Confirm Cancellation</h2>
                <p className="text-text-muted mb-6">Are you sure you want to cancel your appointment with <strong>{appointmentToCancel.doctorName}</strong> on <strong>{appointmentToCancel.date}</strong>?</p>
                <div className="flex justify-center space-x-4">
                    <motion.button onClick={() => setAppointmentToCancel(null)} className="py-2 px-6 bg-gray-200 rounded-full font-semibold hover:bg-gray-300" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>No</motion.button>
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
        <Icon path="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" className="h-8 w-8" />
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