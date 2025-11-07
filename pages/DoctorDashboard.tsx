
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Appointment, Doctor as DoctorType } from '../types';
import { api } from '../services/mockApi';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (user) {
      api.getAppointmentsForDoctor(user.id).then(setAppointments);
    }
  }, [user]);

  if (!user) return null;
  const doctor = user as DoctorType;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome, {doctor.name}</h1>
      <p className="text-gray-600 mb-6">{doctor.qualification}</p>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left">Patient Name</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Time</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? appointments.map(app => (
                  <tr key={app.id} className="border-b">
                    <td className="py-2 px-4">{app.patientName}</td>
                    <td className="py-2 px-4">{app.date}</td>
                    <td className="py-2 px-4">{app.time}</td>
                    <td className="py-2 px-4 capitalize">{app.status}</td>
                  </tr>
                )) : (
                    <tr><td colSpan={4} className="text-center py-4">No appointments found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
