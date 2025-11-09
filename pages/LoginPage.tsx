import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const LoginPage: React.FC = () => {
  const { role } = useParams<{ role: UserRole }>();
  const navigate = useNavigate();
  const { login, signup, loading, error } = useAuth();
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<any>({});
  
  if (!role || !Object.values(UserRole).includes(role)) {
    navigate('/get-started');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [e.target.name]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({ identifier: formData.identifier, password: formData.password }, role);
      } else {
        await signup(formData, role);
        showToast('✅ Signup successful! Please log in.', 'success');
        setIsLogin(true);
        setFormData({});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  const inputClasses = "w-full p-3 border-0 rounded-lg focus:ring-2 focus:ring-primary/40 outline-none bg-black/5 dark:bg-black/20 text-text-light dark:text-text-dark shadow-inner placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark";
  
  const renderSignupFields = () => (
    <div className="space-y-4">
      {role === UserRole.PATIENT && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <input name="firstName" placeholder="First Name" onChange={handleInputChange} required className={inputClasses} />
            <input name="lastName" placeholder="Last Name" onChange={handleInputChange} required className={inputClasses} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input name="age" type="number" placeholder="Age" onChange={handleInputChange} required className={inputClasses} />
            <input name="gender" placeholder="Gender" onChange={handleInputChange} required className={inputClasses} />
          </div>
          <input name="location" placeholder="Location" onChange={handleInputChange} required className={inputClasses} />
          <input name="email" type="email" placeholder="Email" onChange={handleInputChange} required className={inputClasses} />
          <input name="phone" placeholder="Phone Number" onChange={handleInputChange} required className={inputClasses} />
        </>
      )}
      {role === UserRole.DOCTOR && (
        <>
          <input name="name" placeholder="Full Name" onChange={handleInputChange} required className={inputClasses} />
          <input name="qualification" placeholder="Qualification (e.g., MD, MBBS)" onChange={handleInputChange} required className={inputClasses} />
           <input 
                name="specialization" 
                placeholder="Specialization (e.g., Cardiologist)" 
                onChange={handleInputChange} 
                required 
                className={inputClasses} 
            />
            <input 
                name="license" 
                placeholder="License Number (e.g., ABCD1998)" 
                onChange={handleInputChange} 
                required 
                pattern="^[A-Z]{4}[0-9]{4}$"
                title="License must be 4 uppercase letters followed by 4 digits"
                className={inputClasses} 
            />
          <input name="experience" type="number" placeholder="Years of Experience" onChange={handleInputChange} required className={inputClasses} />
          <input name="email" type="email" placeholder="Email" onChange={handleInputChange} required className={inputClasses} />
          <input name="phone" placeholder="Phone Number" onChange={handleInputChange} required className={inputClasses} />
          <input name="location" placeholder="Location" onChange={handleInputChange} required className={inputClasses} />
          <div>
              <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Profile Image</label>
              <input name="image" type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-text-muted-light dark:text-text-muted-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
          </div>
        </>
      )}
      {role === UserRole.SHOP && (
         <>
            <input name="shopName" placeholder="Shop Name" onChange={handleInputChange} required className={inputClasses} />
            <input name="ownerName" placeholder="Owner Name" onChange={handleInputChange} required className={inputClasses} />
            <input name="phone" placeholder="Phone Number" onChange={handleInputChange} required className={inputClasses} />
            <input name="email" type="email" placeholder="Email" onChange={handleInputChange} required className={inputClasses} />
            <input name="license" placeholder="License No." onChange={handleInputChange} required className={inputClasses} />
            <input name="yearsActive" type="number" placeholder="Years Active" onChange={handleInputChange} required className={inputClasses} />
            <input name="location" placeholder="Location" onChange={handleInputChange} required className={inputClasses} />
          </>
      )}
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10 glass-card p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-center text-text-light dark:text-text-dark capitalize">{role} {isLogin ? 'Login' : 'Sign Up'}</h2>
      <AnimatePresence mode="wait">
        <motion.form 
            key={isLogin ? 'login' : 'signup'}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleSubmit} 
            className="mt-8 space-y-4">
            
            {isLogin || role === UserRole.ADMIN ? (
                <input name="identifier" placeholder={role === UserRole.ADMIN ? "Username" : "Email or Phone"} onChange={handleInputChange} required className={inputClasses}/>
            ) : renderSignupFields()}

            <input name="password" type="password" placeholder="Password" onChange={handleInputChange} required className={inputClasses} />
            
            {error && <p className="text-accent text-sm text-center font-semibold">{error}</p>}

            <motion.button 
                type="submit" 
                disabled={loading} 
                className="w-full btn-primary py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                whileHover={{ y: loading ? 0 : -2 }}
            >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
            </motion.button>
        </motion.form>
       </AnimatePresence>
      {role !== UserRole.ADMIN && (
        <p className="mt-6 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-primary hover:text-primary-dark ml-1">
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      )}
    </div>
  );
};

export default LoginPage;