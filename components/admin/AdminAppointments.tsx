import React, { useEffect, useState } from "react";
import { api } from "../../services/mockApi";
import { Appointment, Doctor } from "../../types";
import { useToast } from "../../context/ToastContext";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<Appointment['status'] | "all">("all");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    load();
    loadDoctors();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getAllAppointments();
      setAppointments(data || []);
    } catch (e) {
      console.warn("Could not fetch admin appointments", e);
      setAppointments([]);
    } finally { setLoading(false); }
  };

  const loadDoctors = async () => {
    try {
      const d = await api.getDoctors();
      setDoctors(d || []);
    } catch {
      setDoctors([]);
    }
  };

  const filtered = appointments.filter(a => {
    const queryActive = q.trim().length > 0;
    const statusActive = statusFilter !== "all";
    const doctorActive = doctorFilter !== "all";
    
    setIsFiltered(queryActive || statusActive || doctorActive);

    if (statusActive && a.status !== statusFilter) return false;
    if (doctorActive && String(a.doctorId) !== String(doctorFilter)) return false;
    if (!queryActive) return true;

    const s = q.toLowerCase();
    return (a.patientName || "").toLowerCase().includes(s)
      || (a.doctorName || "").toLowerCase().includes(s)
      || (a.date || "").toLowerCase().includes(s)
      || (a.time || "").toLowerCase().includes(s);
  });

  const changeStatus = async (id: string, status: Appointment['status']) => {
    try {
      await api.updateAppointmentStatus(id, status);
      await load();
      showToast(`✅ Appointment marked as ${status}.`, 'success');
    } catch (err) {
      console.error(err);
      showToast("❌ Action failed. Check console.", 'error');
    }
  };

  const exportCSV = () => {
    if (!filtered.length) { 
        showToast("⚠️ No records to export", "warning");
        return; 
    }
    const headers = ["Patient","Doctor","Date","Time","Status","Patient Address","Doctor Address","CreatedAt"];
    const rows = filtered.map(a => [
      a.patientName,
      a.doctorName,
      a.date,
      a.time,
      a.status,
      a.patientAddress || "",
      a.doctorAddress || "",
      a.createdAt ? new Date(a.createdAt).toLocaleString() : ""
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `appointments_export.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const inputClasses = "p-2 border-0 rounded-lg focus:ring-2 focus:ring-primary/40 outline-none bg-black/5 dark:bg-black/20 text-text-light dark:text-text-dark shadow-inner placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark";

  return (
    <div className="p-6 glass-card shadow">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by patient/doctor/date" className={inputClasses} />
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value as any)} className={inputClasses}>
            <option value="all">All status</option>
            <option value="booked">Booked</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={doctorFilter} onChange={e=>setDoctorFilter(e.target.value)} className={inputClasses}>
            <option value="all">All doctors</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="px-4 py-2 rounded-lg bg-primary text-white font-semibold">Export CSV</button>
          <button onClick={load} className="px-4 py-2 rounded-lg border border-primary text-primary font-semibold">Refresh</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-white/20 dark:border-white/10">
            <tr>
              {["Patient","Doctor","Date","Time","Status","Patient Address","Doctor Address","Actions"].map(h => 
                <th key={h} className="p-3 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="p-6 text-center">Loading...</td></tr>
            ) : filtered.length ? filtered.map(a => (
              <tr key={a.id} className="border-t border-white/20 dark:border-white/10 hover:bg-primary/5">
                <td className="p-2 text-sm">{a.patientName}</td>
                <td className="p-2 text-sm">{a.doctorName}</td>
                <td className="p-2 text-sm">{a.date}</td>
                <td className="p-2 text-sm">{a.time}</td>
                <td className="p-2 text-sm capitalize">{a.status}</td>
                <td className="p-2 text-sm">{a.patientAddress || "-"}</td>
                <td className="p-2 text-sm">{a.doctorAddress || "-"}</td>
                <td className="p-2 flex gap-1.5 flex-wrap">
                  {a.status !== "accepted" && <button onClick={()=>changeStatus(a.id,"accepted")} className="px-2 py-1 rounded bg-green-600 text-white text-xs font-semibold">Accept</button>}
                  {a.status !== "rejected" && <button onClick={()=>changeStatus(a.id,"rejected")} className="px-2 py-1 rounded bg-red-600 text-white text-xs font-semibold">Reject</button>}
                  {a.status !== "completed" && <button onClick={()=>changeStatus(a.id,"completed")} className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold">Complete</button>}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={8} className="p-6 text-center text-gray-500">
                {isFiltered ? "No matching appointments found." : "No appointments found."}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}