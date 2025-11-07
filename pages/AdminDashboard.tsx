
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Patient, Doctor, Shop, ContactMessage } from '../types';

type Tab = 'home' | 'patients' | 'shops' | 'doctors' | 'messages';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [data, setData] = useState<{ patients: Patient[], doctors: Doctor[], shops: Shop[], messages: ContactMessage[] }>({
    patients: [],
    doctors: [],
    shops: [],
    messages: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const patients = await api.getPatients();
      const doctors = await api.getDoctors();
      const shops = await api.getShops();
      const messages = await api.getContactMessages();
      setData({ patients, doctors, shops, messages });
    };
    fetchData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'patients':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Phone</th>
                  <th className="py-2 px-4 text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                {data.patients.map(p => (
                  <tr key={p.id} className="border-b">
                    <td className="py-2 px-4">{p.firstName} {p.lastName}</td>
                    <td className="py-2 px-4">{p.email}</td>
                    <td className="py-2 px-4">{p.phone}</td>
                    <td className="py-2 px-4">{p.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'doctors':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Qualification</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                {data.doctors.map(d => (
                  <tr key={d.id} className="border-b">
                    <td className="py-2 px-4">{d.name}</td>
                    <td className="py-2 px-4">{d.qualification}</td>
                    <td className="py-2 px-4">{d.email}</td>
                    <td className="py-2 px-4">{d.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'shops':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
               <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left">Shop Name</th>
                  <th className="py-2 px-4 text-left">Owner</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                {data.shops.map(s => (
                  <tr key={s.id} className="border-b">
                    <td className="py-2 px-4">{s.shopName}</td>
                    <td className="py-2 px-4">{s.ownerName}</td>
                    <td className="py-2 px-4">{s.email}</td>
                    <td className="py-2 px-4">{s.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'messages':
        return (
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
               <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left">From</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Phone</th>
                  <th className="py-2 px-4 text-left">Message</th>
                </tr>
              </thead>
              <tbody>
                {data.messages.map(m => (
                  <tr key={m.id} className="border-b">
                    <td className="py-2 px-4">{m.name}</td>
                    <td className="py-2 px-4">{m.email}</td>
                    <td className="py-2 px-4">{m.phone}</td>
                    <td className="py-2 px-4 whitespace-pre-wrap">{m.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'home':
      default:
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-100 p-6 rounded-lg shadow"><h3 className="text-xl font-bold">Patients</h3><p className="text-3xl">{data.patients.length}</p></div>
            <div className="bg-green-100 p-6 rounded-lg shadow"><h3 className="text-xl font-bold">Doctors</h3><p className="text-3xl">{data.doctors.length}</p></div>
            <div className="bg-yellow-100 p-6 rounded-lg shadow"><h3 className="text-xl font-bold">Shops</h3><p className="text-3xl">{data.shops.length}</p></div>
            <div className="bg-purple-100 p-6 rounded-lg shadow"><h3 className="text-xl font-bold">Messages</h3><p className="text-3xl">{data.messages.length}</p></div>
          </div>
        );
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-6 border-b">
        <nav className="flex space-x-8">
          {(['home', 'patients', 'doctors', 'shops', 'messages'] as Tab[]).map(tab => (
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
    </div>
  );
};

export default AdminDashboard;
