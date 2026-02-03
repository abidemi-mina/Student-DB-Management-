import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Section } from "../components/Section";
import { Field } from "../components/Field";
import { studentAPI } from "../services/api";
import type { Student } from "../services/api";
import axios from "axios";

interface AcademicRecordFormData {
  student: number;
  course_name: string;
  cgpa: string;
  grade: string;
  semester: string;
  level: number;
}

export default function AcademicRecordFormPage() {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId?: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const [form, setForm] = useState<AcademicRecordFormData>({
    student: 0,
    course_name: "",
    cgpa: "",
    grade: "",
    semester: "",
    level: 100,
  });

  // Fetch all students for dropdown
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentAPI.getStudents();
        setStudents(data);
        
        // If studentId is provided in URL, pre-select that student
        if (studentId) {
          const preSelectedStudent = data.find(s => s.id === parseInt(studentId));
          if (preSelectedStudent) {
            setForm(prev => ({ ...prev, student: preSelectedStudent.id }));
            setSelectedStudent(preSelectedStudent);
          }
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students list");
      }
    };
    fetchStudents();
  }, [studentId]);

  const update = (key: keyof AcademicRecordFormData, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleStudentChange = (studentId: string) => {
    const id = parseInt(studentId);
    update("student", id);
    const student = students.find(s => s.id === id);
    setSelectedStudent(student || null);
  };

  async function saveAcademicRecord(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      
      const payload = {
        student: form.student,
        course_name: form.course_name,
        cgpa: parseFloat(form.cgpa),
        grade: form.grade,
        semester: form.semester,
        level: form.level,
      };

      console.log('Submitting academic record:', payload);
      
      await axios.post(`${API_BASE_URL}/academic-records/`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Navigate back to admin dashboard
      navigate("/admin");
      
    } catch (err: any) {
      console.error('Error creating academic record:', err);
      
      if (err.response?.data) {
        const errors = err.response.data;
        if (typeof errors === 'object') {
          const errorMessages = Object.entries(errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('; ');
          setError(errorMessages);
        } else {
          setError(err.response.data.message || 'Failed to create academic record');
        }
      } else {
        setError('Failed to connect to server. Make sure Django is running on port 8000.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Add Academic Record</h1>
            <p className="text-zinc-600">Record student academic performance</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={saveAcademicRecord} className="space-y-8">
          <Section title="Student Information">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Select Student" required>
                <select
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.student || ""}
                  onChange={(e) => handleStudentChange(e.target.value)}
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.matriculation_number} - {student.first_name} {student.last_name}
                    </option>
                  ))}
                </select>
              </Field>

              {selectedStudent && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Selected Student</h3>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p><span className="font-medium">Name:</span> {selectedStudent.first_name} {selectedStudent.last_name}</p>
                    <p><span className="font-medium">Matric:</span> {selectedStudent.matriculation_number}</p>
                    <p><span className="font-medium">Email:</span> {selectedStudent.email}</p>
                  </div>
                </div>
              )}
            </div>
          </Section>

          <Section title="Course Information">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Course Name" required>
                <input
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.course_name}
                  onChange={(e) => update("course_name", e.target.value)}
                  placeholder="e.g. Introduction to Computer Science"
                />
              </Field>

              <Field label="Level" required>
                <select
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.level}
                  onChange={(e) => update("level", parseInt(e.target.value))}
                >
                  <option value={100}>100 Level</option>
                  <option value={200}>200 Level</option>
                  <option value={300}>300 Level</option>
                  <option value={400}>400 Level</option>
                  <option value={500}>500 Level</option>
                </select>
              </Field>

              <Field label="Semester" required>
                <select
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.semester}
                  onChange={(e) => update("semester", e.target.value)}
                >
                  <option value="">Select semester</option>
                  <option value="First">First Semester</option>
                  <option value="Second">Second Semester</option>
                  <option value="Third">Third Semester</option>
                </select>
              </Field>

              <Field label="Grade" required>
                <select
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.grade}
                  onChange={(e) => update("grade", e.target.value)}
                >
                  <option value="">Select grade</option>
                  <option value="A">A (Excellent)</option>
                  <option value="B">B (Very Good)</option>
                  <option value="C">C (Good)</option>
                  <option value="D">D (Fair)</option>
                  <option value="E">E (Pass)</option>
                  <option value="F">F (Fail)</option>
                </select>
              </Field>

              <Field label="CGPA" required>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  max="5.0"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.cgpa}
                  onChange={(e) => update("cgpa", e.target.value)}
                  placeholder="e.g. 4.50"
                />
                <p className="mt-1 text-xs text-zinc-500">Enter CGPA on a 5.0 scale</p>
              </Field>
            </div>
          </Section>

          {/* Form Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-zinc-500">
              <p>Fields marked with <span className="text-red-500">*</span> are required</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="rounded-lg border border-zinc-300 bg-white px-6 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !form.student}
                className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Academic Record'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
