import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient, Doctor, Appointment } from '../types';
import { generateId, cn } from '../utils';
import { Calendar, Clock, User, Stethoscope, Plus, X, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEED_PATIENTS, SEED_DOCTORS, SEED_APPOINTMENTS } from '../seedData';

export default function Appointments() {
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', SEED_APPOINTMENTS);
  const [patients] = useLocalStorage<Patient[]>('patients', SEED_PATIENTS);
  const [doctors] = useLocalStorage<Doctor[]>('doctors', SEED_DOCTORS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Appointment = {
      id: `APT-${generateId()}`,
      ...formData,
      status: 'Scheduled'
    };
    setAppointments([...appointments, newAppointment]);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ patientId: '', doctorId: '', date: '', time: '' });
  };

  const updateStatus = (id: string, status: Appointment['status']) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
  };

  const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || 'Unknown Patient';
  const getDoctorName = (id: string) => doctors.find(d => d.id === id)?.name || 'Unknown Doctor';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">Appointment Schedule</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Book Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {appointments.length > 0 ? appointments.map((apt) => (
          <motion.div
            layout
            key={apt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">{apt.id}</div>
                  <div className="text-lg font-bold text-slate-900">{apt.date}</div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <Clock size={14} />
                    {apt.time}
                  </div>
                </div>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                apt.status === 'Scheduled' ? "bg-blue-50 text-blue-600" :
                apt.status === 'Completed' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {apt.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                  <User size={10} /> Patient
                </div>
                <div className="text-sm font-semibold text-slate-800">{getPatientName(apt.patientId)}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                  <Stethoscope size={10} /> Doctor
                </div>
                <div className="text-sm font-semibold text-slate-800">{getDoctorName(apt.doctorId)}</div>
              </div>
            </div>

            {apt.status === 'Scheduled' && (
              <div className="flex gap-2">
                <button 
                  onClick={() => updateStatus(apt.id, 'Completed')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors"
                >
                  <CheckCircle2 size={16} />
                  Mark Completed
                </button>
                <button 
                  onClick={() => updateStatus(apt.id, 'Cancelled')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors"
                >
                  <XCircle size={16} />
                  Cancel
                </button>
              </div>
            )}
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
            <Clock3 size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No appointments scheduled</p>
            <p className="text-sm">Click 'Book Appointment' to get started</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Book Appointment</h3>
                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Select Patient</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    value={formData.patientId}
                    onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                  >
                    <option value="">Choose a patient...</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Select Doctor</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    value={formData.doctorId}
                    onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Date</label>
                    <input
                      required
                      type="date"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Time</label>
                    <input
                      required
                      type="time"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      value={formData.time}
                      onChange={e => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all"
                  >
                    Confirm Booking
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
