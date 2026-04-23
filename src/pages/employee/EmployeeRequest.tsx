import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";
import { RefreshCw, AlertCircle } from "lucide-react";

interface RequestFormData {
  startDate: string;
  endDate: string;
  reason: string;
  leaveType: string;
}

interface RequestHistoryItem {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

export const EmployeeRequest: React.FC = () => {
  const [formData, setFormData] = useState<RequestFormData>({
    startDate: "",
    endDate: "",
    reason: "",
    leaveType: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<RequestHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [historyError, setHistoryError] = useState<string>("");

  // Fetch request history
  const fetchHistory = async (showToast = false) => {
    setIsLoadingHistory(true);
    setHistoryError("");
    try {
      const res = await axiosInstance.get("/requests/my-records");
      setHistory(res.data.slice(0, 5)); // Show latest 5
      if (showToast) toast.success("History refreshed");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Failed to load history";
        setHistoryError(msg);
        if (showToast) toast.error(msg);
      } else {
        setHistoryError("An unexpected error occurred");
        if (showToast) toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.post("/requests", formData);
      toast.success("Leave request submitted successfully!");
      setFormData({
        startDate: "",
        endDate: "",
        reason: "",
        leaveType: "",
      });
      // Refresh history after successful submission
      await fetchHistory();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        let message = "Failed to submit form";
        if (Array.isArray(errorData?.message)) {
          message = errorData.message.join(", ");
        } else if (typeof errorData?.message === "string") {
          message = errorData.message;
        }
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "approved")
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (s === "pending") return "bg-amber-100 text-amber-700 border-amber-200";
    if (s === "rejected") return "bg-red-100 text-red-700 border-red-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-indigo-50 to-blue-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
            Leave Request
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1">
            Submit a new leave request or track your existing ones
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Info & Benefits (hidden on mobile, visible on lg) */}
          <div className="hidden lg:block sticky top-12 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100/50">
              <div className="inline-block mb-4 px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full">
                <p className="text-white text-xs font-semibold uppercase tracking-widest">
                  Leave Request
                </p>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Request Your Leave
              </h1>
              <p className="text-gray-600 text-base md:text-lg mb-8">
                Fill out the form to submit your leave request for approval.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-indigo-600 text-xl">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Quick Approval
                    </h3>
                    <p className="text-sm text-gray-500">
                      Requests reviewed within 2-3 business days
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-purple-600 text-xl">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Track Status
                    </h3>
                    <p className="text-sm text-gray-500">
                      Real-time updates on your dashboard
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-pink-600 text-xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Secure & Private
                    </h3>
                    <p className="text-sm text-gray-500">
                      Your data is encrypted and confidential
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">💡</span>
                <h3 className="font-semibold text-xl">Pro Tips</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Submit requests at least 5 days in advance</li>
                <li>• Provide a clear reason for faster processing</li>
                <li>• Check your leave balance before applying</li>
              </ul>
            </div>
          </div>

          {/* Right side - Form and History */}
          <div className="space-y-8">
            {/* Request Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100/50 p-5 sm:p-6 md:p-8">
              <div className="text-center lg:text-left mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Leave Request Form
                </h2>
                <p className="text-gray-500 text-sm sm:text-base mt-1">
                  Please fill in all required details
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Two Column Layout - stacks on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  {/* Start Date */}
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
                    >
                      📅 Start Date
                    </label>
                    <input
                      type="datetime-local"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-900 text-sm sm:text-base"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
                    >
                      📅 End Date
                    </label>
                    <input
                      type="datetime-local"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-900 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Leave Type */}
                <div>
                  <label
                    htmlFor="leaveType"
                    className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
                  >
                    🏷️ Leave Type
                  </label>
                  <select
                    id="leaveType"
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-900 text-sm sm:text-base"
                  >
                    <option value="">Select a leave type</option>
                    <option value="EmergencyLeave">Emergency Leave</option>
                    <option value="SickLeave">Sick Leave</option>
                    <option value="PersonalLeave">Personal Leave</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                {/* Reason */}
                <div>
                  <label
                    htmlFor="reason"
                    className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
                  >
                    💬 Reason
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows={4}
                    required
                    placeholder="Please provide a detailed reason for your leave..."
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none text-sm sm:text-base"
                  />
                </div>

                <div className="h-px bg-gray-200/50"></div>

                {/* Button Group */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
                  >
                    {isLoading ? "Submitting..." : "✓ Submit Request"}
                  </button>
                  <button
                    type="reset"
                    onClick={() =>
                      setFormData({
                        startDate: "",
                        endDate: "",
                        reason: "",
                        leaveType: "",
                      })
                    }
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition duration-200 text-sm sm:text-base"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>

            {/* Request History Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100/50 p-5 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Recent Requests
                  </h2>
                  <p className="text-gray-500 text-sm mt-0.5">
                    Your latest 5 submissions
                  </p>
                </div>
                <button
                  onClick={() => fetchHistory(true)}
                  disabled={isLoadingHistory}
                  className="self-start sm:self-center p-2 rounded-full bg-white/80 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                  aria-label="Refresh history"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${isLoadingHistory ? "animate-spin" : ""}`}
                  />
                </button>
              </div>

              {isLoadingHistory ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-50 rounded-xl gap-3">
                        <div className="flex-1">
                          <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-slate-200 rounded w-48"></div>
                        </div>
                        <div className="h-6 bg-slate-200 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : historyError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
                  <p className="text-red-500 text-sm">{historyError}</p>
                  <button
                    onClick={() => fetchHistory(true)}
                    className="mt-3 text-indigo-600 text-sm font-medium hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-slate-500">No requests yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Submit your first leave request above
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((req) => (
                    <div
                      key={req.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-white transition-all gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-slate-800">
                            {req.leaveType}
                          </p>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getStatusBadge(
                              req.status,
                            )}`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {formatDate(req.startDate)} →{" "}
                          {formatDate(req.endDate)}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Submitted {formatDate(req.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          #{req.id}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};
