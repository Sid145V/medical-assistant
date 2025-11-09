import React, { useState, useEffect, useMemo } from 'react';
import { Doctor } from '../types';
import { api } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

const DoctorCard: React.FC<{ doctor: Doctor; onBook: (doctor: Doctor) => void }> = ({ doctor, onBook }) => (
  <motion.div 
    className="glass-card p-6 flex flex-col items-center text-center transition-all transform hover:-translate-y-2 shadow-lg hover:shadow-xl"
    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(6, 20, 30, 0.1)' }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <img src={doctor.image} alt={doctor.name} className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-primary/20" />
    <h3 className="text-xl font-bold text-text-light dark:text-text-dark">{doctor.name}</h3>
    <p className="text-primary font-semibold">{doctor.specialization || doctor.qualification}</p>
    <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">{doctor.location}</p>
    <motion.button
      onClick={() => onBook(doctor)}
      className="mt-4 btn-primary"
      whileHover={{ y: -2, boxShadow: '0 10px 20px rgba(15, 157, 146, 0.25)' }}
    >
      Book Appointment
    </motion.button>
  </motion.div>
);

const AppointmentModal: React.FC<{ doctor: Doctor | null; onClose: () => void; onConfirm: (details: any) => void }> = ({ doctor, onClose, onConfirm }) => {
  const { user } = useAuth();
  const patientUser = user as any;
  
  const [details, setDetails] = useState({ 
      patientName: patientUser ? `${patientUser.firstName} ${patientUser.lastName}` : '',
      age: patientUser ? patientUser.age : '', 
      date: '', 
      time: '' 
  });
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
        await onConfirm(details);
    } catch(err: any) {
        setError(err.message || "An unknown error occurred.");
    }
  };
  
  const inputClasses = "w-full p-3 border-0 rounded-lg focus:ring-2 focus:ring-primary/40 outline-none bg-black/5 dark:bg-black/20 text-text-light dark:text-text-dark shadow-inner placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark";

  return (
    <AnimatePresence>
        {doctor && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-md"
            >
                <motion.div 
                    initial={{ scale: 0.95, y: 10, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 10, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="glass-card p-8 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto modal-scroll"
                >
                    <h2 className="text-2xl font-bold mb-1 text-text-light dark:text-text-dark">Book with {doctor.name}</h2>
                    <p className="text-md text-primary font-semibold mb-1">{doctor.specialization || 'General'}</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">{doctor.qualification} &bull; {doctor.location}</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Patient Name" value={details.patientName} onChange={e => setDetails({...details, patientName: e.target.value})} required className={inputClasses} />
                    <input type="number" placeholder="Age" value={details.age} onChange={e => setDetails({...details, age: e.target.value})} required className={inputClasses} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="date" value={details.date} min={new Date().toISOString().split("T")[0]} onChange={e => setDetails({...details, date: e.target.value})} required className={inputClasses} />
                        <input type="time" value={details.time} onChange={e => setDetails({...details, time: e.target.value})} required className={inputClasses} />
                    </div>
                    {error && <p className="text-accent text-sm text-center font-semibold pt-2">{error}</p>}
                    <div className="flex justify-end space-x-4 mt-6">
                        <motion.button type="button" onClick={onClose} className="py-2 px-6 bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-600" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Cancel</motion.button>
                        <motion.button type="submit" className="py-2 px-6 bg-primary text-white rounded-full font-bold hover:bg-primary-dark" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Confirm</motion.button>
                    </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};


const AppointmentsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.getDoctors().then(setDoctors);
  }, []);

  const handleBookAppointment = async (details: any) => {
    if (user && selectedDoctor) {
      try {
        await api.bookAppointment({
          ...details,
          patientId: user.id,
          doctorId: selectedDoctor.id,
        });
        showToast('💬 Appointment booked successfully!', 'success');
        setSelectedDoctor(null);
        navigate('/');
      } catch (error) {
        console.error(error);
        // Re-throw to be caught by the modal
        throw error;
      }
    }
  };

  const filteredDoctors = useMemo(() => doctors.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.location && d.location.toLowerCase().includes(searchQuery.toLowerCase()))
  ), [doctors, searchQuery]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-4 text-text-light dark:text-text-dark">Available Doctors</h1>
       <div className="max-w-xl mx-auto mb-8">
        <input 
            type="text" 
            placeholder="Search by doctor name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 border-0 rounded-full focus:ring-2 focus:ring-primary/40 outline-none bg-black/5 dark:bg-black/20 text-text-light dark:text-text-dark shadow-inner placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark"
        />
    </div>
      <div className="overflow-y-auto max-h-[calc(100vh-25rem)] pr-4 -mr-4">
        {filteredDoctors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} onBook={setSelectedDoctor} />
            ))}
            </div>
        ) : (
            <EmptyState 
                title="No doctors found." 
                message="Try another name or location, or check back later."
            />
        )}
      </div>
      <AppointmentModal 
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onConfirm={handleBookAppointment}
      />
    </div>
  );
};

export default AppointmentsPage;