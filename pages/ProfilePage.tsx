import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/mockApi';
import { User, UserRole, Patient, Doctor, Shop, Admin, Address } from '../types';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const inputClasses = "w-full p-3 border-0 rounded-lg focus:ring-2 focus:ring-primary/40 outline-none bg-black/5 dark:bg-black/20 text-text-light dark:text-text-dark shadow-inner placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark";

const AddressForm: React.FC<{ address: Partial<Address>; onAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ address, onAddressChange }) => (
    <div className="space-y-4">
        <h3 className="font-semibold text-text-light dark:text-text-dark">Address Details</h3>
        <input name="address.fullName" placeholder="Full Name" value={address.fullName || ''} onChange={onAddressChange} required className={inputClasses} />
        <input name="address.building" placeholder="Building/Flat No." value={address.building || ''} onChange={onAddressChange} required className={inputClasses} />
        <input name="address.street" placeholder="Street / Locality" value={address.street || ''} onChange={onAddressChange} required className={inputClasses} />
        <div className="grid grid-cols-2 gap-4">
            <input name="address.city" placeholder="City" value={address.city || ''} onChange={onAddressChange} required className={inputClasses} />
            <input name="address.pincode" placeholder="Pincode" value={address.pincode || ''} onChange={onAddressChange} required className={inputClasses} />
        </div>
        <input name="address.landmark" placeholder="Landmark (optional)" value={address.landmark || ''} onChange={onAddressChange} className={inputClasses} />
        <input name="address.phone" placeholder="Phone Number" value={address.phone || ''} onChange={onAddressChange} required className={inputClasses} />
    </div>
);


const ProfilePage: React.FC = () => {
    const { user, updateAuthUser } = useAuth();
    const { showToast } = useToast();
    const [formData, setFormData] = useState<Partial<User>>({});
    const [status, setStatus] = useState<'idle' | 'saving'>('idle');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData(user);
            if ('image' in user && user.image) {
                setImagePreview(user.image);
            }
        }
    }, [user]);
    
    if (!user) {
        return <div className="text-center">Loading profile...</div>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...(prev as Patient | Shop).address,
                    [field]: value,
                }
            }));
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({ ...prev, image: base64String }));
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('saving');
        try {
            const updatedUser = await api.updateUser(user.id, formData);
            updateAuthUser(updatedUser);
            showToast('✅ Profile updated successfully!', 'success');
        } catch (error) {
            console.error("Failed to update profile:", error);
            showToast('❌ Failed to save changes.', 'error');
        } finally {
            setStatus('idle');
        }
    };
    
    const renderFields = () => {
        switch(user.role) {
            case UserRole.PATIENT:
                const patient = formData as Patient;
                return (
                    <>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input name="firstName" placeholder="First Name" value={patient.firstName || ''} onChange={handleInputChange} required className={inputClasses} />
                            <input name="lastName" placeholder="Last Name" value={patient.lastName || ''} onChange={handleInputChange} required className={inputClasses} />
                        </div>
                        <input name="age" type="number" placeholder="Age" value={patient.age || ''} onChange={handleInputChange} required className={inputClasses} />
                        <hr className="border-[var(--border-color)]" />
                        <AddressForm address={patient.address || {}} onAddressChange={handleInputChange} />
                    </>
                );
            case UserRole.DOCTOR:
                const doctor = formData as Doctor;
                return (
                    <>
                        <input name="name" placeholder="Full Name" value={doctor.name || ''} onChange={handleInputChange} required className={inputClasses} />
                        <input name="qualification" placeholder="Qualification" value={doctor.qualification || ''} onChange={handleInputChange} required className={inputClasses} />
                        <input name="specialization" placeholder="Specialization" value={doctor.specialization || ''} onChange={handleInputChange} required className={inputClasses} />
                        <input name="experience" type="number" placeholder="Years of Experience" value={doctor.experience || ''} onChange={handleInputChange} required className={inputClasses} />
                        <input name="location" placeholder="Location" value={doctor.location || ''} onChange={handleInputChange} required className={inputClasses} />
                         <div>
                            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Profile Image</label>
                            <div className="flex items-center space-x-4">
                              {imagePreview && <img src={imagePreview} alt="Avatar Preview" className="w-16 h-16 rounded-full object-cover flex-shrink-0" />}
                              <input id="file-upload" name="image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                              <label htmlFor="file-upload" className="cursor-pointer w-full text-sm text-center text-primary font-semibold p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                                {imagePreview ? 'Change Photo' : 'Upload Photo'}
                              </label>
                            </div>
                        </div>
                    </>
                );
             case UserRole.SHOP:
                const shop = formData as Shop;
                 return (
                    <>
                        <input name="shopName" placeholder="Shop Name" value={shop.shopName || ''} onChange={handleInputChange} required className={inputClasses} />
                        <input name="ownerName" placeholder="Owner Name" value={shop.ownerName || ''} onChange={handleInputChange} required className={inputClasses} />
                        <hr className="border-[var(--border-color)]" />
                        <AddressForm address={shop.address || {}} onAddressChange={handleInputChange} />
                    </>
                );
            case UserRole.ADMIN:
                const admin = formData as Admin;
                return <input name="username" placeholder="Username" value={admin.username || ''} onChange={handleInputChange} required className={inputClasses} />;
            default: return null;
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8 text-text-light dark:text-text-dark">My Profile</h1>
            <div className="glass-card p-8 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {renderFields()}
                     <hr className="border-[var(--border-color)]" />
                    <div className="grid md:grid-cols-2 gap-4">
                       <input name="email" type="email" placeholder="Email" value={formData.email || ''} onChange={handleInputChange} required className={inputClasses} />
                       <input name="phone" placeholder="Phone Number" value={formData.phone || ''} onChange={handleInputChange} required className={inputClasses} />
                    </div>
                     <motion.button 
                        type="submit" 
                        disabled={status === 'saving'} 
                        className="w-full btn-primary py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        whileHover={{ y: status === 'saving' ? 0 : -2 }}
                    >
                        {status === 'saving' ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;