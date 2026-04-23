import React, { useEffect, useState, useCallback } from "react";
import {
  FiCalendar,
  FiClock,
  FiSun,
  FiSmile,
  FiUserCheck,
  FiShield,
  FiUsers,
  FiTrendingUp,
  FiFileText,
  FiCheckCircle,
  FiClock as FiPending,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import type { RequestStatus } from "../../types/Status.types";

interface RequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface RecentRequest {
  id: number;
  title: string;
  status: string;
  createdAt: string;
}

// Skeleton Components
const StatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-5 animate-pulse"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
          <div className="w-12 h-3 bg-slate-200 rounded"></div>
        </div>
        <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
        <div className="h-3 bg-slate-200 rounded w-24"></div>
      </div>
    ))}
  </div>
);

const RecentSkeleton: React.FC = () => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-5 sm:p-6">
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="h-5 bg-slate-200 rounded w-32 mb-1"></div>
        <div className="h-3 bg-slate-200 rounded w-24"></div>
      </div>
      <div className="w-5 h-5 bg-slate-200 rounded"></div>
    </div>
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
            <div>
              <div className="h-4 bg-slate-200 rounded w-32 mb-1"></div>
              <div className="h-3 bg-slate-200 rounded w-24"></div>
            </div>
          </div>
          <div className="h-5 bg-slate-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  </div>
);

const WorkflowSkeleton: React.FC = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-5 sm:p-6 md:p-8 animate-pulse">
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-4">
        <div className="w-4 h-4 bg-indigo-200 rounded"></div>
        <div className="h-3 bg-indigo-200 rounded w-32"></div>
      </div>
      <div className="h-7 bg-slate-200 rounded w-64 mx-auto mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-48 mx-auto"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-6 bg-white/50 rounded-2xl border border-slate-100"
        >
          <div className="w-12 h-12 bg-slate-200 rounded-2xl mx-auto mb-4"></div>
          <div className="h-5 bg-slate-200 rounded w-24 mx-auto mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-32 mx-auto"></div>
        </div>
      ))}
    </div>
  </div>
);

export const EmployeeHomepage: React.FC = () => {
  const [name] = useState<string | null>(localStorage.getItem("username"));
  const [time, setTime] = useState(() => new Date());
  const [stats, setStats] = useState<RequestStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchEmployeeRequests = useCallback(async (showToast = false) => {
    try {
      setIsLoadingStats(true);
      setError("");
      const res = await axiosInstance.get("/requests/my-records");
      const requests = res.data;
      const pending = requests.filter(
        (r: RequestStatus) => r.status === "Pending",
      ).length;
      const approved = requests.filter(
        (r: RequestStatus) => r.status === "Approved",
      ).length;
      const rejected = requests.filter(
        (r: RequestStatus) => r.status === "Rejected",
      ).length;
      setStats({
        total: requests.length,
        pending,
        approved,
        rejected,
      });
      setRecentRequests(requests.slice(0, 5));
      if (showToast) toast.success("Dashboard refreshed");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.message || "Failed to load your requests";
        setError(msg);
        if (showToast) toast.error(msg);
        else console.log("Could not fetch requests:", error.message);
      } else {
        setError("An unexpected error occurred");
        if (showToast) toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployeeRequests();
  }, [fetchEmployeeRequests]);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchEmployeeRequests(true);
    setRefreshing(false);
  };

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const formattedDate = time.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = time.getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 18) greeting = "Good afternoon";
  if (hour >= 18) greeting = "Good evening";

  const workflowSteps = [
    {
      title: "Department Head",
      icon: FiUsers,
      description: "First approval level",
      color: "from-blue-500 to-cyan-500",
      stepNumber: 1,
    },
    {
      title: "HR",
      icon: FiUserCheck,
      description: "Second approval level",
      color: "from-indigo-500 to-purple-500",
      stepNumber: 2,
    },
    {
      title: "Admin",
      icon: FiShield,
      description: "Final approval level",
      color: "from-purple-500 to-pink-500",
      stepNumber: 3,
    },
  ];

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "approved":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-amber-600 bg-amber-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  // Loading state with skeletons
  if (isLoadingStats && stats.total === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50/40 to-purple-50/30 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome skeleton */}
          <div className="mb-6 sm:mb-8 animate-pulse">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-5 sm:p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <div className="h-5 bg-slate-200 rounded w-32 mb-3"></div>
                  <div className="h-8 bg-slate-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-64"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-14 w-24 bg-slate-200 rounded-xl"></div>
                  <div className="h-14 w-32 bg-slate-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
          <StatsSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-5 sm:p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-200 rounded-2xl"></div>
                <div className="h-6 bg-slate-200 rounded w-24"></div>
              </div>
              <div className="h-12 bg-slate-200 rounded w-40 mx-auto mb-4"></div>
              <div className="h-8 bg-slate-200 rounded w-48 mx-auto"></div>
            </div>
            <RecentSkeleton />
          </div>
          <WorkflowSkeleton />
        </div>
      </div>
    );
  }

  // Error state (only if we have an error and no data)
  if (error && stats.total === 0 && !isLoadingStats) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50/40 to-purple-50/30 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200 p-6 sm:p-8 text-center max-w-md w-full">
          <FiXCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">
            Failed to Load Dashboard
          </h3>
          <p className="text-slate-500 text-sm sm:text-base mb-6">{error}</p>
          <button
            onClick={() => fetchEmployeeRequests(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <FiRefreshCw size={18} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50/40 to-purple-50/30 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section with Refresh */}
        <div className="mb-6 sm:mb-8 animate-fade-in-up">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-5 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 text-indigo-700 text-xs font-semibold mb-3">
                  <FiSmile className="w-3 h-3" />
                  <span>Employee Dashboard</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                  {greeting}, {name?.toLocaleUpperCase() || "Employee"}
                </h1>
                <p className="text-slate-500 text-sm sm:text-base mt-1 sm:mt-2">
                  Here's an overview of your activity and the approval process.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="p-2 rounded-full bg-white/80 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                  aria-label="Refresh dashboard"
                >
                  <FiRefreshCw
                    className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                  />
                </button>
                <div className="bg-indigo-50 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-center">
                  <p className="text-xs text-indigo-600 font-semibold">
                    Current Time
                  </p>
                  <p className="text-xs sm:text-sm font-mono text-slate-700">
                    {formattedTime}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-center">
                  <p className="text-xs text-purple-600 font-semibold">Date</p>
                  <p className="text-xs sm:text-sm font-mono text-slate-700">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-4 sm:p-5 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <FiFileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
              <span className="text-[10px] sm:text-xs text-slate-400">
                Total
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-800">
              {stats.total}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
              Total requests submitted
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-4 sm:p-5 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <FiPending className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
              <span className="text-[10px] sm:text-xs text-slate-400">
                Pending
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600">
              {stats.pending}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
              Awaiting approval
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-4 sm:p-5 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              <span className="text-[10px] sm:text-xs text-slate-400">
                Approved
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              {stats.approved}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
              Successfully approved
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-4 sm:p-5 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <FiXCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              <span className="text-[10px] sm:text-xs text-slate-400">
                Rejected
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-red-600">
              {stats.rejected}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
              Declined requests
            </p>
          </div>
        </div>

        {/* Two Column Layout: Live Time + Recent Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {/* Compact Time Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-5 sm:p-6 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 sm:p-3 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-md">
                <FiClock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Live Time
              </h2>
            </div>
            <p className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {formattedTime}
            </p>
            <div className="flex items-center justify-center mt-4 space-x-2 text-slate-500 bg-slate-100/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
              <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-400" />
              <p className="text-xs sm:text-sm font-medium">{formattedDate}</p>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-400">
              <FiSun className="inline mr-1 w-3 h-3" /> Have a productive day!
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  Recent Requests
                </h3>
                <p className="text-xs text-slate-500">
                  Your latest submissions
                </p>
              </div>
              <FiTrendingUp className="w-5 h-5 text-indigo-500" />
            </div>
            {recentRequests.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {recentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-xl bg-slate-50/50 hover:bg-white transition-all gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          req.status?.toLowerCase() === "approved"
                            ? "bg-green-500"
                            : req.status?.toLowerCase() === "pending"
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {req.title || `Request #${req.id}`}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(req.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full self-start sm:self-center ${getStatusColor(
                        req.status,
                      )}`}
                    >
                      {req.status || "pending"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiFileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No requests yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Submit a request to see it here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Approval Workflow – Responsive Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-5 sm:p-6 md:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-100 rounded-full mb-4">
                <FiTrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                <span className="text-[10px] sm:text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Multi‑Tenant Approval Workflow
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">
                How Your Requests Are Approved
              </h2>
              <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
                Every request moves through a structured three‑step approval
                process
              </p>
            </div>

            <div className="relative">
              {/* Desktop connector line */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200 -translate-y-1/2 z-0"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {workflowSteps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={idx}
                      className="relative flex flex-col items-center text-center p-5 sm:p-6 bg-white/50 rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
                    >
                      {/* Mobile connecting line */}
                      {idx < workflowSteps.length - 1 && (
                        <div className="absolute left-1/2 -bottom-5 md:hidden w-0.5 h-6 bg-indigo-200 transform -translate-x-1/2"></div>
                      )}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-indigo-300 flex items-center justify-center text-xs font-bold text-indigo-600 shadow-sm">
                        {step.stepNumber}
                      </div>
                      <div
                        className={`p-3 rounded-2xl bg-linear-to-r ${step.color} text-white shadow-md mb-4`}
                      >
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg sm:text-xl">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-2">
                        {step.description}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-xs text-indigo-500">
                        <FiCheckCircle className="w-3 h-3" />
                        <span>Level {step.stepNumber}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-slate-500 border-t border-slate-100 pt-5 sm:pt-6">
              <p>
                <span className="font-medium text-indigo-600">
                  ➤ Department Head
                </span>{" "}
                reviews first →
                <span className="font-medium text-indigo-600"> ➤ HR</span>{" "}
                reviews second →
                <span className="font-medium text-indigo-600"> ➤ Admin</span>{" "}
                gives final approval.
              </p>
              <p className="mt-2">
                This ensures proper oversight and accountability across your
                organization.
              </p>
            </div>
          </div>
        </div>

        {/* Inspirational quote */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-xs sm:text-sm text-slate-400 italic">
            "Make today count. Every small step leads to big achievements."
          </p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};
