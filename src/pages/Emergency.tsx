import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { EmergencyCase } from '../types';
import { generateId, cn } from '../utils';
import { AlertCircle, Plus, Trash2, X, Clock, Siren } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEED_EMERGENCY } from '../seedData';

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function Emergency() {
  const [cases, setCases] = useLocalStorage<EmergencyCase[]>('emergency_cases', SEED_EMERGENCY);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    priority: 'High' as EmergencyCase['priority'],
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: EmergencyCase = {
      id: `EMG-${generateId()}`,
      ...formData,
      timestamp: new Date().toLocaleString()
    };
    setCases([newCase, ...cases]);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ patientName: '', priority: 'High', description: '' });
  };

  const deleteCase = (id: string) => {
    if (confirm('Resolve and clear this emergency case?')) {
      setCases(cases.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white animate-pulse">
            <Siren size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Emergency Response Unit</h3>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Log Emergency
        </button>
      </div>

      <div className="space-y-4">
        {cases.length > 0 ? cases.map((c) => (
          <motion.div
            layout
            key={c.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "bg-white p-6 rounded-2xl border-l-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
              c.priority === 'Critical' ? "border-l-red-600" : 
              c.priority === 'High' ? "border-l-orange-500" : 
              c.priority === 'Medium' ? "border-l-amber-400" : "border-l-blue-400"
            )}
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                  c.priority === 'Critical' ? "bg-red-100 text-red-700" : 
                  c.priority === 'High' ? "bg-orange-100 text-orange-700" : 
                  c.priority === 'Medium' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                )}>
                  {c.priority} Priority
                </span>
                <span className="text-xs font-mono text-slate-400">{c.id}</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900">{c.patientName}</h4>
              <p className="text-slate-600 text-sm">{c.description}</p>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs pt-2">
                <Clock size={12} />
                Logged at {c.timestamp}
              </div>
            </div>
            
            <button 
              onClick={() => deleteCase(c.id)}
              className="px-6 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-all"
            >
              Mark Resolved
            </button>
          </motion.div>
        )) : (
          <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
            <AlertCircle size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No active emergency cases</p>
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
                <h3 className="text-xl font-bold text-slate-900">New Emergency Case</h3>
                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Patient Name / Identifier</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Unknown Male, approx 30y"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    value={formData.patientName}
                    onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Priority Level</label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRIORITIES.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: p as EmergencyCase['priority'] })}
                        className={cn(
                          "py-2 rounded-lg text-xs font-bold border transition-all",
                          formData.priority === p 
                            ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-100" 
                            : "bg-white border-slate-200 text-slate-500 hover:border-red-200"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Case Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Briefly describe the emergency..."
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
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
                    className="flex-1 px-6 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
                  >
                    Log Emergency
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
