import React, { useState, useEffect, useMemo } from 'react';
import { Medicine, Patient, Address, Shop, User } from '../types';
import { api } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

const MedicineCard: React.FC<{ medicine: Medicine; onBuy: (medicine: Medicine) => void }> = ({ medicine, onBuy }) => (
  <motion.div 
    className="glass-card p-4 flex flex-col text-center group shadow-lg"
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3 }}
  >
    <div className="relative h-40 flex items-center justify-center mb-4 bg-white/70 dark:bg-black/20 rounded-lg overflow-hidden">
        <img src={medicine.image} alt={medicine.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        <div className="absolute top-2 right-2 bg-gold text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">₹{medicine.price.toFixed(2)}</div>
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

const AddressForm: React.FC<{ address: Partial<Address>; setAddress: React.Dispatch<React.SetStateAction<Partial<Address>>>; inputClasses: string }> = ({ address, setAddress, inputClasses }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="space-y-4">
            <input name="fullName" placeholder="Full Name" value={address.fullName || ''} onChange={handleChange} required className={inputClasses} />
            <input name="building" placeholder="Building/Flat No." value={address.building || ''} onChange={handleChange} required className={inputClasses} />
            <input name="street" placeholder="Street / Locality" value={address.street || ''} onChange={handleChange} required className={inputClasses} />
            <div className="grid grid-cols-2 gap-4">
                <input name="city" placeholder="City" value={address.city || ''} onChange={handleChange} required className={inputClasses} />
                <input name="pincode" placeholder="Pincode" value={address.pincode || ''} onChange={handleChange} required className={inputClasses} />
            </div>
            <input name="landmark" placeholder="Landmark (optional)" value={address.landmark || ''} onChange={handleChange} className={inputClasses} />
            <input name="phone" placeholder="Phone Number" value={address.phone || ''} onChange={handleChange} required className={inputClasses} />
        </div>
    );
};

const BuyModal: React.FC<{ medicine: Medicine | null; onClose: () => void; onConfirm: (details: any) => void }> = ({ medicine, onClose, onConfirm }) => {
  const { user, updateAuthUser } = useAuth();
  const patient = user as Patient;
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash_on_delivery'>('upi');
  const [utr, setUtr] = useState('');
  const [address, setAddress] = useState<Partial<Address>>(patient?.address || { phone: patient?.phone });
  const [isEditingAddress, setIsEditingAddress] = useState(!patient?.address);

  useEffect(() => {
    if (medicine) {
      document.body.style.overflow = "hidden";
      setQuantity(medicine.minOrderQuantity);
      setAddress(patient?.address || { phone: patient?.phone });
      setIsEditingAddress(!patient?.address);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [medicine, patient]);

  if (!medicine) return null;

  const isUtrValid = /^[a-zA-Z0-9]{12}$/.test(utr);
  const isAddressValid = address.fullName && address.building && address.street && address.city && address.pincode && address.phone;
  const isFormValid = isAddressValid && quantity >= medicine.minOrderQuantity;
  const isOkEnabled = isFormValid && (paymentMethod === 'cash_on_delivery' || (paymentMethod === 'upi' && isUtrValid));
  
  const inputClasses = "w-full p-3 border-0 rounded-lg focus:ring-2 focus:ring-primary/40 outline-none bg-black/5 dark:bg-black/20 text-text-light dark:text-text-dark shadow-inner placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark";
  
  const handleConfirm = () => {
    onConfirm({
      quantity,
      paymentMethod,
      utr,
      addressObject: isEditingAddress ? address : undefined, // Only send address object if it was edited/new
    });
  }

  return (
     <AnimatePresence>
        {medicine && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-md"
            >
                <motion.div 
                    initial={{ scale: 0.95, y: 10, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 10, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="bg-white/90 dark:bg-bg-dark/80 p-6 rounded-2xl shadow-xl w-full max-w-md border border-white/20 dark:border-white/10 max-h-[90vh] overflow-y-auto modal-scroll"
                >
                    <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Buy {medicine.name}</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="font-semibold text-text-light dark:text-text-dark">Delivery Address</label>
                            {isEditingAddress ? (
                                <div className="mt-2"><AddressForm address={address} setAddress={setAddress} inputClasses={inputClasses} /></div>
                            ) : (
                                <div className="p-3 mt-2 rounded-lg bg-black/5 dark:bg-black/20 text-sm">
                                    <p className="font-semibold">{address.fullName}</p>
                                    <p>{address.building}, {address.street}</p>
                                    <p>{address.city}, {address.pincode}</p>
                                    <button onClick={() => setIsEditingAddress(true)} className="text-primary font-semibold text-xs mt-1">Change Address</button>
                                </div>
                            )}
                        </div>

                        <input type="number" placeholder="Quantity" value={quantity} min={medicine.minOrderQuantity} onChange={e => setQuantity(parseInt(e.target.value))} required className={inputClasses} />

                        <div>
                            <label className="font-semibold text-text-light dark:text-text-dark">Payment Method</label>
                            <div className="flex space-x-4 mt-2">
                                <button onClick={() => setPaymentMethod('upi')} className={`p-3 rounded-lg border-2 w-full transition-colors ${paymentMethod === 'upi' ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-gray-600'}`}>UPI</button>
                                <button onClick={() => setPaymentMethod('cash_on_delivery')} className={`p-3 rounded-lg border-2 w-full transition-colors ${paymentMethod === 'cash_on_delivery' ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-gray-600'}`}>Cash on Delivery</button>
                            </div>
                        </div>

                        {paymentMethod === 'upi' && (
                            <motion.div initial={{opacity:0, height: 0}} animate={{opacity: 1, height: 'auto'}} className="text-center p-4 bg-black/5 dark:bg-black/20 rounded-lg overflow-hidden">
                                <p className="text-text-light dark:text-text-dark">Scan to pay</p>
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay" alt="QR Code" className="mx-auto my-2 rounded-lg bg-white p-1"/>
                                <input type="text" placeholder="12-digit UTR/Reference No." value={utr} onChange={e => setUtr(e.target.value)} required className={`w-full p-3 border rounded-lg outline-none transition-all ${isUtrValid ? 'border-green-500 ring-2 ring-green-500/50' : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary/50'}`} />
                            </motion.div>
                        )}
                        
                        <div className="flex justify-end space-x-4 pt-2">
                            <button onClick={onClose} className="py-2 px-6 bg-gray-200 dark:bg-gray-700 rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                            <button onClick={handleConfirm} disabled={!isOkEnabled} className="py-2 px-6 text-white rounded-full font-bold bg-primary hover:bg-primary-dark disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">Confirm Order</button>
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
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const { user, updateAuthUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterShop, setFilterShop] = useState("all");
  const [sortOption, setSortOption] = useState("default");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    api.getMedicines().then(setMedicines);
    api.getShops().then(setShops);
  }, []);

  const handleBuyNow = async (details: any) => {
    if (user && selectedMedicine) {
      try {
        const { order, updatedPatient } = await api.placeOrder({
          ...details,
          patientId: user.id,
          shopId: selectedMedicine.shopId,
          medicineId: selectedMedicine.id,
        });
        
        if (updatedPatient) {
            updateAuthUser(updatedPatient as User);
        }
        showToast(`🩹 ${order.medicineName} ordered successfully!`, 'success');
        setSelectedMedicine(null);
        navigate('/');
      } catch (err) {
          console.error("Order placement failed", err);
          showToast('❌ Failed to place order.', 'error');
      }
    }
  };

  const filteredAndSortedMedicines = useMemo(() => {
    return medicines
      .filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterShop === 'all' || m.shopName === filterShop)
      )
      .sort((a, b) => {
        switch(sortOption) {
            case 'low-high': return a.price - b.price;
            case 'high-low': return b.price - a.price;
            case 'newest': return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
            default: return 0;
        }
      });
  }, [medicines, searchQuery, filterShop, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedMedicines.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedMedicines.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const selectClasses = "p-3 pr-8 border-0 rounded-lg focus:ring-2 focus:ring-primary/40 outline-none bg-black/5 dark:bg-black/20 text-text-light dark:text-text-dark shadow-inner";

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-4 text-text-light dark:text-text-dark">Shop for Medicines</h1>
      
      <div className="glass-card p-4 mb-8 flex flex-wrap gap-4 items-center justify-center shadow-md">
        <input 
            type="text" 
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-auto flex-grow p-3 border-0 rounded-lg focus:ring-2 focus:ring-primary/40 outline-none bg-black/5 dark:bg-black/20 text-text-light dark:text-text-dark shadow-inner"
        />
        <div className="relative">
            <select value={filterShop} onChange={(e) => setFilterShop(e.target.value)} className={selectClasses}>
                <option value="all">All Shops</option>
                {shops.map(shop => <option key={shop.id} value={shop.shopName}>{shop.shopName}</option>)}
            </select>
        </div>
        <div className="relative">
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className={selectClasses}>
                <option value="default">Sort by</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
            </select>
        </div>
      </div>
      
      <AnimatePresence>
        {currentItems.length > 0 ? (
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {currentItems.map(med => (
                    <MedicineCard key={med.id} medicine={med} onBuy={setSelectedMedicine} />
                ))}
            </motion.div>
        ) : (
            <EmptyState 
                title="No medicines found for your search." 
                message="Try adjusting your search query or filters to find what you're looking for."
            />
        )}
      </AnimatePresence>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 flex-wrap gap-2">
            <button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className="px-4 py-2 border rounded-md hover:bg-primary hover:text-white disabled:opacity-50"
            >
            Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
            <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-4 py-2 rounded-md border ${
                currentPage === i + 1 ? "bg-primary text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
            >
                {i + 1}
            </button>
            ))}
            <button
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="px-4 py-2 border rounded-md hover:bg-primary hover:text-white disabled:opacity-50"
            >
            Next
            </button>
        </div>
      )}

      <BuyModal
        medicine={selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
        onConfirm={handleBuyNow}
      />
    </div>
  );
};

export default ShopPage;