import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Medicine, Order, Shop as ShopType } from '../types';
import { api } from '../services/mockApi';
import { motion, AnimatePresence } from 'framer-motion';

const inputClasses = "w-full p-3 border-0 rounded-lg focus:ring-2 focus:ring-primary/40 outline-none bg-black/5 dark:bg-black/20 text-text-light dark:text-text-dark shadow-inner placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark";
const Icon = ({ path, className = "h-6 w-6" }: { path: string, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const AddItemModal: React.FC<{ onClose: () => void; onAdd: (item: any) => void }> = ({ onClose, onAdd }) => {
  const [item, setItem] = useState({ name: '', minOrderQuantity: 1, price: 0.01, image: '' });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: name === 'price' || name === 'minOrderQuantity' ? parseFloat(value) || 0 : value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setItem(prev => ({ ...prev, image: reader.result as string }));
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item.name && item.minOrderQuantity > 0 && item.price > 0 && item.image) {
      onAdd(item);
    } else {
        alert("Please fill out all fields correctly.");
    }
  };
  
  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <motion.div 
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="glass-card p-8 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">Add New Medicine</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" placeholder="Medicine Name" onChange={handleChange} required className={inputClasses} />
                <div className="grid grid-cols-2 gap-4">
                    <input name="minOrderQuantity" type="number" placeholder="Min Order Qty" min="1" step="1" onChange={handleChange} required className={inputClasses} />
                    <input name="price" type="number" step="0.01" min="0.01" placeholder="Price" onChange={handleChange} required className={inputClasses} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Product Image</label>
                    <div className="flex items-center space-x-4">
                      {imagePreview && <img src={imagePreview} alt="preview" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
                      <input id="file-upload" name="image" type="file" accept="image/*" onChange={handleFileChange} required className="hidden" />
                      <label htmlFor="file-upload" className="cursor-pointer w-full text-sm text-center text-primary font-semibold p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                        {imagePreview ? 'Change Image' : 'Upload Image'}
                      </label>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                    <motion.button type="button" onClick={onClose} className="py-2 px-6 bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-600" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Cancel</motion.button>
                    <motion.button type="submit" className="py-2 px-6 bg-primary text-white rounded-full font-bold hover:bg-primary-dark" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Add Item</motion.button>
                </div>
            </form>
        </motion.div>
    </motion.div>
  )
};

const ShopDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'items' | 'orders'>('items');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'shop') {
      setLoading(true);
      Promise.all([
        api.getMedicinesByShop(user.id),
        api.getOrdersForShop(user.id)
      ]).then(([meds, ords]) => {
        setMedicines(meds);
        setOrders(ords);
      }).finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, [user]);

  const handleAddItem = async (item: any) => {
    if (user) {
      const newMedicine = await api.addMedicine({ ...item, shopId: user.id });
      setMedicines(prev => [...prev, newMedicine]);
      setShowModal(false);
    }
  };

  if (!user || user.role !== 'shop') return null;
  const shop = user as ShopType;
  
  const content = {
      items: (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">My Inventory</h2>
                <motion.button 
                    onClick={() => setShowModal(true)} 
                    className="btn-primary py-2 flex items-center space-x-2"
                    whileHover={{ y: -2, boxShadow: '0 10px 20px rgba(15, 157, 146, 0.25)' }}
                >
                    <Icon path="M12 4v16m8-8H4" className="h-5 w-5"/>
                    <span>Add Item</span>
                </motion.button>
            </div>
            {medicines.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {medicines.map(med => (
                        <div key={med.id} className="bg-white/50 dark:bg-black/20 p-4 rounded-xl text-center flex flex-col border border-white/30 dark:border-white/10 hover:border-primary/30 transition-all shadow-md hover:shadow-lg">
                            <div className="relative h-32 flex items-center justify-center mb-2 bg-white/70 dark:bg-black/20 rounded-lg overflow-hidden">
                                <img src={med.image} alt={med.name} className="max-w-full max-h-full object-contain" loading="lazy" />
                            </div>
                            <h4 className="font-semibold text-text-light dark:text-text-dark flex-grow mt-2">{med.name}</h4>
                            <p className="text-primary font-bold mt-1">${med.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-12 text-text-muted-light dark:text-text-muted-dark">You haven't added any items yet. Add one to get started!</div>
            )}
        </div>
      ),
      orders: (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">Incoming Orders</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="border-b-2 border-white/20 dark:border-white/10">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-text-muted-light dark:text-text-muted-dark">Item</th>
                      <th className="py-3 px-4 text-left font-semibold text-text-muted-light dark:text-text-muted-dark">Qty</th>
                      <th className="py-3 px-4 text-left font-semibold text-text-muted-light dark:text-text-muted-dark">Address</th>
                      <th className="py-3 px-4 text-left font-semibold text-text-muted-light dark:text-text-muted-dark">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map(o => (
                        <tr key={o.id} className="border-b border-white/20 dark:border-white/10 last:border-b-0 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors group">
                           <td className="py-4 px-4 font-medium text-text-light dark:text-text-dark relative">
                            <div className="absolute left-0 top-0 h-full w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out"></div>
                            {o.medicineName}
                          </td>
                          <td className="py-4 px-4 text-text-muted-light dark:text-text-muted-dark">{o.quantity}</td>
                          <td className="py-4 px-4 text-text-muted-light dark:text-text-muted-dark truncate max-w-xs">{o.address}</td>
                          <td className="py-4 px-4 text-text-muted-light dark:text-text-muted-dark capitalize">{o.paymentMethod.replace('_', ' ')}</td>
                        </tr>
                      ))
                    ) : (
                        <tr><td colSpan={4} className="text-center py-12 text-text-muted-light dark:text-text-muted-dark">No orders received yet.</td></tr>
                    )}
                  </tbody>
                </table>
            </div>
        </div>
      )
  }

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-8"
    >
        <div>
            <h1 className="text-3xl font-bold mb-1 text-text-light dark:text-text-dark">Welcome, {shop.shopName}!</h1>
            <p className="text-text-muted-light dark:text-text-muted-dark">{shop.location}</p>
        </div>

      <div className="glass-card p-6 shadow-xl">
          <div className="flex border-b border-white/20 dark:border-white/10 mb-6">
              <button onClick={() => setActiveTab('items')} className={`py-3 px-6 font-semibold relative transition-colors ${activeTab === 'items' ? 'text-primary' : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark'}`}>
                  Inventory
                  {activeTab === 'items' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" layoutId="dashboard-underline" />}
              </button>
              <button onClick={() => setActiveTab('orders')} className={`py-3 px-6 font-semibold relative transition-colors ${activeTab === 'orders' ? 'text-primary' : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark'}`}>
                  Orders
                  {activeTab === 'orders' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" layoutId="dashboard-underline" />}
              </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
            >
                {loading ? (
                    <div className="text-center py-12 text-text-muted-light dark:text-text-muted-dark">Loading dashboard...</div>
                ) : content[activeTab]}
            </motion.div>
          </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && <AddItemModal onClose={() => setShowModal(false)} onAdd={handleAddItem} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShopDashboard;