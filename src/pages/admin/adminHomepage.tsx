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
} from "react-icons/fi";
import type { RequestStatus } from "../../types/Status.types";
import { workflowSteps } from "../../utils/mockdata";

export const AdminHomepage: React.FC = () => {
  const [name, _] = useState<string | null>(localStorage.getItem("username"));
  const [usersLength, setUsersLength] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [totalRequestPerDay, setTotalRequestPerDay] = useState<number>(0);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  // Optional: fetch request status counts if your API provides them
  const [requestStats, setRequestStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Fetch today's requests and recent activity
  useEffect(() => {
    const requestPerDay = async () => {
      try {
        const res = await axiosInstance.get("/requests/todays-record");
        const requests = res.data;
        setTotalRequestPerDay(requests.length);
        setRecentRequests(requests.slice(0, 5));
        // Calculate status counts (adjust field names as needed)
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
          toast.error(error?.response?.data?.message);
        }
      }
    };
    requestPerDay();
  }, []);

  // Fetch users data
  useEffect(() => {
    const usersOnCompany = async () => {
      try {
        const res = await axiosInstance.get("/users/own-company");
        const activeUserList = res.data.filter(
          (user: UserInterface) => user.isActive,
        );
        setActiveUsers(activeUserList.length);
        setUsersLength(res.data.length);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          let message = error?.response?.data?.message;
          toast.error(message);
        }
      }
    };
    usersOnCompany();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "text-green-600 bg-green-50";
      case "Pending":
        return "text-amber-600 bg-amber-50";
      case "Rejected":
        return "text-red-600 bg-red-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50/40 to-purple-50/30 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section with Stats Overview */}
        <div className="mb-8 animate-fade-in-up">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 text-indigo-700 text-xs font-semibold mb-3">
                  <FiActivity className="w-3 h-3" />
                  <span>Admin Dashboard</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                  Welcome back, {name?.toLocaleUpperCase()}
                </h1>
                <p className="text-slate-500 mt-2">
                  Here's what's happening with your company today.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 rounded-xl px-4 py-2 text-center">
                  <p className="text-xs text-indigo-600 font-semibold">
                    Current Time
                  </p>
                  <p className="text-sm font-mono text-slate-700">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl px-4 py-2 text-center">
                  <p className="text-xs text-purple-600 font-semibold">Date</p>
                  <p className="text-sm font-mono text-slate-700">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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
        </div>

        {/* Two Column Layout: Request Status Summary + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Request Status Summary Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Request Status
                </h3>
                <p className="text-xs text-slate-500">Today's breakdown</p>
              </div>
              <FiTrendingUp className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50">
                <div className="flex items-center gap-3">
                  <FiClock className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-slate-700">Pending</span>
                </div>
                <span className="text-2xl font-bold text-amber-600">
                  {requestStats.pending}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-green-50/50">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-slate-700">Approved</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {requestStats.approved}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50/50">
                <div className="flex items-center gap-3">
                  <FiXCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-slate-700">Rejected</span>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {requestStats.rejected}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 text-xs text-slate-400 border-t border-slate-100">
              Based on {totalRequestPerDay} total request(s) today
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Recent Requests
                </h3>
                <p className="text-xs text-slate-500">Latest activity</p>
              </div>
              <FiActivity className="w-5 h-5 text-indigo-500" />
            </div>
            {recentRequests.length > 0 ? (
              <div className="space-y-3">
                {recentRequests.map((req, idx) => (
                  <div
                    key={idx}
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
                          {req.title || "Request #" + req.id}
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
                <FiCalendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No recent requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Approval Workflow – Enhanced Timeline Style */}
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
                How Requests Are Approved
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
                        <span>Approval level {step.stepNumber}</span>
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
