import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { motion } from 'framer-motion';

const Icon = ({ path, className = "h-12 w-12 text-primary" }: { path: string, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const RoleCard: React.FC<{ title: string; description: string; iconPath: string; onClick: () => void }> = ({ title, description, iconPath, onClick }) => (
  <motion.div 
    className="glass-card p-8 transition-all transform hover:-translate-y-2 cursor-pointer text-left"
    onClick={onClick}
    whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 40px rgba(6, 20, 30, 0.1)' }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <Icon path={iconPath} />
    <h3 className="text-2xl font-bold text-text mt-4">{title}</h3>
    <p className="mt-2 text-text-muted">{description}</p>
  </motion.div>
);

const GetStartedPage: React.FC = () => {
  const navigate = useNavigate();
  
  const roles = [
      { title: "Patient", description: "Access AI health guidance, book appointments, and order medicine.", role: UserRole.PATIENT, icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
      { title: "Doctor", description: "Manage your appointments and connect with patients.", role: UserRole.DOCTOR, icon: "M12 6.253v11.494m-5.747-8.994l11.494 5.747m-11.494 0l11.494-5.747" }, // a simple cross
      { title: "Pharmacy / Shop", description: "List your medicines and manage orders from local customers.", role: UserRole.SHOP, icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
      { title: "Admin", description: "Oversee the platform, manage users, and view system data.", role: UserRole.ADMIN, icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  ];
  
  const containerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-text">Join Our Healthcare Community</h1>
      <p className="mt-4 text-lg text-text-muted">
        Choose your role to get started. Whether you're a patient seeking care, a doctor providing it, a pharmacy, or an admin, we've got you covered.
      </p>
      <motion.div 
        className="mt-12 grid md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {roles.map(role => (
            <motion.div key={role.role} variants={itemVariants}>
                <RoleCard 
                    title={role.title} 
                    description={role.description}
                    iconPath={role.icon}
                    onClick={() => navigate(`/login/${role.role}`)}
                />
            </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GetStartedPage;