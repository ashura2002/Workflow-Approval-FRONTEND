import React, { useEffect, useState } from "react";
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
} from "react-icons/fi";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
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

export const EmployeeHomepage: React.FC = () => {
  const [name, _] = useState<string | null>(localStorage.getItem("username"));
  const [time, setTime] = useState(() => new Date());
  const [stats, setStats] = useState<RequestStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch employee's own request stats and recent requests
  useEffect(() => {
    const fetchEmployeeRequests = async () => {
      try {
        setIsLoadingStats(true);
        // Adjust endpoints according to your backend
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
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          // If endpoint doesn't exist, just show zero state silently
          console.log("Could not fetch requests:", error.message);
        }
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchEmployeeRequests();
  }, []);

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
    switch (status) {
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

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50/40 to-purple-50/30 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 text-indigo-700 text-xs font-semibold mb-3">
                  <FiSmile className="w-3 h-3" />
                  <span>Employee Dashboard</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                  {greeting}, {name?.toLocaleUpperCase() || "Employee"}
                </h1>
                <p className="text-slate-500 mt-2">
                  Here's an overview of your activity and the approval process.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 rounded-xl px-4 py-2 text-center">
                  <p className="text-xs text-indigo-600 font-semibold">
                    Current Time
                  </p>
                  <p className="text-sm font-mono text-slate-700">
                    {formattedTime}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl px-4 py-2 text-center">
                  <p className="text-xs text-purple-600 font-semibold">Date</p>
                  <p className="text-sm font-mono text-slate-700">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards – Employee's Request Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-5 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <FiFileText className="w-6 h-6 text-indigo-500" />
              <span className="text-xs text-slate-400">Total</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
            <p className="text-xs text-slate-500 mt-1">
              Total requests submitted
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-5 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <FiPending className="w-6 h-6 text-amber-500" />
              <span className="text-xs text-slate-400">Pending</span>
            </div>
            <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
            <p className="text-xs text-slate-500 mt-1">Awaiting approval</p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-5 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <FiCheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-xs text-slate-400">Approved</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {stats.approved}
            </p>
            <p className="text-xs text-slate-500 mt-1">Successfully approved</p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-5 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <FiXCircle className="w-6 h-6 text-red-500" />
              <span className="text-xs text-slate-400">Rejected</span>
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            <p className="text-xs text-slate-500 mt-1">Declined requests</p>
          </div>
        </div>

        {/* Two Column Layout: Live Time Card (simplified) + Recent Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Compact Time Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-md">
                <FiClock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Live Time</h2>
            </div>
            <p className="text-6xl font-bold tracking-tighter bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {formattedTime}
            </p>
            <div className="flex items-center justify-center mt-4 space-x-2 text-slate-500 bg-slate-100/50 px-4 py-2 rounded-full">
              <FiCalendar className="w-4 h-4 text-indigo-400" />
              <p className="text-sm font-medium">{formattedDate}</p>
            </div>
            <div className="mt-4 text-sm text-slate-400">
              <FiSun className="inline mr-1 w-3 h-3" /> Have a productive day!
            </div>
          </div>

          {/* Recent Activity for Employee */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Recent Requests
                </h3>
                <p className="text-xs text-slate-500">
                  Your latest submissions
                </p>
              </div>
              <FiTrendingUp className="w-5 h-5 text-indigo-500" />
            </div>
            {!isLoadingStats && recentRequests.length > 0 ? (
              <div className="space-y-3">
                {recentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 hover:bg-white transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          req.status === "approved"
                            ? "bg-green-500"
                            : req.status === "pending"
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
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
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
                <p className="text-slate-500">
                  {isLoadingStats ? "Loading..." : "No requests yet"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Submit a request to see it here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Approval Workflow – same elegant timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-4">
                <FiTrendingUp className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Multi‑Tenant Approval Workflow
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                How Your Requests Are Approved
              </h2>
              <p className="text-slate-500 mt-2 max-w-lg mx-auto">
                Every request moves through a structured three‑step approval
                process
              </p>
            </div>

            <div className="relative">
              {/* Timeline connector line (desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200 -translate-y-1/2 z-0"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {workflowSteps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={idx}
                      className="relative flex flex-col items-center text-center p-6 bg-white/50 rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-indigo-300 flex items-center justify-center text-xs font-bold text-indigo-600">
                        {step.stepNumber}
                      </div>
                      <div
                        className={`p-3 rounded-2xl bg-linear-to-r ${step.color} text-white shadow-md mb-4`}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-xl">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-2">
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

            <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
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
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-400 italic">
            "Make today count. Every small step leads to big achievements."
          </p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
