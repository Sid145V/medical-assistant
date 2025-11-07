
import React, { useState, useEffect } from 'react';
import { Doctor } from '../types';
import { api } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DoctorCard: React.FC<{ doctor: Doctor; onBook: (doctor: Doctor) => void }> = ({ doctor, onBook }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
    <img src={doctor.image} alt={doctor.name} className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-teal-200" />
    <h3 className="text-xl font-bold">{doctor.name}</h3>
    <p className="text-gray-600">{doctor.qualification}</p>
    <p className="text-sm text-gray-500">{doctor.location}</p>
    <button
      onClick={() => onBook(doctor)}
      className="mt-4 bg-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-600 transition-colors"
    >
      Book an Appointment
    </button>
  </div>
);

const AppointmentModal: React.FC<{ doctor: Doctor | null; onClose: () => void; onConfirm: (details: any) => void }> = ({ doctor, onClose, onConfirm }) => {
  const [details, setDetails] = useState({ patientName: '', age: '', date: '', time: '' });

  if (!doctor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(details);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Book with {doctor.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Patient Name" value={details.patientName} onChange={e => setDetails({...details, patientName: e.target.value})} required className="w-full p-2 border rounded" />
          <input type="number" placeholder="Age" value={details.age} onChange={e => setDetails({...details, age: e.target.value})} required className="w-full p-2 border rounded" />
          <input type="date" value={details.date} onChange={e => setDetails({...details, date: e.target.value})} required className="w-full p-2 border rounded" />
          <input type="time" value={details.time} onChange={e => setDetails({...details, time: e.target.value})} required className="w-full p-2 border rounded" />
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="py-2 px-4 bg-teal-500 text-white rounded hover:bg-teal-600">OK</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const AppointmentsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.getDoctors().then(setDoctors);
  }, []);

  const handleBookAppointment = async (details: any) => {
    if (user && selectedDoctor) {
      await api.bookAppointment({
        ...details,
        patientId: user.id,
        doctorId: selectedDoctor.id,
      });
      alert('Appointment booked successfully!');
      setSelectedDoctor(null);
      navigate('/');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">Available Doctors</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map(doctor => (
          <DoctorCard key={doctor.id} doctor={doctor} onBook={setSelectedDoctor} />
        ))}
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
