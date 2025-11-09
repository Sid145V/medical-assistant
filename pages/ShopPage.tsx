import React, { useState, useEffect } from 'react';
import { Medicine } from '../types';
import { api } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MedicineCard: React.FC<{ medicine: Medicine; onBuy: (medicine: Medicine) => void }> = ({ medicine, onBuy }) => (
  <motion.div 
    className="glass-card p-4 flex flex-col text-center group shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="relative h-40 flex items-center justify-center mb-4 bg-white/70 dark:bg-black/20 rounded-lg overflow-hidden">
        <img src={medicine.image} alt={medicine.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        <div className="absolute top-2 right-2 bg-gold text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">${medicine.price.toFixed(2)}</div>
    </div>
    <h3 className="text-lg font-bold text-text-light dark:text-text-dark flex-grow">{medicine.name}</h3>
    <p className="text-text-muted-light dark:text-text-muted-dark text-sm italic">from {medicine.shopName}</p>
    <motion.button
      onClick={() => onBuy(medicine)}
      className="mt-4 btn-primary py-2"
      whileHover={{ y: -2, boxShadow: '0 10px 20px rgba(15, 157, 146, 0.25)' }}
    >
      Buy Now
    </motion.button>
  </motion.div>
);

const BuyModal: React.FC<{ medicine: Medicine | null; onClose: () => void; onConfirm: (details: any) => void }> = ({ medicine, onClose, onConfirm }) => {
  const [details, setDetails] = useState({ quantity: 1, address: '', paymentMethod: 'upi' as 'upi' | 'cash_on_delivery', utr: '' });
  
  if (!medicine) return null;
  
  const isUtrValid = /^[a-zA-Z0-9]{12}$/.test(details.utr);
  const isFormValid = details.address.trim() !== '' && details.quantity >= medicine.minOrderQuantity;
  const isOkEnabled = isFormValid && (details.paymentMethod === 'cash_on_delivery' || (details.paymentMethod === 'upi' && isUtrValid));
  
  const inputClasses = "w-full p-3 border-0 rounded-lg focus:ring-2 focus:ring-primary/40 outline-none bg-black/5 dark:bg-black/20 text-text-light dark:text-text-dark shadow-inner placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark";

  return (
     <AnimatePresence>
        {medicine && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
            >
                <motion.div 
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.98, opacity: 0 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="glass-card p-8 w-full max-w-md shadow-xl"
                >
                    <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Buy {medicine.name}</h2>
                    <div className="space-y-4">
                        <input type="number" placeholder="Quantity" value={details.quantity} min={medicine.minOrderQuantity} onChange={e => setDetails({...details, quantity: parseInt(e.target.value)})} required className={inputClasses} />
                        <textarea placeholder="Delivery Address" value={details.address} onChange={e => setDetails({...details, address: e.target.value})} required className={inputClasses} rows={3}></textarea>
                        <div>
                            <label className="font-semibold text-text-light dark:text-text-dark">Payment Method</label>
                            <div className="flex space-x-4 mt-2">
                                <button onClick={() => setDetails({...details, paymentMethod: 'upi'})} className={`p-3 rounded-lg border-2 w-full transition-colors ${details.paymentMethod === 'upi' ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-gray-600'}`}>UPI</button>
                                <button onClick={() => setDetails({...details, paymentMethod: 'cash_on_delivery'})} className={`p-3 rounded-lg border-2 w-full transition-colors ${details.paymentMethod === 'cash_on_delivery' ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-gray-600'}`}>Cash on Delivery</button>
                            </div>
                        </div>
                        {details.paymentMethod === 'upi' && (
                            <motion.div 
                                initial={{opacity:0, height: 0}} animate={{opacity: 1, height: 'auto'}}
                                className="text-center p-4 bg-black/5 dark:bg-black/20 rounded-lg overflow-hidden">
                                <p className="text-text-light dark:text-text-dark">Scan to pay</p>
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay" alt="QR Code" className="mx-auto my-2 rounded-lg bg-white p-1"/>
                                <input type="text" placeholder="12-digit UTR/Reference No." value={details.utr} onChange={e => setDetails({...details, utr: e.target.value})} required className={`w-full p-3 border rounded-lg outline-none transition-all ${isUtrValid ? 'border-green-500 ring-2 ring-green-500/50' : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary/50'}`} />
                            </motion.div>
                        )}
                        <div className="flex justify-end space-x-4 mt-6">
                            <motion.button onClick={onClose} className="py-2 px-6 bg-gray-200 dark:bg-gray-700 rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-600" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Cancel</motion.button>
                            <motion.button onClick={() => onConfirm(details)} disabled={!isOkEnabled} className="py-2 px-6 text-white rounded-full font-bold bg-primary hover:bg-primary-dark disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Confirm Order</motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};

const ShopPage: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.getMedicines().then(setMedicines);
  }, []);

  const handleBuyNow = async (details: any) => {
    if (user && selectedMedicine) {
      await api.placeOrder({
        ...details,
        patientId: user.id,
        shopId: selectedMedicine.shopId,
        medicineId: selectedMedicine.id,
      });
      alert('Order placed successfully!');
      setSelectedMedicine(null);
      navigate('/');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8 text-text-light dark:text-text-dark">Shop for Medicines</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {medicines.map(med => (
          <MedicineCard key={med.id} medicine={med} onBuy={setSelectedMedicine} />
        ))}
      </div>
      <BuyModal
        medicine={selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
        onConfirm={handleBuyNow}
      />
    </div>
  );
};

export default ShopPage;