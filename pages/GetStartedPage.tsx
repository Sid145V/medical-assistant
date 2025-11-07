
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

const RoleCard: React.FC<{ title: string; description: string; onClick: () => void }> = ({ title, description, onClick }) => (
  <div 
    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:border-teal-500 border-2 border-transparent transition-all transform hover:-translate-y-2 cursor-pointer"
    onClick={onClick}
  >
    <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
    <p className="mt-2 text-gray-500">{description}</p>
  </div>
);

const GetStartedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-800">Join Us</h1>
      <p className="mt-4 text-lg text-gray-600">
        Choose your role to get started. Whether you're a patient seeking care, a doctor providing it, a pharmacy, or an admin, we've got you covered.
      </p>
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <RoleCard 
          title="Patient" 
          description="Access AI health guidance, book appointments, and order medicine."
          onClick={() => navigate(`/login/${UserRole.PATIENT}`)}
        />
        <RoleCard 
          title="Doctor" 
          description="Manage your appointments and connect with patients."
          onClick={() => navigate(`/login/${UserRole.DOCTOR}`)}
        />
        <RoleCard 
          title="Pharmacy / Shop" 
          description="List your medicines and manage orders from local customers."
          onClick={() => navigate(`/login/${UserRole.SHOP}`)}
        />
        <RoleCard 
          title="Admin" 
          description="Oversee the platform, manage users, and view system data."
          onClick={() => navigate(`/login/${UserRole.ADMIN}`)}
        />
      </div>
    </div>
  );
};

export default GetStartedPage;
