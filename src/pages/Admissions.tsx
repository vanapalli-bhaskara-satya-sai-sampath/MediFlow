import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient } from '../types';
import { generateId, cn } from '../utils';
import { Bed, UserPlus, LogOut, Search, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEED_PATIENTS } from '../seedData';

const WARDS = ['General Ward', 'ICU', 'Pediatrics', 'Maternity', 'Emergency Ward'];

export default function Admissions() {
  const [patients, setPatients] = useLocalStorage<Patient[]>('patients', SEED_PATIENTS);
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
  const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);

  const [admitData, setAdmitData] = useState({
    patientId: '',
    ward: WARDS[0],
    date: new Date().toISOString().split('T')[0]
  });

  const handleAdmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPatients(patients.map(p => p.id === admitData.patientId ? {
      ...p,
      admitted: true,
      ward: admitData.ward,
      admitDate: admitData.date
    } : p));
    setIsAdmitModalOpen(false);
    setAdmitData({ patientId: '', ward: WARDS[0], date: new Date().toISOString().split('T')[0] });
  };

  const handleDischarge = (patientId: string) => {
    if (confirm('Confirm patient discharge?')) {
      setPatients(patients.map(p => p.id === patientId ? {
        ...p,
        admitted: false,
        ward: undefined,
        admitDate: undefined
      } : p));
    }
  };

  const admittedPatients = patients.filter(p => p.admitted);
  const availablePatients = patients.filter(p => !p.admitted);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">In-Patient Management</h3>
        <button
          onClick={() => setIsAdmitModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 shadow-lg shadow-cyan-200 transition-all active:scale-95"
        >
          <UserPlus size={20} />
          Admit New Patient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admittedPatients.length > 0 ? admittedPatients.map((patient) => (
          <motion.div
            layout
            key={patient.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
                <Bed size={24} />
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {patient.ward}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">{patient.name}</h3>
            <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">{patient.id}</div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Admitted On:</span>
                <span className="text-slate-900 font-medium">{patient.admitDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Duration:</span>
                <span className="text-slate-900 font-medium">
                  {Math.floor((new Date().getTime() - new Date(patient.admitDate!).getTime()) / (1000 * 3600 * 24))} Days
                </span>
              </div>
            </div>

            <button 
              onClick={() => handleDischarge(patient.id)}
              className="w-full mt-6 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Discharge Patient
            </button>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
            <Bed size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No patients currently admitted</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAdmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdmitModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Patient Admission</h3>
                <button onClick={() => setIsAdmitModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAdmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Select Patient</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    value={admitData.patientId}
                    onChange={e => setAdmitData({ ...admitData, patientId: e.target.value })}
                  >
                    <option value="">Choose a patient...</option>
                    {availablePatients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Assign Ward</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    value={admitData.ward}
                    onChange={e => setAdmitData({ ...admitData, ward: e.target.value })}
                  >
                    {WARDS.map(ward => (
                      <option key={ward} value={ward}>{ward}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Admission Date</label>
                  <input
                    required
                    type="date"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    value={admitData.date}
                    onChange={e => setAdmitData({ ...admitData, date: e.target.value })}
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAdmitModalOpen(false)}
                    className="flex-1 px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2.5 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 shadow-lg shadow-cyan-200 transition-all"
                  >
                    Confirm Admission
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
