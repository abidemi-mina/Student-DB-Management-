import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Section } from "../components/Section";
import { studentAPI, formatDisplayDate } from "../services/api";
import type { Student, DashboardStats } from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("");

  const isAdmin = localStorage.getItem("adminLoggedIn") === "yes";

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (filterGender) params.gender = filterGender;
      
      // ✅ Get data directly - no .data needed
      const studentsData = await studentAPI.getStudents(params);
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }, [search, filterGender]);

  const fetchDashboardStats = useCallback(async () => {
    try {
      // ✅ Get data directly - no .data needed
      const statsData = await studentAPI.getDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchStudents();
      fetchDashboardStats();
    }
  }, [isAdmin, fetchStudents, fetchDashboardStats]);

  const handleDeleteStudent = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentAPI.deleteStudent(id);
        setStudents(students.filter(student => student.id !== id));
        // Refresh stats
        fetchDashboardStats();
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");
    navigate("/");
  };

  // Admin login form
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-100 p-4 md:p-6">
        <div className="mx-auto max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-zinc-900">Student DBMS</h1>
            <p className="text-zinc-600 mt-2">Administrator Login</p>
          </div>
          
          <Section title="Login">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get("email") as string;
              const password = formData.get("password") as string;
              
              // Simple admin check
              if (email === "admin@example.com" && password === "admin123") {
                localStorage.setItem("adminLoggedIn", "yes");
                localStorage.setItem("adminEmail", email);
                window.location.reload();
              } else {
                alert("Invalid credentials. Use admin@example.com / admin123 for demo.");
              }
            }} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  placeholder="admin@example.com"
                  defaultValue="admin@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  placeholder="Password"
                  defaultValue="admin123"
                />
              </div>
              
              <div className="space-y-3">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800"
                >
                  Login
                </button>
                
                <div className="text-center text-sm text-zinc-600">
                  <p className="mb-2">Demo credentials:</p>
                  <p className="font-mono text-xs bg-zinc-200 p-2 rounded">admin@example.com / admin123</p>
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mt-4 text-zinc-900 hover:underline"
                  >
                    ← Back to Home
                  </button>
                </div>
              </div>
            </form>
          </Section>
        </div>
      </div>
    );
  }

  // Main dashboard (rest remains the same)
  return (
    <div className="min-h-screen bg-zinc-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Student Management Dashboard</h1>
            <p className="text-zinc-600">Manage student records and academic information</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/student")}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Student
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-zinc-500">Total Students</h3>
            <p className="mt-2 text-3xl font-bold text-zinc-900">
              {stats?.total_students || students.length}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-zinc-500">Average CGPA</h3>
            <p className="mt-2 text-3xl font-bold text-zinc-900">
              {stats?.average_cgpa ? stats.average_cgpa.toFixed(2) : '0.00'}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-zinc-500">Level Distribution</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {stats?.level_stats?.map((stat) => (
                <div key={stat.level} className="rounded-full bg-zinc-100 px-3 py-1 text-xs">
                  <span className="font-medium">L{stat.level}:</span>
                  <span className="ml-1">{stat.count}</span>
                </div>
              )) || <p className="text-sm text-zinc-500">No data available</p>}
            </div>
          </div>
        </div>

        {/* Filters */}
        <Section title="Filters & Search">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Search</label>
              <input
                type="text"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                placeholder="Search by name, matric, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Gender</label>
              <select
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
              >
                <option value="">All Genders</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearch("");
                  setFilterGender("");
                }}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </Section>

        {/* Students Table */}
        <Section title={`Students (${students.length})`}>
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900"></div>
              <p className="mt-3 text-zinc-600">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
              </svg>
              <h3 className="mt-4 text-sm font-medium text-zinc-900">No students</h3>
              <p className="mt-1 text-sm text-zinc-500">
                {search || filterGender 
                  ? "No students match your filters."
                  : "Get started by adding your first student."
                }
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/student")}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Add Student
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50">
                      <th className="px-4 py-3 text-left font-medium text-zinc-700">Matric No.</th>
                      <th className="px-4 py-3 text-left font-medium text-zinc-700">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-zinc-700">Gender</th>
                      <th className="px-4 py-3 text-left font-medium text-zinc-700">Email</th>
                      <th className="px-4 py-3 text-left font-medium text-zinc-700">State</th>
                      <th className="px-4 py-3 text-left font-medium text-zinc-700">Enrolled</th>
                      <th className="px-4 py-3 text-left font-medium text-zinc-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-zinc-50">
                        <td className="px-4 py-3 font-medium text-zinc-900">
                          {student.matriculation_number}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-zinc-900">
                              {student.first_name} {student.last_name}
                            </div>
                            {student.middle_name && (
                              <div className="text-xs text-zinc-500">{student.middle_name}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            student.gender === 'M' ? 'bg-blue-100 text-blue-800' :
                            student.gender === 'F' ? 'bg-pink-100 text-pink-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {student.gender === 'M' ? 'Male' :
                             student.gender === 'F' ? 'Female' : 'Other'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-600">{student.email}</td>
                        <td className="px-4 py-3 text-zinc-600">{student.state_of_origin}</td>
                        <td className="px-4 py-3 text-zinc-600">
                          {formatDisplayDate(student.enrollment_date)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => navigate(`/student/${student.id}/edit`)}
                              className="rounded border border-blue-300 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="rounded border border-red-300 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Section>

        {/* Connection Status */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${
                students.length > 0 ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {students.length > 0 ? 'Connected to Django API' : 'Not connected to Django API'}
                </p>
                <p className="text-xs text-zinc-500">
                  API Base URL: {import.meta.env.VITE_API_BASE_URL || 'Not set'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                fetchStudents();
                fetchDashboardStats();
              }}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}