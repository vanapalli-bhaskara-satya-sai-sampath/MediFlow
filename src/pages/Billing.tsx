import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient, Bill } from '../types';
import { generateId, cn } from '../utils';
import { Search, Plus, Receipt, Download, CheckCircle2, Clock, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEED_PATIENTS, SEED_BILLS } from '../seedData';

export default function Billing() {
  const [bills, setBills] = useLocalStorage<Bill[]>('bills', SEED_BILLS);
  const [patients] = useLocalStorage<Patient[]>('patients', SEED_PATIENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientId: '',
    items: [{ description: '', amount: '' }]
  });

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { description: '', amount: '' }] });
  };

  const removeItem = (index: number) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  };

  const updateItem = (index: number, field: 'description' | 'amount', value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const items = formData.items.map(item => ({
      description: item.description,
      amount: Number(item.amount)
    }));
    const total = items.reduce((sum, item) => sum + item.amount, 0);

    const newBill: Bill = {
      id: `INV-${generateId()}`,
      patientId: formData.patientId,
      items,
      total,
      date: new Date().toLocaleDateString(),
      status: 'Unpaid'
    };

    setBills([newBill, ...bills]);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ patientId: '', items: [{ description: '', amount: '' }] });
  };

  const markAsPaid = (id: string) => {
    setBills(bills.map(b => b.id === id ? { ...b, status: 'Paid' } : b));
  };

  const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || 'Unknown Patient';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">Billing & Invoices</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Create Invoice
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bills.length > 0 ? bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{bill.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{getPatientName(bill.patientId)}</td>
                  <td className="px-6 py-4 text-slate-600">{bill.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">${bill.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit",
                      bill.status === 'Paid' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {bill.status === 'Paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {bill.status === 'Unpaid' && (
                      <button 
                        onClick={() => markAsPaid(bill.id)}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all"
                      >
                        Mark Paid
                      </button>
                    )}
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No invoices generated yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Create New Invoice</h3>
                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Select Patient</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    value={formData.patientId}
                    onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                  >
                    <option value="">Choose a patient...</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700">Bill Items</label>
                    <button
                      type="button"
                      onClick={addItem}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <input
                          required
                          placeholder="Description (e.g. Consultation Fee)"
                          className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          value={item.description}
                          onChange={e => updateItem(index, 'description', e.target.value)}
                        />
                        <input
                          required
                          type="number"
                          placeholder="Amount"
                          className="w-32 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          value={item.amount}
                          onChange={e => updateItem(index, 'amount', e.target.value)}
                        />
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="text-slate-500">
                    Total Amount: <span className="text-2xl font-black text-slate-900 ml-2">
                      ${formData.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 shadow-lg shadow-indigo-200 transition-all"
                    >
                      Generate Invoice
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
