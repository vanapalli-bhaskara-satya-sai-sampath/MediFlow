import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Doctor } from '../types';
import { generateId, cn } from '../utils';
import { Search, Plus, Trash2, X, Stethoscope, Phone, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEED_DOCTORS } from '../seedData';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Doctors() {
  const [doctors, setDoctors] = useLocalStorage<Doctor[]>('doctors', SEED_DOCTORS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    phone: '',
    availableDays: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoctor: Doctor = {
      id: `DOC-${generateId()}`,
      ...formData
    };
    setDoctors([...doctors, newDoctor]);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', specialization: '', phone: '', availableDays: [] });
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const deleteDoctor = (id: string) => {
    if (confirm('Delete this doctor record?')) {
      setDoctors(doctors.filter(d => d.id !== id));
    }
  };

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-violet-500 text-white rounded-xl font-semibold hover:bg-violet-600 shadow-lg shadow-violet-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add Doctor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length > 0 ? filteredDoctors.map((doctor) => (
          <motion.div
            layout
            key={doctor.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                <img src={`https://picsum.photos/seed/${doctor.id}/100/100`} alt={doctor.name} referrerPolicy="no-referrer" />
              </div>
              <button 
                onClick={() => deleteDoctor(doctor.id)}
                className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900">{doctor.name}</h3>
            <div className="flex items-center gap-2 text-violet-600 text-sm font-medium mt-1">
              <Stethoscope size={14} />
              {doctor.specialization}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <Phone size={16} className="text-slate-400" />
                {doctor.phone}
              </div>
              <div className="flex items-start gap-3 text-slate-500 text-sm">
                <Calendar size={16} className="text-slate-400 mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {doctor.availableDays.map(day => (
                    <span key={day} className="px-2 py-0.5 bg-slate-50 rounded text-xs font-medium border border-slate-100">
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-50 flex gap-2">
              <button className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">
                View Schedule
              </button>
              <button className="flex-1 py-2 bg-violet-50 text-violet-600 rounded-lg text-sm font-semibold hover:bg-violet-100 transition-colors">
                Edit Profile
              </button>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center text-slate-500">
            No doctors found matching your search.
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
                <h3 className="text-xl font-bold text-slate-900">Add New Doctor</h3>
                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Doctor Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Dr. John Doe"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Specialization</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Cardiology, Pediatrics"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    value={formData.specialization}
                    onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                  <input
                    required
                    type="tel"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Available Days</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                          formData.availableDays.includes(day)
                            ? "bg-violet-500 border-violet-500 text-white shadow-md shadow-violet-100"
                            : "bg-white border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-500"
                        )}
                      >
                        {day}
                      </button>
                    ))}
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
                    className="flex-1 px-6 py-2.5 bg-violet-500 text-white rounded-xl font-semibold hover:bg-violet-600 shadow-lg shadow-violet-200 transition-all"
                  >
                    Add Doctor
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
