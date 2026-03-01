import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserRound, 
  Calendar, 
  Pill, 
  TestTube, 
  Bed, 
  LogOut, 
  ReceiptText, 
  FileText, 
  Contact, 
  AlertCircle,
  Stethoscope
} from 'lucide-react';
import { cn } from '../utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Patients', path: '/patients' },
  { icon: Stethoscope, label: 'Doctors', path: '/doctors' },
  { icon: Calendar, label: 'Appointments', path: '/appointments' },
  { icon: Pill, label: 'Pharmacy', path: '/pharmacy' },
  { icon: TestTube, label: 'Lab Tests', path: '/lab-tests' },
  { icon: Bed, label: 'Admissions', path: '/admissions' },
  { icon: ReceiptText, label: 'Billing', path: '/billing' },
  { icon: FileText, label: 'Medical Records', path: '/records' },
  { icon: Contact, label: 'Staff', path: '/staff' },
  { icon: AlertCircle, label: 'Emergency', path: '/emergency' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Stethoscope size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">MediFlow</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                location.pathname === item.path
                  ? "bg-emerald-50 text-emerald-600 font-medium"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-colors",
                location.pathname === item.path ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
              )} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800 capitalize">
              {location.pathname === '/' ? 'Overview' : location.pathname.substring(1).replace('-', ' ')}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-900">Dr. Sampath</span>
              <span className="text-xs text-slate-500">Administrator</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
              <img src="https://picsum.photos/seed/doctor/100/100" alt="Profile" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
