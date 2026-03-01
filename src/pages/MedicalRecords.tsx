import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient, Appointment, Bill, LabTest } from '../types';
import { FileText, Search, Download, Eye } from 'lucide-react';
import { SEED_PATIENTS, SEED_APPOINTMENTS, SEED_BILLS, SEED_LAB_TESTS } from '../seedData';

export default function MedicalRecords() {
  const [patients] = useLocalStorage<Patient[]>('patients', SEED_PATIENTS);
  const [appointments] = useLocalStorage<Appointment[]>('appointments', SEED_APPOINTMENTS);
  const [bills] = useLocalStorage<Bill[]>('bills', SEED_BILLS);
  const [tests] = useLocalStorage<LabTest[]>('lab_tests', SEED_LAB_TESTS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-bold text-slate-900">Patient Medical Records</h3>
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search records by patient name..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {patients.length > 0 ? patients.map((patient) => {
          const patientAppointments = appointments.filter(a => a.patientId === patient.id);
          const patientBills = bills.filter(b => b.patientId === patient.id);
          const patientTests = tests.filter(t => t.patientId === patient.id);

          return (
            <div key={patient.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              <div className="flex items-center gap-4 min-w-[250px]">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{patient.name}</h4>
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">{patient.id}</p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-3 gap-4 w-full">
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Visits</div>
                  <div className="text-lg font-bold text-slate-900">{patientAppointments.length}</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Lab Tests</div>
                  <div className="text-lg font-bold text-slate-900">{patientTests.length}</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Invoices</div>
                  <div className="text-lg font-bold text-slate-900">{patientBills.length}</div>
                </div>
              </div>

              <div className="flex gap-2 w-full lg:w-auto">
                <button className="flex-1 lg:flex-none px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  <Eye size={16} />
                  View History
                </button>
                <button className="flex-1 lg:flex-none p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all border border-slate-100">
                  <Download size={20} />
                </button>
              </div>
            </div>
          );
        }) : (
          <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No patient records available</p>
          </div>
        )}
      </div>
    </div>
  );
}
