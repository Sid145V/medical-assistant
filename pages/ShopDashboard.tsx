
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Medicine, Order, Shop as ShopType } from '../types';
import { api } from '../services/mockApi';

const AddItemModal: React.FC<{ onClose: () => void; onAdd: (item: any) => void }> = ({ onClose, onAdd }) => {
  const [item, setItem] = useState({ name: '', minOrderQuantity: 1, price: 0, image: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: name === 'price' || name === 'minOrderQuantity' ? parseFloat(value) : value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setItem(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(item);
  };
  
  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Medicine</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Medicine Name" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input name="minOrderQuantity" type="number" placeholder="Min Order Quantity" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input name="price" type="number" step="0.01" placeholder="Price" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input name="image" type="file" accept="image/*" onChange={handleFileChange} required className="w-full p-2 border rounded" />
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="py-2 px-4 bg-teal-500 text-white rounded hover:bg-teal-600">Add</button>
          </div>
        </form>
      </div>
    </div>
  )
};

const ShopDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'orders'>('home');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      api.getMedicinesByShop(user.id).then(setMedicines);
      api.getOrdersForShop(user.id).then(setOrders);
    }
  }, [user]);

  const handleAddItem = async (item: any) => {
    if (user) {
      const newMedicine = await api.addMedicine({ ...item, shopId: user.id });
      setMedicines(prev => [...prev, newMedicine]);
      setShowModal(false);
    }
  };

  if (!user) return null;
  const shop = user as ShopType;

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left">Medicine</th>
                  <th className="py-2 px-4 text-left">Quantity</th>
                  <th className="py-2 px-4 text-left">Address</th>
                  <th className="py-2 px-4 text-left">Payment</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b">
                    <td className="py-2 px-4">{o.medicineName}</td>
                    <td className="py-2 px-4">{o.quantity}</td>
                    <td className="py-2 px-4">{o.address}</td>
                    <td className="py-2 px-4 capitalize">{o.paymentMethod.replace('_', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'home':
      default:
        return (
            <div>
                <button onClick={() => setShowModal(true)} className="mb-6 bg-teal-500 text-white font-bold py-2 px-4 rounded hover:bg-teal-600">Add Item</button>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {medicines.map(med => (
                        <div key={med.id} className="bg-gray-100 p-4 rounded-lg text-center">
                            <img src={med.image} alt={med.name} className="w-32 h-32 object-contain mx-auto mb-2" />
                            <h4 className="font-semibold">{med.name}</h4>
                            <p>${med.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
  };


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {shop.shopName}</h1>
       <div className="mb-6 border-b">
        <nav className="flex space-x-8">
          {(['home', 'orders'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 capitalize font-semibold transition-colors ${activeTab === tab ? 'border-b-2 border-teal-500 text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {renderContent()}
      </div>
      {showModal && <AddItemModal onClose={() => setShowModal(false)} onAdd={handleAddItem} />}
    </div>
  );
};

export default ShopDashboard;
