import React, { useEffect, useState } from "react";
import { api } from "../../services/mockApi";
import { Doctor, Slot } from "../../types";
import EmptyState from "../EmptyState";

export default function AdminDoctorControls() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ loadDoctors(); }, []);

  const loadDoctors = async () => {
    try {
      const d = await api.getDoctors();
      setDoctors(d || []);
    } catch (e) { setDoctors([]); }
  };

  const viewSlots = async (doc: Doctor) => {
    setSelected(doc);
    setLoading(true);
    try {
      const s = await api.getDoctorSlots(doc.id);
      setSlots(s || []);
    } catch (e) { setSlots([]); } finally { setLoading(false); }
  };

  return (
    <div className="p-6 glass-card shadow">
      <h2 className="text-xl font-semibold mb-4">Doctors & Availability</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2 text-text-light dark:text-text-dark">All Doctors</h3>
          <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {doctors.length > 0 ? doctors.map(d => (
              <li key={d.id} className="p-3 rounded-lg border border-white/20 dark:border-white/10 flex justify-between items-center bg-black/5 dark:bg-white/5">
                <div>
                  <div className="font-medium text-text-light dark:text-text-dark">{d.name}</div>
                  <div className="text-sm text-text-muted-light dark:text-text-muted-dark">{d.location} • {d.specialization || "N/A"}</div>
                </div>
                <div>
                  <button onClick={()=>viewSlots(d)} className="px-3 py-1 rounded-md bg-primary text-white text-sm font-semibold">View Slots</button>
                </div>
              </li>
            )) : (
                <EmptyState title="No Doctors Found" message="There are no doctors registered in the system." />
            )}
          </ul>
        </div>

        <div className="min-h-[300px]">
          {selected ? (
            <div>
              <h3 className="font-semibold mb-2 text-text-light dark:text-text-dark">Available Slots for {selected.name}</h3>
              <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg max-h-[60vh] overflow-y-auto">
                {loading ? <p className="p-2 text-gray-500">Loading slots...</p> : 
                 slots.length ? slots.map((s,i)=>(
                  <div key={i} className="flex justify-between p-2 border-b border-white/20 dark:border-white/10">
                    <div>{s.date} {s.time}</div>
                    <div className={`text-sm font-semibold capitalize ${s.status === 'available' ? 'text-green-500' : 'text-red-500'}`}>{s.status}</div>
                  </div>
                 )) : <EmptyState title="No Slots Data" message="No availability information found for this doctor."/>}
              </div>
            </div>
          ) : <div className="text-gray-500 p-4 text-center h-full flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-lg">Select a doctor to view their slots</div>}
        </div>
      </div>
    </div>
  );
}
