import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDasboard';
import StudentFormPage from './pages/StudentFormPage';
import AcademicRecordFormPage from './pages/AcademicRecordFormPage';
import SelectRole from './pages/SelectRole';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SelectRole />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentFormPage />} />
        <Route path="/student/:id/edit" element={<StudentFormPage />} />
        <Route path="/academic-record/new" element={<AcademicRecordFormPage />} />
        <Route path="/academic-record/new/:studentId" element={<AcademicRecordFormPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
