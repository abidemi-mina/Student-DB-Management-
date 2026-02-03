import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Section } from "../components/Section";
import { Field } from "../components/Field";
import { studentAPI, formatDateForDjango} from "../services/api";
import type { StudentFormData } from "../services/api";

export default function StudentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get student ID from URL
  const isEditMode = !!id; // Check if we're editing
  
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState<StudentFormData>({
    matriculation_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    email: "",
    phone_number: "",
    state_of_origin: "",
    local_government_area: "",
    nationality: "",
    address: "",
    enrollment_date: "",
  });

  // Fetch student data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchStudent = async () => {
        try {
          setFetchingData(true);
          const student = await studentAPI.getStudent(parseInt(id));
          
          // Populate form with existing data
          setForm({
            matriculation_number: student.matriculation_number,
            first_name: student.first_name,
            middle_name: student.middle_name || "",
            last_name: student.last_name,
            date_of_birth: student.date_of_birth,
            gender: student.gender,
            email: student.email,
            phone_number: student.phone_number,
            state_of_origin: student.state_of_origin,
            local_government_area: student.local_government_area,
            nationality: student.nationality,
            address: student.address,
            enrollment_date: student.enrollment_date,
          });
        } catch (err) {
          console.error('Error fetching student:', err);
          setError('Failed to load student data');
        } finally {
          setFetchingData(false);
        }
      };
      
      fetchStudent();
    }
  }, [isEditMode, id]);

  const update = (key: keyof StudentFormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function saveStudent(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format dates for Django
      const formattedData = {
        ...form,
        date_of_birth: formatDateForDjango(form.date_of_birth),
        enrollment_date: formatDateForDjango(form.enrollment_date),
      };

      console.log('Submitting data:', formattedData);
      
      if (isEditMode && id) {
        // Update existing student
        await studentAPI.updateStudent(parseInt(id), formattedData);
        console.log('Student updated');
      } else {
        // Create new student
        await studentAPI.createStudent(formattedData);
        console.log('Student created');
      }
      
      // Navigate to dashboard
      navigate("/admin");
      
    } catch (err: any) {
      console.error('Error saving student:', err);
      
      // Handle Django validation errors
      if (err.response?.data) {
        const errors = err.response.data;
        if (typeof errors === 'object') {
          const errorMessages = Object.entries(errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('; ');
          setError(errorMessages);
        } else {
          setError(err.response.data.message || `Failed to ${isEditMode ? 'update' : 'create'} student`);
        }
      } else {
        setError('Failed to connect to server. Make sure Django is running on port 8000.');
      }
    } finally {
      setLoading(false);
    }
  }

  // Calculate today's date for max date inputs
  const today = new Date().toISOString().split('T')[0];

  // Show loading state while fetching data
  if (fetchingData) {
    return (
      <div className="min-h-screen bg-zinc-100 p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900"></div>
            <p className="mt-3 text-zinc-600">Loading student data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              {isEditMode ? 'Edit Student' : 'Register New Student'}
            </h1>
            <p className="text-zinc-600">
              {isEditMode ? 'Update student information' : 'Fill in all required fields to register a student'}
            </p>
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
        <form onSubmit={saveStudent} className="space-y-8">
          <Section title="Personal Information">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Matriculation Number" required>
                <input
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.matriculation_number}
                  onChange={(e) => update("matriculation_number", e.target.value)}
                  placeholder="e.g. 22/SCI01/157"
                  disabled={isEditMode} // Can't change matric number in edit mode
                />
                {isEditMode && (
                  <p className="mt-1 text-xs text-zinc-500">Matriculation number cannot be changed</p>
                )}
              </Field>

              <Field label="First Name" required>
                <input
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.first_name}
                  onChange={(e) => update("first_name", e.target.value)}
                  placeholder="First name"
                />
              </Field>

              <Field label="Middle Name">
                <input
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.middle_name || ""}
                  onChange={(e) => update("middle_name", e.target.value)}
                  placeholder="Middle name (optional)"
                />
              </Field>

              <Field label="Last Name" required>
                <input
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.last_name}
                  onChange={(e) => update("last_name", e.target.value)}
                  placeholder="Last name"
                />
              </Field>

              <Field label="Date of Birth" required>
                <input
                  required
                  type="date"
                  max={today}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.date_of_birth}
                  onChange={(e) => update("date_of_birth", e.target.value)}
                />
              </Field>

             <Field label="Gender" required>
              <select
                required
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                value={form.gender}
                onChange={(e) => update("gender", e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </Field>

              <Field label="Email" required>
                <input
                  required
                  type="email"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="student@example.com"
                />
              </Field>

              <Field label="Phone Number" required>
                <input
                  required
                  type="tel"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.phone_number}
                  onChange={(e) => update("phone_number", e.target.value)}
                  placeholder="080XXXXXXXX"
                />
              </Field>
            </div>
          </Section>

          <Section title="Origin Information">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="State of Origin" required>
                <input
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.state_of_origin}
                  onChange={(e) => update("state_of_origin", e.target.value)}
                  placeholder="e.g. Ogun State"
                />
              </Field>

              <Field label="Local Government Area" required>
                <input
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.local_government_area}
                  onChange={(e) => update("local_government_area", e.target.value)}
                  placeholder="e.g. Abeokuta North"
                />
              </Field>

              <Field label="Nationality" required>
                <input
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.nationality}
                  onChange={(e) => update("nationality", e.target.value)}
                  placeholder="e.g. Nigerian"
                />
              </Field>
            </div>

            <Field label="Address" required>
              <textarea
                required
                rows={3}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Enter complete residential address..."
              />
            </Field>
          </Section>

          <Section title="Academic Information">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Enrollment Date" required>
                <input
                  required
                  type="date"
                  max={today}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  value={form.enrollment_date}
                  onChange={(e) => update("enrollment_date", e.target.value)}
                />
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
                disabled={loading}
                className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    {isEditMode ? 'Updating...' : 'Registering...'}
                  </>
                ) : (isEditMode ? 'Update Student' : 'Register Student')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
