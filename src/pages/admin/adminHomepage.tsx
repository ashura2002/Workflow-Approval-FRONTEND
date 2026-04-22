import React, { useEffect, useState } from "react";
import { Cards } from "../../components/Cards";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import type { UserInterface } from "../../types/user.types";
import {
  FiTrendingUp,
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";
import type { RequestStatus } from "../../types/Status.types";
import { workflowSteps } from "../../utils/mockdata";

// Skeleton Loader Component
const SkeletonCard: React.FC = () => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 animate-pulse">
    <div className="h-6 bg-slate-200 rounded w-1/3 mb-3"></div>
    <div className="h-10 bg-slate-200 rounded w-2/3 mb-2"></div>
    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
  </div>
);

const SkeletonStatusItem: React.FC = () => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
      <div className="h-4 bg-slate-200 rounded w-20"></div>
    </div>
    <div className="h-6 bg-slate-200 rounded w-8"></div>
  </div>
);

export const AdminHomepage: React.FC = () => {
  const [name] = useState<string | null>(localStorage.getItem("username"));
  const [usersLength, setUsersLength] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [totalRequestPerDay, setTotalRequestPerDay] = useState<number>(0);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [requestStats, setRequestStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState({
    users: true,
    requests: true,
  });
  const [error, setError] = useState({
    users: "",
    requests: "",
  });
  const [refreshing, setRefreshing] = useState(false);

  // Fetch today's requests and recent activity
  const fetchRequests = async () => {
    setLoading((prev) => ({ ...prev, requests: true }));
    setError((prev) => ({ ...prev, requests: "" }));
    try {
      const res = await axiosInstance.get("/requests/todays-record");
      const requests = res.data;
      setTotalRequestPerDay(requests.length);
      setRecentRequests(requests.slice(0, 5));
      const pending = requests.filter(
        (r: RequestStatus) => r.status === "Pending",
      ).length;
      const approved = requests.filter(
        (r: RequestStatus) => r.status === "Approved",
      ).length;
      const rejected = requests.filter(
        (r: RequestStatus) => r.status === "Rejected",
      ).length;
      setRequestStats({ pending, approved, rejected });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message || "Failed to load requests";
        setError((prev) => ({ ...prev, requests: msg }));
        toast.error(msg);
      } else {
        setError((prev) => ({ ...prev, requests: "Something went wrong" }));
      }
    } finally {
      setLoading((prev) => ({ ...prev, requests: false }));
    }
  };

  // Fetch users data
  const fetchUsers = async () => {
    setLoading((prev) => ({ ...prev, users: true }));
    setError((prev) => ({ ...prev, users: "" }));
    try {
      const res = await axiosInstance.get("/users/own-company");
      const activeUserList = res.data.filter(
        (user: UserInterface) => user.isActive,
      );
      setActiveUsers(activeUserList.length);
      setUsersLength(res.data.length);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message || "Failed to load users";
        setError((prev) => ({ ...prev, users: msg }));
        toast.error(msg);
      } else {
        setError((prev) => ({ ...prev, users: "Something went wrong" }));
      }
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  // Refresh all data
  const refreshAllData = async () => {
    setRefreshing(true);
    await Promise.all([fetchUsers(), fetchRequests()]);
    setRefreshing(false);
    toast.success("Dashboard refreshed");
  };

  useEffect(() => {
    fetchUsers();
    fetchRequests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50/40 to-purple-50/30 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section with Stats Overview */}
        <div className="mb-6 sm:mb-8 animate-fade-in-up">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-5 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 text-indigo-700 text-xs font-semibold mb-3">
                  <FiActivity className="w-3 h-3" />
                  <span>Admin Dashboard</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                  Welcome back, {name?.toLocaleUpperCase() || "Admin"}
                </h1>
                <p className="text-slate-500 text-sm sm:text-base mt-1 sm:mt-2">
                  Here's what's happening with your company today.
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={refreshAllData}
                  disabled={refreshing}
                  className="p-2 rounded-full bg-white/80 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                  aria-label="Refresh dashboard"
                >
                  <FiRefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
                </button>
                <div className="bg-indigo-50 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-center">
                  <p className="text-xs text-indigo-600 font-semibold">Current Time</p>
                  <p className="text-xs sm:text-sm font-mono text-slate-700">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-center">
                  <p className="text-xs text-purple-600 font-semibold">Date</p>
                  <p className="text-xs sm:text-sm font-mono text-slate-700">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10">
          {loading.users ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <div className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <Cards
                  cardTitle="Total Users"
                  data={usersLength}
                  message="Currently on this company"
                />
              </div>
              <div className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <Cards
                  cardTitle="Active Users"
                  data={activeUsers}
                  message="Currently active"
                />
              </div>
              <div className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <Cards
                  cardTitle="Today's Requests"
                  data={totalRequestPerDay}
                  message="Total today's requests"
                />
              </div>
            </>
          )}
          {error.users && !loading.users && (
            <div className="col-span-full text-center text-red-500 text-sm">
              {error.users} - <button onClick={fetchUsers} className="underline">Retry</button>
            </div>
          )}
        </div>

        {/* Two Column Layout: Request Status Summary + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {/* Request Status Summary Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  Request Status
                </h3>
                <p className="text-xs text-slate-500">Today's breakdown</p>
              </div>
              <FiTrendingUp className="w-5 h-5 text-indigo-500" />
            </div>
            {loading.requests ? (
              <div className="space-y-3">
                <SkeletonStatusItem />
                <SkeletonStatusItem />
                <SkeletonStatusItem />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50">
                  <div className="flex items-center gap-3">
                    <FiClock className="w-5 h-5 text-amber-600" />
                    <span className="font-medium text-slate-700 text-sm sm:text-base">Pending</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-amber-600">
                    {requestStats.pending}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-green-50/50">
                  <div className="flex items-center gap-3">
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-slate-700 text-sm sm:text-base">Approved</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-green-600">
                    {requestStats.approved}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-red-50/50">
                  <div className="flex items-center gap-3">
                    <FiXCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-slate-700 text-sm sm:text-base">Rejected</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-red-600">
                    {requestStats.rejected}
                  </span>
                </div>
              </div>
            )}
            <div className="mt-4 pt-3 text-xs text-slate-400 border-t border-slate-100">
              Based on {totalRequestPerDay} total request(s) today
            </div>
            {error.requests && !loading.requests && (
              <div className="mt-3 text-center text-red-500 text-xs">
                {error.requests} - <button onClick={fetchRequests} className="underline">Retry</button>
              </div>
            )}
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  Recent Requests
                </h3>
                <p className="text-xs text-slate-500">Latest activity</p>
              </div>
              <FiActivity className="w-5 h-5 text-indigo-500" />
            </div>
            {loading.requests ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-slate-200 rounded w-24 mb-1"></div>
                        <div className="h-3 bg-slate-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-5 bg-slate-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : recentRequests.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {recentRequests.map((req, idx) => (
                  <div
                    key={idx}
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
                <FiCalendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No recent requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Approval Workflow – Responsive Timeline (vertical on mobile, horizontal on md+) */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-5 sm:p-6 md:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-100 rounded-full mb-4">
                <FiTrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Multi‑Tenant Approval Workflow
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">
                How Requests Are Approved
              </h2>
              <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
                Every request moves through a structured three‑step approval
                process
              </p>
            </div>

            {/* Responsive timeline */}
            <div className="relative">
              {/* Desktop connector line (hidden on mobile) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200 -translate-y-1/2 z-0"></div>
              
              {/* Steps - vertical on mobile, horizontal on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {workflowSteps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={idx}
                      className="relative flex flex-col items-center text-center p-5 sm:p-6 bg-white/50 rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
                    >
                      {/* Mobile connecting line (vertical) */}
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
                        <span>Approval level {step.stepNumber}</span>
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