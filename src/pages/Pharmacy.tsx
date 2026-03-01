import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Medicine } from '../types';
import { generateId, cn } from '../utils';
import { Search, Plus, Pill, ShoppingCart, Trash2, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEED_MEDICINES } from '../seedData';

export default function Pharmacy() {
  const [medicines, setMedicines] = useLocalStorage<Medicine[]>('medicines', SEED_MEDICINES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    stock: '',
    price: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMedicine: Medicine = {
      id: `MED-${generateId()}`,
      name: formData.name,
      stock: Number(formData.stock),
      price: Number(formData.price)
    };
    setMedicines([...medicines, newMedicine]);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', stock: '', price: '' });
  };

  const deleteMedicine = (id: string) => {
    if (confirm('Remove this medicine from inventory?')) {
      setMedicines(medicines.filter(m => m.id !== id));
    }
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search medicines..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 shadow-lg shadow-amber-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add Medicine
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedicines.length > 0 ? filteredMedicines.map((med) => (
          <motion.div
            layout
            key={med.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Pill size={24} />
              </div>
              <button 
                onClick={() => deleteMedicine(med.id)}
                className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900">{med.name}</h3>
            <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">{med.id}</div>

            <div className="mt-6 flex justify-between items-end">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Stock Level</div>
                <div className={cn(
                  "text-lg font-bold",
                  med.stock < 10 ? "text-rose-600" : "text-slate-900"
                )}>
                  {med.stock} units
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Price</div>
                <div className="text-xl font-black text-emerald-600">${med.price.toFixed(2)}</div>
              </div>
            </div>

            {med.stock < 10 && (
              <div className="mt-4 p-2 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold flex items-center gap-2">
                <AlertTriangle size={12} />
                LOW STOCK WARNING
              </div>
            )}
            
            <button className="w-full mt-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              <ShoppingCart size={16} />
              Sell Medicine
            </button>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center text-slate-500">
            No medicines found in inventory.
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
                <h3 className="text-xl font-bold text-slate-900">Add Medicine to Inventory</h3>
                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Medicine Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Paracetamol 500mg"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Initial Stock</label>
                    <input
                      required
                      type="number"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Price per Unit ($)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
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
                    className="flex-1 px-6 py-2.5 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 shadow-lg shadow-amber-200 transition-all"
                  >
                    Add to Stock
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
