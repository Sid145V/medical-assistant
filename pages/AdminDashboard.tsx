import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/mockApi';
import { Patient, Doctor, Shop, ContactMessage } from '../types';
import { motion } from 'framer-motion';

type Tab = 'home' | 'patients' | 'shops' | 'doctors' | 'messages';

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

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [data, setData] = useState<{ patients: Patient[], doctors: Doctor[], shops: Shop[], messages: ContactMessage[] }>({
    patients: [],
    doctors: [],
    shops: [],
    messages: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [patients, doctors, shops, messages] = await Promise.all([
        api.getPatients(),
        api.getDoctors(),
        api.getShops(),
        api.getContactMessages(),
      ]);
      setData({ patients, doctors, shops, messages });
      setLoading(false);
    };
    fetchData();
  }, []);
  
  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'patients', label: 'Patients', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1.78-4.125a4 4 0 00-6.44 0A6 6 0 003 20v1h12z' },
    { id: 'doctors', label: 'Doctors', icon: 'M12 6.253v11.494m-5.747-8.994l11.494 5.747m-11.494 0l11.494-5.747' },
    { id: 'shops', label: 'Shops', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'messages', label: 'Messages', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];
  
  const tableHeaders = {
      patients: ["Name", "Email", "Phone", "Location"],
      doctors: ["Name", "Qualification", "Email", "Location"],
      shops: ["Shop Name", "Owner", "Email", "Location"],
      messages: ["From", "Email", "Phone", "Message"],
  };

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
          </div>
        );
      case 'patients': case 'doctors': case 'shops': case 'messages':
        const currentData = data[activeTab];
        const headers = tableHeaders[activeTab];

        return (
          <div className="overflow-x-auto glass-card shadow-lg">
            <table className="min-w-full">
              <thead className="border-b border-white/20 dark:border-white/10">
                <tr>
                  {headers.map(h => <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20 dark:divide-white/10">
                {currentData.map((item: any) => {
                  let rowData: string[];
                  if (activeTab === 'patients') rowData = [ `${item.firstName} ${item.lastName}`, item.email, item.phone, item.location ];
                  else if (activeTab === 'doctors') rowData = [ item.name, item.qualification, item.email, item.location ];
                  else if (activeTab === 'shops') rowData = [ item.shopName, item.ownerName, item.email, item.location ];
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
                })}
              </tbody>
            </table>
          </div>
        );
      default: return null;
    }
  }, [activeTab, data, loading]);

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