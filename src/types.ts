export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  address: string;
  admitted: boolean;
  ward?: string;
  admitDate?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availableDays: string[];
  phone: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface Medicine {
  id: string;
  name: string;
  stock: number;
  price: number;
}

export interface Bill {
  id: string;
  patientId: string;
  items: { description: string; amount: number }[];
  total: number;
  date: string;
  status: 'Paid' | 'Unpaid';
}

export interface Staff {
  id: string;
  name: string;
  role: 'Nurse' | 'Technician' | 'Receptionist' | 'Admin';
  phone: string;
}

export interface LabTest {
  id: string;
  patientId: string;
  testName: string;
  date: string;
  status: 'Pending' | 'Completed';
}

export interface EmergencyCase {
  id: string;
  patientName: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  timestamp: string;
}
