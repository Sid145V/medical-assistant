import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Appointment, Doctor as DoctorType } from '../types';
import { api } from '../services/mockApi';
import { motion } from 'framer-motion';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'doctor') {
      api.getAppointmentsForDoctor(user.id)
        .then(setAppointments)
        .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, [user]);

  if (!user || user.role !== 'doctor') {
    return null;
  }
  
  const doctor = user as DoctorType;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 glass-card">
        <img src={doctor.image} alt={doctor.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20 shadow-lg" />
        <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-text">Welcome, {doctor.name}</h1>
            <p className="text-lg text-primary font-semibold">{doctor.qualification}</p>
            <p className="text-text-muted mt-1">{doctor.location}</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4 text-text">Your Appointments</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b-2 border-white/20">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-text-muted">Patient Name</th>
                  <th className="py-3 px-4 text-left font-semibold text-text-muted">Date</th>
                  <th className="py-3 px-4 text-left font-semibold text-text-muted">Time</th>
                  <th className="py-3 px-4 text-left font-semibold text-text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr><td colSpan={4} className="text-center py-12 text-text-muted">Loading appointments...</td></tr>
                ) : appointments.length > 0 ? (
                    appointments.map(app => (
                      <tr key={app.id} className="border-b border-white/20 last:border-b-0 hover:bg-black/5 transition-colors group">
                        <td className="py-4 px-4 font-medium text-text relative">
                           <div className="absolute left-0 top-0 h-full w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out"></div>
                           {app.patientName}
                        </td>
                        <td className="py-4 px-4 text-text-muted">{app.date}</td>
                        <td className="py-4 px-4 text-text-muted">{app.time}</td>
                        <td className="py-4 px-4">
                            <span className={`font-semibold capitalize px-2.5 py-1 text-xs rounded-full ${app.status === 'booked' ? 'text-blue-800 bg-blue-100' : app.status === 'completed' ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'}`}>{app.status}</span>
                        </td>
                      </tr>
                    ))
                ) : (
                    <tr><td colSpan={4} className="text-center py-12 text-text-muted">No appointments found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
      </div>
    </motion.div>
  );
};

export default DoctorDashboard;