import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/mockApi';
import { Patient, Doctor, Shop, ContactMessage, Appointment, Order, Medicine, Address } from '../types';
import { motion } from 'framer-motion';
import AdminAppointments from '../components/admin/AdminAppointments';
import AdminDoctorControls from '../components/admin/AdminDoctorControls';
import AdminPatientHistory from '../components/admin/AdminPatientHistory';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

type Tab = 'home' | 'patients' | 'shops' | 'doctors' | 'messages' | 'appointments' | 'orders' | 'doctor-controls' | 'patient-history';

const StatCard: React.FC<{ title: string; value: number; icon: string; color: string }> = ({ title, value, icon, color }) => (
    <div className={`glass-card p-6 flex items-center space-x-4 border-l-4 shadow-lg ${color}`}>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')} dark:${color.replace('border-', 'bg-').replace('-500', '-900/50')}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${color.replace('border-', 'text-')}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
            </svg>
        </div>
        <div>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{title}</p>
            <p className="text-3xl font-bold text-text-light dark:text-text-dark">{value}</p>
        </div>
    </div>
);

const formatAddress = (address?: Address): string => {
    if (!address) return 'N/A';
    return `${address.building}, ${address.street}, ${address.city} - ${address.pincode}`;
};

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    api.getAllOrders().then(setOrders);
  }, []);

  return (
    <div className="glass-card p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-text-light dark:text-text-dark">All Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-white/20 dark:border-white/10">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Patient</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Shop</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Medicine</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Qty</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Price</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Payment</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Ref No</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20 dark:divide-white/10">
            {orders.length > 0 ? orders.map((o) => (
              <tr key={o.id} className="hover:bg-primary/5 dark:hover:bg-primary/10">
                <td className="py-3 px-4 text-sm">{o.patientName}</td>
                <td className="py-3 px-4 text-sm">{o.shopName}</td>
                <td className="py-3 px-4 text-sm">{o.medicineName}</td>
                <td className="py-3 px-4 text-sm">{o.quantity}</td>
                <td className="py-3 px-4 text-sm">₹{o.totalPrice.toFixed(2)}</td>
                <td className="py-3 px-4 text-sm capitalize">{o.paymentMethod.replace('_', ' ')}</td>
                <td className="py-3 px-4 text-sm">{o.utr || 'N/A'}</td>
                <td className="py-3 px-4 text-sm">{new Date(o.timestamp).toLocaleDateString()}</td>
              </tr>
            )) : (
              <tr><td colSpan={8} className="p-4 text-center text-gray-500">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminShops: React.FC<{ shops: Shop[] }> = ({ shops }) => {
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
    const [shopMedicines, setShopMedicines] = useState<Medicine[]>([]);
    const [isLoadingMeds, setIsLoadingMeds] = useState(false);

    const handleShopClick = async (shop: Shop) => {
        if (selectedShop?.id === shop.id) {
            setSelectedShop(null); // Toggle off
            return;
        }
        setIsLoadingMeds(true);
        setSelectedShop(shop);
        try {
            const meds = await api.getMedicinesByShop(shop.id);
            setShopMedicines(meds);
        } catch {
            setShopMedicines([]);
        } finally {
            setIsLoadingMeds(false);
        }
    };

    return (
        <div>
            <div className="overflow-x-auto glass-card shadow-lg">
                <table className="min-w-full">
                    <thead className="border-b border-white/20 dark:border-white/10">
                        <tr>
                            {["Shop Name", "Owner", "Email", "Shop Address"].map(h => <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20 dark:divide-white/10">
                        {shops.length > 0 ? shops.map((shop) => (
                            <tr key={shop.id} onClick={() => handleShopClick(shop)} className="cursor-pointer hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors group">
                                {[shop.shopName, shop.ownerName, shop.email, formatAddress(shop.address)].map((cellData, idx) => (
                                    <td key={idx} className="py-3 px-4 text-sm text-text-light dark:text-text-dark whitespace-nowrap relative">
                                        {idx === 0 && <div className="absolute left-0 top-0 h-full w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out"></div>}
                                        {cellData}
                                    </td>
                                ))}
                            </tr>
                        )) : (
                            <tr><td colSpan={4} className="p-6 text-center text-gray-500">No shops available at the moment.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {selectedShop && (
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="mt-6 glass-card p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-3 text-text-light dark:text-text-dark">Medicines from {selectedShop.shopName}</h3>
                    {isLoadingMeds ? <p>Loading medicines...</p> : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="border-b border-white/20 dark:border-white/10">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Medicine</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Price</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Min Qty</th>
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Added On</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/20 dark:divide-white/10">
                                    {shopMedicines.length > 0 ? shopMedicines.map((m) => (
                                        <tr key={m.id} className="hover:bg-primary/5 dark:hover:bg-primary/10">
                                            <td className="py-3 px-4 text-sm">{m.name}</td>
                                            <td className="py-3 px-4 text-sm">₹{m.price.toFixed(2)}</td>
                                            <td className="py-3 px-4 text-sm">{m.minOrderQuantity}</td>
                                            <td className="py-3 px-4 text-sm">{m.dateAdded}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} className="p-4 text-center text-gray-500">No medicines found for this shop.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};


// --- Main Dashboard Component ---
const downloadJson = (data: object, filename: string) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};


const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [data, setData] = useState<{ patients: Patient[], doctors: Doctor[], shops: Shop[], messages: ContactMessage[], appointments: Appointment[], orders: Order[] }>({
    patients: [], doctors: [], shops: [], messages: [], appointments: [], orders: []
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [patients, doctors, shops, messages, appointments, orders] = await Promise.all([
        api.getPatients(),
        api.getDoctors(),
        api.getShops(),
        api.getContactMessages(),
        api.getAllAppointments(),
        api.getAllOrders()
      ]);
      setData({ patients, doctors, shops, messages, appointments, orders });
      setLoading(false);
    };
    fetchData();
  }, []);
  
  const handleBackup = async () => {
    try {
        const backupData = {
            patients: await api.getPatients(),
            doctors: await api.getDoctors(),
            shops: await api.getShops(),
            medicines: await api.getMedicines(),
            appointments: await api.getAllAppointments(),
            orders: await api.getAllOrders(),
            messages: await api.getContactMessages(),
        };
        downloadJson(backupData, `mediai-backup-${new Date().toISOString().split('T')[0]}.json`);
        showToast('✅ Data exported successfully!', 'success');
    } catch (error) {
        console.error("Backup failed:", error);
        showToast('❌ Failed to export data.', 'error');
    }
  };

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'patients', label: 'Patients', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1.78-4.125a4 4 0 00-6.44 0A6 6 0 003 20v1h12z' },
    { id: 'doctors', label: 'Doctors', icon: 'M12 6.253v11.494m-5.747-8.994l11.494 5.747m-11.494 0l11.494-5.747' },
    { id: 'shops', label: 'Shops', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'appointments', label: 'Appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'orders', label: 'Orders', icon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' },
    { id: 'messages', label: 'Messages', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'doctor-controls', label: 'Doctor Controls', icon: 'M10.34 15.84c-.22.22-.46.38-.72.48l-1.9.7a1.13 1.13 0 01-1.4-1.4l.7-1.9c.1-.26.26-.5.48-.72l8.22-8.22a2.12 2.12 0 013 3L10.34 15.84zM16 5L19 8' },
    { id: 'patient-history', label: 'Patient History', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6-11.958zM12 6.042V21m0-14.958a8.967 8.967 0 016 2.292m0 10.125a8.967 8.967 0 01-5.982 2.292m0 0a8.967 8.967 0 01-5.982-2.292m0 0V21' },
  ];
  
  const renderContent = useMemo(() => {
    if (loading) return <div className="text-center p-8 text-text-muted-light dark:text-text-muted-dark">Loading data...</div>;

    switch (activeTab) {
      case 'home':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            <StatCard title="Total Patients" value={data.patients.length} icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1.78-4.125a4 4 0 00-6.44 0A6 6 0 003 20v1h12z" color="border-blue-500 text-blue-500" />
            <StatCard title="Verified Doctors" value={data.doctors.length} icon="M12 6.253v11.494m-5.747-8.994l11.494 5.747m-11.494 0l11.494-5.747" color="border-green-500 text-green-500" />
            <StatCard title="Registered Shops" value={data.shops.length} icon="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" color="border-yellow-500 text-yellow-500" />
            <StatCard title="Inbox Messages" value={data.messages.length} icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" color="border-purple-500 text-purple-500" />
            <StatCard title="Total Appointments" value={data.appointments.length} icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" color="border-indigo-500 text-indigo-500" />
            <StatCard title="Total Orders" value={data.orders.length} icon="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" color="border-pink-500 text-pink-500" />
             <div className="md:col-span-2 lg:col-span-2 glass-card p-6 flex items-center justify-between shadow-lg border-l-4 border-gray-500">
                <div>
                    <h3 className="text-xl font-bold text-text-light dark:text-text-dark">System Backup</h3>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">Export all system data to a JSON file for backup.</p>
                </div>
                <button onClick={handleBackup} className="btn-secondary">
                    Export Data
                </button>
            </div>
          </div>
        );
      case 'patients':
      case 'doctors':
      case 'messages':
        const currentData = data[activeTab];
        const tableHeaders = {
            patients: ["Name", "Email", "Phone", "Address"],
            doctors: ["Name", "Qualification", "Email", "Location", "License No.", "Specialization"],
            messages: ["From", "Email", "Phone", "Message"],
        };
        const headers = tableHeaders[activeTab as 'patients' | 'doctors' | 'messages'];

        return (
          <div className="overflow-x-auto glass-card shadow-lg">
            <table className="min-w-full">
              <thead className="border-b border-white/20 dark:border-white/10">
                <tr>
                  {headers.map(h => <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20 dark:divide-white/10">
                {currentData.length > 0 ? currentData.map((item: any) => {
                  let rowData: string[];
                  if (activeTab === 'patients') rowData = [ `${item.firstName} ${item.lastName}`, item.email, item.phone, formatAddress(item.address) ];
                  else if (activeTab === 'doctors') rowData = [ item.name, item.qualification, item.email, item.location, item.license || 'N/A', item.specialization || 'N/A' ];
                  else rowData = [ item.name, item.email, item.phone, item.message ];

                  return (
                    <tr key={item.id} className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors group">
                      {rowData.map((cellData, idx) => (
                        <td key={idx} className="py-3 px-4 text-sm text-text-light dark:text-text-dark whitespace-nowrap relative">
                           {idx === 0 && (
                            <div className="absolute left-0 top-0 h-full w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out"></div>
                          )}
                          {activeTab === 'messages' && idx === 3 ? (
                            <span className="block max-w-xs truncate" title={cellData}>{cellData}</span>
                          ) : (
                            cellData
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                }) : (
                     <tr><td colSpan={100} className="p-6 text-center text-gray-500">No records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        );
       case 'shops':
        return <AdminShops shops={data.shops} />;
       case 'appointments':
        return <AdminAppointments />;
       case 'orders':
        return <AdminOrders />;
      case 'doctor-controls':
        return <AdminDoctorControls />;
      case 'patient-history':
        return <AdminPatientHistory />;
      default: return null;
    }
  }, [activeTab, data, loading, handleBackup]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 flex-shrink-0">
            <h1 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">Admin Panel</h1>
            <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto">
                {TABS.map(tab => (
                    <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-3 text-left py-2 px-4 rounded-lg font-semibold transition-colors w-full ${activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-text-muted-light dark:text-text-muted-dark hover:bg-primary/10 hover:text-text-light dark:hover:text-text-dark'}`}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} /></svg>
                    <span className="whitespace-nowrap">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
        <main className="flex-grow">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {renderContent}
            </motion.div>
        </main>
    </div>
  );
};

export default AdminDashboard;