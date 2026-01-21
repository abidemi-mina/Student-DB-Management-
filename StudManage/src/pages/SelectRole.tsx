import { useNavigate } from "react-router-dom";

export default function SelectRole() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900">StudManage</h1>
        <p className="text-zinc-700">Choose how you want to continue.</p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate("/student")}
            className="rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm hover:shadow"
          >
            <div className="font-semibold text-zinc-900">Student</div>
            <div className="text-sm text-zinc-600">Fill in your details</div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm hover:shadow"
          >
            <div className="font-semibold text-zinc-900">Admin</div>
            <div className="text-sm text-zinc-600">Login and view students</div>
          </button>
        </div>
      </div>
    </div>
  );
}
