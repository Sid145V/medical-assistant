import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { UserRole } from '../types';
import { motion } from 'framer-motion';

const SettingsToggle: React.FC<{ label: string; description: string; isEnabled: boolean; onToggle: () => void; }> = ({ label, description, isEnabled, onToggle }) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-black/5 dark:bg-white/5">
        <div>
            <h4 className="font-semibold text-text-light dark:text-text-dark">{label}</h4>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{description}</p>
        </div>
        <button onClick={onToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const PatientSettings = () => {
    const { theme, toggleTheme, isSoundEnabled, toggleSound } = useSettings();
    return (
        <div className="space-y-4">
            <SettingsToggle 
                label="Dark Mode"
                description="Reduce glare and improve night viewing."
                isEnabled={theme === 'dark'}
                onToggle={toggleTheme}
            />
            <SettingsToggle 
                label="Sound Effects"
                description="Enable or disable UI sound effects."
                isEnabled={isSoundEnabled}
                onToggle={toggleSound}
            />
        </div>
    )
}

const AdminSettings = () => {
    const [isMaintenance, setIsMaintenance] = useState(false);

    const handleClearCache = () => {
        alert("System cache cleared! (simulation)");
    }
    
    return (
        <div className="space-y-4">
            <SettingsToggle 
                label="Maintenance Mode"
                description="Take the site offline for visitors."
                isEnabled={isMaintenance}
                onToggle={() => setIsMaintenance(p => !p)}
            />
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/5 dark:bg-white/5">
                <div>
                    <h4 className="font-semibold text-text-light dark:text-text-dark">System Cache</h4>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Clear all cached application data.</p>
                </div>
                <motion.button 
                    onClick={handleClearCache}
                    className="px-4 py-2 text-sm font-semibold text-white bg-accent rounded-lg hover:bg-red-700"
                    whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                >
                    Clear Cache
                </motion.button>
            </div>
        </div>
    )
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  const renderSettings = () => {
    // Other roles can have their own settings panels here
    if (user.role === UserRole.ADMIN) {
      return <AdminSettings />;
    }
    // Default to patient settings for Patient, Doctor, Shop
    return <PatientSettings />;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-text-light dark:text-text-dark">Settings</h1>
      
      <div className="glass-card p-6 md:p-8 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-text-light dark:text-text-dark">
            {user.role === UserRole.ADMIN ? 'Admin Controls' : 'General'}
        </h2>
        {renderSettings()}
      </div>

    </div>
  );
};

export default SettingsPage;
