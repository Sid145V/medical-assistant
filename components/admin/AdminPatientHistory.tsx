import React, { useEffect, useState } from "react";
import { api } from "../../services/mockApi";
import { Patient, HistoryItem } from "../../types";
import EmptyState from "../EmptyState";

export default function AdminPatientHistory() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ loadPatients(); }, []);

  const loadPatients = async () => {
    try {
      const d = await api.getPatients();
      setPatients(d || []);
    } catch { setPatients([]); }
  };

  const viewHistory = async (p: Patient) => {
    setSelectedPatient(p);
    setLoading(true);
    try {
      const h = await api.getPatientHistory(p.id);
      setHistory(h || []);
    } catch { setHistory([]); } finally { setLoading(false); }
  };
  
  const formatAddress = (address: any): string => {
    if (!address) return "No address on file";
    return `${address.building}, ${address.street}, ${address.city} - ${address.pincode}`;
  };

  return (
    <div className="p-6 glass-card shadow">
      <h2 className="text-xl font-semibold mb-4">Patient History</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <h3 className="font-semibold mb-2 text-text-light dark:text-text-dark">All Patients</h3>
          <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {patients.length > 0 ? patients.map(p => (
              <li key={p.id} className="p-2 border border-white/20 dark:border-white/10 rounded-lg flex justify-between items-center bg-black/5 dark:bg-white/5">
                <div>
                  <div className="font-medium text-text-light dark:text-text-dark">{p.firstName} {p.lastName}</div>
                  <div className="text-sm text-text-muted-light dark:text-text-muted-dark">{p.phone || p.email}</div>
                </div>
                <button onClick={()=>viewHistory(p)} className="px-3 py-1 rounded-md border border-primary text-primary text-sm font-semibold">View</button>
              </li>
            )) : (
                <EmptyState title="No Patients Found" message="There are no patients registered in the system."/>
            )}
          </ul>
        </div>

        <div className="flex-1 min-h-[300px]">
          {selectedPatient ? (
            <>
              <div className="mb-4 p-3 rounded-lg bg-black/5 dark:bg-white/5">
                <div className="font-semibold text-text-light dark:text-text-dark">{selectedPatient.firstName} {selectedPatient.lastName}</div>
                <div className="text-sm text-text-muted-light dark:text-text-muted-dark">{formatAddress(selectedPatient.address)}</div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-text-light dark:text-text-dark">Appointments & Chat History</h3>
                 <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg max-h-[50vh] overflow-y-auto">
                    {loading ? <p className="p-2 text-gray-500">Loading history...</p> : 
                    history.length ? history.map((h,i)=>(
                      <div key={i} className="p-2 border-b border-white/20 dark:border-white/10">
                        <div className="text-sm font-semibold">{h.date} {h.time} — {h.doctorName}</div>
                        <div className="text-xs text-text-muted-light dark:text-text-muted-dark">{h.summary}</div>
                      </div>
                    )) : <EmptyState title="No History Found" message="This patient has no recorded history."/>}
                 </div>
              </div>
            </>
          ) : <div className="text-gray-500 p-4 text-center h-full flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-lg">Select a patient to view history</div>}
        </div>
      </div>
    </div>
  );
}
