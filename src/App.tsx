import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Pharmacy from './pages/Pharmacy';
import LabTests from './pages/LabTests';
import Admissions from './pages/Admissions';
import Billing from './pages/Billing';
import MedicalRecords from './pages/MedicalRecords';
import Staff from './pages/Staff';
import Emergency from './pages/Emergency';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/lab-tests" element={<LabTests />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/records" element={<MedicalRecords />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/emergency" element={<Emergency />} />
        </Routes>
      </Layout>
    </Router>
  );
}
