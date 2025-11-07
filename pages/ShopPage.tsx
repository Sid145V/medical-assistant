
import React, { useState, useEffect } from 'react';
import { Medicine } from '../types';
import { api } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MedicineCard: React.FC<{ medicine: Medicine; onBuy: (medicine: Medicine) => void }> = ({ medicine, onBuy }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
    <img src={medicine.image} alt={medicine.name} className="w-48 h-48 object-contain mb-4" />
    <h3 className="text-xl font-bold">{medicine.name}</h3>
    <p className="text-gray-500 text-sm">from {medicine.shopName}</p>
    <p className="text-lg font-semibold text-teal-600 mt-2">${medicine.price.toFixed(2)}</p>
    <button
      onClick={() => onBuy(medicine)}
      className="mt-4 bg-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-600 transition-colors"
    >
      Buy Now
    </button>
  </div>
);

const BuyModal: React.FC<{ medicine: Medicine | null; onClose: () => void; onConfirm: (details: any) => void }> = ({ medicine, onClose, onConfirm }) => {
  const [details, setDetails] = useState({ quantity: 1, address: '', paymentMethod: 'upi' as 'upi' | 'cash_on_delivery', utr: '' });
  
  if (!medicine) return null;

  const isUtrValid = /^[a-z]{4}[0-9]{8}$/.test(details.utr);
  const isOkEnabled = details.paymentMethod === 'cash_on_delivery' || (details.paymentMethod === 'upi' && isUtrValid);
  
  const handleConfirm = () => {
    onConfirm(details);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Buy {medicine.name}</h2>
        <div className="space-y-4">
          <input type="number" placeholder="Quantity" value={details.quantity} min={medicine.minOrderQuantity} onChange={e => setDetails({...details, quantity: parseInt(e.target.value)})} required className="w-full p-2 border rounded" />
          <input type="text" placeholder="Delivery Address" value={details.address} onChange={e => setDetails({...details, address: e.target.value})} required className="w-full p-2 border rounded" />
          <div>
            <label className="font-semibold">Payment Method</label>
            <div className="flex space-x-4 mt-2">
              <button onClick={() => setDetails({...details, paymentMethod: 'upi'})} className={`p-2 rounded border-2 ${details.paymentMethod === 'upi' ? 'border-teal-500' : ''}`}>UPI</button>
              <button onClick={() => setDetails({...details, paymentMethod: 'cash_on_delivery'})} className={`p-2 rounded border-2 ${details.paymentMethod === 'cash_on_delivery' ? 'border-teal-500' : ''}`}>Cash on Delivery</button>
            </div>
          </div>
          {details.paymentMethod === 'upi' && (
            <div>
              <p className="text-center">Scan to pay</p>
              <img src="https://picsum.photos/seed/qr/200" alt="QR Code" className="mx-auto my-2"/>
              <input type="text" placeholder="UTR/Reference No. (e.g. abcd12345678)" value={details.utr} onChange={e => setDetails({...details, utr: e.target.value})} required className="w-full p-2 border rounded" />
            </div>
          )}
          <div className="flex justify-end space-x-4 mt-6">
            <button onClick={onClose} className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
            <button onClick={handleConfirm} disabled={!isOkEnabled} className={`py-2 px-4 text-white rounded ${isOkEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}>OK</button>
          </div>
        </div>
      </div>
    </div>
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
      <h1 className="text-3xl font-bold text-center mb-8">Shop for Medicines</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
