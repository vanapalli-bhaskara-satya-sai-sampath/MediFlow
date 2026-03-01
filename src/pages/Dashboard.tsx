import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  Pill, 
  TestTube, 
  Bed, 
  ReceiptText, 
  FileText, 
  Contact, 
  AlertCircle,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Patient, Doctor, Appointment } from '../types';
import { cn } from '../utils';
import { SEED_PATIENTS, SEED_DOCTORS, SEED_APPOINTMENTS, SEED_MEDICINES, SEED_STAFF, SEED_BILLS, SEED_LAB_TESTS, SEED_EMERGENCY } from '../seedData';
import { RotateCcw } from 'lucide-react';

const modules = [
  { icon: UserPlus, label: 'Patient Registration', path: '/patients', color: 'bg-blue-500', desc: 'Register and manage patient records' },
  { icon: Calendar, label: 'Book Appointment', path: '/appointments', color: 'bg-emerald-500', desc: 'Schedule visits with doctors' },
  { icon: Stethoscope, label: 'Doctor Management', path: '/doctors', color: 'bg-violet-500', desc: 'Manage medical staff and schedules' },
  { icon: Pill, label: 'Pharmacy', path: '/pharmacy', color: 'bg-amber-500', desc: 'Medicine inventory and sales' },
  { icon: TestTube, label: 'Lab Tests', path: '/lab-tests', color: 'bg-rose-500', desc: 'Book and manage diagnostic tests' },
  { icon: Bed, label: 'Admissions', path: '/admissions', color: 'bg-cyan-500', desc: 'In-patient management and wards' },
  { icon: ReceiptText, label: 'Billing & Payments', path: '/billing', color: 'bg-indigo-500', desc: 'Invoices, payments and insurance' },
  { icon: FileText, label: 'Medical Records', path: '/records', color: 'bg-orange-500', desc: 'Patient history and reports' },
  { icon: Contact, label: 'Staff Management', path: '/staff', color: 'bg-slate-700', desc: 'Manage hospital employees' },
  { icon: AlertCircle, label: 'Emergency Care', path: '/emergency', color: 'bg-red-600', desc: 'Immediate critical care management' },
];

export default function Dashboard() {
  const [patients, setPatients] = useLocalStorage<Patient[]>('patients', SEED_PATIENTS);
  const [doctors, setDoctors] = useLocalStorage<Doctor[]>('doctors', SEED_DOCTORS);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', SEED_APPOINTMENTS);
  const [, setMedicines] = useLocalStorage<any[]>('medicines', SEED_MEDICINES);
  const [, setStaff] = useLocalStorage<any[]>('staff', SEED_STAFF);
  const [, setBills] = useLocalStorage<any[]>('bills', SEED_BILLS);
  const [, setLabTests] = useLocalStorage<any[]>('lab_tests', SEED_LAB_TESTS);
  const [, setEmergency] = useLocalStorage<any[]>('emergency_cases', SEED_EMERGENCY);

  const resetData = () => {
    if (confirm('Reset all hospital data to seed records? Current changes will be lost.')) {
      setPatients(SEED_PATIENTS);
      setDoctors(SEED_DOCTORS);
      setAppointments(SEED_APPOINTMENTS);
      setMedicines(SEED_MEDICINES);
      setStaff(SEED_STAFF);
      setBills(SEED_BILLS);
      setLabTests(SEED_LAB_TESTS);
      setEmergency(SEED_EMERGENCY);
      window.location.reload();
    }
  };

  const stats = [
    { label: 'Total Patients', value: patients.length, icon: Users },
    { label: 'Total Doctors', value: doctors.length, icon: Stethoscope },
    { label: 'Appointments', value: appointments.length, icon: Calendar },
    { label: 'Active Admissions', value: patients.filter(p => p.admitted).length, icon: Bed },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Modules Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-500" />
            Quick Access Modules
          </h3>
          <button 
            onClick={resetData}
            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all text-sm font-medium"
          >
            <RotateCcw size={16} />
            Reset to Seed Data
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module, i) => (
            <motion.div
              key={module.path}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={module.path}
                className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block h-full"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg transition-transform group-hover:scale-110",
                  module.color
                )}>
                  <module.icon size={24} />
                </div>
                <h4 className="text-slate-900 font-bold mb-2 group-hover:text-emerald-600 transition-colors">{module.label}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{module.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
