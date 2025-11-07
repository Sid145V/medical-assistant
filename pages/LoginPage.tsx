
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const { role } = useParams<{ role: UserRole }>();
  const navigate = useNavigate();
  const { login, signup, loading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<any>({});
  
  if (!role || !Object.values(UserRole).includes(role)) {
    navigate('/get-started');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
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
        alert('Signup successful! Please log in.');
        setIsLogin(true);
        setFormData({});
      }
    } catch (err) {
      console.error(err);
      // Error is already handled in AuthContext and displayed
    }
  };
  
  const renderSignupFields = () => {
    switch (role) {
      case UserRole.PATIENT:
        return (
          <>
            <input name="firstName" placeholder="First Name" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="lastName" placeholder="Last Name" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="age" type="number" placeholder="Age" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="gender" placeholder="Gender" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="location" placeholder="Location" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="email" type="email" placeholder="Email" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="phone" placeholder="Phone Number" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
          </>
        );
      case UserRole.DOCTOR:
        return (
          <>
            <input name="name" placeholder="Full Name" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="qualification" placeholder="Qualification" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="experience" type="number" placeholder="Years of Experience" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="email" type="email" placeholder="Email" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="phone" placeholder="Phone Number" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="location" placeholder="Location" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <div>
                <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                <input name="image" type="file" accept="image/*" onChange={handleFileChange} className="w-full p-3 border rounded-lg" />
            </div>
          </>
        );
      case UserRole.SHOP:
        return (
          <>
            <input name="shopName" placeholder="Shop Name" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="ownerName" placeholder="Owner Name" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="phone" placeholder="Phone Number" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="email" type="email" placeholder="Email" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="license" placeholder="License No." onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="yearsActive" type="number" placeholder="Years Active" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
            <input name="location" placeholder="Location" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 capitalize">{role} {isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {isLogin || role === UserRole.ADMIN ? (
          <input name="identifier" placeholder={role === UserRole.ADMIN ? "Username" : "Email or Phone"} onChange={handleInputChange} required className="w-full p-3 border rounded-lg"/>
        ) : renderSignupFields()}
        <input name="password" type="password" placeholder="Password" onChange={handleInputChange} required className="w-full p-3 border rounded-lg" />
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 disabled:bg-teal-300 transition-colors">
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Signup')}
        </button>
      </form>
      {role !== UserRole.ADMIN && (
        <p className="mt-6 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-teal-600 hover:text-teal-500 ml-1">
            {isLogin ? 'Signup' : 'Login'}
          </button>
        </p>
      )}
    </div>
  );
};

export default LoginPage;
