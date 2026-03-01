import { Patient, Doctor, Appointment, Medicine, Staff, Bill, LabTest, EmergencyCase } from './types';

export const SEED_PATIENTS: Patient[] = [
  { id: 'PAT-A1B2C3', name: 'John Doe', age: 45, gender: 'Male', phone: '555-0101', address: '123 Maple St, Springfield', admitted: true, ward: 'General Ward', admitDate: '2026-02-20' },
  { id: 'PAT-D4E5F6', name: 'Jane Smith', age: 32, gender: 'Female', phone: '555-0102', address: '456 Oak Ave, Metropolis', admitted: false },
  { id: 'PAT-G7H8I9', name: 'Robert Brown', age: 68, gender: 'Male', phone: '555-0103', address: '789 Pine Rd, Gotham', admitted: true, ward: 'ICU', admitDate: '2026-02-25' },
  { id: 'PAT-J0K1L2', name: 'Emily Davis', age: 24, gender: 'Female', phone: '555-0104', address: '321 Elm St, Star City', admitted: false },
  { id: 'PAT-M3N4O5', name: 'Michael Wilson', age: 52, gender: 'Male', phone: '555-0105', address: '654 Cedar Ln, Central City', admitted: false },
];

export const SEED_DOCTORS: Doctor[] = [
  { id: 'DOC-D1R2S3', name: 'Dr. Sarah Jenkins', specialization: 'Cardiology', availableDays: ['Mon', 'Wed', 'Fri'], phone: '555-0201' },
  { id: 'DOC-P4E5D6', name: 'Dr. Mark Thompson', specialization: 'Pediatrics', availableDays: ['Tue', 'Thu', 'Sat'], phone: '555-0202' },
  { id: 'DOC-N7E8U9', name: 'Dr. Lisa Wong', specialization: 'Neurology', availableDays: ['Mon', 'Tue', 'Thu'], phone: '555-0203' },
];

export const SEED_APPOINTMENTS: Appointment[] = [
  { id: 'APT-X1Y2Z3', patientId: 'PAT-D4E5F6', doctorId: 'DOC-D1R2S3', date: '2026-03-05', time: '10:30', status: 'Scheduled' },
  { id: 'APT-A4B5C6', patientId: 'PAT-J0K1L2', doctorId: 'DOC-P4E5D6', date: '2026-03-06', time: '14:15', status: 'Scheduled' },
];

export const SEED_MEDICINES: Medicine[] = [
  { id: 'MED-P1A2R3', name: 'Paracetamol 500mg', stock: 150, price: 5.50 },
  { id: 'MED-A4M5O6', name: 'Amoxicillin 250mg', stock: 8, price: 12.00 },
  { id: 'MED-I7B8U9', name: 'Ibuprofen 400mg', stock: 85, price: 8.25 },
];

export const SEED_STAFF: Staff[] = [
  { id: 'STF-N1U2R3', name: 'Alice Johnson', role: 'Nurse', phone: '555-0301' },
  { id: 'STF-T4E5C6', name: 'Bob Miller', role: 'Technician', phone: '555-0302' },
  { id: 'STF-R7E8C9', name: 'Charlie Davis', role: 'Receptionist', phone: '555-0303' },
];

export const SEED_BILLS: Bill[] = [
  { id: 'INV-B1I2L3', patientId: 'PAT-A1B2C3', items: [{ description: 'Consultation', amount: 50 }, { description: 'Lab Test', amount: 120 }], total: 170, date: '2026-02-28', status: 'Paid' },
  { id: 'INV-C4A5S6', patientId: 'PAT-D4E5F6', items: [{ description: 'Pharmacy', amount: 45 }], total: 45, date: '2026-03-01', status: 'Unpaid' },
];

export const SEED_LAB_TESTS: LabTest[] = [
  { id: 'LAB-T1E2S3', patientId: 'PAT-A1B2C3', testName: 'Blood Count', date: '2026-02-27', status: 'Completed' },
  { id: 'LAB-X4Y5Z6', patientId: 'PAT-G7H8I9', testName: 'MRI Scan', date: '2026-03-02', status: 'Pending' },
];

export const SEED_EMERGENCY: EmergencyCase[] = [
  { id: 'EMG-E1M2G3', patientName: 'Unknown Male', priority: 'Critical', description: 'Accident victim, unconscious', timestamp: '2026-03-01 21:15' },
];
