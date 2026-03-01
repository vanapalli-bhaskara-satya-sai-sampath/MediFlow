import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient, LabTest } from '../types';
import { generateId, cn } from '../utils';
import { Search, Plus, TestTube, CheckCircle2, Clock, X, Beaker } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEED_PATIENTS, SEED_LAB_TESTS } from '../seedData';

export default function LabTests() {
  const [tests, setTests] = useLocalStorage<LabTest[]>('lab_tests', SEED_LAB_TESTS);
  const [patients] = useLocalStorage<Patient[]>('patients', SEED_PATIENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientId: '',
    testName: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTest: LabTest = {
      id: `LAB-${generateId()}`,
      ...formData,
      status: 'Pending'
    };
    setTests([newTest, ...tests]);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ patientId: '', testName: '', date: new Date().toISOString().split('T')[0] });
  };

  const updateStatus = (id: string, status: LabTest['status']) => {
    setTests(tests.map(t => t.id === id ? { ...t, status } : t));
  };

  const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || 'Unknown Patient';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">Laboratory Services</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Book Lab Test
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.length > 0 ? tests.map((test) => (
          <motion.div
            layout
            key={test.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <Beaker size={24} />
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                test.status === 'Completed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              )}>
                {test.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">{test.testName}</h3>
            <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">{test.id}</div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Patient:</span>
                <span className="text-slate-900 font-semibold">{getPatientName(test.patientId)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Test Date:</span>
                <span className="text-slate-900 font-medium">{test.date}</span>
              </div>
            </div>

            {test.status === 'Pending' && (
              <button 
                onClick={() => updateStatus(test.id, 'Completed')}
                className="w-full mt-6 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                Mark as Completed
              </button>
            )}
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
            <TestTube size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No lab tests scheduled</p>
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
                <h3 className="text-xl font-bold text-slate-900">Book Laboratory Test</h3>
                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Select Patient</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
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
                  <label className="text-sm font-semibold text-slate-700">Test Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Blood Count, Lipid Profile"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    value={formData.testName}
                    onChange={e => setFormData({ ...formData, testName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Scheduled Date</label>
                  <input
                    required
                    type="date"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
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
                    className="flex-1 px-6 py-2.5 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all"
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
