
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole, Patient } from '../types';
import { api } from '../services/mockApi';

const GuestHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center md:text-left">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            AI-Powered Medical Assistant
          </h1>
          <p className="text-lg text-gray-600">
            Get AI-powered quick guidance for symptoms and image inputs. A concise answer fast.
          </p>
          <p className="text-lg text-gray-600">
            Book an appointment with an available doctor, or shop for medicines from local pharmacies.
          </p>
          <button 
            onClick={() => navigate('/get-started')} 
            className="mt-4 bg-teal-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-teal-600 transition-all transform hover:scale-105">
            Get Started Now
          </button>
        </div>
        <div>
          <img src="https://picsum.photos/seed/doctor/600/400" alt="Doctor" className="rounded-lg shadow-2xl mx-auto" />
        </div>
      </div>
    </div>
  );
};

const PatientHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [orders, setOrders] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (user) {
      api.getAppointmentsForPatient(user.id).then(setAppointments);
      api.getOrdersForPatient(user.id).then(setOrders);
    }
  }, [user]);

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">Welcome back, {(user as Patient)?.firstName}!</h1>
        <p className="text-lg text-gray-600 mt-2">How can we help you today?</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => navigate('/chatbot')}>
          <h2 className="text-2xl font-bold text-teal-600">Chat with AI</h2>
          <p className="mt-2 text-gray-500">Get instant guidance on your symptoms.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => navigate('/book-appointment')}>
          <h2 className="text-2xl font-bold text-teal-600">Book Appointment</h2>
          <p className="mt-2 text-gray-500">Find and schedule a visit with a doctor.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow cursor-pointer" onClick={() => navigate('/shops')}>
          <h2 className="text-2xl font-bold text-teal-600">Shop Now</h2>
          <p className="mt-2 text-gray-500">Order medicines from nearby pharmacies.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            {appointments.length > 0 ? appointments.map(app => (
              <div key={app.id} className="p-4 border rounded-lg">
                <p><strong>Doctor:</strong> {app.doctorName}</p>
                <p><strong>Date:</strong> {app.date} at {app.time}</p>
              </div>
            )) : <p>You have no upcoming appointments.</p>}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">My Orders</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            {orders.length > 0 ? orders.map(ord => (
              <div key={ord.id} className="p-4 border rounded-lg">
                <p><strong>Item:</strong> {ord.medicineName}</p>
                <p><strong>Quantity:</strong> {ord.quantity}</p>
                 <p><strong>Status:</strong> Processing</p>
              </div>
            )) : <p>You have no recent orders.</p>}
          </div>
        </div>
      </div>

    </div>
  );
};

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      {user && user.role === UserRole.PATIENT ? <PatientHome /> : <GuestHome />}
    </div>
  );
};

export default HomePage;
